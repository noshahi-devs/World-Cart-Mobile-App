import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';
import { resolveImagePath } from '../utils/imagePathHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        // ... (existing cart logic remains, as it's not wishlist)
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            setIsLoading(true);
            const items = await cartService.getCartItems(user.id);
            const mappedItems = items.map(item => ({
                id: item.storeProductId,
                cartItemId: item.id,
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
        } finally {
            setIsLoading(false);
        }
    };



    // Animation Refs
    const cartHeartsRef = React.useRef(null);
    const cartToastRef = React.useRef(null);

    const addToCart = async (product, quantity = 1, size = null, color = null) => {
        // Robust ID selection: prioritize storeProductId, then id, then productId
        const targetStoreProductId =
            product.storeProductId ||
            product.id ||
            product.productId ||
            product.store?.id ||
            product.store?.storeProductId;

        const currentUserId = user?.id || 0;

        if (!targetStoreProductId || targetStoreProductId === '00000000-0000-0000-0000-000000000000') {
            console.error('Add to Cart failed: Invalid ID detected');
            throw new Error('Could not identify a valid product listing ID.');
        }

        try {
            setIsLoading(true);
            // Add to backend - pass full product so service can select best ID if needed, 
            // but the stashed changes used targetStoreProductId. 
            // Upstream used cartService.addToCart(product, quantity, user?.id || 0);
            const response = await cartService.addToCart(product, quantity, currentUserId);

            // Update local state optimistically
            setCartItems(prevCart => {
                const existingItem = prevCart.find(item =>
                    item.id === targetStoreProductId &&
                    item.size === size &&
                    item.color === color
                );

                if (existingItem) {
                    return prevCart.map(item =>
                        (item.id === targetStoreProductId && item.size === size && item.color === color)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }

                return [...prevCart, { ...product, id: targetStoreProductId, quantity, size, color }];
            });

            // Trigger animations
            const productImage = resolveImagePath(product.image1 || product.image || product.imageUrl);
            cartHeartsRef.current?.trigger(productImage);
            cartToastRef.current?.show(`${product.title || product.name || 'Product'}`);

            // Refresh from backend to sync state
            await fetchCartFromBackend();
            return response;
        } catch (error) {
            console.error('Add to Cart detailed error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        } finally {
            setIsLoading(false);
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
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
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
            refreshCart: fetchCartFromBackend,
            cartHeartsRef,
            cartToastRef
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
