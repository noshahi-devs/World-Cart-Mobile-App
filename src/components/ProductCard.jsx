import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { HeartOutline, HeartFilled, CartFilled } from './TabIcons';
import { Star3D } from './ThreeDIcons';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES } from '../constants/theme';
import { rf, moderateScale } from '../utils/responsive';

const ProductCard = ({ product, onPress, containerStyle }) => {
    const { width } = useWindowDimensions();
    const { toggleWishlist, addToCart } = useCart();

    // Consistent column logic
    const numColumns = width >= 1440 ? 5 : (width >= 1024 ? 4 : (width >= 768 ? 3 : 2));

    // Account for the maxWidth of the main container (1200px)
    const containerMaxWidth = 1200;
    const effectiveWidth = Math.min(width, containerMaxWidth);

    const gridCardWidth = (effectiveWidth - (SIZES.padding * 2) - (SIZES.base * 2 * (numColumns - 1))) / numColumns;

    // Use containerStyle width if provided (for horizontal lists), otherwise grid width
    const cardWidth = containerStyle?.width || gridCardWidth;

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const cartPulseAnim = useRef(new Animated.Value(1)).current;
    const [activeImage, setActiveImage] = useState(product.image);


    useEffect(() => {
        // Subtle breathing/pulse animation for the cart button
        const startPulse = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(cartPulseAnim, {
                        toValue: 1.08,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(cartPulseAnim, {
                        toValue: 1,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startPulse();
    }, []);

    const handlePressIn = () => {
        if (product.hoverImage) {
            setActiveImage(product.hoverImage);
        }
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        setActiveImage(product.image);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    const handleWishlistPress = () => {
        toggleWishlist(product.id);
    };

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <Animated.View style={[styles.wrapper, containerStyle, { width: cardWidth, transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Image Container */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: activeImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={handleWishlistPress}
                        activeOpacity={0.8}
                    >
                        {product.wishlisted ? (
                            <HeartFilled size={18} color={COLORS.secondary} />
                        ) : (
                            <HeartOutline size={18} color={COLORS.gray[500]} />
                        )}
                    </TouchableOpacity>

                    {product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>-{product.discount}</Text>
                        </View>
                    )}
                </View>

                {/* Info Container */}
                <View style={styles.infoContainer}>
                    <Text style={styles.brandLine} numberOfLines={1}>
                        <Text style={styles.brandName}>{product.brand || product.category || 'World'}</Text>
                        <Text style={styles.brandSeparator}> • </Text>
                        <Text style={styles.soldByText}>Sold by {product.storeName}</Text>
                    </Text>

                    <Text style={styles.title} numberOfLines={2}>
                        {product.title}
                    </Text>

                    <View style={styles.bottomSection}>
                        <View style={styles.priceRatingColumn}>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>
                                {product.oldPrice && (
                                    <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
                                )}
                            </View>

                            <View style={styles.ratingContainer}>
                                <Star3D size={12} color="#FFD700" focused />
                                <Text style={styles.ratingText}>
                                    {product.rating || '0.0'} • <Text style={styles.reviewText}>{product.reviews || 0} Reviews</Text>
                                </Text>
                            </View>
                        </View>

                        <Animated.View style={{ transform: [{ scale: cartPulseAnim }] }}>
                            <TouchableOpacity
                                style={styles.addCartButton}
                                onPress={handleAddToCart}
                                activeOpacity={0.7}
                            >
                                <CartFilled size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
        marginHorizontal: SIZES.base,
    },
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        // Clean spread shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    imageContainer: {
        position: 'relative',
        height: 180,
        backgroundColor: COLORS.gray[100],
    },
    image: {
        width: '100%',
        height: '100%',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.secondary,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    discountText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 10,
    },
    brandLine: {
        fontSize: 10,
        color: COLORS.gray[500],
        marginBottom: 2,
    },
    brandName: {
        fontWeight: 'bold',
        color: COLORS.black,
    },
    brandSeparator: {
        color: COLORS.gray[400],
    },
    soldByText: {
        color: COLORS.gray[600],
    },
    title: {
        fontSize: rf(15),
        color: COLORS.gray[800],
        fontWeight: '600',
        marginBottom: 1,
        lineHeight: rf(18),
        height: rf(38),
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceRatingColumn: {
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        marginRight: 6,
    },
    oldPrice: {
        fontSize: 12,
        color: COLORS.gray[400],
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 11,
        color: COLORS.black,
        fontWeight: '600',
    },
    reviewText: {
        color: COLORS.gray[500],
        fontWeight: '400',
    },
    addCartButton: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6, // Lifted up from the bottom
        // Premium 3D Shadow
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});

export default ProductCard;