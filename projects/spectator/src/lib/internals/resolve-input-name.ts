import { reflectComponentType, Type } from '@angular/core';

/**
 * @internal
 * Build a resolver that maps a key used in a test onto the name Angular expects.
 *
 * `ComponentRef.setInput()` addresses inputs by their public name, so an input
 * declaring an alias — `@Input('userName')`, `input({ alias: 'userName' })` — is
 * only reachable through that alias. Tests, however, are typed against the class
 * property names, so both spellings have to work.
 */
export function inputNameResolver(componentType: Type<unknown>): (key: string) => string {
  const inputs = reflectComponentType(componentType)?.inputs;

  if (!inputs?.length) {
    return (key) => key;
  }

  const publicNames = new Set(inputs.map((input) => input.templateName));
  const publicNameByPropName = new Map(inputs.map((input) => [input.propName, input.templateName]));

  return (key) => {
    /**
     * A public name always wins. A key can be the public name of one input and
     * the property name of another, and resolving it as the public name is what
     * `setInput()` has always done.
     */
    if (publicNames.has(key)) {
      return key;
    }

    /**
     * Unknown keys are left untouched so that Angular still reports them
     * (NG0303) instead of them being silently redirected onto another input.
     */
    return publicNameByPropName.get(key) ?? key;
  };
}
