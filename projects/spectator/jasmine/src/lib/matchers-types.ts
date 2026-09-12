import { SpectatorMatchers } from '@openng/spectator';

declare global {
  namespace jasmine {
    interface Matchers<T> extends Omit<SpectatorMatchers<boolean>, 'toHaveClass'> {
      toHaveClass(className: string | string[], options?: { strict: boolean }): boolean;
    }
  }
}

export { };

