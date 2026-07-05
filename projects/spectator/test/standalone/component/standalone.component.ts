import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: `app-standalone`,
  template: `<div id="standalone">This stands alone!</div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class StandaloneComponent {}
