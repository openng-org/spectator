import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ChildServiceService } from '../child-service.service';

@Component({
  selector: 'app-child',
  template: ` <p>child works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChildComponent {
  constructor(private readonly service: ChildServiceService) {}
}
