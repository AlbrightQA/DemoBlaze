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
  
  // Debug: Check if table has rows
  const tableRows = await driver.findElements(By.css('#tbodyid tr'));
  console.log(`Found ${tableRows.length} rows in cart table`);
  
  if (tableRows.length === 0) {
    console.log('Cart table is empty - products may not have been added successfully');
    // Wait a bit longer and check again
    await new Promise(resolve => setTimeout(resolve, 2000));
    const retryRows = await driver.findElements(By.css('#tbodyid tr'));
    console.log(`After retry: Found ${retryRows.length} rows in cart table`);
  }
  
  // Get all price cells from the table
  const priceCells = await driver.findElements(By.css('#tbodyid tr td:nth-child(3)'));
  console.log(`Found ${priceCells.length} price cells`);
  
  // Calculate the sum of prices
  let calculatedTotal = 0;
  const productPrices: number[] = [];
  
  for (const cell of priceCells) {
    const priceText = await cell.getText();
    console.log(`Raw price text: "${priceText}"`);
    const price = parseInt(priceText);
    if (!isNaN(price)) {
      calculatedTotal += price;
      productPrices.push(price);
      console.log(`Product price: ${price}`);
    } else {
      console.log(`Invalid price: "${priceText}"`);
    }
  }
  
  console.log(`Calculated total: ${calculatedTotal}`);
  
  // Get the displayed total
  let displayedTotal: number;
  try {
    const totalElement = await driver.findElement(By.id('totalp'));
    const totalText = await totalElement.getText();
    console.log(`Raw total text: "${totalText}"`);
    displayedTotal = parseInt(totalText);
    console.log(`Displayed total: ${displayedTotal}`);
  } catch (error) {
    console.log('Could not find total element:', error instanceof Error ? error.message : String(error));
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
