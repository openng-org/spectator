import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import path from 'path';

/**
 * Supported test-runner sub-packages for @ngneat/@openng/spectator.
 */
const TEST_RUNNERS = ['jasmine', 'jest', 'vitest'] as const;

/**
 * Resolves the full module path for a given test runner under the `@ngneat/spectator` package.
 * Jasmine maps to the base package; other runners map to a sub-path.
 */
function resolveNgNeatModule(testRunner: (typeof TEST_RUNNERS)[number]): string {
  const base = '@ngneat/spectator';
  return testRunner === 'jasmine' ? base : `${base}/${testRunner}`;
}

/**
 * Resolves the full module path for a given test runner under the `@openng/spectator` package.
 * Jasmine maps to the base package; other runners map to a sub-path.
 */
function resolveOpenNgModule(testRunner: (typeof TEST_RUNNERS)[number]): string {
  const base = '@openng/spectator';
  return testRunner === 'jasmine' ? base : `${base}/${testRunner}`;
}

/**
 * Configuration used to generate a synthetic test fixture file.
 */
interface TestFixtureConfig {
  /**
   * Spectator type name (e.g., `Spectator`, `SpectatorDirective`).
   */
  spectatorType: string;
  /**
   * Factory creator function name (e.g., `createComponentFactory`).
   */
  factoryName: string;
  /**
   * Angular element kind being tested.
   */
  type: 'component' | 'directive' | 'pipe' | 'service';
  /**
   * Body of the test describe block.
   */
  testBody: string;
  /**
   * Test-runner sub-package to target (defaults to `jasmine`).
   */
  testRunner?: (typeof TEST_RUNNERS)[number];
}

/**
 * Generates the source content for a synthetic test file that imports from `@ngneat/spectator`.
 * The generated file can be fed into the schematic to verify import rewriting.
 */
function createTestFixtureContent(config: TestFixtureConfig): string {
  const { spectatorType, factoryName, type, testBody, testRunner = 'jasmine' } = config;
  const ngNeatModule = resolveNgNeatModule(testRunner);
  const className = `My${type.replace(/^./, (c) => c.toUpperCase())}`;
  const importPath = `./my.${type.toLowerCase()}`;

  return `import { ${factoryName}, ${spectatorType} } from '${ngNeatModule}';
import { ${className} } from '${importPath}';

describe('${className}', () => {
  let spectator: ${spectatorType}<${className}>;
  const create${className.replace(/^./, (c) => c.toLowerCase())} = ${factoryName}(${className});

${testBody}
});`;
}

describe('ngneat-to-openng', () => {
  const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../collection.json'));

  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
    tree.create(
      'package.json',
      JSON.stringify({
        name: 'app',
        version: '0.0.0',
        dependencies: {
          '@ngneat/spectator': '^22.1.0',
        },
        devDependencies: {
          '@ngneat/spectator': '^22.1.0',
        },
      }),
    );
  });

  describe('ngneat/directive', () => {
    const pathStr = '/src/ngneat.directive.ts';

    /**
     * Builds a test tree seeded with a directive fixture for the given runner.
     */
    function createTreeWithRunner(testRunner: (typeof TEST_RUNNERS)[number]) {
      tree.create(
        pathStr,
        createTestFixtureContent({
          spectatorType: 'SpectatorDirective',
          factoryName: 'createDirectiveFactory',
          type: 'directive',
          testRunner,
          testBody: `  it('should change the background color', () => {
    spectator = createDirective(\`<div highlight>Testing MyDirective</div>\`);

    spectator.dispatchMouseEvent(spectator.element, 'mouseover');

    expect(spectator.element).toHaveStyle({
      backgroundColor: 'rgba(0,0,0, 0.1)'
    });

    spectator.dispatchMouseEvent(spectator.element, 'mouseout');
    expect(spectator.element).toHaveStyle({
      backgroundColor: '#fff'
    });
  });`,
        }),
      );
    }

    it.each(TEST_RUNNERS)(`should rename to @openng - $testRunner`, async (testRunner) => {
      createTreeWithRunner(testRunner);
      const result = await runner.runSchematic('ngneat-to-openng', {}, tree);
      const content = result.readContent(pathStr);

      expect(content).toContain(`from '${resolveOpenNgModule(testRunner)}'`);
      expect(content).not.toContain(`from '${resolveNgNeatModule(testRunner)}'`);
      expect(content).toContain(`import { createDirectiveFactory, SpectatorDirective }`);
    });
  });

  describe('ngneat/pipe', () => {
    const pathStr = '/src/ngneat.pipe.ts';

    /**
     * Builds a test tree seeded with a pipe fixture for the given runner.
     */
    function createTreeWithRunner(testRunner: (typeof TEST_RUNNERS)[number]) {
      tree.create(
        pathStr,
        createTestFixtureContent({
          spectatorType: 'SpectatorPipe',
          factoryName: 'createPipeFactory',
          type: 'pipe',
          testRunner,
          testBody: `  it('should change the background color', () => {
    spectator = createPipe(\`<div>{{ 'Testing' | my }}</div>\`);

    expect(spectator.element).toHaveText('Testing');
  });`,
        }),
      );
    }

    it.each(TEST_RUNNERS)(`should rename to @openng - $testRunner`, async (testRunner) => {
      createTreeWithRunner(testRunner);
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(pathStr);

      expect(content).toContain(`from '${resolveOpenNgModule(testRunner)}'`);
      expect(content).not.toContain(`from '${resolveNgNeatModule(testRunner)}'`);
      expect(content).toContain(`import { createPipeFactory, SpectatorPipe }`);
    });
  });

  describe('ngneat/service', () => {
    const pathStr = '/src/ngneat.service.ts';

    /**
     * Builds a test tree seeded with a service fixture for the given runner.
     */
    function createTreeWithRunner(testRunner: (typeof TEST_RUNNERS)[number]) {
      tree.create(
        pathStr,
        createTestFixtureContent({
          spectatorType: 'SpectatorService',
          factoryName: 'createServiceFactory',
          type: 'service',
          testRunner,
          testBody: `  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });`,
        }),
      );
    }

    it.each(TEST_RUNNERS)(`should rename to @openng - $testRunner`, async (testRunner) => {
      createTreeWithRunner(testRunner);
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(pathStr);

      expect(content).toContain(`from '${resolveOpenNgModule(testRunner)}'`);
      expect(content).not.toContain(`from '${resolveNgNeatModule(testRunner)}'`);
      expect(content).toContain(`import { createServiceFactory, SpectatorService }`);
    });
  });

  describe('ngneat/component', () => {
    const pathStr = '/src/ngneat.component.ts';

    /**
     * Builds a test tree seeded with a component fixture for the given runner.
     */
    function createTreeWithRunner(testRunner: (typeof TEST_RUNNERS)[number]) {
      tree.create(
        pathStr,
        createTestFixtureContent({
          spectatorType: 'Spectator',
          factoryName: 'createComponentFactory',
          type: 'component',
          testRunner,
          testBody: `  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });`,
        }),
      );
    }

    it.each(TEST_RUNNERS)(`should rename to @openng - $testRunner`, async (testRunner) => {
      createTreeWithRunner(testRunner);
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(pathStr);

      expect(content).toContain(`from '${resolveOpenNgModule(testRunner)}'`);
      expect(content).not.toContain(`from '${resolveNgNeatModule(testRunner)}'`);
      expect(content).toContain(`import { createComponentFactory, Spectator }`);
    });
  });

  describe('package.json', () => {
    it('should remove ngneat dependencies', async () => {
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent('package.json');

      expect(content).not.toContain('@ngneat/spectator');
    });
  });

  describe('edge cases', () => {
    it('leaves unrelated files alone', async () => {
      const content = `import { Component } from '@angular/core';

@Component({})
export class Unrelated {}`;

      tree.create('/src/unrelated.ts', content);
      const result = await runner.runSchematic('nto', {}, tree);

      expect(result.readContent('/src/unrelated.ts')).toBe(content);
    });

    it('ignores partial prefix matches like @ngneat/spectator-testing', async () => {
      const content = `import { Something } from '@ngneat/spectator-testing';
import { Other } from '@ngneat/spectator-fork/vitest';

console.log(Something, Other);`;

      tree.create('/src/lookalike.ts', content);
      const result = await runner.runSchematic('nto', {}, tree);

      expect(result.readContent('/src/lookalike.ts')).toBe(content);
    });

    it('handles multiple imports from @ngneat/spectator in the same file', async () => {
      const content = `import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockProvider } from '@ngneat/spectator';
import { Component } from '@angular/core';

describe('multi-import', () => {});`;

      tree.create('/src/multi.ts', content);
      const result = await runner.runSchematic('nto', {}, tree);
      const updated = result.readContent('/src/multi.ts');

      expect(updated).toContain(`from '@openng/spectator'`);
      expect(updated).not.toContain(`from '@ngneat/spectator'`);
      // Both import lines should be rewritten — count occurrences
      expect(updated.match(/@ngneat\/spectator/g)).toBeNull();
      expect(updated.match(/@openng\/spectator/g)?.length).toBe(2);
    });

    it('rewrites export declarations from @ngneat/spectator', async () => {
      const content = `export { Spectator, createComponentFactory } from '@ngneat/spectator';
export { MockProvider } from '@ngneat/spectator/jest';`;

      tree.create('/src/barrel.ts', content);
      const result = await runner.runSchematic('nto', {}, tree);
      const updated = result.readContent('/src/barrel.ts');

      expect(updated).toContain(`from '@openng/spectator'`);
      expect(updated).toContain(`from '@openng/spectator/jest'`);
      expect(updated).not.toContain(`from '@ngneat/spectator'`);
    });

    it('skips non-TypeScript files', async () => {
      const content = "import { Spectator } from '@ngneat/spectator';";

      tree.create('/src/notes.md', content);
      const result = await runner.runSchematic('nto', {}, tree);

      expect(result.readContent('/src/notes.md')).toBe(content);
    });
  });
});
