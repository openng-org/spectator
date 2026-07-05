import { Component, Output, output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-child-custom-event',
  template: ` <p>Custom child</p> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChildCustomEventComponent {
  @Output() customEventUsingEventEmitter = new EventEmitter<string>();
  customEventUsingOutputEmitter = output<string>();
}
