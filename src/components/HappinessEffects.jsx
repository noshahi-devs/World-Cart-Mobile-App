import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import HeartFallingAnimation from './HeartFallingAnimation';
import WishlistToast from './WishlistToast';

const HappinessEffects = () => {
    const { heartsRef, toastRef } = useWishlist();

    return (
        <>
            <HeartFallingAnimation ref={heartsRef} />
            <WishlistToast ref={toastRef} />
        </>
    );
};

export default HappinessEffects;
