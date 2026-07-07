import { SpectatorMatchers } from '@openng/spectator/core';

export * from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends SpectatorMatchers<T> {}
  interface AsymmetricMatchersContaining extends SpectatorMatchers<unknown> {}
}
