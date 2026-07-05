import { Component, EventEmitter, Input, input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({ changeDetection: ChangeDetectionStrategy.Eager, template: '' })
export class TestCompInput {
  @Input() value = 0;
}

@Component({ changeDetection: ChangeDetectionStrategy.Eager, template: '<button (click)="event.emit()">Click me</button>' })
export class TestCompOutput {
  @Output() event = new EventEmitter<void>();
}

@Component({ changeDetection: ChangeDetectionStrategy.Eager, template: 'Value: {{value}}' })
export class TestCompTwoWayBinding {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}

@Component({
  selector: 'my-host-comp',
  template: '...',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { '[class.checked]': 'isChecked()' },
})
export class TestCompHost {
  isChecked = input(false);
}
