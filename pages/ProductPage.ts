import { By, WebDriver, Locator, WebElement } from 'selenium-webdriver';

export class ProductPage {
  private driver: WebDriver;

  // Public selectors for main product elements
  public name: Locator = By.css('.name');
  public price: Locator = By.css('.price-container');
  public description: Locator = By.css('div#more-information p');
  public addToCartButton: Locator = By.css("a.btn.btn-success.btn-lg[onclick^='addToCart']");

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async getProductName(): Promise<string> {
    return await this.driver.findElement(this.name).getText();
  }

  async getProductPrice(): Promise<string> {
    return await this.driver.findElement(this.price).getText();
  }

  async getProductDescription(): Promise<string> {
    return await this.driver.findElement(this.description).getText();
  }

  async addToCart(): Promise<void> {
    await this.driver.findElement(this.addToCartButton).click();
  }
}
