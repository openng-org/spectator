import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import path from 'path';

describe('NgNeat to Openng', () => {
  const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../collection.json'));

  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
  });

  describe('ngneat/directive', () => {
    const path: string = '/src/ngneat.directive.ts';

    beforeEach(() => {
      tree.create(
        path,
        `import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
        import { MyDirective } from './my.directive';

        describe('MyDirective', () => {
          let spectator: SpectatorDirective<MyDirective>;
          const createDirective = createDirectiveFactory(MyDirective);

          it('should change the background color', () => {
            spectator = createDirective(\`<div highlight>Testing MyDirective</div>\`);

            spectator.dispatchMouseEvent(spectator.element, 'mouseover');

            expect(spectator.element).toHaveStyle({
              backgroundColor: 'rgba(0,0,0, 0.1)'
            });

            spectator.dispatchMouseEvent(spectator.element, 'mouseout');
            expect(spectator.element).toHaveStyle({
              backgroundColor: '#fff'
            });
          });

        });`,
      );
    });

    it('should remane to @openng', async () => {
      const result = await runner.runSchematic('ngneat-to-openng', {}, tree);
      const content = result.readContent(path);

      expect(content).toContain(`from '@openng/spectator'`);
      expect(content).not.toContain(`from '@ngneat/spectator'`);
      expect(content).toContain(`import { createDirectiveFactory, SpectatorDirective }`); // named imports intacts
    });
  });

  describe('ngneat/pipe', () => {
    const path: string = '/src/ngneat.pipe.ts';

    beforeEach(() => {
      tree.create(
        path,
        `import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';
        import { MyPipe } from './my.pipe';

        describe('MyPipe ', () => {
        let spectator: SpectatorPipe<MyPipe>;
        const createPipe = createPipeFactory(MyPipe);

        it('should change the background color', () => {
            spectator = createPipe(\`<div>{{ 'Testing' | my }}</div>\`);

            expect(spectator.element).toHaveText('Testing');
        });
        });`,
      );
    });

    it('should remane to @openng', async () => {
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(path);

      expect(content).toContain(`from '@openng/spectator'`);
      expect(content).not.toContain(`from '@ngneat/spectator'`);
      expect(content).toContain(`import { createPipeFactory, SpectatorPipe }`); // named imports intacts
    });
  });

  describe('ngneat/service', () => {
    const path: string = '/src/ngneat.service.ts';

    beforeEach(() => {
      tree.create(
        path,
        `import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
        import { MyService } from './my.service';

        describe('MyService', () => {
        let spectator: SpectatorService<MyService>;
        const createService = createServiceFactory(MyService);

        beforeEach(() => spectator = createService());

        it('should...', () => {
            expect(spectator.service).toBeTruthy();
        });
        });`,
      );
    });

    it('should remane to @openng', async () => {
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(path);

      expect(content).toContain(`from '@openng/spectator'`);
      expect(content).not.toContain(`from '@ngneat/spectator'`);
      expect(content).toContain(`import { createServiceFactory, SpectatorService }`); // named imports intacts
    });
  });

  describe('ngneat/component', () => {
    const path: string = '/src/ngneat.component.ts';

    beforeEach(() => {
      tree.create(
        path,
        `import { Spectator, createComponentFactory } from '@ngneat/spectator';
        import { MyComponent } from './my.component';

        describe('MyComponent', () => {
        let spectator: Spectator<MyComponent>;
        const createComponent = createComponentFactory(MyComponent);

        it('should create', () => {
            spectator = createComponent();

            expect(spectator.component).toBeTruthy();
        });
        });`,
      );
    });

    it('should remane to @openng', async () => {
      const result = await runner.runSchematic('nto', {}, tree);
      const content = result.readContent(path);

      expect(content).toContain(`from '@openng/spectator'`);
      expect(content).not.toContain(`from '@ngneat/spectator'`);
      expect(content).toContain(`import { Spectator, createComponentFactory }`); // named imports intacts
    });
  });
});
