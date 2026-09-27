import path from 'path';
import 'dotenv/config';

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,
  specs: ['./test/specs/**/*.spec.ts'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:app': path.join(process.cwd(), 'app', 'loja-ebac.apk'),
      'appium:appWaitActivity': 'com.woocommerce.android.ui.*',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
    },
  ],

  logLevel: 'error',
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 180000 },
  waitforTimeout: 20000,

  // Starts the globally installed Appium server automatically
  services: [['appium', { command: 'appium' }]],

  reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],
};