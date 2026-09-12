/**
 * Entry points involved in the migration.
 */
export const ROOT_ENTRY_POINT = '@openng/spectator';
export const JASMINE_ENTRY_POINT = '@openng/spectator/jasmine';

/**
 * Entry points that pin a file to a different test runner. A file importing from one of these is
 * never a Jasmine consumer, so it is left untouched.
 */
export const OTHER_RUNNER_ENTRY_POINTS = ['@openng/spectator/jest', '@openng/spectator/vitest'];

/**
 * Symbols that moved from the `@openng/spectator` root entry point to `@openng/spectator/jasmine`.
 *
 * These are the symbols the root entry point used to type against `jasmine.Spy`. The root entry
 * point still exports names such as `Spectator` and `createComponentFactory`, but they are now the
 * runner-agnostic bases: `inject()` returns `T` rather than `SpyObject<T>`, and `mockProvider` must
 * be supplied by the caller. Jasmine consumers therefore need the `/jasmine` flavour of every name
 * listed here to keep the behaviour they had before the split.
 *
 * Deliberately excluded, because the root entry point still exports them unchanged and `/jasmine`
 * does not export them at all: the options and overrides types (`SpectatorOptions`,
 * `SpectatorOverrides`, …), `CompatibleSpy`, `MockProvider`, `SpectatorMatchers`,
 * `ActivatedRouteStub`, `typeInElement`, `defineGlobalsInjections`, the `dispatch*` /
 * `create*Event` helpers and the `initial*Module` symbols.
 */
export const JASMINE_MOVED_SYMBOLS: ReadonlySet<string> = new Set([
  // mock
  'createSpyObject',
  'mockProvider',
  'SpyObject',

  // component
  'createComponentFactory',
  'Spectator',
  'SpectatorFactory',

  // host
  'createHostFactory',
  'SpectatorHost',
  'SpectatorHostFactory',

  // directive
  'createDirectiveFactory',
  'SpectatorDirective',
  'SpectatorDirectiveFactory',

  // service
  'createServiceFactory',
  'SpectatorService',
  'SpectatorServiceFactory',

  // routing
  'createRoutingFactory',
  'SpectatorRouting',
  'SpectatorRoutingFactory',

  // http
  'createHttpFactory',
  'SpectatorHttp',
  'SpectatorHttpFactory',

  // pipe
  'createPipeFactory',
  'SpectatorPipe',
  'SpectatorPipeFactory',

  // injection context
  'createInjectionContextFactory',
  'SpectatorInjectionContext',
  'SpectatorInjectionContextFactory',
]);

/**
 * Symbols that `@openng/spectator/jasmine` re-exports verbatim from the root entry point, so either
 * import path is correct.
 *
 * They travel along when the statement they sit in already needs the `/jasmine` entry point, which
 * keeps a spec's Spectator imports on a single line instead of splitting them across two. Files that
 * need nothing from `/jasmine` are left alone.
 */
export const JASMINE_SHARED_SYMBOLS: ReadonlySet<string> = new Set([
  // dom-selectors
  'byAltText',
  'byLabel',
  'byPlaceholder',
  'byRole',
  'byTestId',
  'byText',
  'byTextContent',
  'byTitle',
  'byValue',

  // http
  'HttpMethod',
]);
