# ngneat to openng migration

Converts all imports of `@ngneat/spectator` to `@openng/spectator` across your project.

This migration scans every TypeScript file in your project (excluding `node_modules` and `dist` directories) and updates any import or export declarations that reference `@ngneat/spectator` to instead reference `@openng/spectator`. Named imports remain intact — only the module specifier path changes.

## What does this migration do?

- Finds all TypeScript files (`.ts`) in your project
- Skips files inside `node_modules` and `dist` directories
- Replaces `from '@ngneat/spectator'` with `from '@openng/spectator'` in import and export declarations
- Preserves all named imports (e.g., `createComponentFactory`, `Spectator`, etc.)

## How to run this migration?

```bash
ng generate @openng/spectator:ngneat-to-openng
```

Or using the alias:

```bash
ng g @openng/spectator:nto
```
