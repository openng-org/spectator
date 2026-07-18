/** Credit: Valentin Buryakov */
import { FactoryProvider, Type, AbstractType } from '@angular/core';

type Writable<T> = { -readonly [P in keyof T]: T[P] };

declare type UnknownFunction = (...args: any[]) => any;

/**
 * @publicApi
 */
export interface CompatibleSpy<F extends UnknownFunction = UnknownFunction> {
  (...args: Parameters<F>): ReturnType<F>;

  /**
   * By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value.
   */
  andReturn(val: ReturnType<F>): void;

  /**
   * By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function.
   */
  andCallFake(fn: F): this;

  /**
   * removes all recorded calls
   */
  reset(): void;
}

/**
 * @publicApi
 */
export type SpyObject<T> = T & { [P in keyof T]: T[P] extends UnknownFunction ? T[P] & CompatibleSpy<T[P]> : T[P] } & {
  /**
   * Casts to type without readonly properties
   */
  castToWritable(): Writable<T>;
};

/**
 * @internal
 */
export function installProtoMethods<T>(mock: any, proto: any, createSpyFn: Function): void {
  if (proto === null || proto === Object.prototype) {
    return;
  }

  for (const key of Object.getOwnPropertyNames(proto)) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);

    if (!descriptor) {
      continue;
    }

    if (typeof descriptor.value === 'function' && key !== 'constructor' && typeof mock[key] === 'undefined') {
      mock[key] = createSpyFn(key);
    } else if (descriptor.get && !mock.hasOwnProperty(key)) {
      Object.defineProperty(mock, key, {
        set: (value) => (mock[`_${key}`] = value),
        get: () => mock[`_${key}`],
        configurable: true,
      });
    }
  }

  installProtoMethods(mock, Object.getPrototypeOf(proto), createSpyFn);

  mock.castToWritable = () => mock;
}

/**
 * @publicApi
 */
export type MockProvider = <T>(type: Type<T> | AbstractType<T>, properties?: Partial<Record<keyof T, any>>) => FactoryProvider;
