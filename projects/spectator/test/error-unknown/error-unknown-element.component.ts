import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/* eslint-disable @angular-eslint/template/no-call-expression */

@Component({
  selector: 'app-use-unknown-element',
  template: `<some-element></some-element>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ErrorUnknownElementComponent {}
