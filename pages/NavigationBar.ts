import { By, WebDriver, Locator } from 'selenium-webdriver';

export class NavigationBar {
  private driver: WebDriver;

  // Selectors for navigation elements
  public brand: Locator = By.css('a#nava.navbar-brand');
  public home: Locator = By.css('a.nav-link[href="index.html"]');
  public contact: Locator = By.css('a.nav-link[data-target="#exampleModal"]');
  public about: Locator = By.css('a.nav-link[data-target="#videoModal"]');
  public cart: Locator = By.css('a.nav-link[onclick="showcart()"]');
  public login: Locator = By.css('a#login2.nav-link');
  public logout: Locator = By.css('a#logout2.nav-link');
  public user: Locator = By.css('a#nameofuser.nav-link');
  public signup: Locator = By.css('a#signin2.nav-link');

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async clickBrand() {
    await this.driver.findElement(this.brand).click();
  }
  async clickHome() {
    await this.driver.findElement(this.home).click();
  }
  async clickContact() {
    await this.driver.findElement(this.contact).click();
  }
  async clickAbout() {
    await this.driver.findElement(this.about).click();
  }
  async clickCart() {
    await this.driver.findElement(this.cart).click();
  }
  async clickLogin() {
    await this.driver.findElement(this.login).click();
  }
  async clickLogout() {
    await this.driver.findElement(this.logout).click();
  }
  async clickSignup() {
    await this.driver.findElement(this.signup).click();
  }
  async getUserText(): Promise<string> {
    return await this.driver.findElement(this.user).getText();
  }
}