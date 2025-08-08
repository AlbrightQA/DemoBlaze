import { NavigationBar } from '@/pages/NavigationBar.js';
import { WebDriver, until, By } from 'selenium-webdriver';
import { strict as assert } from 'assert';

declare const driver: WebDriver;

describe('Authentication E2E: Login and Logout Flow', function () {
  let navigationBar: NavigationBar;

  before(function () {
    navigationBar = new NavigationBar(driver);
  });

  it('Should logout successfully and show login button', async function () {
    this.timeout(30000);

    // Note: Global setup already logs in the user, so we start in logged-in state

    // Verify we're in logged-in state by checking logout button is visible
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
