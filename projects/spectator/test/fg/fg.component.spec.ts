import { SpectatorHost, createHostFactory } from '@openng/spectator';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FgComponent } from './fg.component';

@Component({
  selector: 'app-custom-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class CustomHostComponent {
  public group = new FormGroup({
    name: new FormControl('name'),
  });
}

describe('With Custom Host Component', () => {
  let host: SpectatorHost<FgComponent, CustomHostComponent>;

  const createHost = createHostFactory({
    component: FgComponent,
    imports: [ReactiveFormsModule],
    host: CustomHostComponent,
  });

  it('should display the host component title', () => {
    host = createHost(`<app-fg [group]="group"></app-fg>`);
    expect(host.component).toBeDefined();
  });
});
