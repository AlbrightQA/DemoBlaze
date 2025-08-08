import { WebDriver, Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import testConfig from '@/config/test.config.js';
import { after } from 'mocha';

let isolatedDriver: WebDriver | null = null;

export async function getIsolatedDriver(): Promise<WebDriver> {
  if (!isolatedDriver) {
    // Create a completely separate driver instance for isolated tests
    const chromeOptions = new Options();
    testConfig.browser.chromeOptions.forEach((option) => {
      chromeOptions.addArguments(option);
    });
    chromeOptions.addArguments(`--user-data-dir=${testConfig.browser.userDataDir}-isolated-auth`);
    chromeOptions.addArguments(
      `--remote-debugging-port=${testConfig.browser.remoteDebuggingPort + 2}`,
    );

    isolatedDriver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  }
  return isolatedDriver;
}

export async function quitIsolatedDriver(): Promise<void> {
  if (isolatedDriver) {
    await isolatedDriver.quit();
    isolatedDriver = null;
  }
}

// Cleanup function to be called after all tests
export async function cleanupIsolatedSession(): Promise<void> {
  await quitIsolatedDriver();
}

// Global after hook to ensure cleanup
after(async function () {
  this.timeout(10000);
  await cleanupIsolatedSession();
});
