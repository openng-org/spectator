import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/* eslint-disable @angular-eslint/template/no-call-expression */

@Component({
  selector: 'app-set-input',
  template: ``,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SetInputComponent {
  public another;

  @Input() public one;
  @Input() public set two(value: any) {
    this.another = value;
  }
}
