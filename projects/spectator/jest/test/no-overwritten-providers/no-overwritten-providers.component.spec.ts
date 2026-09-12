import { createHostFactory, mockProvider } from '@openng/spectator/jest';

import { DummyService } from '../../../test/no-overwritten-providers/dummy.service';
import { ComponentWithoutOverwrittenProvidersComponent } from '../../../test/no-overwritten-providers/no-overwritten-providers.component';

describe('ComponentWithoutOverwrittenProvidersComponent', () => {
  describe('with options', () => {
    const createHost = createHostFactory({
      component: ComponentWithoutOverwrittenProvidersComponent,
      componentProviders: [mockProvider(DummyService)],
    });

    it('should not overwrite components providers and work using createHostFactory', () => {
      const { component } = createHost(`
        <app-component-without-overwritten-providers>
        </app-component-without-overwritten-providers>
      `);

      expect(component).toBeDefined();
      expect(component.dummy).toBeDefined();
    });
  });

  // describe('with component', () => {
  //   let createHost = createHostFactory(ComponentWithoutOverwrittenProvidersComponent);
  //
  //   it('should not overwrite component\'s providers and work using createHostFactory', () => {
  //     const { component } = createHost(`
  //       <app-component-without-overwritten-providers>
  //       </app-component-without-overwritten-providers>
  //     `);
  //
  //     expect(component).toBeDefined();
  //     expect(component.dummy).toBeDefined();
  //   });
  // });
});
