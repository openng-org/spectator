import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-async-input',
  template: `
    @if (show) {
      <div>Hello</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AsyncInputComponent {
  public show;

  @Input() public set widgets(v: any) {
    Promise.resolve().then(() => {
      this.show = true;
    });
  }
}
