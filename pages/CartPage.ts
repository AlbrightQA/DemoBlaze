import { By, WebDriver, Locator, WebElement } from 'selenium-webdriver';

export class CartPage {
  private driver: WebDriver;

  // Selectors for cart elements
  public cartTable: Locator = By.css('table.table.table-bordered.table-hover.table-striped');
  public cartTableBody: Locator = By.css('tbody#tbodyid');
  public cartRows: Locator = By.css('tbody#tbodyid tr');
  public deleteButton: Locator = By.css('a[onclick^="deleteItem"]');
  public cartTotal: Locator = By.css('h3.panel-title#totalp');
  public placeOrderButton: Locator = By.css('button.btn.btn-success[data-toggle="modal"]');

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  // Get all cart items
  async getAllCartItems(): Promise<WebElement[]> {
    return await this.driver.findElements(this.cartRows);
  }

  // Get cart item by product name
  async getCartItemByName(productName: string): Promise<WebElement | null> {
    const items = await this.getAllCartItems();
    for (const item of items) {
      const titleCell = await item.findElement(By.css('td:nth-child(2)'));
      const title = await titleCell.getText();
      if (title === productName) {
        return item;
      }
    }
    return null;
  }

  // Get price of a specific cart item
  async getItemPrice(productName: string): Promise<string> {
    const item = await this.getCartItemByName(productName);
    if (!item) {
      throw new Error(`Product "${productName}" not found in cart`);
    }
    const priceCell = await item.findElement(By.css('td:nth-child(3)'));
    return await priceCell.getText();
  }

  // Delete a specific cart item
  async deleteCartItem(productName: string): Promise<void> {
    const item = await this.getCartItemByName(productName);
    if (!item) {
      throw new Error(`Product "${productName}" not found in cart`);
    }
    const deleteButton = await item.findElement(this.deleteButton);
    await deleteButton.click();
  }

  // Get cart total
  async getCartTotal(): Promise<string> {
    return await this.driver.findElement(this.cartTotal).getText();
  }

  // Click place order button
  async placeOrder(): Promise<void> {
    await this.driver.findElement(this.placeOrderButton).click();
  }

  // Check if cart is empty
  async isCartEmpty(): Promise<boolean> {
    const items = await this.getAllCartItems();
    return items.length === 0;
  }

  // Get number of items in cart
  async getCartItemCount(): Promise<number> {
    const items = await this.getAllCartItems();
    return items.length;
  }
} 
