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

  it("Should navigate the storefront, add 3 different products to cart via UI, and then delete one", async function () {
    this.timeout(30000);

    const products = [
      { name: 'ASUS Full HD', category: 'monitors' },
      { name: 'Nexus 6', category: 'phones' },
      { name: 'MacBook Pro', category: 'laptops' }
    ];

    // Add each product to cart
    for (const product of products) {
      console.log(`Adding ${product.name} to cart...`);
      
      // Navigate to home page
      await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/index.html`);
      
      // Select category
      if (product.category === 'monitors') {
        await storefront.selectMonitorsCategory();
      } else if (product.category === 'phones') {
        await storefront.selectPhonesCategory();
      } else if (product.category === 'laptops') {
        await storefront.selectLaptopsCategory();
      }
      
      // Wait for category filter to load by checking for the product
      await driver.wait(until.elementLocated(By.xpath(`//a[contains(text(), '${product.name}')]`)), 5000);
      
      // Click on the product
      await storefront.clickItemByPartialText(product.name);
      
      // Wait for product page to load by checking for add to cart button
      await driver.wait(until.elementLocated(By.linkText('Add to cart')), 5000);
      
      // Add to cart
      await new ProductPage(driver).addToCart();
      
      console.log(`✅ Added ${product.name} to cart`);
    }

    // Navigate to cart to verify all products
    await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/cart.html`);
    
    // Wait for cart to load
    await driver.wait(until.elementLocated(By.css('#tbodyid tr')), 3000);
    
    // Verify all products are in cart
    for (const product of products) {
      const productElement = await driver.findElement(By.xpath(`//td[contains(text(), '${product.name}')]`));
      const productText = await productElement.getText();
      assert.strictEqual(productText.includes(product.name), true, `Expected to find "${product.name}" in cart`);
      console.log(`✅ Verified ${product.name} is in cart`);
    }

    // Delete one product from cart (ASUS Full HD)
    const productToDelete = 'ASUS Full HD';
    await cartPage.deleteCartItem(productToDelete);
    
    // Wait for deletion by checking that product is no longer present
    const deletedProductElement = await driver.findElement(By.xpath(`//td[contains(text(), '${productToDelete}')]`));
    await driver.wait(until.stalenessOf(deletedProductElement), 5000);
    
    // Verify product is removed
    try {
      await driver.findElement(By.xpath(`//td[contains(text(), '${productToDelete}')]`));
      assert.fail(`Product "${productToDelete}" still exists in cart after deletion`);
    } catch (error: any) {
      if (error.name !== 'NoSuchElementError') {
        throw error;
      }
      console.log(`✅ Successfully deleted ${productToDelete} from cart`);
    }
  });
});