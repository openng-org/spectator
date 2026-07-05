---
id: vitest-support  
title: Vitest Support 
---

By default, Spectator uses Jasmine for creating spies. If you are using Vitest as test framework instead, you can let Spectator create Vitest-compatible spies.

## Configuration

Update your `vite.config.[m]ts` to inline the Spectator package so it gets transformed with Vite before the tests run.

```ts
export default defineConfig(({ mode }) => ({
  /* ... */
  test: {
    /* ... */
    // inline @openng/spectator
    server: {
      deps: {
        inline: ['@openng/spectator']
      }
    }
  },
}));
```

## Usage

Import the functions from `@openng/spectator/vitest` instead of  `@openng/spectator` to use Vitest instead of Jasmine.

```ts
import { createServiceFactory, SpectatorService } from '@openng/spectator/vitest';
import { AuthService } from './auth.service';
import { DateService } from './date.service';

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory({
    service: AuthService,
    mocks: [DateService]
  });

  beforeEach(() => spectator = createService());

  it('should not be logged in', () => {
    const dateService = spectator.inject<DateService>(DateService);
    dateService.isExpired.mockReturnValue(true);
    expect(spectator.service.isLoggedIn()).toBeFalsy();
  });

  it('should be logged in', () => {
    const dateService = spectator.inject<DateService>(DateService);
    dateService.isExpired.mockReturnValue(false);
    expect(spectator.service.isLoggedIn()).toBeTruthy();
  });
});
```
