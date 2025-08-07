import { ApiClient } from './apiClient.js';

export interface DeleteResult {
  uuid: string;
  success: boolean;
  errorMessage?: string;
}

export async function deleteAllCartItems(
  apiClient: ApiClient,
  uuids: string[],
): Promise<DeleteResult[]> {
  const results: DeleteResult[] = [];

  for (const uuid of uuids) {
    try {
      const deleteResult = await apiClient.deleteCartItem(uuid);

      if (deleteResult.errorMessage) {
        results.push({
          uuid,
          success: false,
          errorMessage: deleteResult.errorMessage,
        });
      } else {
        console.log(`Successfully deleted item with UUID ${uuid}`);
        results.push({
          uuid,
          success: true,
        });
      }
    } catch (error) {
      console.log(
        `Error deleting item with UUID ${uuid}:`,
        error instanceof Error ? error.message : String(error),
      );
      results.push({
        uuid,
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
