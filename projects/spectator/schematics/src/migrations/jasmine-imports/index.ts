import { join, normalize, Path } from '@angular-devkit/core';
import { DirEntry, Rule, SchematicContext, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import * as ts from 'typescript';

import {
  JASMINE_ENTRY_POINT,
  JASMINE_MOVED_SYMBOLS,
  JASMINE_SHARED_SYMBOLS,
  OTHER_RUNNER_ENTRY_POINTS,
  ROOT_ENTRY_POINT,
} from './moved-symbols';
import { Schema } from './schema';

const TS_FILE = /\.[mc]?tsx?$/;
const IGNORED_DIRECTORIES = new Set(['node_modules', 'dist', 'coverage', 'out-tsc', 'bazel-out']);
const DYNAMIC_REFERENCE = /\b(?:require|import)\(\s*['"]@openng\/spectator['"]\s*\)/;

/**
 * `import`/`export` specifier that has to move to the `/jasmine` entry point.
 */
interface MovedSpecifier {
  /** Verbatim source text of the specifier, e.g. `Spectator` or `createHostFactory as createHost`. */
  text: string;
  /** True when the specifier is only usable in a type position. */
  typeOnly: boolean;
}

/**
 * - `moved` — only exported from `/jasmine` now, so it has to move.
 * - `shared` — exported from both, so it moves only to keep company with a `moved` specifier.
 * - `kept` — only exported from the root entry point, so it must stay.
 */
type SpecifierKind = 'moved' | 'shared' | 'kept';

interface ClassifiedSpecifier extends MovedSpecifier {
  kind: SpecifierKind;
}

/**
 * A single `import`/`export … from '@openng/spectator'` statement, split into the specifiers that
 * move and the ones that stay behind.
 */
interface Partitioned {
  node: ts.ImportDeclaration | ts.ExportDeclaration;
  named: ts.NamedImports | ts.NamedExports;
  isTypeOnly: boolean;
  specifiers: ClassifiedSpecifier[];
  /** Resolved by `resolveShared`, preserving the order the specifiers were written in. */
  moved: MovedSpecifier[];
  kept: string[];
}

/**
 * Rewrites `@openng/spectator` imports of Jasmine-flavoured symbols to `@openng/spectator/jasmine`.
 */
export function migrateJasmineImports(options: Schema = {}): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const root = await resolveRoot(tree, options);
    const warnings: string[] = [];
    const migrated: string[] = [];

    for (const filePath of collectTsFiles(tree, root)) {
      const buffer = tree.read(filePath);

      if (!buffer) {
        continue;
      }

      const content = buffer.toString();

      // Cheap pre-filters: skip files that cannot reference the root entry point, and files that
      // are pinned to another runner and therefore never want the Jasmine flavour.
      if (!content.includes(ROOT_ENTRY_POINT)) {
        continue;
      }

      if (OTHER_RUNNER_ENTRY_POINTS.some((entryPoint) => content.includes(entryPoint))) {
        continue;
      }

      const recorder = tree.beginUpdate(filePath);
      const result = migrateFile(filePath, content, recorder);

      if (result.changed) {
        tree.commitUpdate(recorder);
        migrated.push(filePath);
      }

      warnings.push(...result.warnings);
    }

    report(context, migrated, warnings);
  };
}

function migrateFile(filePath: string, content: string, recorder: UpdateRecorder): { changed: boolean; warnings: string[] } {
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    filePath.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const warnings: string[] = [];
  const imports: Partitioned[] = [];
  const exports: Partitioned[] = [];
  const sideEffectImports: ts.ImportDeclaration[] = [];
  let jasmineImportSeen = false;
  let jasmineImportTarget: ts.NamedImports | undefined;
  let jasmineExportTarget: ts.NamedExports | undefined;

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) {
      continue;
    }

    const moduleSpecifier = statement.moduleSpecifier;

    // `export { … }` without a `from` clause has no module specifier.
    if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) {
      continue;
    }

    const specifier = moduleSpecifier.text;

    if (specifier === JASMINE_ENTRY_POINT) {
      jasmineImportSeen ||= ts.isImportDeclaration(statement);

      // Remember an existing `/jasmine` statement so a re-run merges into it instead of adding a
      // second one. Only value clauses can absorb both value and type specifiers.
      const named = namedClauseOf(statement);

      if (named && !isTypeOnly(statement) && named.elements.length > 0) {
        if (ts.isNamedImports(named)) {
          jasmineImportTarget ??= named;
        } else {
          jasmineExportTarget ??= named;
        }
      }

      continue;
    }

    if (specifier !== ROOT_ENTRY_POINT) {
      continue;
    }

    const named = namedClauseOf(statement);

    if (!named) {
      if (ts.isImportDeclaration(statement) && !statement.importClause) {
        // A bare `import '@openng/spectator';` was how consumers registered the custom Jasmine
        // matcher types before the split, so it belongs on the `/jasmine` entry point now.
        sideEffectImports.push(statement);
      } else {
        // `import * as spectator from …` and `export * from …` cannot be split automatically,
        // because we cannot tell which members are used.
        warnings.push(`${filePath}: could not split \`${oneLine(statement.getText(sourceFile))}\` — review it manually.`);
      }

      continue;
    }

    const partitioned = partition(statement, named, sourceFile);

    if (partitioned.specifiers.every((specifier) => specifier.kind === 'kept')) {
      continue;
    }

    (ts.isImportDeclaration(statement) ? imports : exports).push(partitioned);
  }

  // Whether the shared symbols travel is a per-statement-kind decision, so it can only be made once
  // every statement has been seen.
  const movingImports = resolveShared(imports);
  const movingExports = resolveShared(exports);

  if (DYNAMIC_REFERENCE.test(content)) {
    warnings.push(`${filePath}: contains a dynamic \`${ROOT_ENTRY_POINT}\` reference — review it manually.`);
  }

  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const quote = quoteOf(imports[0]?.node ?? exports[0]?.node ?? sideEffectImports[0]) ?? "'";
  let changed = false;

  changed = apply(recorder, content, movingImports, jasmineImportTarget, 'import', eol, quote) || changed;
  changed = apply(recorder, content, movingExports, jasmineExportTarget, 'export', eol, quote) || changed;

  // Once the file imports from `/jasmine` for its own sake, a side-effect import adds nothing.
  const jasmineImported = jasmineImportSeen || movingImports.length > 0;

  for (const sideEffectImport of sideEffectImports) {
    if (jasmineImported) {
      removeStatement(recorder, content, sideEffectImport);
    } else {
      replace(recorder, sideEffectImport, `import ${quote}${JASMINE_ENTRY_POINT}${quote};`);
    }

    changed = true;
  }

  return { changed, warnings };
}

/**
 * Applies the rewrite for one statement kind (`import` or `export`). All moved specifiers of the
 * file are collected into a single `/jasmine` statement so the result stays tidy and re-runnable.
 */
function apply(
  recorder: UpdateRecorder,
  content: string,
  partitions: Partitioned[],
  target: ts.NamedImports | ts.NamedExports | undefined,
  keyword: 'import' | 'export',
  eol: string,
  quote: string,
): boolean {
  if (partitions.length === 0) {
    return false;
  }

  const moved = dedupe(partitions.reduce<MovedSpecifier[]>((all, partition) => all.concat(partition.moved), []));
  const existing = target ? new Set(target.elements.map((element) => stripTypeKeyword(element.getText()))) : new Set<string>();
  const additions = moved.filter((specifier) => !existing.has(stripTypeKeyword(specifier.text)));

  // A statement we can repurpose: every one of its specifiers moves, so it can simply become the
  // `/jasmine` statement instead of being deleted and re-added elsewhere.
  const host = target ? undefined : partitions.find((partition) => partition.kept.length === 0);

  for (const partition of partitions) {
    if (partition === host) {
      continue;
    }

    if (partition.kept.length > 0) {
      replace(recorder, partition.named, renderClause(partition.kept, partition.named, content, eol));
    } else {
      removeStatement(recorder, content, partition.node);
    }
  }

  if (additions.length === 0) {
    // Everything already lives in the existing `/jasmine` statement; only the leftovers above
    // needed touching.
    return true;
  }

  if (target) {
    const last = target.elements[target.elements.length - 1];
    recorder.insertLeft(last.getEnd(), `, ${additions.map((specifier) => renderSpecifier(specifier, false)).join(', ')}`);

    return true;
  }

  if (host) {
    // Reusing the repurposed statement's clause as the layout reference keeps a multi-line import
    // multi-line, so the diff stays limited to the module specifier.
    replace(recorder, host.node, renderStatement(additions, keyword, quote, eol, content, host.named));
  } else {
    // No statement could be repurposed, so every partition kept something and none was removed.
    // Anchoring to the first one is therefore safe.
    const anchor = partitions[0].node;
    const statement = renderStatement(additions, keyword, quote, eol, content);

    recorder.insertRight(anchor.getEnd(), `${eol}${indentOf(content, anchor.getStart())}${statement}`);
  }

  return true;
}

function partition(
  node: ts.ImportDeclaration | ts.ExportDeclaration,
  named: ts.NamedImports | ts.NamedExports,
  sourceFile: ts.SourceFile,
): Partitioned {
  const clauseIsTypeOnly = isTypeOnly(node);
  const specifiers = named.elements.map((element): ClassifiedSpecifier => {
    // `propertyName` holds the name as exported by the module when the specifier is aliased.
    const importedName = (element.propertyName ?? element.name).text;

    return {
      text: element.getText(sourceFile),
      typeOnly: clauseIsTypeOnly || element.isTypeOnly,
      kind: JASMINE_MOVED_SYMBOLS.has(importedName) ? 'moved' : JASMINE_SHARED_SYMBOLS.has(importedName) ? 'shared' : 'kept',
    };
  });

  return { node, named, isTypeOnly: clauseIsTypeOnly, specifiers, moved: [], kept: [] };
}

/**
 * Decides whether the shared symbols follow the moved ones, then materialises each statement's
 * `moved` and `kept` lists. Returns the statements that actually need rewriting.
 */
function resolveShared(partitions: Partitioned[]): Partitioned[] {
  const sharedTravels = partitions.some((partition) => partition.specifiers.some((specifier) => specifier.kind === 'moved'));

  for (const partition of partitions) {
    for (const specifier of partition.specifiers) {
      if (specifier.kind === 'moved' || (specifier.kind === 'shared' && sharedTravels)) {
        partition.moved.push(specifier);
      } else {
        partition.kept.push(specifier.text);
      }
    }
  }

  return partitions.filter((partition) => partition.moved.length > 0);
}

function renderStatement(
  specifiers: MovedSpecifier[],
  keyword: 'import' | 'export',
  quote: string,
  eol: string,
  content: string,
  layout?: ts.Node,
): string {
  // A clause-level `type` keyword reads better than repeating it on every specifier, but it is only
  // valid when nothing in the clause is a value.
  const typeOnlyClause = specifiers.every((specifier) => specifier.typeOnly);
  const rendered = specifiers.map((specifier) => renderSpecifier(specifier, typeOnlyClause));
  const clause = layout ? renderClause(rendered, layout, content, eol) : `{ ${rendered.join(', ')} }`;

  return `${keyword}${typeOnlyClause ? ' type' : ''} ${clause} from ${quote}${JASMINE_ENTRY_POINT}${quote};`;
}

function renderSpecifier(specifier: MovedSpecifier, typeOnlyClause: boolean): string {
  if (typeOnlyClause) {
    return stripTypeKeyword(specifier.text);
  }

  return specifier.typeOnly ? `type ${stripTypeKeyword(specifier.text)}` : specifier.text;
}

/**
 * Rewrites the `{ … }` clause of a statement, preserving whether it was written on one line.
 */
function renderClause(specifiers: string[], named: ts.Node, content: string, eol: string): string {
  if (!named.getText().includes('\n')) {
    return `{ ${specifiers.join(', ')} }`;
  }

  const indent = indentOf(content, named.getStart());
  const inner = `${indent}  `;

  return `{${eol}${specifiers.map((specifier) => `${inner}${specifier},`).join(eol)}${eol}${indent}}`;
}

function replace(recorder: UpdateRecorder, node: ts.Node, text: string): void {
  const start = node.getStart();

  recorder.remove(start, node.getEnd() - start);
  recorder.insertRight(start, text);
}

/**
 * Removes a statement together with the line it sits on, provided the line holds nothing else.
 */
function removeStatement(recorder: UpdateRecorder, content: string, node: ts.Node): void {
  const nodeStart = node.getStart();
  const lineStart = startOfLine(content, nodeStart);
  const start = /^[ \t]*$/.test(content.slice(lineStart, nodeStart)) ? lineStart : nodeStart;
  let end = node.getEnd();

  while (content[end] === ' ' || content[end] === '\t') {
    end++;
  }

  if (content[end] === '\r') {
    end++;
  }

  if (content[end] === '\n') {
    end++;
  }

  recorder.remove(start, end - start);
}

function dedupe(specifiers: MovedSpecifier[]): MovedSpecifier[] {
  const byName = new Map<string, MovedSpecifier>();

  for (const specifier of specifiers) {
    const key = stripTypeKeyword(specifier.text);
    const existing = byName.get(key);

    // A value import subsumes a type-only one, so the widest form wins.
    if (!existing || (existing.typeOnly && !specifier.typeOnly)) {
      byName.set(key, specifier);
    }
  }

  return [...byName.values()];
}

function namedClauseOf(node: ts.ImportDeclaration | ts.ExportDeclaration): ts.NamedImports | ts.NamedExports | undefined {
  if (ts.isImportDeclaration(node)) {
    const bindings = node.importClause?.namedBindings;

    // A default import alongside the clause would be left dangling by a rewrite, but the package
    // has no default export so this cannot legitimately happen.
    return bindings && ts.isNamedImports(bindings) && !node.importClause?.name ? bindings : undefined;
  }

  return node.exportClause && ts.isNamedExports(node.exportClause) ? node.exportClause : undefined;
}

function isTypeOnly(node: ts.ImportDeclaration | ts.ExportDeclaration): boolean {
  return ts.isImportDeclaration(node) ? (node.importClause?.isTypeOnly ?? false) : node.isTypeOnly;
}

function quoteOf(node: ts.ImportDeclaration | ts.ExportDeclaration | undefined): string | undefined {
  return node?.moduleSpecifier?.getText().charAt(0);
}

function stripTypeKeyword(text: string): string {
  return text.replace(/^type\s+/, '');
}

function startOfLine(content: string, position: number): number {
  let start = position;

  while (start > 0 && content[start - 1] !== '\n') {
    start--;
  }

  return start;
}

function indentOf(content: string, position: number): string {
  const line = content.slice(startOfLine(content, position), position);

  return /^[ \t]*/.exec(line)?.[0] ?? '';
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function resolveRoot(tree: Tree, options: Schema): Promise<Path> {
  if (options.path) {
    return normalize(options.path);
  }

  if (!options.project) {
    return normalize('/');
  }

  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(options.project);

  if (!project) {
    throw new SchematicsException(`Project "${options.project}" could not be found in the workspace.`);
  }

  return normalize(`/${project.sourceRoot ?? project.root}`);
}

function collectTsFiles(tree: Tree, root: Path): Path[] {
  const files: Path[] = [];
  const stack: DirEntry[] = [tree.getDir(root)];

  while (stack.length > 0) {
    const dir = stack.pop() as DirEntry;

    for (const file of dir.subfiles) {
      if (TS_FILE.test(file)) {
        files.push(join(dir.path, file));
      }
    }

    for (const subdir of dir.subdirs) {
      // Pruning here rather than filtering afterwards keeps `node_modules` from being walked at all.
      if (!IGNORED_DIRECTORIES.has(subdir) && !subdir.startsWith('.')) {
        stack.push(dir.dir(subdir));
      }
    }
  }

  return files;
}

function report(context: SchematicContext, migrated: string[], warnings: string[]): void {
  for (const warning of warnings) {
    context.logger.warn(`  ${warning}`);
  }

  if (migrated.length === 0) {
    context.logger.info(`No '${ROOT_ENTRY_POINT}' imports needed to move to '${JASMINE_ENTRY_POINT}'.`);

    return;
  }

  context.logger.info(
    `Moved Jasmine-specific imports to '${JASMINE_ENTRY_POINT}' in ${migrated.length} file${migrated.length === 1 ? '' : 's'}.`,
  );
  context.logger.info(
    `If a spec relies on Spectator's custom Jasmine matchers (toHaveClass, toHaveText, …) but no longer imports from ` +
      `'${JASMINE_ENTRY_POINT}', add \`import '${JASMINE_ENTRY_POINT}';\` to your test setup file to register their types.`,
  );
}
