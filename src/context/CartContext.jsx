import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Removed local products - now fetched from API in screens
    const [cartItems, setCartItems] = useState([]);

    // Wishlist is now managed by backend API
    // Removed toggleWishlist function

    const addToCart = (product, quantity = 1, size = null, color = null) => {
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
    };

    const removeFromCart = (productId, size, color) => {
        setCartItems(prevCart => prevCart.filter(item =>
            !(item.id === productId && item.size === size && item.color === color)
        ));
    };

    const updateCartItem = (productId, size, color, updates) => {
        setCartItems(prevCart =>
            prevCart.map(item =>
                (item.id === productId && item.size === size && item.color === color)
                    ? { ...item, ...updates }
                    : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateCartItem,
            clearCart,
            getCartTotal,
            getCartItemCount
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
