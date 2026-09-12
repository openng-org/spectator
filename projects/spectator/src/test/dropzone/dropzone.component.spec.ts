/* eslint-disable */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createHostFactory, SpectatorHost } from '@openng/spectator';
import { DownloadComponent } from '../../../test/download/download.component';
import { DropzoneComponent } from '../../../test/dropzone/dropzone.component';

@Component({
  selector: 'host',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class HostComponent {
  allowCSV = false;
  sampleTemplateFilename = '';
  onTemplate = (template: string): void => {};
  onFile = (file: string): void => {};
}

describe('DropzoneComponent', () => {
  let spectator: SpectatorHost<DropzoneComponent, HostComponent>;
  const createHost = createHostFactory({
    component: DropzoneComponent,
    host: HostComponent,
    declarations: [DownloadComponent],
  });

  beforeEach(() => {
    spectator = createHost(`
     <lib-dropzone
        [allowCSV]="allowCSV"
        (template)="onTemplate()"
        (file)="onFile()">
     </lib-dropzone>
  `);
  });

  it('should work', () => {
    const downloadComponent = spectator.queryHost<DownloadComponent>(DownloadComponent);
    const dropzoneComponent = spectator.queryHost<DropzoneComponent>(DropzoneComponent);
    console.log({
      downloadComponent,
      dropzoneComponent,
    });
    spyOn(spectator.hostComponent, 'onTemplate').and.callThrough();
    downloadComponent!.onDownloadClick();
    expect(spectator.hostComponent.onTemplate).toHaveBeenCalled();
  });
});
