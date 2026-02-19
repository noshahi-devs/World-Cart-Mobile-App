import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import HeartFallingAnimation from './HeartFallingAnimation';
import WishlistToast from './WishlistToast';
import ProductFallingAnimation from './ProductFallingAnimation';
import CartToast from './CartToast';

const HappinessEffects = () => {
    const { heartsRef, toastRef } = useWishlist();
    const { cartHeartsRef, cartToastRef } = useCart();

    return (
        <>
            {/* Wishlist Effects */}
            <HeartFallingAnimation ref={heartsRef} />
            <WishlistToast ref={toastRef} />

            {/* Cart Effects */}
            <ProductFallingAnimation ref={cartHeartsRef} />
            <CartToast ref={cartToastRef} />
        </>
    );
};

export default HappinessEffects;
