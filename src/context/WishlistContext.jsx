import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    // Toggle: agar product already wishlist mein hai to remove, warna add
    const toggleWishlist = (product) => {
        setWishlistItems(prev => {
            const productId = product.productId || product.id;
            const exists = prev.find(item => (item.productId || item.id) === productId);
            if (exists) {
                return prev.filter(item => (item.productId || item.id) !== productId);
            } else {
                return [...prev, product];
            }
        });
    };

    // Check karo ke product wishlist mein hai ya nahi
    const isWishlisted = (productId) => {
        return wishlistItems.some(item => (item.productId || item.id) === productId);
    };

    // Directly remove by ID (for delete button in ProfileScreen)
    const removeFromWishlist = (productId) => {
        setWishlistItems(prev =>
            prev.filter(item => (item.productId || item.id) !== productId)
        );
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleWishlist,
            isWishlisted,
            removeFromWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
