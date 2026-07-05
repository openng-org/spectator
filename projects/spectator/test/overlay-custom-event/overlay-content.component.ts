import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-overlay-content',
  template: ` <p>Overlay Content</p> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OverlayContentComponent {
  @Output() customEvent = new EventEmitter<string>();
}
