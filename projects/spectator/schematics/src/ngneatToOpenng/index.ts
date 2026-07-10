import { SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export function migrate() {
  return async (tree: Tree, context: SchematicContext) => {
    const { oldModule, newModule } = { oldModule: '@ngneat/spectator', newModule: '@openng/spectator' };

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
      let hasChanges = false;

      const visit = (node: ts.Node) => {
        const isImportOrExport = ts.isImportDeclaration(node) || ts.isExportDeclaration(node);

        if (
          isImportOrExport &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier) &&
          node.moduleSpecifier.text === oldModule
        ) {
          const specifier = node.moduleSpecifier;
          const start = specifier.getStart(sourceFile) + 1; // +1 to skip the opening quote
          const width = specifier.getWidth(sourceFile) - 2; // -2 to skip the closing quote and semicolon

          recorder.remove(start, width);
          recorder.insertRight(start, newModule);
          hasChanges = true;
        }

        ts.forEachChild(node, visit);
      };

      visit(sourceFile);

      if (hasChanges) {
        tree.commitUpdate(recorder);
        context.logger.info(`Updated imports in ${filePath}`);
      }

      return tree;
    });
  };
}
