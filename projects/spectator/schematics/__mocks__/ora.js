// Mock for ora (ESM-only) package
// ora returns an object with start/stop/succeed/fail methods
const createMockSpinner = () => ({
  start: (text) => createMockSpinner(),
  stop: () => createMockSpinner(),
  succeed: (text) => createMockSpinner(),
  fail: (text) => createMockSpinner(),
  warn: (text) => createMockSpinner(),
  info: (text) => createMockSpinner(),
  clear: () => createMockSpinner(),
  render: () => createMockSpinner(),
  color: 'cyan',
  prefixText: '',
  text: '',
});

module.exports = createMockSpinner;
module.exports.default = createMockSpinner;
