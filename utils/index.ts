export { ApiClient } from './apiClient.js';
export { generateUUID } from './uuidGenerator.js';
export { calculateCartTotal, type CartTotalResult } from './cartCalculator.js';
export { deleteAllCartItems, type DeleteResult } from './cartCleanup.js';
export { addMultipleProductsToCart, type AddToCartResult } from './cartOperations.js';
export {
  takeDebugScreenshot,
  debugElementState,
  debugPageState,
  type DebugInfo,
} from './screenshotDebugger.js';
export { getBrowserSession, type SessionInfo } from './sessionManager.js';
export { testConfig } from '../config/test.config.js';
