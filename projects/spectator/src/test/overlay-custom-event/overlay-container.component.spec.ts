import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@openng/spectator';

import { byText } from '@openng/spectator';
import { OverlayContainerComponent } from '../../../test/overlay-custom-event/overlay-container.component';
import { OverlayContainerModule } from '../../../test/overlay-custom-event/overlay-container.module';
import { OverlayContentComponent } from '../../../test/overlay-custom-event/overlay-content.component';

describe('Overlay container custom event', () => {
  let spectator: Spectator<object>;

  const createComponent = createComponentFactory({
    component: Component({
      selector: 'test-host',
      template: '<div></div>',
    })(class {}),
    imports: [OverlayContainerModule],
  });

  it('should trigger custom event on a component inside an overlay', () => {
    spectator = createComponent();
    const overlayRef = spectator.inject(Overlay).create();
    const componentPortal = new ComponentPortal<unknown>(OverlayContainerComponent);
    overlayRef.attach(componentPortal);

    spectator.triggerEventHandler(OverlayContentComponent, 'customEvent', 'hello');
    expect(spectator.query(byText('hello'))).not.toExist();
    expect(spectator.query(byText('hello'), { root: true })).not.toExist();

    spectator.triggerEventHandler(OverlayContentComponent, 'customEvent', 'hello', { root: true });
    expect(spectator.query(byText('hello'))).not.toExist();
    expect(spectator.query(byText('hello'), { root: true })).toExist();

    overlayRef.dispose();
  });
});
