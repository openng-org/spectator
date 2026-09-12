import { AbstractType, InjectionToken, Type } from '@angular/core';
import {
    createServiceFactory as baseCreateServiceFactory,
    SpectatorService as BaseSpectatorService,
    isType,
    SpectatorServiceOptions,
    SpectatorServiceOverrides
} from '@openng/spectator';

import { mockProvider, SpyObject } from './mock';

/**
 * @publicApi
 */
export interface SpectatorService<S> extends BaseSpectatorService<S> {
  inject<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>): SpyObject<T>;
}

/**
 * @publicApi
 */
export type SpectatorServiceFactory<S> = (overrides?: SpectatorServiceOverrides<S>) => SpectatorService<S>;

/**
 * @publicApi
 */
export function createServiceFactory<S>(typeOrOptions: SpectatorServiceOptions<S> | Type<S>): SpectatorServiceFactory<S> {
  return baseCreateServiceFactory({
    mockProvider,
    ...(isType(typeOrOptions) ? { service: typeOrOptions } : typeOrOptions),
  }) as SpectatorServiceFactory<S>;
}
