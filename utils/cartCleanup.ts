import { ApiClient } from './apiClient.js';

export interface DeleteResult {
  uuid: string;
  success: boolean;
  errorMessage?: string;
}

export async function deleteAllCartItems(apiClient: ApiClient, uuids: string[]): Promise<DeleteResult[]> {
  console.log(`Starting cleanup - deleting ${uuids.length} cart items...`);
  
  const results: DeleteResult[] = [];
  
  for (const uuid of uuids) {
    try {
      const deleteResult = await apiClient.deleteCartItem(uuid);
      console.log(`Deleted item with UUID ${uuid}:`, deleteResult);
      
      if (deleteResult.errorMessage) {
        console.log(`Warning: Delete returned error for UUID ${uuid}:`, deleteResult.errorMessage);
        results.push({
          uuid,
          success: false,
          errorMessage: deleteResult.errorMessage
        });
      } else {
        console.log(`✅ Successfully deleted item with UUID ${uuid}`);
        results.push({
          uuid,
          success: true
        });
      }
    } catch (error) {
      console.log(`❌ Error deleting item with UUID ${uuid}:`, error instanceof Error ? error.message : String(error));
      results.push({
        uuid,
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  
  console.log(`🧹 Cleanup completed! Successfully deleted: ${successCount}, Failed: ${failureCount}`);
  
  return results;
}
