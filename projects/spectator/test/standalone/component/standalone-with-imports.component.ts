import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: `app-standalone-child`,
  template: `<div id="child-standalone">This stands alone child!</div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class StandaloneChildComponent {}

@Component({
  selector: `app-standalone-child:not(.NG0912)`,
  template: `<div id="child-standalone">Mocked!</div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class MockStandaloneChildComponent {}

@Component({
  selector: `app-standalone-with-imports`,
  template: `<app-standalone-child />`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StandaloneChildComponent],
})
export class StandaloneWithImportsComponent {}
