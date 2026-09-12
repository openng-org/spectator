import { CommonModule } from '@angular/common';
import { createComponentFactory } from '@openng/spectator';

import { ErrorUnknownElementComponent } from '../../../test/error-unknown/error-unknown-element.component';

describe('ErrorUnknownElementComponent', () => {
  const createComponent = createComponentFactory({
    component: ErrorUnknownElementComponent,
    imports: [CommonModule],
    errorOnUnknownElements: true,
  });

  it('should throw an error when creating the component', () => {
    expect(() => createComponent()).toThrowError();
  });
});
