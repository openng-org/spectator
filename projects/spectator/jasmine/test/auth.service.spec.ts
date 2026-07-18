import { createServiceFactory, SpectatorService } from '@openng/spectator/jasmine';

import { AuthService } from '../../test/auth.service';
import { DateService } from '../../test/date.service';
import { DynamicComponent } from '../../test/dynamic/dynamic.component';

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory({
    service: AuthService,
    entryComponents: [DynamicComponent],
    mocks: [DateService],
  });

  beforeEach(() => (spectator = createService()));

  it('should not be logged in', () => {
    const dateService = spectator.inject(DateService);
    dateService.isExpired.and.returnValue(true);
    expect(spectator.service.isLoggedIn()).toBeFalsy();
  });

  it('should be logged in', () => {
    const dateService = spectator.inject(DateService);
    dateService.isExpired.and.returnValue(false);
    expect(spectator.service.isLoggedIn()).toBeTruthy();
  });
});
