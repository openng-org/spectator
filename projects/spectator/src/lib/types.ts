import { DebugElement, ElementRef, EventEmitter, InputSignalWithTransform, OnDestroy, OutputRef, Type } from '@angular/core';

import { DOMSelector } from './dom-selectors';
import { Token } from './token';

type OptionalPropertyNames<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
type OptionalProperties<T> = Pick<T, OptionalPropertyNames<T>>;

export type InferInputSignal<T> = T extends InputSignalWithTransform<infer K, infer _> ? K : T;
export type InferInputSignals<C> = {
  [P in keyof C]+?: InferInputSignal<C[P]>;
};

/**
 * Props accepted by `createComponent()` and `createRoutingFactory()`.
 *
 * Keys may be either the class property name or the input's public name, since
 * an input declaring an alias is only reachable through that alias at runtime.
 * Aliases cannot be derived from the type system -- neither `@Input('userName')`
 * nor `input({ alias: 'userName' })` carries the literal into the type -- so the
 * public names are admitted through an index signature.
 *
 * The union with the bare mapped type is what keeps that index signature from
 * costing more than it has to: value types are still checked for every known
 * input, and a `props` object typed through an `interface` or a class stays
 * assignable. An unknown key is the one thing it can no longer reject, and
 * Angular still reports that at runtime (NG0303).
 */
export type InferInputProps<C> = InferInputSignals<C> | (InferInputSignals<C> & Record<string, unknown>);

export type OptionalsRequired<T> = Required<OptionalProperties<T>> & Partial<T>;

export type AtLeastOneRequired<T> = {
  [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

export type SpectatorElement = string | Element | DebugElement | ElementRef | Window | Document | DOMSelector;

export type QueryType = Type<any> | DOMSelector | string;
export interface QueryOptions<R> {
  read?: Token<R>;
  root?: boolean;
  parentSelector?: Type<any> | string | DOMSelector;
}

export type OutputType<P> = P extends EventEmitter<infer T> ? T : P extends OutputRef<infer T> ? T : never;

export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

export type SelectOptions = string | string[] | HTMLOptionElement | HTMLOptionElement[];

export type NestedDeferBlocks = {
  deferBlock: (deferBlockIndex?: number) => DeferBlocks;
};

export interface DeferBlocks {
  renderComplete(): Promise<NestedDeferBlocks>;
  renderPlaceholder(): Promise<NestedDeferBlocks>;
  renderLoading(): Promise<NestedDeferBlocks>;
  renderError(): Promise<NestedDeferBlocks>;
}

export interface KeyboardEventOptions {
  key: string;
  keyCode: number;
}

export function doesServiceImplementsOnDestroy<S extends object>(testedService: S): testedService is S & OnDestroy {
  return 'ngOnDestroy' in testedService && typeof testedService['ngOnDestroy'] === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export function isHTMLOptionElementArray(value: any): value is HTMLOptionElement[] {
  return Array.isArray(value) && !!value.length && value.every((item) => item instanceof HTMLOptionElement);
}

export function isObject(v: any): v is object {
  return v && typeof v === 'object';
}
