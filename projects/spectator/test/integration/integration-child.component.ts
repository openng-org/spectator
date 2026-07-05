import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-integration-child',
  template: ` <p>integration-child works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IntegrationChildComponent {}
