import { By, WebDriver, Locator, WebElement, until } from 'selenium-webdriver';

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
    
    try {
      // Wait for element to be present
      await this.driver.wait(until.elementLocated(itemLink), 10000);
      
      // Get fresh element reference
      const element = await this.driver.findElement(itemLink);
      
      // Wait for element to be visible and clickable
      await this.driver.wait(until.elementIsVisible(element), 5000);
      await this.driver.wait(until.elementIsEnabled(element), 5000);
      
      // Click the element
      await element.click();
      
    } catch (error) {
      console.log(`Failed to click ${partialText}: ${error}`);
      
      // Retry with fresh element reference
      try {
        const freshElement = await this.driver.findElement(itemLink);
        await freshElement.click();
        console.log(`Successfully clicked ${partialText} on retry`);
      } catch (retryError) {
        console.log(`Failed to click ${partialText} on retry: ${retryError}`);
        throw retryError;
      }
    }
  }
}
