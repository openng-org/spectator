import { byLabel, createComponentFactory, Spectator } from '@openng/spectator';
import { CalcComponent } from '../../../test/calc/calc.component';

describe('CalcComponent', () => {
  let spectator: Spectator<CalcComponent>;
  const createComponent = createComponentFactory(CalcComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should be defined', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should calc the value', () => {
    const a = spectator.query('.a') as HTMLInputElement;
    const b = spectator.query('.b') as HTMLInputElement;
    spectator.typeInElement('1', a);
    spectator.typeInElement('2', b);

    expect(spectator.query('.result')).toHaveText('12');
  });

  it('should calc the value by DOMSelector', () => {
    spectator.typeInElement('3', byLabel('a'));
    spectator.typeInElement('7', byLabel('b'));

    expect(spectator.query('.result')).toHaveText('37');
  });
});
