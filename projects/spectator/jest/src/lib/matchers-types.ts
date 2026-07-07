import { SpectatorMatchers } from '@openng/spectator/core';

declare global {
  namespace jest {
    interface Matchers<R> extends SpectatorMatchers<R> {}
  }
}

export {};
