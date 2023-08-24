# @flexn/graybox

## Overview

E2E testing package using WebdriverIO. Native apps use [Appium Service](https://webdriver.io/docs/appium-service) and [wdio-native-app-compare](https://github.com/wswebcreation/wdio-native-app-compare). Web uses [Selenium Standalone Service](https://webdriver.io/docs/selenium-standalone-service) and [wdio-image-comparison-service](https://github.com/wswebcreation/wdio-image-comparison-service). Reporting is done using [Allure Reporter](https://webdriver.io/docs/allure-reporter).

## Adding Graybox to your project

1. Do `npm install @flexn/graybox --save-dev`
2. Create `wdio.conf.js` file, example can be found below these steps.
3. Customize `capabilities` according to your platform scope (in the example are all supported platforms by Graybox), simulator environment and testable application.
4. Customize `services` according to your platform scope.
5. Customize any other needed properties like `baseUrl` and `specs`.
6. If Graybox is added to yarn workspaces monorepo then lines below must be added to monorepo root `package.json`.

```json
"nohoist": [
    "**/@flexn/graybox",
    "**/appium-*",
    "**/@wdio/*"
]
```

7. Set test ID's in the application's source code (if needed). Android and AndroidTV get test ID from `accessibilityLabel` property, also `accessible` needs to be added to the element. All other platforms supported by Graybox get test ID from `TestID` property. Example is below.

```javascript
<TouchableOpacity
    style={theme.styles.icon}
    testID='my-cool-test-id'
    accessibilityLabel='my-cool-test-id'
    accessible
>
    <Icon name="twitter" size={theme.static.iconSize} color={theme.static.colorBrand} />
</TouchableOpacity>
```

Alternatively method can be created and imported which returns specific test ID depending on platform. 

8. Create test specs file and import Graybox package.

```javascript
const FlexnRunner = require('@flexn/graybox').default;
```

9. Write your tests using FlexnRunner. How to execute written tests look at [Test executing](#test-executing).

```javascript
// wdio.conf.js

const fs = require('fs');
const path = require('path');

let customCapabilities = {};
if (fs.existsSync(path.join(__dirname, './wdio.capabilities.template.js'))) {
    const { capabilities } = require('./wdio.capabilities.template');
    customCapabilities = capabilities;
}

const capabilities = {
    ios: [
        {
            platformName: 'iOS',
            'appium:options': {
                deviceName: 'iPhone 11',
                platformVersion: '13.5',
                automationName: 'XCUITest',
                bundleId: 'my.bundleId',
                app: 'path/to/my/app',
            },
        },
    ],
    tvos: [
        {
            platformName: 'tvOS',
            'appium:options': {
                deviceName: 'Apple TV',
                platformVersion: '14.4',
                automationName: 'XCUITest',
                bundleId: 'my.bundleId',
                app: 'path/to/my/app',
            },
        },
    ],
    android: [
        {
            platformName: 'Android',
            'appium:options': {
                avd: 'Pixel_4_API_29',
                deviceName: 'Pixel_4_API_29',
                platformVersion: '10',
                automationName: 'UiAutomator2',
                appPackage: 'my.appPackage',
                appActivity: 'my.appActivity',
                app: 'path/to/my/app',
            },
        },
    ],
    androidtv: [
        {
            platformName: 'Android',
            'appium:options': {
                avd: 'Android_TV_1080p_API_29',
                deviceName: 'Android_TV_1080p_API_29',
                platformVersion: '10',
                automationName: 'UiAutomator2',
                appPackage: 'my.appPackage',
                appActivity: 'my.appActivity',
                app: 'path/to/my/app',
            },
        },
    ],
    macos: [
        {
            platformName: 'Mac',
            'appium:options': {
                deviceName: 'macOS',
                automationName: 'Mac2',
                bundleId: 'my.bundleId',
            },
            //
            // capabilities below should be used when electron framework is used to build macos app
            //
            // browserName: 'chrome',
            // 'goog:chromeOptions': {
            //     binary: 'path/to/electron/binary',
            //     args: ['app=path/to/my/app'],
            // },
        },
    ],
    web: [
        {
            browserName: 'chrome',
        },
        {
            browserName: 'firefox',
        },
        {
            browserName: 'MicrosoftEdge',
        },
        {
            browserName: 'safari',
        },
    ],
    ...customCapabilities,
};

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: ['./test/specs/*.js'],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: capabilities[process.env.PLATFORM],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    ...(process.env.PLATFORM === 'web' && {
        services: [
            'selenium-standalone',
            [
                'image-comparison',
                {
                    baselineFolder: './test/baselineImages',
                    formatImageName: '{tag}',
                    screenshotPath: '.tmp/actualImages',
                    savePerInstance: true,
                    autoSaveBaseline: true,
                    blockOutStatusBar: true,
                    blockOutToolBar: true,
                    blockOutSideBar: true,
                },
            ],
        ],
    }),
    //
    // services below should be used when electron framework is used to build macos app
    //
    // ...(process.env.PLATFORM === 'macos' && {
    //     services: [
    //         'chromedriver',
    //         [
    //             'image-comparison',
    //             {
    //                 baselineFolder: './test/baselineImages',
    //                 formatImageName: '{tag}',
    //                 screenshotPath: '.tmp/actualImages',
    //                 savePerInstance: true,
    //                 autoSaveBaseline: true,
    //                 blockOutStatusBar: true,
    //                 blockOutToolBar: true,
    //                 blockOutSideBar: true,
    //             },
    //         ],
    //     ],
    // }),
    ...((process.env.PLATFORM === 'ios' ||
        process.env.PLATFORM === 'tvos' ||
        process.env.PLATFORM === 'android' ||
        process.env.PLATFORM === 'androidtv' ||
        process.env.PLATFORM === 'macos') && {
        services: [
            [
                'appium',
                {
                    args: {
                        ...(process.env.PLATFORM === 'ios' && {
                            port: 3001,
                        }),
                        ...(process.env.PLATFORM === 'tvos' && {
                            port: 3002,
                        }),
                        ...(process.env.PLATFORM === 'android' && {
                            port: 3003,
                        }),
                        ...(process.env.PLATFORM === 'androidtv' && {
                            port: 3004,
                        }),
                        ...(process.env.PLATFORM === 'macos' && {
                            port: 3005,
                        }),
                    },
                },
            ],
            [
                'native-app-compare',
                {
                    baselineFolder: './test/baselineImages',
                    imageNameFormat: '{tag}',
                    screenshotPath: '.tmp/actualImages',
                    savePerDevice: true,
                    autoSaveBaseline: true,
                    blockOutStatusBar: true,
                    blockOutNavigationBar: true,
                    blockOutIphoneHomeBar: true,
                },
            ],
        ],
    }),

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'reporting/allure-results',
            },
        ],
    ],

    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {Object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine).
     */
    // afterTest: function(test, context, { error, result, duration, passed, retries }) {
    // },

    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    // onReload: function(oldSessionId, newSessionId) {
    // }
};

```

## Optional local test environment setup

Often it is useful to be able to customize local test environment. This is also supported by Graybox and can be achieved by following steps below.

1. Create `wdio.capabilities.js` file in testable project's root folder (make sure to add this file to `.gitignore`).
2. Copy capabilities object from testable project's `wdio.conf.js` to `wdio.capabilities.js`.
3. In `wdio.capabilities.js` remove `...customCapabilities,` and after object add `module.exports = { capabilities };`.
4. In `wdio.capabilities.js` file change `deviceName` and `platformVersion` for iOS, tvOS and change `avd`, `deviceName` and `platformVersion` for Android, AndroidTV. Example of `wdio.capabilities.js` file can be seen below.

```javascript
// wdio.capabilities.js

const capabilities = {
    ios: [
        {
            platformName: 'iOS',
            deviceName: 'iPhone 11',
            platformVersion: '13.5',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app',
        },
    ],
    tvos: [
        {
            platformName: 'tvOS',
            deviceName: 'Apple TV',
            platformVersion: '14.4',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app',
        },
    ],
    android: [
        {
            platformName: 'Android',
            avd: 'Pixel_4_API_29',
            deviceName: 'Pixel_4_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app',
        },
    ],
    androidtv: [
        {
            platformName: 'Android',
            avd: 'Android_TV_1080p_API_29',
            deviceName: 'Android_TV_1080p_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app',
        },
    ],
    macos: [
        {
            platformName: 'Mac',
            deviceName: 'macOS',
            automationName: 'Mac2',
            bundleId: 'my.bundleId',
        },
    ],
    web: [
        {
            browserName: 'chrome',
        },
        {
            browserName: 'firefox',
        },
        {
            browserName: 'MicrosoftEdge',
        },
        {
            browserName: 'safari',
        },
    ],
};

module.exports = { capabilities };
```

## Additional environment setup for testing on real device

For iOS/tvOS:

1. Add the following code to `wdio.capabilities.js` file under ios/tvos object. `<Device udid>` must be replaced by device udid. Device udid can be found under indentifier on Xcode by navigating to Window -> Devices and Simulators and selecting connected device. `<Team ID>` must be replaced by Team ID. Team ID can be found using developer account. Sign in to `developer.apple.com/account`, and click Membership in the sidebar. Team ID appears in the Membership Information section under the team name.

```javascript
udid: '<Device udid>',
xcodeOrgId: '<Team ID>',
xcodeSigningId: 'iPhone Developer'
```

2. If the first step doesn't work, then open `./node-modules/appium-webdriveragent/WebDriverAgent.xcodeproj`. Select WebDriverAgent project and select WebDriverAgentRunner (for iOS) or WebDriverAgentRunner_tvOS (for tvOS) target, then under Signing & Capabilities tab select developer team.

For Android/AndroidTV:

1. Add the following code to `wdio.capabilities.js` file under android/androidtv object and comment `avd` property. `<Device udid>` must be replaced by device udid. Device udid can be found using cli command `adb devices`.

```javascript
udid: '<Device udid>';
```

## Test executing

1. Make sure application is built (applies for iOS, tvOS, Android, AndroidTV, macOS) or hosted to server (applies for Web).
2. Run in cli `APPIUM_HOME=./ PLATFORM=<platform> ENGINE=<engine> npx wdio wdio.conf.js`. `<platform>` must be replaced by `ios`, `tvos`, `android`, `androidtv`, `macos` or `web`. `ENGINE` environment variable is only needed for macOS and `<engine>` must be replaced by `macos` or `electron` depending on what framework macOS application is built. `APPIUM_HOME=./` is only needed for platforms which use Appium Service and it is not necessary when project is not monorepo.

## Prerequisites executing tests on macOS app

> Xcode Helper app should be enabled for Accessibility access. The app itself could be usually found at `/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/Xcode Helper.app`. In order to enable Accessibility access for it simply open the parent folder in Finder:

```
 open /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/
```

> and drag & drop the Xcode Helper app to Security & Privacy -> Privacy -> Accessibility list of your System Preferences. This action must only be done once.

## Selector strategies

Test ID selector strategy varies from platform to platform. Table below shows from what property each platform maps test ID so some platforms need different properties to be set in application source code when adding test ID's. When writing tests user needs to provide only test ID itself to method and Graybox handles everything else on every platform.

| Platform              | Test ID selector strategy                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| iOS                   | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| tvOS                  | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| macOS using Apple SDK | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| Android               | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `accessibilityLabel` property. NOTE: `accessible` also needs to be added to the element |
| AndroidTV             | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where testID is mapped from `accessibilityLabel` property. NOTE: `accessible` also needs to be added to the element  |
| macOS using Electron  | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `data-testid` attribute which maps test ID from `TestID` property                                                                  |
| Web                   | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `data-testid` attribute which maps test ID from `TestID` property                                                                  |

Text selector strategy varies from platform to platform. This strategy doesn't require any additional property setting in application source code assuming element has visible text in front end. When writing tests user needs to provide only visible text on the element to method and Graybox handles everything else on every platform.

| Platform              | Text selector strategy                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| iOS                   | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `label` attribute |
| tvOS                  | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `label` attribute |
| macOS using Apple SDK | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `name` attribute  |
| Android               | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `text` attribute  |
| AndroidTV             | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `text` attribute  |
| macOS using Electron  | [xPath](https://webdriver.io/docs/selectors/#xpath) strategy selector                                                     |
| Web                   | [xPath](https://webdriver.io/docs/selectors/#xpath) strategy selector                                                     |

## Methods

### launchApp

Launches application.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.launchApp();
```

IMPORTANT: must be included in before hook:

```javascript
before(() => {
    FlexnRunner.launchApp();
});
```

### getElementById

Returns element object by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.getElementById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### getElementByText

Returns element object by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.getElementByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### scrollById

Scrolls to element by provided test ID.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.scrollById(selectorTo, direction, selectorFrom);
```

**Arguments**

| Name         | Type                                   | Details                                                                                                                    |
| ------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| selectorTo   | string                                 | test ID of the element to which scroll is executed. For more context look at [Selector strategies](#selector-strategies)   |
| direction    | either 'up', 'down', 'left' or 'right' | direction of the scroll                                                                                                    |
| selectorFrom | string                                 | test ID of the element from which scroll is executed. For more context look at [Selector strategies](#selector-strategies) |

### clickById

Clicks on element by provided test ID.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.clickById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### clickByText

Clicks on element by provided text.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.clickByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### pressButtonHome

Presses native platform _Home_ button.

**Platform support**

Supported on: iOS, tvOS, Android, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonHome(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonBack

Presses native platform _Back_ button.

**Platform support**

Supported on: iOS, tvOS, Android, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonBack(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonUp

Presses native platform _Up_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonUp(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonDown

Presses native platform _Down_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonDown(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonLeft

Presses native platform _Left_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonLeft(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonRight

Presses native platform _Right_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonRight(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonSelect

Presses native platform _Select_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonSelect(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### expectToMatchElementById

Validates whether actual screenshot of element by provided test ID matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchElementById(selector, tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToMatchElementByText

Validates whether actual screenshot of element by provided text matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchElementByText(selector, tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToMatchScreen

Validates whether actual screenshot of screen matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchScreen(tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToBeExistingById

Validates whether element is existing by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeExistingById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeExistingByText

Validates whether element is existing by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeExistingByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeDisplayedById

Validates whether element is displayed by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeDisplayedById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeDisplayedByText

Validates whether element is displayed by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeDisplayedByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeClickableById

Validates whether element is clickable by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeClickableById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeClickableByText

Validates whether element is clickable by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeClickableByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToHaveTextById

Validates whether element has specific text by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToHaveTextById(selector, text);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| text | string | expected text in the element |

### expectToHaveValueById

Validates whether element has specific value by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToHaveValueById(selector, value);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| value | string | expected value in the element |

### waitForDisplayedById

Waits for an element for the provided amount of milliseconds to be displayed by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForDisplayedById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForDisplayedByText

Waits for an element for the provided amount of milliseconds to be displayed by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForDisplayedByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### waitForExistById

Waits for an element for the provided amount of milliseconds to be present within the DOM by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForExistById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForExistByText

Waits for an element for the provided amount of milliseconds to be present within the DOM by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForExistByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### waitForClickableById

Waits for an element for the provided amount of milliseconds to be clickable by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForClickableById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForClickableByText

Waits for an element for the provided amount of milliseconds to be clickable by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForClickableByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### setValueById

Sends a sequence of key strokes to an element after the input has been cleared before by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.setValueById(selector, value);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| value    | string | value to be added                                                                            |

### clearValueById

Clears the value of an input or textarea element by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.clearValueById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### pause

Pauses execution for a specific amount of time. It is recommended to not use this command to wait for an element to show up. In order to avoid flaky test results it is better to use commands like `waitForExistById` or other waitFor\* commands.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.pause(time);
```

**Arguments**

| Name | Type   | Details                                          |
| ---- | ------ | ------------------------------------------------ |
| time | number | time in ms for which execution of test is paused |

### GIVEN

Logs to cli `GIVEN:` with provided message.

**Usage**

```javascript
FlexnRunner.GIVEN(message);
```

**Arguments**

| Name    | Type   | Details                                    |
| ------- | ------ | ------------------------------------------ |
| message | string | text to be logged to console with `GIVEN:` |

### WHEN

Logs to cli `WHEN:` with provided message.

**Usage**

```javascript
FlexnRunner.WHEN(message);
```

**Arguments**

| Name    | Type   | Details                                   |
| ------- | ------ | ----------------------------------------- |
| message | string | text to be logged to console with `WHEN:` |

### THEN

Logs to cli `THEN:` with provided message.

**Usage**

```javascript
FlexnRunner.THEN(message);
```

**Arguments**

| Name    | Type   | Details                                   |
| ------- | ------ | ----------------------------------------- |
| message | string | text to be logged to console with `THEN:` |
