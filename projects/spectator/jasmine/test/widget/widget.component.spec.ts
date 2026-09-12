import { createHostFactory, SpectatorHost, SpyObject } from '@openng/spectator/jasmine';

import { WidgetService } from '../../../test/widget.service';

import { WidgetComponent } from '../../../test/widget/widget.component';

describe('WidgetComponent', () => {
  let host: SpectatorHost<WidgetComponent>;

  const createHost = createHostFactory({
    component: WidgetComponent,
    mocks: [WidgetService],
  });

  it('should work', () => {
    host = createHost(`<app-widget></app-widget>`);
    expect(host.component).toBeDefined();
  });

  it('should call the service method on button click', () => {
    host = createHost(`<app-widget></app-widget>`);
    host.click('button');
    expect(host.inject(WidgetService).get).toHaveBeenCalled();
  });
});
