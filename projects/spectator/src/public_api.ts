// Jasmine-specific wrappers (Spectator classes, factories, spy types, matchers types)
export * from '@openng/spectator/jasmine';

// Core exports that don't conflict with jasmine
export {
  // Options types
  SpectatorOptions,
  SpectatorHostOptions,
  SpectatorDirectiveOptions,
  SpectatorServiceOptions,
  SpectatorRoutingOptions,
  SpectatorHttpOptions,
  SpectatorPipeOptions,
  SpectatorInjectionContextOptions,

  // Override types
  SpectatorOverrides,
  SpectatorHostOverrides,
  SpectatorDirectiveOverrides,
  SpectatorServiceOverrides,
  SpectatorRoutingOverrides,
  CreateHttpOverrides,
  SpectatorPipeOverrides,
  SpectatorInjectionContextOverrides,

  // Initial modules
  initialSpectatorModule,
  initialSpectatorWithHostModule,
  initialSpectatorDirectiveModule,
  initialSpectatorPipeModule,
  initialInjectionContextModule,

  // Host
  HostComponent,
  HostModule,

  // Routing
  ActivatedRouteStub,

  // Mock utilities (core versions)
  CompatibleSpy,
  installProtoMethods,
  MockProvider,

  // Matchers (implementations)
  toExist,
  toHaveLength,
  toHaveId,
  toHaveClass,
  toHaveAttribute,
  toHaveProperty,
  toContainProperty,
  toHaveText,
  toContainText,
  toHaveExactText,
  toHaveExactTrimmedText,
  toHaveValue,
  toContainValue,
  toHaveStyle,
  toHaveData,
  toBeChecked,
  toBeIndeterminate,
  toBeDisabled,
  toBeEmpty,
  toBePartial,
  toBeHidden,
  toBeSelected,
  toBeVisible,
  toBeFocused,
  toBeMatchedBy,
  toHaveDescendant,
  toHaveDescendantWithText,
  toHaveSelectedOptions,

  // Matcher types
  CustomMatcherFactory,
  CustomMatcher,
  CustomMatcherResult,

  // Token
  Token,

  // Types
  SpectatorElement,
  QueryType,
  QueryOptions,
  KeyboardEventOptions,
  SelectOptions,
  OptionalsRequired,
  InferInputSignals,
  InferInputSignal,
  OutputType,
  KeysMatching,
  isType,

  // Utilities
  typeInElement,
  defineGlobalsInjections,

  // Events
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  dispatchTouchEvent,
  createFakeEvent,
  createKeyboardEvent,
  createMouseEvent,
  createTouchEvent,

  // DOM selectors
  DOMSelector,
  DOMSelectorFactory,
  byAltText,
  byLabel,
  byPlaceholder,
  byText,
  byTextContent,
  byTitle,
  byValue,
  byTestId,
  byRole,
} from '@openng/spectator/core';
