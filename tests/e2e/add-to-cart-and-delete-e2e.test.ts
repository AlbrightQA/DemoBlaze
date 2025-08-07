import { StorefrontPage } from '@/pages/StorefrontPage.js';
import { ProductPage } from '@/pages/ProductPage.js';
import { CartPage } from '@/pages/CartPage.js';
import { WebDriver, until, By } from 'selenium-webdriver';
import { strict as assert } from 'assert';

// Interface for tracking products
interface Product {
  name: string;
  category: string;
}

declare const driver: WebDriver;

describe('Storefront E2E: Add 3 products to cart and delete them', function () {
  let storefront: StorefrontPage;
  let cartPage: CartPage;

  before(function () {
    storefront = new StorefrontPage(driver);
    cartPage = new CartPage(driver);
  });

  it('Should navigate the storefront, add 3 products to the cart, and delete them', async function () {
    this.timeout(30000);

    const products: Product[] = [
      { name: 'ASUS Full HD', category: 'monitors' },
      { name: 'Nexus 6', category: 'phones' },
      { name: 'MacBook Pro', category: 'laptops' },
    ];

    // Navigate to the cart to clear it out if necessary
    await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/cart.html`);

    // Wait for the page to load
    await driver.sleep(2000);

    // Delete all existing items in cart using CartPage utility
    await cartPage.deleteAllCartItems();

    // Add each product to cart
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`Adding ${product.name} to cart...`);

      // Navigate to home page
      await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/index.html`);

      // Wait for page to load completely
      await driver.wait(until.elementLocated(By.css('a#itemc')), 5000);

      // Select category with retry logic
      let categorySelected = false;
      for (let attempt = 0; attempt < 3 && !categorySelected; attempt++) {
        try {
          if (product.category === 'monitors') {
            await storefront.selectMonitorsCategory();
          } else if (product.category === 'phones') {
            await storefront.selectPhonesCategory();
          } else if (product.category === 'laptops') {
            await storefront.selectLaptopsCategory();
          }

          // Wait for category filter to load by checking for the product
          await driver.wait(
            until.elementLocated(By.xpath(`//a[contains(text(), '${product.name}')]`)),
            5000,
          );
          categorySelected = true;
        } catch (error) {
          console.log(`Category selection attempt ${attempt + 1} failed: ${error}`);
          if (attempt < 2) {
            await driver.sleep(1000);
          }
        }
      }

      // Click on the product
      await storefront.clickItemByPartialText(product.name);

      // Wait for product page to load by checking for add to cart button
      await driver.wait(until.elementLocated(By.linkText('Add to cart')), 5000);

      // Add to cart
      await new ProductPage(driver).addToCart();

      console.log(`Added ${product.name} to cart`);
    }

    // Navigate to cart to verify all products we added
    console.log('Navigating to cart to verify products...');
    await driver.get(`${process.env.DEMO_BLAZE_BASE_URL}/cart.html`);

    // Wait for cart to load
    await driver.wait(until.elementLocated(By.css('#tbodyid tr')), 3000);

    // Verify all products we added are in the cart
    for (const product of products) {
      const productElement = await driver.findElement(
        By.xpath(`//td[contains(text(), '${product.name}')]`),
      );
      const productText = await productElement.getText();
      assert.strictEqual(
        productText.includes(product.name),
        true,
        `Expected to find "${product.name}" in cart`,
      );
      console.log(`Verified ${product.name} is in cart`);
    }

    // Delete all products we added
    console.log('Deleting all products we added...');
    await cartPage.deleteAllCartItems();

    // Wait for the page to load and then verify all products are deleted
    await driver.sleep(2000);

    // Verify all products we added are no longer in the cart
    for (const product of products) {
      try {
        await driver.findElement(By.xpath(`//td[contains(text(), '${product.name}')]`));
        assert.fail(`Product "${product.name}" still exists in cart after deletion`);
      } catch (error: any) {
        if (error.name !== 'NoSuchElementError') {
          throw error;
        }
        console.log(`Verified ${product.name} is no longer in cart`);
      }
    }

    console.log('All products deleted via UI');
  });
});
