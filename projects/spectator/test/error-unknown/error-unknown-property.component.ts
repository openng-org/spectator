import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/* eslint-disable @angular-eslint/template/no-call-expression */

@Component({
  selector: 'app-use-unknown-property',
  template: `<span [some-property]="true"></span>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ErrorUnknownPropertyComponent {}
