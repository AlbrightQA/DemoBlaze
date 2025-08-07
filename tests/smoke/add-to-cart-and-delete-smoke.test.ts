import { ApiClient, generateUUID } from '../../utils/index.js';
import 'dotenv/config';
import { strict as assert } from 'assert';

describe('API Client Tests', function() {
  let apiClient: ApiClient;
  let testUuid: string;
  let productId: number;

  before(function() {
    apiClient = new ApiClient();
    testUuid = generateUUID();
    
    const nexus6ProductId = process.env.NEXUS_6_PRODUCT_ID;
    if (!nexus6ProductId) {
      throw new Error('NEXUS_6_PRODUCT_ID environment variable is required');
    }
    productId = parseInt(nexus6ProductId);
  });

  it('Should add product to cart via API', async function() {
    this.timeout(10000);
    
    const result = await apiClient.addProductToCart(productId, testUuid);
    console.log('Added to cart:', result);
    
    // Verify no error message in response
    assert.strictEqual(result.errorMessage, undefined, `API returned error: ${result.errorMessage}`);
    
    console.log('Add to cart smoke test passed: API call completed successfully');
  });

  it('Should delete product from cart via API', async function() {
    this.timeout(10000);
    
    const result = await apiClient.deleteCartItem(testUuid);
    console.log('Deleted from cart:', result);
    
    // Verify no error message in response
    assert.strictEqual(result.errorMessage, undefined, `API returned error: ${result.errorMessage}`);
    
    console.log('Delete from cart smoke test passed: API call completed successfully');
  });
});
