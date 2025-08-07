import { ApiClient, generateUUID } from './index.js';

export interface AddToCartResult {
  productId: number;
  uuid: string;
  success: boolean;
  errorMessage?: string;
}

export async function addMultipleProductsToCart(
  apiClient: ApiClient,
  productIds: number[],
  customCookie?: string,
): Promise<AddToCartResult[]> {
  const results: AddToCartResult[] = [];

  for (const productId of productIds) {
    try {
      const uuid = generateUUID();
      const addResult = await apiClient.addProductToCart(productId, uuid, customCookie);

      if (addResult.errorMessage) {
        results.push({
          productId,
          uuid,
          success: false,
          errorMessage: addResult.errorMessage,
        });
      } else {
        console.log(`Successfully added product ${productId} with UUID ${uuid}`);
        results.push({
          productId,
          uuid,
          success: true,
        });
      }
    } catch (error) {
      console.log(
        `Error adding product ${productId}:`,
        error instanceof Error ? error.message : String(error),
      );
      results.push({
        productId,
        uuid: '', // No UUID generated due to error
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
