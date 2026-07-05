import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fg',
  template: `
    <form [formGroup]="group">
      <input formControlName="name" />
    </form>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FgComponent {
  @Input() public group?: FormGroup;
}
