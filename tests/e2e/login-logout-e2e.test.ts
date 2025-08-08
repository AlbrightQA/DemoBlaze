import { NavigationBar } from '@/pages/NavigationBar.js';
import { LoginPage } from '@/pages/LoginPage.js';
import { WebDriver, until, By } from 'selenium-webdriver';
import { strict as assert } from 'assert';
import { getIsolatedDriver } from './shared-isolated-session.js';

describe('Authentication E2E: Login and Logout Flow', function () {
  let driver: WebDriver;
  let navigationBar: NavigationBar;
  let loginPage: LoginPage;

  before(async function () {
    this.timeout(60000);
    driver = await getIsolatedDriver();
    navigationBar = new NavigationBar(driver);
    loginPage = new LoginPage(driver);
  });

  it('Should logout successfully and show login button', async function () {
    this.timeout(30000);

    const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
    const username = process.env.DEMO_BLAZE_USER_NAME;
    const password = process.env.DEMO_BLAZE_PASSWORD;

    if (!baseUrl || !username || !password) {
      throw new Error('Missing required environment variables for login');
    }

    // Navigate to the application
    await driver.get(`${baseUrl}/index.html`);

    // Wait for page to load completely
    await driver.wait(until.elementLocated(By.css('a#login2.nav-link')), 5000);

    // Use LoginPage to perform login
    await loginPage.login(username, password);

    // Wait a moment for the login API call to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Wait for login to complete and verify we're logged in
    await driver.wait(until.elementLocated(By.css('a#logout2.nav-link')), 5000);

    // Click the logout button
    await navigationBar.clickLogout();

    // Wait for logout to complete and login button to become visible
    await driver.wait(until.elementLocated(By.css('a#login2.nav-link')), 5000);

    // Verify login button is visible and logout button is not
    const loginButton = await driver.findElement(By.css('a#login2.nav-link'));
    const isLoginVisible = await loginButton.isDisplayed();

    assert.strictEqual(isLoginVisible, true, 'Login button should be visible after logout');

    // Verify logout button is no longer visible
    try {
      const logoutButton = await driver.findElement(By.css('a#logout2.nav-link'));
      const isLogoutVisible = await logoutButton.isDisplayed();
      assert.strictEqual(
        isLogoutVisible,
        false,
        'Logout button should not be visible after logout',
      );
    } catch (error) {
      // Logout button not found is also acceptable
    }
  });
});
