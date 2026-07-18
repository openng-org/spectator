import { createHostFactory, SpectatorHost } from '@openng/spectator/jasmine';

import { DynamicComponent } from '../../../test/dynamic/dynamic.component';

import { ConsumeDynamicComponent } from '../../../test/consum-dynamic/consume-dynamic.component';

describe('ConsumeDynamicComponent', () => {
  let host: SpectatorHost<ConsumeDynamicComponent>;

  const createHost = createHostFactory({
    declarations: [DynamicComponent],
    entryComponents: [DynamicComponent],
    component: ConsumeDynamicComponent,
  });

  it('should work', () => {
    host = createHost(`<app-consume-dynamic></app-consume-dynamic>`);
    expect(host.component).toBeDefined();
  });

  it('should render the dynamic component', () => {
    host = createHost(`<app-consume-dynamic></app-consume-dynamic>`);
    expect(host.queryHost('.dynamic')).toHaveText('dynamic works!');
  });
});
