import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Spectator, createComponentFactory } from '@openng/spectator';

import { IntegrationParentComponent } from '../../../test/integration/integration-parent.component';
import { IntegrationModule } from '../../../test/integration/integration.module';

describe('IntegrationParentComponent', () => {
  let spectator: Spectator<IntegrationParentComponent>;
  const createComponent = createComponentFactory({
    component: IntegrationParentComponent,
    imports: [IntegrationModule, HttpClientTestingModule],
    declareComponent: false,
  });

  it('should exist', () => {
    spectator = createComponent();
    expect(spectator.component).toBeDefined();
  });
});
