import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { user } = useAuth();

    // Animation Refs
    const heartsRef = React.useRef(null);
    const toastRef = React.useRef(null);

    // 📥 Load Wishlist on Start
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const savedWishlist = await AsyncStorage.getItem('user_wishlist');
                if (savedWishlist) {
                    setWishlistItems(JSON.parse(savedWishlist));
                }
            } catch (error) {
                console.error('Wishlist Context: Failed to load wishlist from storage', error);
            }
        };
        loadWishlist();
    }, []);

    // 💾 Save Wishlist whenever it changes
    useEffect(() => {
        const saveWishlist = async () => {
            try {
                await AsyncStorage.setItem('user_wishlist', JSON.stringify(wishlistItems));
            } catch (error) {
                console.error('Wishlist Context: Failed to save wishlist', error);
            }
        };
        if (wishlistItems.length >= 0) {
            saveWishlist();
        }
    }, [wishlistItems]);

    // 🧹 Clear Wishlist on Logout (as requested)
    useEffect(() => {
        if (!user) {
            setWishlistItems([]);
            AsyncStorage.removeItem('user_wishlist');
        }
    }, [user]);

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
