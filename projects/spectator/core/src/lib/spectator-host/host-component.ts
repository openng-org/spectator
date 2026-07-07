import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-openng-host-component',
  template: '',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Eager,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class HostComponent {}

/*
  This is an unused module to resolve the ng build error:
    'Cannot determine the module for class HostComponent'

  Reference: https://github.com/angular/issues/13590
*/
@NgModule({
  declarations: [HostComponent],
})
export class HostModule {}
