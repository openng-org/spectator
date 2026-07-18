import { SpectatorMatchers } from '@openng/spectator';

export * from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends SpectatorMatchers<T> {}
  interface AsymmetricMatchersContaining extends SpectatorMatchers<unknown> {}
}
