import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    // Animation Refs
    const heartsRef = React.useRef(null);
    const toastRef = React.useRef(null);

    // Toggle: agar product already wishlist mein hai to remove, warna add
    const toggleWishlist = (product) => {
        const productId = product.productId || product.id;
        const exists = wishlistItems.some(item => (item.productId || item.id) === productId);

        if (exists) {
            setWishlistItems(prev => prev.filter(item => (item.productId || item.id) !== productId));
        } else {
            setWishlistItems(prev => [...prev, product]);
            // Trigger Happiness only when adding
            heartsRef.current?.trigger();
            toastRef.current?.show(`Added to your wishlist! 💖`);
        }
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

    const triggerHappiness = () => {
        heartsRef.current?.trigger();
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleWishlist,
            isWishlisted,
            removeFromWishlist,
            triggerHappiness,
            heartsRef,
            toastRef
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
