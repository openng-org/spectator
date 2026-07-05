/* eslint-disable */
import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-download',
  template: `
    <h1 (click)="onDownloadClick()">Download comp</h1>
    >
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DownloadComponent {
  @Output() selectedFile = new EventEmitter();

  onDownloadClick() {
    this.selectedFile.emit('someValue');
  }
}
