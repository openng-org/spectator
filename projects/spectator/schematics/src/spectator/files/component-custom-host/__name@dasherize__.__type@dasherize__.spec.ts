import { Component, ChangeDetectionStrategy } from '@angular/core';
import { createHostFactory, SpectatorHost } from '@openng/spectator<% if (secondaryEntryPoint) { %>/<%= secondaryEntryPoint%><% } %>';

import { <%= classify(name)%>Component } from './<%= dasherize(name)%>.component';

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
class CustomHostComponent {
  title = 'Custom HostComponent';
}

describe('<%= classify(name)%>Component', () => {
  let host: SpectatorHost<<%= classify(name)%>Component, CustomHostComponent>;
  const createHost = createHostFactory({
    component: <%= classify(name)%>Component,
    host: CustomHostComponent
  });

  it('should display the host component title', () => {
    host = createHost(`<zippy [title]="title"></zippy>`);
    expect(host.query('.zippy__title')).toHaveText('Custom HostComponent');
  });
});
