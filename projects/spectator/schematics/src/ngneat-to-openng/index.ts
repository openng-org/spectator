import { SchematicContext, Tree, type UpdateRecorder } from '@angular-devkit/schematics';
import type { SourceFile } from 'typescript';
import * as ts from 'typescript';

const OLD_PKG = '@ngneat/spectator';
const NEW_PKG = '@openng/spectator';

/**
 * Creates a visitor function that replaces occurrences of an old module prefix with a new one
 * within import or export declarations in a TypeScript source file.
 * Supports both exact matches (`@ngneat/spectator`) and sub-paths (`@ngneat/spectator/jest`).
 *
 * @param sourceFile - The TypeScript source/AST node being visited.
 * @param oldModule  - The original package name.
 * @param newModule  - The replacement package name.
 * @param recorder   - The update recorder used to apply changes to the tree.
 * @param state      - An object containing a `hasChanged` flag to track if any replacements were made.
 *
 * @returns A visitor function that traverses the AST and applies replacements.
 */
function visiteFactory(
  sourceFile: SourceFile,
  oldModule: string,
  newModule: string,
  recorder: UpdateRecorder,
  state: { hasChanged: boolean },
) {
  const visit = (node: ts.Node) => {
    const isImportOrExport = ts.isImportDeclaration(node) || ts.isExportDeclaration(node);

    if (isImportOrExport && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const text = node.moduleSpecifier.text;
      if (text === oldModule || text.startsWith(oldModule + '/')) {
        const specifier = node.moduleSpecifier;
        const start = specifier.getStart(sourceFile) + 1; // +1 to skip the opening quote

        recorder.remove(start, text.length);
        recorder.insertRight(start, newModule + text.slice(oldModule.length));
        state.hasChanged = true;
      }
    }

    ts.forEachChild(node, visit);
  };
  return visit;
}

export function migrate() {
  return (tree: Tree, context: SchematicContext) => {
    tree.visit((filePath, entry) => {
      // Early return if the file is not a TypeScript file or if the entry is null
      if (!entry || !filePath.endsWith('.ts')) {
        return;
      }

      // Early return if the file is in node_modules or dist directories
      if (filePath.includes('node_modules') || filePath.includes('dist')) {
        return;
      }

      const sourceText = entry.content.toString('utf-8');
      const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
      const recorder = tree.beginUpdate(filePath);
      const state = { hasChanged: false };

      const visit = visiteFactory(sourceFile, OLD_PKG, NEW_PKG, recorder, state);
      visit(sourceFile);

      if (state.hasChanged) {
        tree.commitUpdate(recorder);
      }
    });
  };
}
