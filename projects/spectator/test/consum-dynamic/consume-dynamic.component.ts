import { Component, OnInit, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';

import { DynamicComponent } from '../dynamic/dynamic.component';

@Component({
  selector: 'app-consume-dynamic',
  template: ` <p>consume-dynamic works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConsumeDynamicComponent implements OnInit {
  constructor(private readonly ref: ViewContainerRef) {}

  public ngOnInit(): void {
    this.ref.createComponent(DynamicComponent);
  }
}
