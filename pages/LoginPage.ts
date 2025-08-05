import { By, WebDriver, until, Locator } from 'selenium-webdriver';

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
    await this.driver.findElement(this.usernameField).clear();
    await this.driver.findElement(this.usernameField).sendKeys(username);
  }

  async enterPassword(password: string) {
    await this.driver.findElement(this.passwordField).clear();
    await this.driver.findElement(this.passwordField).sendKeys(password);
  }

  async submit() {
    await this.driver.findElement(this.submitButton).click();
  }

  async closeModal() {
    await this.driver.findElement(this.closeButton).click();
  }

  async login(username: string, password: string) {
    await this.openModal();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submit();
    // Optionally, wait for modal to close or for a login success indicator
  }
}