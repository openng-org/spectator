import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  template: ` <p class="dynamic">dynamic works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DynamicComponent {}
