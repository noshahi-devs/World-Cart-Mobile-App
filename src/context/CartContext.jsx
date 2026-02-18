import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); // Get user from AuthContext
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch cart from backend when user logs in
    useEffect(() => {
        if (user) {
            fetchCartFromBackend();
        } else {
            // Clear cart when user logs out
            setCartItems([]);
        }
    }, [user]);

    const fetchCartFromBackend = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            setIsLoading(true);
            const items = await cartService.getCartItems();
            // Map backend response to frontend format
            const mappedItems = items.map(item => ({
                id: item.storeProductId,
                cartItemId: item.id, // Backend cart item ID
                title: item.productTitle,
                name: item.productTitle,
                image: item.productImage,
                price: item.price,
                originalPrice: item.originalPrice,
                quantity: item.quantity,
                storeName: item.storeName,
                discount: item.resellerDiscountPercentage
            }));
            setCartItems(mappedItems);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            // Keep local cart if API fails
        } finally {
            setIsLoading(false);
        }
    };

    // Wishlist is now managed by backend API
    // Removed toggleWishlist function

    const addToCart = async (product, quantity = 1, size = null, color = null) => {
        try {
            // Robust ID selection check
            const emptyGuid = '00000000-0000-0000-0000-000000000000';
            const targetId = product.productId || product.id || product.storeProductId;

            if (!targetId || targetId === emptyGuid) {
                console.error('CartContext: No valid ID for product:', product);
                throw new Error('Invalid product ID');
            }

            // Sync with backend: pass full product so service can select best ID
            await cartService.addToCart(product, quantity, user?.id || 0);

            // Update local state
            setCartItems(prevCart => {
                const existingItem = prevCart.find(item =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color
                );

                if (existingItem) {
                    return prevCart.map(item =>
                        (item.id === product.id && item.size === size && item.color === color)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevCart, { ...product, quantity, size, color }];
            });

            // Refresh from backend to get accurate data
            await fetchCartFromBackend();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId, size, color) => {
        try {
            // Find cart item
            const item = cartItems.find(i =>
                i.id === productId && i.size === size && i.color === color
            );

            if (item?.cartItemId) {
                // Remove from backend
                await cartService.removeFromCart(item.cartItemId);
            }

            // Update local state
            setCartItems(prevCart => prevCart.filter(item =>
                !(item.id === productId && item.size === size && item.color === color)
            ));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (productId, size, color, updates) => {
        try {
            const item = cartItems.find(i =>
                i.id === productId && i.size === size && i.color === color
            );

            if (item?.cartItemId && updates.quantity) {
                // Update backend
                await cartService.updateCartItem(item.cartItemId, updates.quantity);
            }

            // Update local state
            setCartItems(prevCart =>
                prevCart.map(item =>
                    (item.id === productId && item.size === size && item.color === color)
                        ? { ...item, ...updates }
                        : item
                )
            );
        } catch (error) {
            console.error('Failed to update cart item:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            if (user) {
                // Clear backend cart
                await cartService.clearCart();
            }
            // Clear local state
            setCartItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
            // Clear local state anyway
            setCartItems([]);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            isLoading,
            addToCart,
            removeFromCart,
            updateCartItem,
            clearCart,
            getCartTotal,
            getCartItemCount,
            refreshCart: fetchCartFromBackend
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
