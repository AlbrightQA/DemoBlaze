import { By, until, WebDriver } from 'selenium-webdriver';

export interface CartTotalResult {
  calculatedTotal: number;
  displayedTotal: number;
  productPrices: number[];
  isMatch: boolean;
}

export async function calculateCartTotal(driver: WebDriver): Promise<CartTotalResult> {
  // Wait for the table to load
  await driver.wait(until.elementLocated(By.id('tbodyid')), 10000);
  
  // Check if table has rows
  const tableRows = await driver.findElements(By.css('#tbodyid tr'));
  
  if (tableRows.length === 0) {
    throw new Error('No products found in cart table. API calls may have failed or products not yet loaded.');
  }
  
  // Get all price cells from the table
  const priceCells = await driver.findElements(By.css('#tbodyid tr td:nth-child(3)'));
  
  // Calculate the sum of prices
  let calculatedTotal = 0;
  const productPrices: number[] = [];
  
  for (const cell of priceCells) {
    const priceText = await cell.getText();
    const price = parseInt(priceText);
    if (!isNaN(price)) {
      calculatedTotal += price;
      productPrices.push(price);
    }
  }
  
  // Get the displayed total
  let displayedTotal: number;
  try {
    const totalElement = await driver.findElement(By.id('totalp'));
    const totalText = await totalElement.getText();
    displayedTotal = parseInt(totalText);
  } catch (error) {
    throw new Error('Total element not found on cart page');
  }
  
  const isMatch = calculatedTotal === displayedTotal;
  
  return {
    calculatedTotal,
    displayedTotal,
    productPrices,
    isMatch
  };
}
