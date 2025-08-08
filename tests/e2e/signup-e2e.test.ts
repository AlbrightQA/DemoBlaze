import { NavigationBar } from '@/pages/NavigationBar.js';
import { WebDriver, until, By } from 'selenium-webdriver';
import { strict as assert } from 'assert';
import { getIsolatedDriver } from './shared-isolated-session.js';

describe('Authentication E2E: Sign Up Flow', function () {
  let driver: WebDriver;
  let navigationBar: NavigationBar;

  before(async function () {
    this.timeout(60000);
    driver = await getIsolatedDriver();
    navigationBar = new NavigationBar(driver);
  });

  it('Should sign up successfully with unique credentials', async function () {
    this.timeout(30000);

    const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
    if (!baseUrl) {
      throw new Error('DEMO_BLAZE_BASE_URL environment variable is required');
    }

    // Generate unique username and password with timestamp
    const timestamp = Math.floor(Date.now() / 1000); // seconds timestamp
    const username = `username${timestamp}`;
    const password = `password${timestamp}`;

    // Navigate to the application
    await driver.get(`${baseUrl}/index.html`);

    // Wait for page to load and verify we're not logged in
    await driver.wait(until.elementLocated(By.css('a#login2.nav-link')), 5000);

    // Click the sign up button
    await navigationBar.clickSignup();

    // Wait for signup modal to appear and be visible
    await driver.wait(until.elementLocated(By.css('#signInModal')), 5000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css('#signInModal'))), 5000);

    // Wait for username field to be interactable
    await driver.wait(until.elementLocated(By.css('#sign-username')), 5000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css('#sign-username'))), 5000);

    // Fill in the username field
    const usernameField = await driver.findElement(By.css('#sign-username'));
    await driver.wait(until.elementIsEnabled(usernameField), 5000);
    await usernameField.clear();
    await usernameField.sendKeys(username);
    await driver.sleep(500); // Small delay to ensure field is filled

    // Wait for password field to be interactable
    await driver.wait(until.elementLocated(By.css('#sign-password')), 5000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css('#sign-password'))), 5000);

    // Fill in the password field
    const passwordField = await driver.findElement(By.css('#sign-password'));
    await driver.wait(until.elementIsEnabled(passwordField), 5000);
    await passwordField.clear();
    await passwordField.sendKeys(password);
    await driver.sleep(500); // Small delay to ensure field is filled

    // Click the sign up button in the modal
    const signupButton = await driver.findElement(By.css('button[onclick="register()"]'));
    await signupButton.click();

    // Wait for and handle the browser alert
    // Wait for alert to appear
    await driver.wait(async () => {
      try {
        const alert = await driver.switchTo().alert();
        return true;
      } catch (error) {
        return false;
      }
    }, 10000);

    // Get the alert and verify its text
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();

    // Verify the alert message (allowing for period at the end)
    assert.strictEqual(
      alertText,
      'Sign up successful.',
      'Alert message should be "Sign up successful."',
    );

    // Accept the alert
    await alert.accept();
  });
});
