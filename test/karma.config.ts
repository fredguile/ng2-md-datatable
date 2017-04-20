// This file is named differently than its JS bootstrapper to avoid the ts compiler to overwrite it.

import path = require('path');
import { customLaunchers } from './browser-providers';

export function config(config) {
  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-browserstack-launcher'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-junit-reporter'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: 'dist/vendor/core-js/client/core.js', included: true, watched: false },
      { pattern: 'dist/vendor/systemjs/dist/system.src.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/zone.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/proxy.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/sync-test.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/jasmine-patch.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/async-test.js', included: true, watched: false },
      { pattern: 'dist/vendor/zone.js/dist/fake-async-test.js', included: true, watched: false },

      { pattern: 'test/karma-test-shim.js', included: true, watched: false },

      // paths loaded via module imports
      { pattern: 'dist/**/*.js', included: false, watched: true },

      // paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      { pattern: 'dist/**/*.scss', included: false, watched: false },

      // paths to support debugging with source maps in dev tools
      { pattern: 'dist/**/*.ts', included: false, watched: false },
      { pattern: 'dist/**/*.js.map', included: false, watched: false },
      { pattern: 'dist/**/*.css.map', included: false, watched: false }
    ],
    proxies: {
      // required for component assets fetched by Angular's compiler
      '/components/': '/base/dist/components/',
      '/core/': '/base/dist/core/',

      // required to properly fetch ng2-md-datatable component stylesheets
      '/md-datatable.component.css': '/base/dist/ng2-md-datatable/md-datatable.component.css',
      '/md-datatable-column.component.css': '/base/dist/ng2-md-datatable/md-datatable-column.component.css',
      '/md-datatable-header.component.css': '/base/dist/ng2-md-datatable/md-datatable-header.component.css',
      '/md-datatable-pagination.component.css': '/base/dist/ng2-md-datatable/md-datatable-pagination.component.css',
      '/md-datatable-row.component.css': '/base/dist/ng2-md-datatable/md-datatable-row.component.css',
    },

    customLaunchers: customLaunchers,

    exclude: [],
    preprocessors: {},
    reporters: ['dots', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    junitReporter: ((testReportsDir, buildNumber) => {
      const outputDir = testReportsDir ? `${testReportsDir}/junit` : '.';
      const outputFile = buildNumber ? `test-result-ui-${buildNumber}.xml` : 'test-result-ui.xml';

      return {
        outputDir,
        outputFile,
        useBrowserName: true,
      };
    })(process.env.CIRCLE_TEST_REPORTS, process.env.CIRCLE_BUILD_NUM),

    sauceLabs: {
      testName: 'ng2MdDataTable',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.48.2',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    },

    browserStack: {
      project: 'ng2MdDataTable',
      startTunnel: false,
      retryLimit: 1,
      timeout: 600,
      pollingTimeout: 20000
    },

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 240000,
    captureTimeout: 120000,
    browsers: ['Chrome_1024x768'],

    singleRun: false
  });
};
