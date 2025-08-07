import { ApiClient, generateUUID } from './index.js';

export interface AddToCartResult {
  productId: number;
  uuid: string;
  success: boolean;
  errorMessage?: string;
}

export async function addMultipleProductsToCart(apiClient: ApiClient, productIds: number[]): Promise<AddToCartResult[]> {
  console.log(`Starting bulk add - adding ${productIds.length} products to cart...`);
  
  const results: AddToCartResult[] = [];
  
  for (const productId of productIds) {
    try {
      const uuid = generateUUID();
      const addResult = await apiClient.addProductToCart(productId, uuid);
      console.log(`🛒 Added product ${productId} with UUID ${uuid}:`, addResult);
      
      if (addResult.errorMessage) {
        console.log(`Warning: Add returned error for product ${productId}:`, addResult.errorMessage);
        results.push({
          productId,
          uuid,
          success: false,
          errorMessage: addResult.errorMessage
        });
      } else {
        console.log(`✅ Successfully added product ${productId} with UUID ${uuid}`);
        results.push({
          productId,
          uuid,
          success: true
        });
      }
    } catch (error) {
      console.log(`❌ Error adding product ${productId}:`, error instanceof Error ? error.message : String(error));
      results.push({
        productId,
        uuid: '', // No UUID generated due to error
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  
  console.log(`Bulk add completed! Successfully added: ${successCount}, Failed: ${failureCount}`);
  
  return results;
}
