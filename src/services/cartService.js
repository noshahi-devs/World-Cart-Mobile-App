import apiClient from '../api/client';

export const cartService = {
    /**
     * Add item to cart
     * POST /api/services/app/Cart/AddToCart
     */
    addToCart: async (product, quantity = 1, userId = 0) => {
        const emptyGuid = '00000000-0000-0000-0000-000000000000';
        let storeProductId = null;

        try {
            // BACKEND ALIGNMENT PROBE:
            // The API strictly requires storeProductId.
            console.log('=== CART SERVICE PROBE ===');
            console.log('Product Keys:', Object.keys(product));

            // Priority:
            // 1. Explicit storeProductId (assigned in ProductDetail from nav params or API)
            // 2. product.store?.storeProductId
            // 3. product.id (This is the storeProductId in Product List/Home views)

            if (product.storeProductId && product.storeProductId !== emptyGuid) {
                storeProductId = product.storeProductId;
            } else if (product.store?.storeProductId && product.store.storeProductId !== emptyGuid) {
                storeProductId = product.store.storeProductId;
            } else if (product.id && product.id !== emptyGuid && product.id !== product.productId) {
                // If id is present and different from productId, it's likely the store-product link ID
                storeProductId = product.id;
            } else if (product.id && product.id !== emptyGuid && !product.productId) {
                // Only id present
                storeProductId = product.id;
            }

            console.log('Selected storeProductId for AddToCart:', storeProductId);

            if (!storeProductId) {
                console.error('CartService: No valid storeProductId found for product:', product);
                throw new Error('Store product ID not found. Please try again.');
            }

            // Strictly follow the payload format requested by the backend:
            // { userId, storeProductId, quantity }
            const payload = {
                userId: typeof userId === 'number' ? userId : 0,
                storeProductId: storeProductId,
                quantity: quantity
            };

            console.log('CartService - Sending AddToCart payload:', JSON.stringify(payload, null, 2));

            const response = await apiClient.post('/api/services/app/Cart/AddToCart', payload);
            console.log('CartService - AddToCart Success:', response.data);
            return response.data;
        } catch (error) {
            console.error('CartService - AddToCart ERROR:', {
                errorMessage: error.message,
                status: error.response?.status,
                apiData: error.response?.data,
                payloadSent: { storeProductId, quantity, userId },
                productTitle: product?.title || product?.productTitle
            });
            throw error;
        }
    },

    /**
     * Get all cart items
     * GET /api/services/app/Cart/GetCartItems
     */
    getCartItems: async () => {
        try {
            const response = await apiClient.get('/api/services/app/Cart/GetCartItems');
            const data = response.data;

            // Handle different response formats
            if (data.result) {
                return data.result.items || data.result || [];
            }
            return data.items || data || [];
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },

    /**
     * Update cart item quantity
     * PUT /api/services/app/Cart/UpdateCartItem (if exists)
     */
    updateCartItem: async (cartItemId, quantity) => {
        try {
            const response = await apiClient.put('/api/services/app/Cart/UpdateCartItem', {
                id: cartItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    /**
     * Remove item from cart
     * DELETE /api/services/app/Cart/RemoveFromCart
     */
    removeFromCart: async (cartItemId) => {
        try {
            const response = await apiClient.delete('/api/services/app/Cart/RemoveFromCart', {
                params: { id: cartItemId }
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    /**
     * Clear entire cart
     * DELETE /api/services/app/Cart/ClearCart (if exists)
     */
    clearCart: async () => {
        try {
            const response = await apiClient.delete('/api/services/app/Cart/ClearCart');
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};

export default cartService;
