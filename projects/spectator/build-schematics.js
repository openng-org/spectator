import { build } from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { glob } from 'fs/promises';
import { rmSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = '../../dist/spectator/schematics';

const schematics = build({
  absWorkingDir: __dirname,
  bundle: false,
  entryPoints: ['schematics/src/**'],
  format: 'esm',
  loader: {
    '.json': 'copy',
    '.template': 'copy',
    '.md': 'empty',
  },
  minify: false,
  outdir: resolve(__dirname, distPath),
  packages: 'external',
  platform: 'node',
  plugins: [
    esbuildPluginTsc({
      force: true,
      tsconfigPath: resolve(__dirname, './schematics/tsconfig.json'),
    }),
  ],
  target: 'node22',
  treeShaking: false,
});

/**
 * Remove files/directories from dist/schematics using glob patterns.
 *
 * @param patterns - Glob pattern(s) relative to dist/schematics
 */
async function removeFromDistSchematics(patterns) {
  const targetDir = resolve(__dirname, distPath);
  const list = Array.isArray(patterns) ? patterns : [patterns];

  for (const pattern of list) {
    const globResults = await Array.fromAsync(glob(pattern, { cwd: targetDir }));
    for (const match of globResults) {
      const fullPath = resolve(targetDir, match);
      rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

schematics
  .then(async () => {
    // Remove unwanted artifact form the build
    await removeFromDistSchematics(['*.config.js', '**/*.spec.js', '__mocks__', "**/*.md"]);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
