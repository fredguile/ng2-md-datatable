// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular/cli"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular/cli/plugins/karma")
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly"],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: "test"
    },
    reporters:
      config.angularCli && config.angularCli.codeCoverage
        ? ["progress", "coverage-istanbul"]
        : ["progress", "kjhtml"],
    junitReporter: (circleCI => {
      const outputDir = circleCI ? "/tmp/test-reports/junit" : ".";

      return {
        outputDir,
        outputFile: "test-result-ui.xml",
        useBrowserName: false
      };
    })(process.env.CIRCLECI),
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--disable-translate",
          "--headless",
          "--disable-gpu",
          "--disable-extensions",
          "--remote-debugging-port=9222"
        ],
        displayName: "Chrome Headless mode"
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false
  });
};
