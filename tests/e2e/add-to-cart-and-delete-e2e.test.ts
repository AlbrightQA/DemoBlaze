import { StorefrontPage } from '@/pages/StorefrontPage.js';
import { ProductPage } from '@/pages/ProductPage.js';
import { CartPage } from '@/pages/CartPage.js';
import { WebDriver, until, By } from 'selenium-webdriver';
import { strict as assert } from 'assert';

declare const driver: WebDriver;

describe('Storefront E2E: Add Monitor to Cart', function () {
  let storefront: StorefrontPage;
  let cartPage: CartPage;

  before(function () {
    storefront = new StorefrontPage(driver);
    cartPage = new CartPage(driver);
  });

  it("Should navigate the storefront, add 'ASUS Full HD' monitor to cart, and then delete it", async function () {
    this.timeout(8000);

    const productName = 'ASUS Full HD';

    // Add product to cart
    await storefront.selectMonitorsCategory();
    // Wait for category filter to load by checking for monitor products
    await driver.wait(until.elementLocated(By.xpath(`//a[contains(text(), '${productName}')]`)), 5000);
    
    await storefront.clickItemByPartialText(productName);
    // Wait for product page to load by checking for add to cart button
    await driver.wait(until.elementLocated(By.linkText('Add to cart')), 5000);
    
    await new ProductPage(driver).addToCart();

    // Navigate to cart
    await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/cart.html`);
    
    // Wait for the specific product to appear in cart
    await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${productName}')]`)), 10000);
    
    // Verify product is in cart
    const productElement = await driver.findElement(By.xpath(`//td[contains(text(), '${productName}')]`));
    const productText = await productElement.getText();
    assert.strictEqual(productText.includes(productName), true, `Expected to find "${productName}" in cart`);

    // Delete product from cart
    await cartPage.deleteCartItem(productName);
    // Wait for deletion by checking that product is no longer present
    await driver.wait(until.stalenessOf(productElement), 5000);
    
    // Verify product is removed
    try {
      await driver.findElement(By.xpath(`//td[contains(text(), '${productName}')]`));
      assert.fail(`Product "${productName}" still exists in cart after deletion`);
    } catch (error: any) {
      if (error.name !== 'NoSuchElementError') {
        throw error;
      }
    }
  });
});