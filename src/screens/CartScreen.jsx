import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { rf, moderateScale } from '../utils/responsive';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cart3D, Minus3D, Plus3D, Trash3D, Package3D, Heart3D, Crown3D } from '../components/ThreeDIcons';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { aboutData } from '../constants/data';

const EmptyCartView = ({ navigation }) => {
    // Animation Values
    const floatAnim = React.useRef(new Animated.Value(0)).current;

    // Items coming out
    const item1Anim = React.useRef(new Animated.Value(0)).current;
    const item2Anim = React.useRef(new Animated.Value(0)).current;
    const item3Anim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Cart Float Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true
                })
            ])
        ).start();

        // Animated Items Logic
        const animateItem = (anim, delay) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true
                    }),
                    Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true })
                ])
            ).start();
        };

        animateItem(item1Anim, 0);
        animateItem(item2Anim, 1000);
        animateItem(item3Anim, 2000);
    }, []);

    // Interpolations
    const cartTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15]
    });

    const getItemStyle = (anim, xOffset, rotate) => ({
        opacity: anim.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 1, 0]
        }),
        transform: [
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -120] // Moves up
                })
            },
            {
                translateX: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, xOffset] // Moves sideways
                })
            },
            {
                scale: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.1, 0.8]
                })
            },
            { rotate: rotate }
        ]
    });

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.animationContainer}>
                {/* Floating Items (Behind Cart) */}
                <Animated.View style={[styles.floatingItem, getItemStyle(item1Anim, -50, '-15deg')]}>
                    <Package3D size={32} color={COLORS.primary} />
                </Animated.View>
                <Animated.View style={[styles.floatingItem, getItemStyle(item2Anim, 0, '0deg')]}>
                    <Heart3D size={30} color="#E91E63" />
                </Animated.View>
                <Animated.View style={[styles.floatingItem, getItemStyle(item3Anim, 50, '15deg')]}>
                    <Crown3D size={28} color="#FFC107" />
                </Animated.View>

                {/* Main Cart */}
                <Animated.View style={[styles.emptyIconCircle, { transform: [{ translateY: cartTranslateY }] }]}>
                    <Cart3D size={56} color={COLORS.gray[400]} />
                </Animated.View>
            </View>

            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>
                Looks like you haven't added anything to your cart yet!
            </Text>
            <Button
                title="Start Shopping"
                onPress={() => navigation.navigate('Home')}
                size="large"
                style={styles.shopButton}
            />
        </View>
    );
};

const CartScreen = ({ navigation }) => {
    const { cartItems, updateCartItem, removeFromCart, getCartTotal, getCartItemCount, clearCart } = useCart();
    const insets = useSafeAreaInsets();
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});

    const showConfirmModal = (config) => {
        setModalConfig(config);
        setShowModal(true);
    };

    const updateQuantity = (id, size, color, newQuantity) => {
        if (newQuantity < 1) {
            showConfirmModal({
                type: 'warning',
                title: 'Remove Item',
                message: 'Are you sure you want to remove this item from your cart?',
                primaryButton: {
                    text: 'Remove',
                    onPress: () => removeFromCart(id, size, color),
                },
                secondaryButton: { text: 'Cancel' },
            });
        } else {
            updateCartItem(id, size, color, { quantity: newQuantity });
        }
    };

    const handleRemoveItem = (id, size, color, title) => {
        showConfirmModal({
            type: 'warning',
            title: 'Remove Item',
            message: `Remove "${title}" from your cart?`,
            primaryButton: {
                text: 'Remove',
                onPress: () => removeFromCart(id, size, color),
            },
            secondaryButton: { text: 'Cancel' },
        });
    };

    const handleClearCart = () => {
        showConfirmModal({
            type: 'error',
            title: 'Clear Cart',
            message: 'Are you sure you want to remove all items from your cart?',
            primaryButton: {
                text: 'Clear All',
                onPress: () => clearCart(),
            },
            secondaryButton: { text: 'Cancel' },
        });
    };

    const handleAboutPress = () => {
        showConfirmModal({
            title: aboutData.title,
            message: aboutData.message,
            type: 'info',
            icon: (
                <Image
                    source={require('../assets/icons/World-Cart.png')}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    resizeMode="cover"
                />
            ),
            primaryButton: {
                text: "Got it",
                onPress: () => setShowModal(false)
            }
        });
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 4.99 : 0;
    const total = subtotal + shipping;

    const renderCartItem = ({ item }) => (
        <View style={styles.cardWrapper3D}>
            {/* 3D Stacked Layers */}
            <View style={styles.cardLayerBack} />
            <View style={styles.cardLayerMiddle} />

            <View style={styles.cartItem}>
                <View style={styles.imageWrapper3D}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.cartItemImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={styles.optionsRow}>
                        <View style={styles.sizeBadge}>
                            <Text style={styles.cartItemSize}>Size: {item.size}</Text>
                        </View>
                        {item.color && (
                            <View style={[styles.sizeBadge, { marginLeft: 8 }]}>
                                <Text style={styles.cartItemSize}>Color: {item.color}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.cartItemPrice}>
                        {`$${(Number(item.price || 0) * item.quantity).toFixed(2)}${item.quantity > 1 ? ` ($${Number(item.price || 0).toFixed(2)} each)` : ''}`}
                    </Text>

                    <View style={styles.cartItemActions}>
                        <View style={styles.quantitySelector3D}>
                            <TouchableOpacity
                                style={styles.quantityButton3D}
                                onPress={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                activeOpacity={0.8}
                            >
                                <Minus3D size={14} color={COLORS.gray[700]} />
                            </TouchableOpacity>
                            <View style={styles.quantityDisplay}>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.quantityButton3D}
                                onPress={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                activeOpacity={0.8}
                            >
                                <Plus3D size={14} color={COLORS.gray[700]} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.removeButton3D}
                            onPress={() => handleRemoveItem(item.id, item.size, item.color, item.title)}
                            activeOpacity={0.8}
                        >
                            <Trash3D size={16} color={COLORS.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title={`Shopping Cart${cartItems.length > 0 ? ` (${getCartItemCount()})` : ''}`}
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
                rightIcon="logo"
                onRightPress={handleAboutPress}
            />

            {cartItems.length === 0 ? (
                <EmptyCartView navigation={navigation} />
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item, index) => `${item.id}-${item.size}-${item.color}-${index}`}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* 3D Summary Card */}
                    <View style={styles.summaryWrapper3D}>
                        <View style={styles.summaryLayerBack} />
                        <View style={styles.summaryLayerMiddle} />

                        <View style={styles.cartSummary}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Shipping</Text>
                                <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                            </View>

                            <Button
                                title="Proceed to Checkout"
                                onPress={() => navigation.navigate('Checkout')}
                                size="medium"
                                style={styles.checkoutButton}
                            />
                        </View>
                    </View>
                </>
            )
            }

            {/* Custom Modal */}
            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalConfig}
            />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    listContent: {
        padding: SIZES.padding,
        paddingBottom: 280,
    },
    cardWrapper3D: {
        marginBottom: moderateScale(25),
        position: 'relative',
    },
    cardLayerBack: {
        position: 'absolute',
        top: 12,
        left: 6,
        right: -6,
        bottom: -12,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 20,
        zIndex: -2,
    },
    cardLayerMiddle: {
        position: 'absolute',
        top: 6,
        left: 3,
        right: -3,
        bottom: -6,
        backgroundColor: COLORS.primary + '20',
        borderRadius: 20,
        zIndex: -1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 10,
    },
    imageWrapper3D: {
    },
    imageBack3D: {
        display: 'none',
    },
    cartItemImage: {
        width: 85,
        height: 85,
        borderRadius: 12,
    },
    cartItemInfo: {
        flex: 1,
        marginLeft: SIZES.padding,
        justifyContent: 'space-between',
    },
    cartItemTitle: {
        fontSize: rf(15),
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 4,
    },
    optionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sizeBadge: {
        backgroundColor: COLORS.gray[100],
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
    },
    cartItemSize: {
        fontSize: SIZES.body4,
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    cartItemPrice: {
        fontSize: rf(18),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: 8,
    },
    unitPrice: {
        fontSize: SIZES.body4,
        fontWeight: 'normal',
        color: COLORS.gray[500],
    },
    cartItemActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantitySelector3D: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
        padding: 4,
        ...SHADOWS.light,
    },
    quantityButton3D: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    quantityDisplay: {
        paddingHorizontal: 16,
    },
    quantityText: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    removeButton3D: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    summaryWrapper3D: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SIZES.padding,
        paddingBottom: moderateScale(20),
    },
    summaryLayerBack: {
        position: 'absolute',
        top: 15,
        left: SIZES.padding + 8,
        right: SIZES.padding - 8,
        bottom: 10,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 24,
        zIndex: -2,
    },
    summaryLayerMiddle: {
        position: 'absolute',
        top: 8,
        left: SIZES.padding + 4,
        right: SIZES.padding - 4,
        bottom: 15,
        backgroundColor: COLORS.primary + '20',
        borderRadius: 24,
        zIndex: -1,
    },
    cartSummary: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        paddingVertical: moderateScale(20),
        paddingHorizontal: moderateScale(20),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: SIZES.body2,
        color: COLORS.gray[600],
    },
    summaryValue: {
        fontSize: SIZES.body2,
        color: COLORS.gray[800],
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginVertical: 6,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    checkoutButton: {
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 2,
    },
    animationContainer: {
        height: 180,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    floatingItem: {
        position: 'absolute',
        top: 100, // Start position inside/behind the cart
        zIndex: 0,
    },
    emptyIconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        // Clean spread shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 5,
    },
    emptyTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: SIZES.base,
    },
    emptyText: {
        fontSize: SIZES.body1,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: SIZES.padding * 2,
        lineHeight: 24,
    },
    shopButton: {
        width: '80%',
    },
});

export default CartScreen;