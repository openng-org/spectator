import { AbstractType, FactoryProvider, Type } from '@angular/core';
import { SpyObject as BaseSpyObject, CompatibleSpy, installProtoMethods } from '@openng/spectator';

export type SpyObject<T> = BaseSpyObject<T> & {
  [P in keyof T]: T[P] &
    (T[P] extends (...args: any[]) => infer R ? jasmine.Spy<(...args: any[]) => R> : T[P]);
};

/**
 * @publicApi
 */
export function createSpyObject<T>(type: Type<T> | AbstractType<T>, template?: Partial<Record<keyof T, any>>): SpyObject<T> {
  const mock: any = { ...template };

  installProtoMethods(mock, type.prototype, (name) => {
    const newSpy: jasmine.Spy & Partial<CompatibleSpy> = jasmine.createSpy(name);
    newSpy.andCallFake = (fn: (...args: any[]) => any) => newSpy.and.callFake(fn) as any;
    newSpy.andReturn = (val) => newSpy.and.returnValue(val);
    newSpy.reset = () => newSpy.calls.reset();
    newSpy.and.returnValue(null);
    return newSpy;
  });

  return mock;
}

/**
 * @publicApi
 */
export function mockProvider<T>(type: Type<T> | AbstractType<T>, properties?: Partial<Record<keyof T, any>>): FactoryProvider {
  return {
    provide: type,
    useFactory: () => createSpyObject(type, properties),
  };
}
