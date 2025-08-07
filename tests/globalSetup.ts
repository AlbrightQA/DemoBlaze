import { Builder, WebDriver } from 'selenium-webdriver';
import { LoginPage } from '@/pages/LoginPage.js';
import { Options } from 'selenium-webdriver/chrome.js';
import testConfig from '../config/test.config.js';
import 'dotenv/config';

export async function globalSetup(): Promise<{ driver: WebDriver, loginPage: LoginPage }> {
  const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
  const username = process.env.DEMO_BLAZE_USER_NAME;
  const password = process.env.DEMO_BLAZE_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error('Missing required environment variables. Please run `npm run dev` and populate new .env file with desired credentials.');
  }

  const chromeOptions = new Options();
  
  // Add all configured Chrome options
  testConfig.browser.chromeOptions.forEach(option => {
    chromeOptions.addArguments(option);
  });
  
  // Add user data directory
  chromeOptions.addArguments(`--user-data-dir=${testConfig.browser.userDataDir}`);
  chromeOptions.addArguments(`--remote-debugging-port=${testConfig.browser.remoteDebuggingPort}`);
  
  // Add headless mode if configured
  if (testConfig.browser.headless) {
    chromeOptions.addArguments('--headless');
  }
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
  await driver.get(`${baseUrl}/index.html`);

  const loginPage = new LoginPage(driver);
  await loginPage.login(username, password);
  
  // Wait a moment for the login API call to complete
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { driver, loginPage };
}