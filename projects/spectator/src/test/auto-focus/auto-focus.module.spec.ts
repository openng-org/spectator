import { createDirectiveFactory, SpectatorDirective } from '@openng/spectator';

import { AutoFocusDirective } from '../../../test/auto-focus/auto-focus.directive';
import { AutoFocusModule } from '../../../test/auto-focus/auto-focus.module';

describe('AutoFocusDirectiveModule', () => {
  let spectator: SpectatorDirective<AutoFocusDirective>;

  const createDirective = createDirectiveFactory({
    directive: AutoFocusDirective,
    imports: [AutoFocusModule],
    declareDirective: false,
  });

  it('should be declare AutoFocusDirective', () => {
    spectator = createDirective(`<input [datoAutoFocus]="false"/>`);
    expect(spectator.directive).toBeDefined();
  });
});
