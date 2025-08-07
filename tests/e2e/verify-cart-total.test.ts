import { ApiClient, generateUUID, calculateCartTotal, deleteAllCartItems, addMultipleProductsToCart } from '../../utils/index.js';
import { until, By } from 'selenium-webdriver';
import 'dotenv/config';
import { strict as assert } from 'assert';

declare const driver: any;

describe('Cart Total Verification E2E Tests', function() {
  let apiClient: ApiClient;

  before(function() {
    apiClient = new ApiClient();
  });

  it('Should add all products to cart via API for manual verification', async function() {
    this.timeout(30000);
    
    const nexus6ProductId = process.env.NEXUS_6_PRODUCT_ID;
    const macbookProductId = process.env.MACBOOK_PRO_PRODUCT_ID;
    const asusProductId = process.env.ASUS_FULL_HD_PRODUCT_ID;
    
    if (!nexus6ProductId || !macbookProductId || !asusProductId) {
      throw new Error('All product ID environment variables are required: NEXUS_6_PRODUCT_ID, MACBOOK_PRO_PRODUCT_ID, ASUS_FULL_HD_PRODUCT_ID');
    }
    
    // Add all products to cart using bulk operation
    const productIds = [
      parseInt(nexus6ProductId),
      parseInt(macbookProductId),
      parseInt(asusProductId)
    ];
    
    const addResults = await addMultipleProductsToCart(apiClient, productIds);
    
    // Check if any products were successfully added
    const successfulResults = addResults.filter(result => result.success);
    if (successfulResults.length === 0) {
      throw new Error('No products were successfully added to cart. Check API connectivity and credentials.');
    }
    
    console.log(`✅ ${successfulResults.length} products added to cart successfully!`);
    
    // Navigate to cart page to verify the products
    const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
    await driver.get(`${baseUrl}/cart.html`);
    
    // Wait for one of our successfully added products to appear in cart (using delete button with UUID)
    const firstSuccessfulUuid = successfulResults[0].uuid;
    console.log(`Waiting for product with UUID: ${firstSuccessfulUuid}`);
    await driver.wait(until.elementLocated(By.xpath(`//a[contains(@onclick, '${firstSuccessfulUuid}')]`)), 10000);
    
    // Calculate cart total using utility function
    const cartResult = await calculateCartTotal(driver);
    
    // Verify cart total calculation is accurate
    assert.strictEqual(cartResult.isMatch, true, `Cart total mismatch! Calculated: ${cartResult.calculatedTotal}, Displayed: ${cartResult.displayedTotal}`);
    
    console.log('✅ Cart total verification passed!');
    
    // Cleanup: Delete only successfully added items from cart
    const uuidsToDelete = successfulResults.map(result => result.uuid);
    await deleteAllCartItems(apiClient, uuidsToDelete);
    
    console.log(`✅ ${uuidsToDelete.length} items successfully deleted during cleanup`);
  });
});
