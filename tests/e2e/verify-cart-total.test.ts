import { ApiClient, generateUUID, calculateCartTotal, deleteAllCartItems, addMultipleProductsToCart, debugPageState, debugElementState, getBrowserSession } from '../../utils/index.js';
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
    
    // Get browser session for API calls
    const sessionInfo = await getBrowserSession(driver);
    
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
    
    const addResults = await addMultipleProductsToCart(apiClient, productIds, sessionInfo.tokenCookie);
    
    console.log('All products added to cart successfully!');
    
    // Navigate to cart page to verify the products
    const baseUrl = process.env.DEMO_BLAZE_BASE_URL;
    await driver.get(`${baseUrl}/cart.html`);
    
    // Wait for cart items to actually appear in the table
    console.log('Waiting for cart items to load...');
    try {
      await driver.wait(until.elementLocated(By.css('#tbodyid tr')), 15000);
    } catch (error) {
      console.log('Cart items not found. Taking debug screenshot...');
      
      // Debug the page state
      await debugPageState(driver, 'cart-total-verification', error as Error);
      
      // Debug specific elements
      await debugElementState(driver, '#tbodyid', 'Cart table body');
      await debugElementState(driver, '#tbodyid tr', 'Cart table rows');
      await debugElementState(driver, 'body', 'Page body');
      
      throw error;
    }
    
    // Calculate cart total using utility function
    const cartResult = await calculateCartTotal(driver);
    
    // Verify cart total calculation is accurate
    assert.strictEqual(cartResult.isMatch, true, `Cart total mismatch! Calculated: ${cartResult.calculatedTotal}, Displayed: ${cartResult.displayedTotal}`);
    
    console.log('Cart total verification passed!');
    
    // Cleanup: Delete all items from cart
    const uuidsToDelete = addResults.map(result => result.uuid);
    await deleteAllCartItems(apiClient, uuidsToDelete);
    
    console.log(`All items successfully deleted during cleanup`);
  });
});
