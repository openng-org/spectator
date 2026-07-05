import '@analogjs/vitest-angular/setup-zone';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';
import { defineGlobalsInjections } from '@openng/spectator';
import { TranslateService } from './test/translate.service';
import { TranslatePipe } from './test/translate.pipe';
import { vi } from 'vitest';

@NgModule({
  providers: [provideZoneChangeDetection()],
})
class ZoneTestModule {}

getTestBed().initTestEnvironment([BrowserDynamicTestingModule, ZoneTestModule], platformBrowserDynamicTesting());

defineGlobalsInjections({
  providers: [TranslateService],
  declarations: [TranslatePipe],
});

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});
