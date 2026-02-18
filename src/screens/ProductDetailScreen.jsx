import React, { useState, useRef, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { rf, moderateScale } from '../utils/responsive';
import { Star3D, Minus3D, Plus3D, Heart3D } from '../components/ThreeDIcons';
import { CartFilled } from '../components/TabIcons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { catalogService } from '../services/catalogService';
import { resolveImagePath } from '../utils/imagePathHelper';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    // FIXED: Safely get productId with fallback
    const { productId } = route.params || {};
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [error, setError] = useState(null);

    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // FIXED: Log the received productId for debugging
        console.log('ProductDetailScreen received productId:', productId);

        if (!productId) {
            setError('No product ID provided');
            setLoading(false);
            return;
        }

        fetchProductDetail();
    }, [productId]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            // FIXED: Pass the productId directly - validation is now in service
            const data = await catalogService.getProductDetail(productId);

            // Enhanced debugging for brand and images
            console.log('=== PRODUCT DETAIL DEBUG ===');
            console.log('Product ID:', productId);
            console.log('Brand from API:', data?.brandName);
            console.log('Category from API:', data?.category?.name);
            console.log('Images from API:', data?.images);
            console.log('Image from API:', data?.image);
            console.log('Full Product Data:', JSON.stringify(data, null, 2));
            console.log('=========================');

            setProduct(data);

            if (data?.sizeOptions?.length > 0) setSelectedSize(data.sizeOptions[0]);
            if (data?.colorOptions?.length > 0) setSelectedColor(data.colorOptions[0]);
        } catch (error) {
            console.error('Fetch detail error:', error);
            setError(error.message || 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if we just returned from login and have a pending action
        if (user && route.params?.action === 'addToCart' && product) {
            // Clear the param so it doesn't trigger again
            navigation.setParams({ action: null });

            // Execute the action
            addToCart(product, quantity, selectedSize, selectedColor);
            setShowModal(true);
        }
    }, [user, route.params, product]);

    // FIXED: Handle case when no productId is provided
    if (!productId && !loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorTitle}>Error</Text>
                    <Text style={styles.errorMessage}>No product ID provided</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} size="medium" />
                </View>
            </SafeAreaView>
        );
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
                <View style={[styles.container, styles.centerContent]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading product details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !product) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
                <View style={[styles.container, styles.centerContent, { padding: 20 }]}>
                    <Text style={styles.errorTitle}>Oops!</Text>
                    <Text style={styles.errorMessage}>
                        {error || 'Product not found'}
                    </Text>
                    <Button
                        title="Try Again"
                        onPress={fetchProductDetail}
                        size="medium"
                        style={{ marginBottom: 10 }}
                    />
                    <Button
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        size="medium"
                        variant="outline"
                    />
                </View>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        if (!user) {
            navigation.navigate('Login', {
                returnTo: 'ProductDetail',
                productId: product.productId || product.id,
                action: 'addToCart'
            });
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
        setShowModal(true);
    };

    const handleWishlistToggle = () => {
        if (!user) {
            navigation.navigate('Login', {
                returnTo: 'ProductDetail',
                productId: product.productId || product.id
            });
            return;
        }
        toggleWishlist(product);
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveImageIndex(index);
    };

    // Helper to get color hex code (simple mapping for demo)
    const getColorHex = (colorName) => {
        const colors = {
            'Black': '#000000', 'White': '#FFFFFF', 'Navy': '#000080', 'Grey': '#808080',
            'Cream': '#FFFDD0', 'Brown': '#A52A2A', 'Red': '#FF0000', 'Pink': '#FFC0CB',
            'Blue': '#0000FF', 'Green': '#008000', 'Burgundy': '#800020', 'Tan': '#D2B48C',
            'Olive': '#808000', 'Khaki': '#F0E68C', 'Coral': '#FF7F50', 'Peach': '#FFDAB9',
            'Lavender': '#E6E6FA', 'Mint': '#98FF98', 'Charcoal': '#36454F', 'Ivory': '#FFFFF0',
            'Teal': '#008080', 'Mustard': '#FFDB58', 'Rose': '#FF007F', 'Sage': '#BCB88A'
        };
        return colors[colorName] || '#CCCCCC';
    };

    // Use the same resolveImagePath utility as ProductCard (handles JSON arrays, escaped quotes, etc.)
    const productImages = (() => {
        const placeholder = 'https://via.placeholder.com/400?text=No+Image';

        if (product.images?.length > 0) {
            const resolved = product.images
                .map(img => resolveImagePath(img))
                .filter(url => url && url !== placeholder);
            if (resolved.length > 0) return resolved;
        }

        if (product.image) {
            const resolved = resolveImagePath(product.image);
            if (resolved && resolved !== placeholder) return [resolved];
        }

        if (product.image1) {
            const resolved = resolveImagePath(product.image1);
            if (resolved && resolved !== placeholder) return [resolved];
        }

        if (product.imageUrl) {
            const resolved = resolveImagePath(product.imageUrl);
            if (resolved && resolved !== placeholder) return [resolved];
        }

        return [placeholder];
    })();

    const currentPrice = product.store?.price || product.price || 0;
    const originalPrice = product.store?.originalPrice || product.oldPrice;
    const discount = product.store?.resellerDiscountPercentage || product.discount;
    const stockQuantity = product.store?.stockQuantity !== undefined ? product.store.stockQuantity : (product.stockQuantity || 0);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title=""
                leftIcon="arrow-left"
                rightIcon={isWishlisted(product.productId || product.id) ? "heart" : "heart-outline"}
                onLeftPress={() => navigation.goBack()}
                onRightPress={handleWishlistToggle}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
            >
                {/* Gallery: Image Slider */}
                <View style={[styles.imageContainer, { height: 400 }]}>
                    <View style={styles.image3DWrapper}>
                        <FlatList
                            data={productImages}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, index) => index.toString()}
                            onScroll={handleScroll}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            renderItem={({ item }) => (
                                <View style={{ width, height: '100%' }}>
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        />
                        {/* Pagination Dots */}
                        <View style={styles.pagination}>
                            {productImages.map((_, index) => {
                                const opacity = scrollX.interpolate({
                                    inputRange: [
                                        (index - 1) * width,
                                        index * width,
                                        (index + 1) * width
                                    ],
                                    outputRange: [0.3, 1, 0.3],
                                    extrapolate: 'clamp'
                                });
                                return (
                                    <Animated.View
                                        key={index}
                                        style={[styles.dot, { opacity }]}
                                    />
                                );
                            })}
                        </View>
                        {!!discount && (
                            <View style={styles.discountBadge3D}>
                                <Text style={styles.discountText}>-{discount}%</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Product Info Card with 3D Effect */}
                <View style={styles.productInfoWrapper}>
                    {/* Layered 3D Effect - Back Stack */}
                    <View style={styles.cardLayerBack} />
                    <View style={styles.cardLayerMiddle} />

                    <View style={styles.productInfo}>

                        {/* Brand & Stock Header */}
                        <View style={styles.headerRow}>
                            <View style={styles.brandLine}>
                                <Text style={styles.brandName}>{product.brandName ? product.brandName : 'Unknown Brand'}</Text><Text style={styles.brandSeparator}> • </Text><Text style={styles.soldByText}>Sold by {product.store?.storeName || 'Merchant'}</Text>
                            </View>
                            <View style={[styles.stockIndicator, { backgroundColor: (stockQuantity > 0) ? COLORS.success + '15' : COLORS.error + '15' }]}>
                                <Text style={[styles.stockText, { color: (stockQuantity > 0) ? COLORS.success : COLORS.error }]}>
                                    {(stockQuantity > 0) ? 'In Stock' : 'Out of Stock'}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.title}>{product.title || ''}</Text>

                        {/* Slug or extra metadata if needed */}
                        {product.slug ? <Text style={styles.reviewText}>{product.slug}</Text> : null}

                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
                            {!!originalPrice && <Text style={styles.oldPrice}>${originalPrice.toFixed(2)}</Text>}
                            {!!discount && (
                                <View style={styles.discountTag}>
                                    <Text style={styles.discountTagText}>Save {discount}%</Text>
                                </View>
                            )}
                        </View>

                        {/* Rating with 3D stars */}
                        <View style={styles.ratingContainer}>
                            <View>
                                <Star3D size={20} color="#FFD700" focused />
                            </View>
                            <View style={styles.ratingText}>
                                <Text style={styles.ratingValue}>{product.rating || '4.5'}</Text><Text style={styles.brandSeparator}> • </Text><Text style={styles.reviewText}>{product.reviews || '345'} Verified Reviews</Text>
                            </View>
                        </View>

                        {/* Description */}
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description || 'No description available.'}</Text>

                        {/* Category */}
                        {product.category && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Category</Text>
                                <Text style={styles.description}>{product.category.name || 'Uncategorized'}</Text>
                            </View>
                        )}

                        {/* Main Store Extended Info */}
                        {product.store && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Store Details</Text>
                                <Text style={styles.description}>{product.store.storeDescription || 'No store description.'}</Text>
                                {product.store.resellerPrice > 0 && (
                                    <View style={styles.resellerInfo}>
                                        <Text style={styles.description}>
                                            Reseller Price: ${product.store.resellerPrice}
                                        </Text>
                                        <Text style={styles.description}>
                                            Discount: {product.store.resellerDiscountPercentage}%
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Other Stores */}
                        {product.otherStores?.length > 0 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Other Sellers ({product.totalOtherStores})</Text>
                                {product.otherStores.map((store, index) => (
                                    <View key={store.storeId || index} style={styles.otherStoreCard}>
                                        <Text style={styles.otherStoreName}>{store.storeName || 'Unknown Store'}</Text>
                                        <Text style={styles.otherStorePrice}>Price: ${store.price || 0}</Text>
                                        <Text style={styles.otherStoreStock}>Stock: {store.stockQuantity || 0}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Color Picker */}
                        {product.colorOptions && product.colorOptions.length > 0 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Select Color</Text>
                                <View style={styles.colorsContainer}>
                                    {product.colorOptions.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorButton,
                                                selectedColor === color && styles.selectedColorButton
                                            ]}
                                            onPress={() => setSelectedColor(color)}
                                        >
                                            <View style={[styles.colorCircle, { backgroundColor: getColorHex(color) }]} />
                                            {selectedColor === color && (
                                                <View style={styles.checkIcon}>
                                                    <View style={styles.checkMark} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Size Selection with 3D effect */}
                        {product.sizeOptions && product.sizeOptions.length > 0 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Size</Text>
                                <View style={styles.sizesContainer}>
                                    {product.sizeOptions.map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[
                                                styles.sizeButton3D,
                                                selectedSize === size && styles.selectedSize3D
                                            ]}
                                            onPress={() => setSelectedSize(size)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={[
                                                styles.sizeButtonInner,
                                                selectedSize === size && styles.selectedSizeInner,
                                                size.length > 3 && { width: 'auto', paddingHorizontal: 16 }
                                            ]}>
                                                <Text style={[
                                                    styles.sizeText,
                                                    selectedSize === size && styles.selectedSizeText
                                                ]}>
                                                    {size}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Quantity with 3D buttons */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Quantity</Text>
                            <View style={styles.quantityContainer3D}>
                                <TouchableOpacity
                                    style={styles.quantityButton3D}
                                    onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                                    activeOpacity={0.8}
                                >
                                    <View>
                                        <Minus3D size={20} color={COLORS.gray[800]} />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.quantityDisplay}>
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.quantityButton3D}
                                    onPress={() => setQuantity(quantity + 1)}
                                    activeOpacity={0.8}
                                >
                                    <View>
                                        <Plus3D size={20} color={COLORS.gray[800]} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: (insets.bottom >= 35 ? 16 : insets.bottom + 16) }]}>
                <View style={styles.priceSummary}>
                    <Text style={styles.totalPrice}>${(currentPrice * parseInt(quantity)).toFixed(2)}</Text>
                </View>
                <Button
                    title={stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                    onPress={handleAddToCart}
                    size="large"
                    style={styles.addToCartButton}
                    disabled={stockQuantity <= 0}
                    icon={<CartFilled size={20} color={COLORS.white} />}
                />
            </View>

            {/* Custom 3D Modal */}
            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                type="success"
                title="Added to Cart"
                message={`${product.title} ${selectedColor ? `(${selectedColor})` : ''} - Size ${selectedSize} x${quantity} has been added to your cart!`}
                primaryButton={{
                    text: 'Go to Cart',
                    onPress: () => navigation.navigate('Cart'),
                }}
                secondaryButton={{
                    text: 'Continue',
                    onPress: () => { },
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.gray[600],
        fontSize: rf(14),
    },
    errorTitle: {
        fontSize: rf(24),
        fontWeight: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 10,
    },
    errorMessage: {
        textAlign: 'center',
        color: COLORS.gray[600],
        marginBottom: 20,
        fontSize: rf(14),
    },
    imageContainer: {
        marginBottom: 20,
    },
    image3DWrapper: {
        height: '100%',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    productImage: {
        width: width,
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white,
        marginHorizontal: 4,
        ...SHADOWS.light
    },
    discountBadge3D: {
        position: 'absolute',
        top: 28,
        right: 28,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    discountText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 13,
    },
    productInfoWrapper: {
        marginHorizontal: SIZES.padding,
        marginTop: -moderateScale(40), // Overlap functionality
        position: 'relative',
    },
    cardLayerBack: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: -10,
        bottom: -20,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 24,
        zIndex: -2,
    },
    cardLayerMiddle: {
        position: 'absolute',
        top: 10,
        left: 5,
        right: -5,
        bottom: -10,
        backgroundColor: COLORS.primary + '20',
        borderRadius: 24,
        zIndex: -1,
    },
    productInfo: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: moderateScale(24),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    brandLine: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    brandName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    brandSeparator: {
        fontSize: 14,
        color: COLORS.gray[400],
    },
    soldByText: {
        fontSize: 14,
        color: COLORS.gray[600],
    },
    stockIndicator: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    stockText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: rf(22),
        fontWeight: '900', // Stronger weight
        color: COLORS.black,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    oldPrice: {
        fontSize: 18,
        color: COLORS.gray[500],
        textDecorationLine: 'line-through',
    },
    discountTag: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    discountTagText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ratingText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    reviewText: {
        fontSize: 14,
        color: COLORS.gray[500],
    },
    description: {
        fontSize: 15,
        color: COLORS.gray[600],
        lineHeight: 24,
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 12,
    },
    colorsContainer: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 2,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedColorButton: {
        borderColor: COLORS.black,
        borderWidth: 1.5,
    },
    colorCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    checkIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        width: 6,
        height: 10,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: 'white',
        transform: [{ rotate: '45deg' }],
    },
    sizesContainer: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    sizeButton3D: {
        position: 'relative',
    },
    selectedSize3D: {},
    sizeButtonInner: {
        minWidth: 48,
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
    },
    selectedSizeInner: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.black,
        ...SHADOWS.button3D,
    },
    sizeText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
    selectedSizeText: {
        color: COLORS.white,
    },
    quantityContainer3D: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 16,
        padding: 6,
        alignSelf: 'flex-start',
        ...SHADOWS.medium,
    },
    quantityButton3D: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    quantityDisplay: {
        paddingHorizontal: 24,
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...SHADOWS.floating,
    },
    priceSummary: {
        flex: 1,
        marginRight: SIZES.padding,
    },
    totalPrice: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    addToCartButton: {
        flex: 2,
    },
    otherStoreCard: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: COLORS.gray[100],
        borderRadius: 8,
    },
    otherStoreName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: COLORS.black,
    },
    otherStorePrice: {
        fontSize: 13,
        color: COLORS.gray[700],
    },
    otherStoreStock: {
        fontSize: 13,
        color: COLORS.gray[700],
    },
    resellerInfo: {
        marginTop: 8,
    },
});

export default ProductDetailScreen;