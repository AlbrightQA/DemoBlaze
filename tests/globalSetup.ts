import { Builder, WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import 'dotenv/config';

export async function globalSetup(): Promise<{ driver: WebDriver, loginPage: LoginPage }> {
  const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
  const username = process.env.DEMO_BLAZE_USER_NAME;
  const password = process.env.DEMO_BLAZE_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error('Missing required environment variables. Please run `npm run dev` and populate new .env file with desired credentials.');
  }

  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get(baseUrl);

  const loginPage = new LoginPage(driver);
  await loginPage.login(username, password);

  return { driver, loginPage };
}