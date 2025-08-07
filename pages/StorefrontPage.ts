import { By, WebDriver, Locator, WebElement } from 'selenium-webdriver';

export class StorefrontPage {
  private driver: WebDriver;

  // Public selectors for navigation
  public phonesCategory: Locator = By.css("a#itemc.list-group-item[onclick=\"byCat('phone')\"]");
  public laptopsCategory: Locator = By.css("a#itemc.list-group-item[onclick*='notebook']");
  public monitorsCategory: Locator = By.css("a#itemc.list-group-item[onclick*='monitor']");
  public carouselPrev: Locator = By.css('a.carousel-control-prev');
  public carouselNext: Locator = By.css('a.carousel-control-next');
  public carouselIndicators: Locator = By.css('ol.carousel-indicators li');
  public paginatePrev: Locator = By.id('prev2');
  public paginateNext: Locator = By.id('next2');

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  // Category methods
  async selectPhonesCategory() {
    await this.driver.findElement(this.phonesCategory).click();
  }
  async selectLaptopsCategory() {
    await this.driver.findElement(this.laptopsCategory).click();
  }
  async selectMonitorsCategory() {
    await this.driver.findElement(this.monitorsCategory).click();
  }

  // Carousel methods
  async clickCarouselPrev() {
    await this.driver.findElement(this.carouselPrev).click();
  }
  async clickCarouselNext() {
    await this.driver.findElement(this.carouselNext).click();
  }
  async clickCarouselIndicator(index: number) {
    const indicators = await this.driver.findElements(this.carouselIndicators);
    if (index < 0 || index >= indicators.length) throw new Error('Invalid carousel indicator index');
    await indicators[index].click();
  }

  // Pagination methods
  async clickPaginatePrev() {
    await this.driver.findElement(this.paginatePrev).click();
  }
  async clickPaginateNext() {
    await this.driver.findElement(this.paginateNext).click();
  }

  public async clickItemByTitle(titleToFind: string): Promise<void> {
    const itemLink = By.linkText(titleToFind);
    await this.driver.findElement(itemLink).click();
  }

  public async clickItemByPartialText(partialText: string): Promise<void> {
    const itemLink = By.xpath(`//a[@class='hrefch' and contains(text(), '${partialText}')]`);
    await this.driver.findElement(itemLink).click();
  }
}
