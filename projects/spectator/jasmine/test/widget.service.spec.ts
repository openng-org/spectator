import { createServiceFactory, SpectatorService } from '@openng/spectator/jasmine';

import { WidgetDataService } from '../../test/widget-data.service';
import { WidgetService } from '../../test/widget.service';

describe('WidgetService', () => {
  let spectator: SpectatorService<WidgetService>;
  const createService = createServiceFactory({
    service: WidgetService,
    mocks: [WidgetDataService],
  });

  it('should be defined', () => {
    spectator = createService();
    expect(spectator.service).toBeDefined();
  });
});
