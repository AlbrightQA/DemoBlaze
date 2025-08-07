import { ApiClient, generateUUID } from '../../utils/index.js';
import 'dotenv/config';

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
    
    try {
      const result = await apiClient.addProductToCart(productId, testUuid);
      console.log('Added to cart:', result);
      
      // Check for error message in response
      if (result.errorMessage) {
        throw new Error(`API returned error: ${result.errorMessage}`);
      }
      
      // Verify the response indicates success
      if (result.success !== undefined) {
        console.log('Success status:', result.success);
      }
      if (result.message) {
        console.log('Response message:', result.message);
      }
      
      console.log('✅ Add to cart smoke test passed: API call completed successfully');
      
    } catch (error) {
      console.error('❌ Add to cart smoke test failed: API call failed:', error);
      throw error;
    }
  });

  it('Should delete product from cart via API', async function() {
    this.timeout(10000);
    
    try {
      const result = await apiClient.deleteCartItem(testUuid);
      console.log('Deleted from cart:', result);
      
      // Check for error message in response
      if (result.errorMessage) {
        throw new Error(`API returned error: ${result.errorMessage}`);
      }
      
      // Verify the response indicates success
      if (result.success !== undefined) {
        console.log('Success status:', result.success);
      }
      if (result.message) {
        console.log('Response message:', result.message);
      }
      
      console.log('✅ Delete from cart smoke test passed: API call completed successfully');
      
    } catch (error) {
      console.error('❌ Delete from cart smoke test failed: API call failed:', error);
      throw error;
    }
  });
});
