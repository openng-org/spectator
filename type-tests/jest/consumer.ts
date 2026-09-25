import { createComponentFactory, Spectator } from '@openng/spectator/jest';
import { input } from '@angular/core';

declare const element: HTMLElement;
declare const option: HTMLOptionElement;

describe('custom DOM matchers are wired into expect()', () => {
  it('type-checks every custom matcher', () => {
    expect(element).toExist();
    expect(element).toHaveLength(3);
    expect(element).toHaveId('root');
    expect(element).toHaveClass('active');
    expect(element).toHaveClass(['active', 'selected'], { strict: false });
    expect(element).toHaveAttribute('role', 'button');
    expect(element).toHaveAttribute({ role: 'button' });
    expect(element).toHaveProperty('title', 'hello');
    expect(element).toHaveProperty('hidden', true);
    expect(element).toContainProperty('title', 'hell');
    expect(element).toHaveText('hello');
    expect(element).toHaveText(['hello', 'world'], true);
    expect(element).toHaveText((text) => text.startsWith('hell'));
    expect(element).toContainText('ell');
    expect(element).toHaveExactText('hello', { trim: true });
    expect(element).toHaveExactTrimmedText('hello');
    expect(element).toHaveValue('42');
    expect(element).toContainValue(['4', '2']);
    expect(element).toHaveStyle({ color: 'red' });
    expect(element).toHaveData({ data: 'role', val: 'admin' });
    expect(element).toBeChecked();
    expect(element).toBeIndeterminate();
    expect(element).toBeDisabled();
    expect(element).toBeEmpty();
    expect(element).toBePartial({ title: 'hello' });
    expect(element).toBeHidden();
    expect(element).toBeSelected();
    expect(element).toBeVisible();
    expect(element).toBeFocused();
    expect(element).toBeMatchedBy('.active');
    expect(element).toHaveDescendant('button');
    expect(element).toHaveDescendantWithText({ selector: 'button', text: 'Save' });
    expect(element).toHaveSelectedOptions('1');
    expect(element).toHaveSelectedOptions([option]);

    // Negative control: proves the assertion type is not `any`, i.e. the
    // matcher checks above are meaningful.
    // @ts-expect-error unknown matcher must not type-check
    expect(element).toHaveTextBogus('hello');
  });
});

/**
 * `props` accepts either the class property name or the input's public name,
 * since an aliased input is only reachable through its alias at runtime (#15).
 */
class AliasedInputsComponent {
  public name = input.required<string>({ alias: 'userName' });
  public age = input(0, { alias: 'userAge' });
}

const createAliasedComponent = createComponentFactory(AliasedInputsComponent);

createAliasedComponent({ props: { name: 'John', age: 30 } });
createAliasedComponent({ props: { userName: 'John', userAge: 30 } });
createAliasedComponent({ props: { name: 'John', userAge: 30 } });

// A `props` object typed through an interface has no index signature, so this is
// the guard against typing `props` as a plain intersection with `Record`.
interface AliasedProps {
  name: string;
}
declare const aliasedProps: AliasedProps;
createAliasedComponent({ props: aliasedProps });

// Negative control: value types are still checked for known inputs. This is what
// distinguishes the shipped type from a plain union with `Record<string, unknown>`,
// which would accept this silently.
// @ts-expect-error a string is not assignable to a number input
createAliasedComponent({ props: { name: 'John', age: 'thirty' } });

// Reference the entry point exports so the import is used and the bundle resolves.
export type Check = Spectator<unknown>;
export const factory = createComponentFactory;
