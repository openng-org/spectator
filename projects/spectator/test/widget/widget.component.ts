import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { WidgetService } from '../widget.service';

@Component({
  selector: 'app-widget',
  template: ` <button (click)="onClick()">Click</button> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class WidgetComponent implements OnInit {
  constructor(public widgetService: WidgetService) {}

  public ngOnInit(): void {}

  public onClick(): void {
    this.widgetService.get();
  }
}
