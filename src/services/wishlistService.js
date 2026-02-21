// Wishlist API has been removed and replaced with local storage (AsyncStorage)
// This file is kept as a placeholder to prevent import errors but contains no logic.

const wishlistService = {
    getWishlist: async () => {
        return [];
    },
    addToWishlist: async () => {
        return true;
    },
    removeFromWishlist: async () => {
        return true;
    }
};

export default wishlistService;
