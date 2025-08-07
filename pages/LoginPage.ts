import { By, WebDriver, until } from 'selenium-webdriver';
import type { Locator } from 'selenium-webdriver';

export class LoginPage {
  private driver: WebDriver;

  // Selectors as public properties
  public loginNavButton: Locator = By.id('login2');
  public modal: Locator = By.id('logInModal');
  public usernameField: Locator = By.id('loginusername');
  public passwordField: Locator = By.id('loginpassword');
  public submitButton: Locator = By.css('button[onclick="logIn()"]');
  public closeButton: Locator = By.css('button[data-dismiss="modal"]');

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async openModal() {
    await this.driver.findElement(this.loginNavButton).click();
    // Wait for the modal to be visible
    await this.driver.wait(until.elementLocated(this.modal));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.modal)));
  }

  async enterUsername(username: string) {
    const usernameElement = await this.driver.wait(until.elementLocated(this.usernameField));
    await this.driver.wait(until.elementIsVisible(usernameElement));
    await this.driver.wait(until.elementIsEnabled(usernameElement));
    await usernameElement.clear();
    await usernameElement.click();
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
    await usernameElement.sendKeys(username);
  }

  async enterPassword(password: string) {
    const passwordElement = await this.driver.wait(until.elementLocated(this.passwordField));
    await this.driver.wait(until.elementIsVisible(passwordElement));
    await this.driver.wait(until.elementIsEnabled(passwordElement));
    await passwordElement.clear();
    await passwordElement.click();
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
    await passwordElement.sendKeys(password);
  }

  async submit() {
    const submitElement = await this.driver.wait(until.elementLocated(this.submitButton));
    await this.driver.wait(until.elementIsVisible(submitElement));
    await this.driver.wait(until.elementIsEnabled(submitElement));
    await submitElement.click();
  }

  async closeModal() {
    await this.driver.findElement(this.closeButton).click();
  }

  async login(username: string, password: string) {
    await this.openModal();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submit();
  }
}
