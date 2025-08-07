import 'dotenv/config';

interface AddToCartRequest {
  id: string;
  cookie: string;
  prod_id: number;
  flag: boolean;
}

interface DeleteCartItemRequest {
  id: string;
}

interface AddToCartResponse {
  success?: boolean;
  message?: string;
  errorMessage?: string;
}

interface DeleteCartItemResponse {
  success?: boolean;
  message?: string;
  errorMessage?: string;
}

export class ApiClient {
  private baseUrl: string;
  private cookie: string;

  constructor() {
    if (!process.env.DEMO_BLAZE_API_BASE_URL) {
      throw new Error('DEMO_BLAZE_API_BASE_URL environment variable is required');
    }
    if (!process.env.DEMO_BLAZE_USER_COOKIE) {
      throw new Error('DEMO_BLAZE_USER_COOKIE environment variable is required');
    }

    this.baseUrl = process.env.DEMO_BLAZE_API_BASE_URL;
    this.cookie = process.env.DEMO_BLAZE_USER_COOKIE;
  }

  async addProductToCart(
    productId: number,
    uuid: string,
    customCookie?: string,
  ): Promise<AddToCartResponse> {
    const url = `${this.baseUrl}/addtocart`;

    const requestBody: AddToCartRequest = {
      id: uuid,
      cookie: customCookie || this.cookie,
      prod_id: productId,
      flag: true,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: this.baseUrl,
          referer: `${this.baseUrl}/`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || contentLength === null) {
        return { success: true, message: 'Product added to cart successfully' };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  async deleteCartItem(uuid: string): Promise<DeleteCartItemResponse> {
    const url = `${this.baseUrl}/deleteitem`;

    const requestBody: DeleteCartItemRequest = {
      id: uuid,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: this.baseUrl,
          referer: `${this.baseUrl}/`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || contentLength === null) {
        return { success: true, message: 'Cart item deleted successfully' };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }
}
