// Karma configuration for core tests
// https://karma-runner.github.io/1.0/config/configuration-file.html

const build = process.env.NODE_ENV === 'build';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../../coverage/spectator'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'text-summary' }
      ],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9877,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [build ? 'ChromeHeadless' : 'Chrome'],
    singleRun: build,
    restartOnFileChange: true
  });
};
