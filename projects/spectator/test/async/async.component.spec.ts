import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { createComponentFactory, Spectator } from '@openng/spectator';

@Component({
  selector: 'app-foo',
  template: '',
  host: {
    '[class.bar]': 'bar',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FooComponent {
  @Input() bar!: boolean;
}

describe('FooComponenent', () => {
  const createComponent = createComponentFactory({
    component: FooComponent,
  });

  let spectator: Spectator<FooComponent>;

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should set the class name "bar"', () => {
    spectator.setInput({ bar: true });

    expect(spectator.element).toHaveClass('bar');
  });
});
