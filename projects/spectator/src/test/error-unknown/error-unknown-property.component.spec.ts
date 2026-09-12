import { CommonModule } from '@angular/common';
import { createComponentFactory } from '@openng/spectator';

import { ErrorUnknownPropertyComponent } from '../../../test/error-unknown/error-unknown-property.component';

describe('ErrorUnknownPropertyComponent', () => {
  const createComponent = createComponentFactory({
    component: ErrorUnknownPropertyComponent,
    imports: [CommonModule],
    errorOnUnknownProperties: true,
  });

  it('should throw an error when creating the component', () => {
    expect(() => createComponent()).toThrowError();
  });
});
