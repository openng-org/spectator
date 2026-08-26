import { Component, Input, input, model } from '@angular/core';
import { createComponentFactory, createRoutingFactory } from '@openng/spectator';

describe('PropsAliasNames', () => {
  describe('input decorators', () => {
    @Component({
      selector: 'app-root',
      template: `
        <div data-test="props--name">{{ name }}</div>
        <div data-test="props--age">{{ numOfYears }}</div>
      `,
      standalone: true,
    })
    class DummyComponent {
      @Input('userName') public name = '';
      @Input({ alias: 'age' }) public numOfYears = 0;
    }

    const createComponent = createComponentFactory(DummyComponent);

    it('props should accept the property name of an @Input() with a rename alias', () => {
      const spectator = createComponent({ props: { name: 'John' } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
    });

    it('props should accept the property name of an @Input() with an alias option', () => {
      const spectator = createComponent({ props: { numOfYears: 123 } });

      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
    });

    it('props should still accept the alias names', () => {
      const spectator = createComponent({ props: { userName: 'John', age: 123 } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
    });

    it('props should accept property names and alias names in the same object', () => {
      const spectator = createComponent({ props: { name: 'John', age: 123 } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
    });

    it('setInput should accept the property name of an aliased input', () => {
      const spectator = createComponent();

      spectator.setInput('name', 'John');
      spectator.setInput('numOfYears', 123);

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
    });
  });

  describe('signal inputs', () => {
    @Component({
      selector: 'app-root',
      template: `
        <div data-test="props--name">{{ name() }}</div>
        <div data-test="props--age">{{ numOfYears() }}</div>
        <div data-test="props--nickname">{{ nickname() }}</div>
      `,
      standalone: true,
    })
    class DummyComponent {
      public name = input.required<string>({ alias: 'userName' });
      public numOfYears = input(0, { alias: 'age' });
      public nickname = model('', { alias: 'nick' });
    }

    const createComponent = createComponentFactory(DummyComponent);

    it('props should accept the property name of a required signal input with an alias', () => {
      const spectator = createComponent({ props: { name: 'John' } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
    });

    it('props should accept the property name of an optional signal input with an alias', () => {
      const spectator = createComponent({ props: { name: 'John', numOfYears: 123 } });

      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
    });

    it('props should accept the property name of a model with an alias', () => {
      const spectator = createComponent({ props: { name: 'John', nickname: 'Johnny' } });

      expect(spectator.query('[data-test="props--nickname"]')!.innerHTML).toBe('Johnny');
    });

    it('props should still accept the alias names', () => {
      const spectator = createComponent({ props: { userName: 'John', age: 123, nick: 'Johnny' } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('123');
      expect(spectator.query('[data-test="props--nickname"]')!.innerHTML).toBe('Johnny');
    });
  });

  describe('inputs without an alias', () => {
    @Component({
      selector: 'app-root',
      template: `
        <div data-test="props--title">{{ title }}</div>
        <div data-test="props--count">{{ count() }}</div>
      `,
      standalone: true,
    })
    class DummyComponent {
      @Input() public title = '';
      public count = input(0);
    }

    const createComponent = createComponentFactory(DummyComponent);

    it('props should keep working for inputs that declare no alias', () => {
      const spectator = createComponent({ props: { title: 'Hello', count: 7 } });

      expect(spectator.query('[data-test="props--title"]')!.innerHTML).toBe('Hello');
      expect(spectator.query('[data-test="props--count"]')!.innerHTML).toBe('7');
    });

    it('props should leave a key that matches no input alone', () => {
      // Angular reports the unknown key itself (NG0303); the resolver must not
      // silently redirect it onto some other input.
      const spectator = createComponent({ props: { title: 'Hello', notAnInput: 'ignored' } });

      expect(spectator.query('[data-test="props--title"]')!.innerHTML).toBe('Hello');
      expect(spectator.query('[data-test="props--count"]')!.innerHTML).toBe('0');
    });
  });

  describe('a key that is both a public name and a property name', () => {
    @Component({
      selector: 'app-root',
      template: `
        <div data-test="props--years">{{ numOfYears }}</div>
        <div data-test="props--age">{{ age }}</div>
      `,
      standalone: true,
    })
    class DummyComponent {
      // 'age' is the public name of this input...
      @Input({ alias: 'age' }) public numOfYears = 'no-years';
      // ...and the property name of this one. Both are strings on purpose: the
      // type describes the property, so a collision is only expressible when the
      // two inputs agree on their value type.
      @Input({ alias: 'collided' }) public age = 'untouched';
    }

    const createComponent = createComponentFactory(DummyComponent);

    it('props should resolve the key as a public name, not as a property name', () => {
      const spectator = createComponent({ props: { age: 'set-via-public-name' } });

      expect(spectator.query('[data-test="props--years"]')!.innerHTML).toBe('set-via-public-name');
      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('untouched');
    });

    it('props should still reach the shadowed input through its own public name', () => {
      const spectator = createComponent({ props: { collided: 'reached' } });

      expect(spectator.query('[data-test="props--age"]')!.innerHTML).toBe('reached');
    });
  });

  describe('no props', () => {
    @Component({
      selector: 'app-root',
      template: `<div data-test="props--name">{{ name }}</div>`,
      standalone: true,
    })
    class DummyComponent {
      @Input('userName') public name = 'default';
    }

    const createComponent = createComponentFactory(DummyComponent);

    it('props should be a no-op when it is explicitly undefined', () => {
      const spectator = createComponent({ props: undefined });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('default');
    });

    it('props should be a no-op when no overrides are passed at all', () => {
      const spectator = createComponent();

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('default');
    });

    it('setInput should be a no-op when it is given nothing', () => {
      const spectator = createComponent();

      spectator.setInput(undefined as unknown as Record<string, unknown>);

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('default');
    });
  });

  describe('createRoutingFactory', () => {
    @Component({
      selector: 'app-root',
      template: `<div data-test="props--name">{{ name }}</div>`,
      standalone: true,
    })
    class DummyComponent {
      @Input('userName') public name = '';
    }

    const createComponent = createRoutingFactory(DummyComponent);

    it('props should accept the property name of an aliased input', () => {
      const spectator = createComponent({ props: { name: 'John' } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
    });

    it('props should still accept the alias name', () => {
      const spectator = createComponent({ props: { userName: 'John' } });

      expect(spectator.query('[data-test="props--name"]')!.innerHTML).toBe('John');
    });
  });
});
