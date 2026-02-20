
import React, { useState, useEffect, useRef } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PayPalIcon } from '../components/TabIcons';
import cardService from '../services/cardService';
import {
    Package3D,
    Heart3D,
    MapMarker3D,
    CreditCard3D,
    Crown3D,
    Logout3D,
} from '../components/ThreeDIcons';
import {
    User, Lock, Shield, Wallet, Ticket, Gift,
    Bell, Globe, Moon, HelpCircle, FileText, ChevronRight, Edit2
} from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Header from '../components/Header';
import CustomModal from '../components/CustomModal';
import { profileData, addresses, paymentMethods } from '../constants/data.jsx';
import orderService from '../services/orderService';
import { COLORS, SIZES } from '../constants/theme';
import { moderateScale, rf, verticalScale } from '../utils/responsive';
import { CreditCardIcon } from '../components/TabIcons';
import { useWishlist } from '../context/WishlistContext';

// Helper Component for Floating Label Input on Card
const CardFloatingInput = React.forwardRef(({ label, value, onChangeText, placeholder, maxLength, keyboardType, secureTextEntry, containerStyle, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: 0,
        width: 200, // Ensure label doesn't wrap even if container is narrow
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, -2], // 16=lower start, -2=not too high
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [11, 10], // Reduced start size as requested
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.9)'],
        }),
        fontWeight: '600',
        letterSpacing: 1,
    };

    return (
        <View style={[styles.cardInputWrapper, containerStyle]}>
            <Animated.Text style={labelStyle}>
                {label}
            </Animated.Text>
            <TextInput
                ref={ref}
                style={styles.cardFloatingInput}
                value={value}
                onChangeText={(text) => {
                    onChangeText(text);
                    if (value === '' && text !== '') {
                        // handled by useEffect
                    }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={maxLength}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholder={isFocused ? placeholder : ''}
                placeholderTextColor="rgba(255,255,255,0.7)"
                {...props}
            />
        </View>
    );
});

const ProfileScreen = ({ navigation }) => {
    // Removed products from useCart - will use Wishlist API later
    const { getCartItemCount } = useCart();
    const { user, logout } = useAuth();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const insets = useSafeAreaInsets();

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        icon: null,
        primaryButton: null,
        secondaryButton: null
    });

    const showModal = (config) => {
        setModalConfig({ ...config, visible: true });
    };

    const hideModal = () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
    };

    const handleLogoutPress = () => {
        showModal({
            title: 'Log Out',
            message: 'Are you sure you want to exit your secure session? Your 3D preferences will be saved.',
            type: 'error',
            icon: <Logout3D size={60} variant="white" />,
            primaryButton: {
                text: 'Log Out',
                onPress: () => {
                    hideModal();
                    logout();
                }
            },
            secondaryButton: { text: 'Cancel', onPress: () => hideModal() }
        });
    };

    const [activeSection, setActiveSection] = useState('orders');

    // --- Real Orders from API ---
    const [userOrders, setUserOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const emptyOrderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (user) {
            fetchUserOrders();
        }
    }, [user]);

    const fetchUserOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrdersError(null);
            const data = await orderService.getAllOrders({ maxResultCount: 50 });
            setUserOrders(data.items || []);
            // Trigger empty state animation if no orders
            if ((data.items || []).length === 0) {
                Animated.spring(emptyOrderAnim, {
                    toValue: 1,
                    tension: 60,
                    friction: 7,
                    useNativeDriver: true,
                }).start();
            }
        } catch (err) {
            console.error('ProfileScreen - fetchUserOrders:', err?.response?.data || err.message);
            setOrdersError('Could not load orders. Please try again.');
        } finally {
            setOrdersLoading(false);
        }
    };


    // Animations for Guest View
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!user) {
            // Entry Animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();

            // Continuous Floating Animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        }
    }, [user]);

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15]
    });

    // Guest View
    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Profile" leftIcon="arrow-left" onLeftPress={() => navigation.navigate('Home')} />
                <Animated.View style={[styles.guestContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {/* Decorative Background Circles */}
                    <View style={styles.guestDecorCircle1} />
                    <View style={styles.guestDecorCircle2} />

                    <Animated.View style={[styles.guestIconWrapper, { transform: [{ translateY }] }]}>
                        <View style={styles.guestIconCircle3D}>
                            <User size={60} color={COLORS.primary} strokeWidth={1.5} />
                        </View>
                        <View style={styles.guestIconShadow} />
                    </Animated.View>

                    <Text style={styles.guestTitle}>Join World-Cart Elite</Text>
                    <Text style={styles.guestMessage}>Unlock premium features, track your 3D orders, and sync your wishlist across all devices.</Text>
                    <TouchableOpacity
                        style={styles.guestLoginButton3D}
                        onPress={() => navigation.navigate('Login', { returnTo: 'Profile' })}
                        activeOpacity={0.8}
                    ><View style={styles.guestLoginButtonInner}><Text style={styles.guestLoginButtonText}>Sign In / Create Account</Text></View></TouchableOpacity>
                    <TouchableOpacity
                        style={styles.guestSecondaryButton}
                        onPress={() => navigation.navigate('Home')}
                    ><Text style={styles.guestSecondaryButtonText}>Continue as Explorer</Text></TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        );
    }

    // Helper: format order date
    const formatOrderDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch { return dateStr; }
    };

    // Helper: map API status string to style
    const getStatusStyle = (status = '') => {
        const s = status.toLowerCase();
        if (s.includes('delivered') || s.includes('completed')) return styles.statusDelivered;
        if (s.includes('shipped') || s.includes('transit')) return styles.statusShipped;
        if (s.includes('processing') || s.includes('pending')) return styles.statusProcessing;
        if (s.includes('cancel')) return styles.statusCancelled;
        return {};
    };

    const renderOrders = () => {
        // Loading skeleton
        if (ordersLoading) {
            return (
                <View style={styles.sectionContent}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.orderSkeletonCard}>
                            <View style={styles.skeletonLine} />
                            <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
                            <View style={[styles.skeletonLine, { width: '40%', marginTop: 8 }]} />
                        </View>
                    ))}
                </View>
            );
        }

        // Error state
        if (ordersError) {
            return (
                <View style={styles.emptyOrdersContainer}>
                    <Text style={styles.emptyOrdersEmoji}>⚠️</Text>
                    <Text style={styles.emptyOrdersTitle}>Oops!</Text>
                    <Text style={styles.emptyOrdersSubtitle}>{ordersError}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchUserOrders}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Empty state — animated
        if (userOrders.length === 0) {
            return (
                <Animated.View
                    style={[
                        styles.emptyOrdersContainer,
                        {
                            opacity: emptyOrderAnim,
                            transform: [{
                                translateY: emptyOrderAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0],
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.emptyOrderIconBg}>
                        <Package3D size={56} focused={false} />
                    </View>
                    <Text style={styles.emptyOrdersTitle}>No Orders Yet</Text>
                    <Text style={styles.emptyOrdersSubtitle}>
                        You haven't placed any orders yet.{`\n`}Start shopping to see them here!
                    </Text>
                    <TouchableOpacity
                        style={styles.shopNowButton}
                        onPress={() => navigation.navigate('Home')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.shopNowButtonText}>🛍️  Start Shopping</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        // Real orders list
        return (
            <View style={styles.sectionContent}>
                {userOrders.map((order, index) => (
                    <View key={order.id || index} style={styles.orderCardWrapper}>
                        <View style={styles.orderLayerBack} />
                        <View style={styles.orderLayerMiddle} />
                        <TouchableOpacity
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('OrderTracking', { orderId: order.orderNumber || order.id })}
                            activeOpacity={0.88}
                        >
                            {/* Order Header */}
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderId} numberOfLines={1}>
                                    #{order.orderNumber || order.id?.toString().slice(0, 8).toUpperCase()}
                                </Text>
                                <Text style={styles.orderDate}>{formatOrderDate(order.creationTime)}</Text>
                            </View>

                            {/* Items count & Total */}
                            <View style={styles.orderDetails}>
                                <Text style={styles.orderItems}>
                                    {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                                </Text>
                                <Text style={styles.orderTotal}>
                                    ${Number(order.totalAmount || 0).toFixed(2)}
                                </Text>
                            </View>

                            {/* Product names preview */}
                            {order.orderItems?.length > 0 && (
                                <Text style={styles.orderItemsPreview} numberOfLines={1}>
                                    {order.orderItems.map(i => i.productName).filter(Boolean).join(' · ')}
                                </Text>
                            )}

                            {/* Footer: Status + Track */}
                            <View style={styles.orderFooter}>
                                <View style={[
                                    styles.orderStatus,
                                    getStatusStyle(order.status)
                                ]}>
                                    <Text style={styles.orderStatusText}>
                                        {order.status || 'Processing'}
                                    </Text>
                                </View>
                                {order.deliveryTrackingNumber || order.trackingCode ? (
                                    <TouchableOpacity
                                        style={styles.trackButton}
                                        onPress={() => navigation.navigate('OrderTracking', { orderId: order.orderNumber || order.id })}
                                    >
                                        <Text style={styles.trackButtonText}>Track</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderWishlist = () => (
        <View style={styles.sectionContent}>
            {wishlistItems.length === 0 ? (
                <View style={styles.emptyWishlist}>
                    <View style={styles.emptyIconCircle}>
                        <Heart3D size={50} color={COLORS.gray[400]} />
                    </View>
                    <Text style={styles.emptyWishlistText}>Your wishlist is empty</Text>
                    <Button
                        title="Browse Products"
                        onPress={() => navigation.navigate('Home')}
                        variant="outline"
                        size="large"
                    />
                </View>
            ) : (
                <View style={styles.wishlistGrid}>
                    {wishlistItems.map((item) => {
                        const itemId = item.productId || item.id;
                        return (
                            <TouchableOpacity
                                key={itemId}
                                style={styles.wishlistItem}
                                onPress={() => navigation.navigate('ProductDetail', { productId: itemId })}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: item.image1 || item.image || item.imageUrl || 'https://via.placeholder.com/150' }}
                                    style={styles.wishlistImage}
                                    resizeMode="contain"
                                />
                                {/* Delete button - top right */}
                                <TouchableOpacity
                                    style={styles.wishlistDeleteBtn}
                                    onPress={() => removeFromWishlist(itemId)}
                                    activeOpacity={0.8}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                    <Text style={styles.wishlistDeleteIcon}>✕</Text>
                                </TouchableOpacity>
                                <Text style={styles.wishlistTitle} numberOfLines={2}>
                                    {item.title || item.name || 'Product'}
                                </Text>
                                <Text style={styles.wishlistPrice}>
                                    ${item.price ? item.price.toFixed(2) : '0.00'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );

    const renderAddresses = () => (
        <View style={styles.sectionContent}>
            {addresses.map((address) => (
                <View key={address.id} style={styles.addressCard}>
                    <View style={styles.addressHeader}>
                        <Text style={styles.addressName}>{address.name}</Text>
                        {address.isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.addressText}>{address.address}</Text>
                    <Text style={styles.addressText}>{address.city}, {address.state} {address.zip}</Text>
                    <Text style={styles.addressText}>{address.phone}</Text>
                    <View style={styles.addressActions}>
                        <Button
                            title="Edit"
                            variant="secondary"
                            size="small"
                            style={styles.editButton}
                        />
                        {!address.isDefault && (
                            <Button
                                title="Delete"
                                variant="danger"
                                size="small"
                                style={styles.deleteButton}
                            />
                        )}
                    </View>
                </View>
            ))}
            <Button
                title="Add New Address"
                variant="outline"
                icon="plus"
                style={styles.addButton}
            />
        </View>
    );

    // Card Balance State
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', holder: user?.fullName || 'CARD HOLDER' });
    const [showBalanceInputs, setShowBalanceInputs] = useState(false);
    const [cardBalance, setCardBalance] = useState(null);
    const [isCheckingBalance, setIsCheckingBalance] = useState(false);

    // Refs for keyboard navigation
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

    // Load persisted balance on mount
    // REMOVED persistence logic per request - session only
    // useEffect(() => {
    //    loadPersistedBalance();
    // }, []);

    // const loadPersistedBalance = async () => { ... }

    const resetCardState = () => {
        setCardBalance(null);
        setShowBalanceInputs(false);
        setCardDetails({ number: '', expiry: '', cvv: '', holder: user?.fullName || 'CARD HOLDER' });
    };

    const handleCheckBalance = async () => {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
            showModal({ title: 'Error', message: 'Please fill in all card details.', type: 'error' });
            return;
        }

        setIsCheckingBalance(true);
        try {
            // Real API call to check balance
            const response = await cardService.getBalance(cardDetails.number, cardDetails.cvv, cardDetails.expiry);

            // Assume response is the balance string, e.g., "$2,450.00" or similar
            // If response is an object, adjust accordingly. Commonly response.result for ABP methods.
            const balance = response?.result || response;

            if (balance) {
                // Formatting balance if it's just a number
                const formattedBalance = typeof balance === 'number'
                    ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : balance;

                setCardBalance(formattedBalance);
                setShowBalanceInputs(false);
                setIsCheckingBalance(false);
                showModal({ title: 'Success', message: 'Balance verified successfully!', type: 'success' });
            } else {
                throw new Error("Invalid balance response");
            }

        } catch (error) {
            console.error(error);
            setIsCheckingBalance(false);
            showModal({ title: 'Error', message: 'Failed to verify balance. Please ensure the card details are correct.', type: 'error' });
        }
    };

    const renderBalance = () => (
        <View style={styles.sectionContent}>
            {/* Payment Card UI */}
            <View style={styles.finoraCardContainer}>
                {/* Visual Card Background */}
                <View style={styles.finoraCardGradient}>
                    <View style={styles.cardDecorCircle} />

                    <View style={styles.cardHeaderRow}>
                        <Image source={require('../../assets/chipp.png')} style={styles.chipImage} />
                        <View style={styles.contactlessIcon}>
                            {/* Removed smallest dot (width: 4) as requested */}
                            <View style={[styles.signalLine, { width: 10, height: 10, borderRadius: 5, borderTopColor: 'transparent', borderLeftColor: 'transparent' }]} />
                            <View style={[styles.signalLine, { width: 16, height: 16, borderRadius: 8, borderTopColor: 'transparent', borderLeftColor: 'transparent' }]} />
                        </View>
                        {/* Close Icon to reset card state */}
                        {(showBalanceInputs || cardBalance) && (
                            <TouchableOpacity
                                style={styles.closeIconWrapper}
                                onPress={resetCardState}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={styles.closeIconText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Main Content Area */}
                    <View style={styles.cardContentArea}>
                        {cardBalance ? (
                            <View style={styles.balanceDisplay}>
                                <Text style={styles.balanceLabel}>Current Balance</Text>
                                <Text style={styles.balanceAmount}>{cardBalance}</Text>
                            </View>
                        ) : showBalanceInputs ? (
                            <View style={styles.cardInputsContainer}>
                                <TextInput
                                    style={styles.cardNumberInput}
                                    placeholder="0000 0000 0000 0000"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    keyboardType="numeric"
                                    maxLength={19}
                                    value={cardDetails.number}
                                    onChangeText={(text) => {
                                        // Remove non-numeric characters
                                        const rawValue = text.replace(/\D/g, '');
                                        // Format: add space after every 4 digits, limit to 16 digits
                                        const formattedValue = rawValue
                                            .substring(0, 16)
                                            .replace(/(\d{4})(?=\d)/g, '$1 ');
                                        setCardDetails({ ...cardDetails, number: formattedValue });
                                    }}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => expiryRef.current?.focus()}
                                />
                                <View style={styles.cardRowInputs}>
                                    <CardFloatingInput
                                        ref={expiryRef}
                                        label="VALID THRU"
                                        value={cardDetails.expiry}
                                        onChangeText={(text) => {
                                            const clean = text.replace(/\D/g, '');
                                            let formatted = clean;
                                            if (clean.length > 2) {
                                                formatted = clean.slice(0, 2) + '/' + clean.slice(2, 4);
                                            }
                                            setCardDetails({ ...cardDetails, expiry: formatted });
                                        }}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        keyboardType="numeric"
                                        containerStyle={{ width: 70 }}
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => cvvRef.current?.focus()}
                                    />
                                    <CardFloatingInput
                                        ref={cvvRef}
                                        label="CVV"
                                        value={cardDetails.cvv}
                                        onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                                        placeholder="123"
                                        maxLength={3}
                                        keyboardType="numeric"
                                        secureTextEntry
                                        containerStyle={{ width: 50 }}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.checkBalanceBtnOverlay}
                                onPress={() => setShowBalanceInputs(true)}
                            >
                                <Text style={styles.checkBalanceBtnText}>Check your Easyfinora card balance</Text>
                            </TouchableOpacity>
                        )}
                        {/* Main Content Area End */}
                    </View>

                    {/* Card Footer */}
                    <View style={styles.cardFooterRow}>
                        <View>
                            <Text style={styles.cardHolderName}>{cardDetails.holder.toUpperCase()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            {/* Keep logo or brand here if needed */}
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons Below Card */}
            {
                !showBalanceInputs && !cardBalance && (
                    <Button
                        title="Check Balance"
                        onPress={() => setShowBalanceInputs(true)}
                        style={styles.verifyBalanceBtn}
                    />
                )
            }
            {
                showBalanceInputs && !cardBalance && (
                    <Button
                        title="Verify Balance"
                        onPress={handleCheckBalance}
                        loading={isCheckingBalance}
                        variant="secondary"
                        style={styles.verifyBalanceBtn}
                    />
                )
            }

            <Button
                title="Add Payment Method"
                variant="outline"
                icon="plus"
                style={styles.addMethodBtn}
                onPress={() => showModal({
                    title: 'Coming Soon',
                    message: 'Currently, World-Cart only supports EasyFinora cards. Other payment methods will be available soon!',
                    type: 'info',
                    icon: <CreditCard3D size={50} variant="primary" />,
                    primaryButton: { text: "Got it", onPress: () => hideModal() }
                })}
            />
        </View >
    );

    const profileNavItems = [
        { id: 'orders', label: 'My Orders', IconComponent: Package3D },
        { id: 'wishlist', label: 'My Wishlist', IconComponent: Heart3D },
        { id: 'address', label: 'Address', IconComponent: MapMarker3D },
        { id: 'Balance', label: 'Balance', IconComponent: CreditCard3D }
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="Profile"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
                rightIcon="logout"
                onRightPress={handleLogoutPress}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Information Card - Pro Level */}
                <View style={styles.profileSectionWrapper}>
                    <View style={styles.profileCardWrapper}>
                        {/* Layered 3D Effect */}
                        <View style={styles.cardLayerBack} />
                        <View style={styles.cardLayerMiddle} />

                        <View style={styles.profileCard3D}>
                            {/* Premium Decorative Elements */}
                            <View style={styles.headerDecor1} />
                            <View style={styles.headerDecor2} />

                            <View style={styles.profileMainContent}>
                                <View style={styles.profileImageWrapper}>
                                    <Image
                                        source={require('../assets/icons/World-Cart.png')}
                                        style={styles.profileImage}
                                    />
                                </View>

                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName} numberOfLines={1} adjustsFontSizeToFit>
                                        Hi 👋 {user?.fullName || user?.name || 'User'}
                                    </Text>
                                    <Text style={styles.profileEmail} numberOfLines={1}>{user?.emailAddress || user?.email || 'user@example.com'}</Text>
                                    <View style={styles.membershipBadge}>
                                        <Crown3D size={20} focused={true} />
                                        <Text style={styles.membershipText}>Elite Member</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.editProfileButton}
                                    onPress={() => navigation.navigate('EditProfile')}
                                    activeOpacity={0.7}
                                >
                                    <Edit2 size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileData.totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileData.loyaltyPoints}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>${profileData.totalSpent.toFixed(0)}</Text>
                        <Text style={styles.statLabel}>Spent</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileData.joinedDate.split(' ')[1]}</Text>
                        <Text style={styles.statLabel}>Joined</Text>
                    </View>
                </View>

                {/* Profile Navigation */}
                <View style={styles.profileNav}>
                    {profileNavItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.profileNavItem,
                                    isActive && styles.activeProfileNavItem
                                ]}
                                onPress={() => setActiveSection(item.id)}
                                activeOpacity={0.7}
                            >
                                <item.IconComponent
                                    size={22}
                                    color={isActive ? COLORS.white : COLORS.gray[500]}
                                    focused={isActive}
                                />
                                <Text style={[
                                    styles.profileNavText,
                                    isActive && styles.activeProfileNavText
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Content Section */}
                {activeSection === 'orders' && renderOrders()}
                {activeSection === 'wishlist' && renderWishlist()}
                {activeSection === 'address' && renderAddresses()}
                {activeSection === 'Balance' && renderBalance()}

                {/* Pro Settings Section */}
                <View style={styles.settingsSection}>
                    {[
                        {
                            title: "Account & Security",
                            data: [

                                {
                                    icon: Lock, color: '#EA580C', label: 'Change Password', detail: 'Last changed 30 days ago',
                                    modalTitle: 'Security Audit',
                                    modalMsg: 'Password Strength: Excellent\nLast Login: Frankfurt, DE (IP: 192.168.x.x)\n2FA: Active via Authenticator'
                                },
                                {
                                    icon: Shield, color: '#059669', label: 'Two-Factor Auth', detail: 'Enabled',
                                    modalTitle: '2FA Settings',
                                    modalMsg: 'Current Method: Google Authenticator\nBackup Codes: 8 remaining\nLast Verification: Just now'
                                },
                            ]
                        },
                        {
                            title: "My Wallet & Rewards",
                            data: [
                                {
                                    icon: Wallet, color: '#7C3AED', label: 'My Wallet', detail: '$2,450.00 Balance',
                                    modalTitle: 'Wallet Balance',
                                    modalMsg: 'Available: $2,450.00\nPending: $0.00\nCurrency: USD\n\nTap "Top Up" to add funds.'
                                },
                                {
                                    icon: Ticket, color: '#DB2777', label: 'Coupons', detail: '5 Active Coupons',
                                    modalTitle: 'Active Coupons',
                                    modalMsg: '1. SUMMER50 (50% OFF)\n2. WELCOME10 ($10 OFF)\n3. FREESHIP (Free Shipping)\n\nExpires in 3 days.'
                                },
                                {
                                    icon: Gift, color: '#D97706', label: 'Gift Cards', detail: '$50.00 Redeemable',
                                    modalTitle: 'Gift Card Vault',
                                    modalMsg: 'Code: ****-****-AB99\nValue: $50.00\nStatus: Unredeemed\nSender: Corporate Reward'
                                },
                            ]
                        },
                        {
                            title: "Preferences",
                            data: [
                                {
                                    icon: Bell, color: '#2563EB', label: 'Notifications', detail: 'Order updates only',
                                    modalTitle: 'Notification Center',
                                    modalMsg: 'Push: Enabled\nEmail: Weekly Digest\nSMS: OTP Only\n\nOptimize your alerts here.'
                                },
                                {
                                    icon: Globe, color: '#0891B2', label: 'Language', detail: 'English (US)',
                                    modalTitle: 'Language Settings',
                                    modalMsg: 'Current: English (US)\nRegion: Global\nAuto-Translate: ON'
                                },
                                {
                                    icon: Moon, color: '#4B5563', label: 'Appearance', detail: 'Light Mode',
                                    modalTitle: 'Theme Settings',
                                    modalMsg: 'Current: Light Mode 3D\nDark Mode: Auto (Sunset)\nContrast: High'
                                },
                            ]
                        },
                        {
                            title: "Support & Legal",
                            data: [
                                {
                                    icon: HelpCircle, color: '#DC2626', label: 'World-Cart Help Center', detail: '24/7 Priority Support',
                                    modalTitle: 'World-Cart Support Hub',
                                    modalMsg: 'Welcome to World-Cart Premium Support.\n\n● Live Chat: Online (Instant)\n● Email: support@world-cart.ai\n● Call: (+1) World-Cart-SOS\n\nOur AI-powered system and human experts are ready to assist you with tracking, refunds, or product queries.'
                                },
                                {
                                    icon: FileText, color: '#6B7280', label: 'Security & Privacy', detail: 'v2.5 Protected encrypted',
                                    modalTitle: 'World-Cart Digital Security',
                                    modalMsg: 'At World-Cart, we take your digital safety seriously. Our platform is built on a foundation of trust and advanced security protocols.\n\n🔒 DATA PROTECTION\nWe utilize AES-256 military-grade encryption for all stored data. Your personal information is completely anonymized for third-party logistics to ensure 100% privacy.\n\n💳 PAYMENT SECURITY\nEvery transaction is processed through a PCI-DSS Level 1 certified gateway. We support 3D Secure 2.0 authentication, ensuring that only you can authorize your purchases.\n\n🌍 GLOBAL COMPLIANCE\nWorld-Cart is fully compliant with GDPR, CCPA, and international privacy frameworks. You have the full right to access, export, or delete your data at any time via your account settings.'
                                },
                                {
                                    icon: Globe, color: COLORS.primary, label: 'About World-Cart', detail: 'Elite Shopping Experience',
                                    isLogo: true,
                                    modalTitle: 'The World-Cart Evolution',
                                    modalMsg: 'World-Cart is the definitive future of the global 3D e-commerce experience.\n\n🌏 OUR VISION\nWe believe shopping should be extraordinary. By combining cutting-edge 3D rendering with seamless logistics, we bring the premium store experience directly to your fingertips.\n\n💎 UNCOMPROMISED QUALITY\nEvery seller on our platform undergoes a rigorous 5-step verification process. From material sourcing to final delivery, we ensure that every product meets our "Elite Standard".\n\n🚀 INNOVATION AT SCALE\n● Presence: Serving customers in over 50+ countries.\n● Network: Partnered with 100,000+ verified premium brands.\n● Logistics: Real-time global tracking with eco-friendly packaging.'
                                },
                            ]
                        }
                    ].map((group, groupIndex) => (
                        <View key={groupIndex} style={styles.settingsGroup}>
                            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
                            {group.data.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.setting3DCard}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        if (item.label === 'Change Password') {
                                            navigation.getParent()?.navigate('ChangePassword');
                                        } else {
                                            showModal({
                                                title: item.modalTitle || item.label,
                                                message: item.modalMsg,
                                                type: 'info',
                                                iconColor: item.isLogo ? COLORS.primary : item.color,
                                                icon: item.isLogo ? (
                                                    <Image
                                                        source={require('../assets/icons/World-Cart.png')}
                                                        style={{ width: 80, height: 80, borderRadius: 40 }}
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <item.icon size={32} color={item.color} strokeWidth={2.5} />
                                                ),
                                                primaryButton: { text: "Got it", onPress: () => hideModal() }
                                            });
                                        }
                                    }}
                                >
                                    <View style={[
                                        styles.settingIconContainer,
                                        { backgroundColor: item.color === COLORS.primary ? COLORS.black : item.color + '15' },
                                        item.isLogo && { borderRadius: 22, backgroundColor: COLORS.black, overflow: 'hidden' }
                                    ]}>
                                        {item.isLogo ? (
                                            <Image
                                                source={require('../assets/icons/World-Cart.png')}
                                                style={{ width: 44, height: 44, borderRadius: 22 }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <item.icon size={22} color={item.color} strokeWidth={2} />
                                        )}
                                    </View>
                                    <View style={styles.settingInfo}>
                                        <Text style={styles.settingLabel}>{item.label}</Text>
                                        <Text style={styles.settingDetail}>{item.detail}</Text>
                                    </View>
                                    <View style={styles.settingChevron}>
                                        <ChevronRight size={18} color="#9CA3AF" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Logout Button */}
                <Button
                    title="Log Out"
                    variant="danger"
                    size="large"
                    style={styles.logoutButton}
                    onPress={() => showModal({
                        title: 'Log Out',
                        message: 'Are you sure you want to log out secure session? All 3D preferences will be saved.',
                        type: 'error',
                        icon: <Logout3D size={60} variant="white" />,
                        primaryButton: {
                            text: 'Log Out',
                            onPress: () => {
                                hideModal();
                                logout();
                            }
                        },
                        secondaryButton: { text: 'Cancel', onPress: () => hideModal() }
                    })}
                />
            </ScrollView>

            <CustomModal
                visible={modalConfig.visible}
                onClose={hideModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                icon={modalConfig.icon}
                iconColor={modalConfig.iconColor}
                primaryButton={modalConfig.primaryButton}
                secondaryButton={modalConfig.secondaryButton}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    guestContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding * 2,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    guestDecorCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.primary + '08',
    },
    guestDecorCircle2: {
        position: 'absolute',
        bottom: 100,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '05',
    },
    guestIconWrapper: {
        alignItems: 'center',
        marginBottom: 40,
    },
    guestIconCircle3D: {
        width: moderateScale(140),
        height: moderateScale(140),
        borderRadius: moderateScale(70),
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[100],
        shadowColor: '#1c71d8',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
        zIndex: 2,
    },
    guestIconShadow: {
        width: 80,
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 40,
        marginTop: 20,
        transform: [{ scaleX: 1.5 }],
    },
    guestTitle: {
        fontSize: rf(26),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: 12,
        textAlign: 'center',
    },
    guestMessage: {
        fontSize: rf(15),
        color: COLORS.gray[500],
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    guestLoginButton3D: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 18,
        padding: 4,
        shadowColor: '#1c71d8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    guestLoginButtonInner: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    guestLoginButtonText: {
        color: COLORS.white,
        fontSize: rf(16),
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    guestSecondaryButton: {
        marginTop: 20,
        paddingVertical: 12,
    },
    guestSecondaryButtonText: {
        color: COLORS.gray[500],
        fontSize: rf(14),
        fontWeight: '700',
    },
    profileSectionWrapper: {
        padding: SIZES.padding,
        backgroundColor: COLORS.gray[50],
    },
    profileCardWrapper: {
        position: 'relative',
        marginBottom: moderateScale(20),
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
    profileCard3D: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SIZES.padding,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    headerDecor1: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD',
    },
    headerDecor2: {
        position: 'absolute',
        bottom: -20,
        left: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3E5F5',
        opacity: 0.6,
    },
    profileMainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    profileImageWrapper: {
        marginRight: moderateScale(16),
        padding: moderateScale(4),
        backgroundColor: COLORS.white,
        borderRadius: moderateScale(45),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    profileImage: {
        width: moderateScale(85),
        height: moderateScale(85),
        borderRadius: moderateScale(42.5),
        borderWidth: 2,
        borderColor: COLORS.gray[100],
    },
    profilePlaceholder: {
        width: moderateScale(85),
        height: moderateScale(85),
        borderRadius: moderateScale(42.5),
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    editProfileButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: rf(22),
        fontWeight: '800',
        color: COLORS.black,
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    profileEmail: {
        fontSize: rf(14),
        color: COLORS.gray[500],
        marginBottom: moderateScale(8),
    },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    membershipText: {
        fontSize: rf(12),
        color: '#F57C00',
        fontWeight: 'bold',
        marginLeft: moderateScale(6),
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: SIZES.body3,
        color: COLORS.gray[600],
    },
    profileNav: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding - 8,
        paddingVertical: 8,
        backgroundColor: COLORS.white,
    },
    profileNavItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginHorizontal: 3,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    activeProfileNavItem: {
        backgroundColor: COLORS.primary,
        // Premium 3D Shadow - tightened up for smaller size
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    profileNavText: {
        fontSize: rf(10.5),
        color: COLORS.gray[500],
        marginTop: 4,
        fontWeight: '600',
        textAlign: 'center',
    },
    activeProfileNavText: {
        color: COLORS.white,
        fontWeight: '800',
    },
    sectionContent: {
        padding: SIZES.padding,
    },
    orderCardWrapper: {
        position: 'relative',
        marginBottom: moderateScale(25),
    },
    orderLayerBack: {
        position: 'absolute',
        top: 12,
        left: 6,
        right: -6,
        bottom: -12,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 20,
        zIndex: -2,
    },
    orderLayerMiddle: {
        position: 'absolute',
        top: 6,
        left: 3,
        right: -3,
        bottom: -6,
        backgroundColor: COLORS.primary + '20',
        borderRadius: 20,
        zIndex: -1,
    },
    orderCard: {
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
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.base,
    },
    orderId: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    orderDate: {
        fontSize: SIZES.body3,
        color: COLORS.gray[600],
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.base,
    },
    orderItems: {
        fontSize: SIZES.body2,
        color: COLORS.gray[600],
    },
    orderTotal: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatus: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: COLORS.gray[300],
    },
    statusDelivered: {
        backgroundColor: '#D4EDDA',
    },
    statusShipped: {
        backgroundColor: '#D1ECF1',
    },
    statusProcessing: {
        backgroundColor: '#FFF3CD',
    },
    statusCancelled: {
        backgroundColor: '#FDECEA',
    },
    orderStatusText: {
        fontSize: SIZES.body3,
        fontWeight: '600',
        color: COLORS.gray[800],
    },
    orderItemsPreview: {
        fontSize: rf(11.5),
        color: COLORS.gray[500],
        marginBottom: 8,
        fontStyle: 'italic',
    },
    trackButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
    },
    trackButtonText: {
        color: COLORS.white,
        fontSize: SIZES.body3,
        fontWeight: '600',
    },
    // --- Empty Orders State ---
    emptyOrdersContainer: {
        alignItems: 'center',
        paddingVertical: moderateScale(40),
        paddingHorizontal: SIZES.padding * 2,
    },
    emptyOrderIconBg: {
        width: moderateScale(110),
        height: moderateScale(110),
        borderRadius: moderateScale(55),
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(20),
        borderWidth: 1.5,
        borderColor: COLORS.primary + '20',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    emptyOrdersEmoji: {
        fontSize: 52,
        marginBottom: 12,
    },
    emptyOrdersTitle: {
        fontSize: rf(20),
        fontWeight: '800',
        color: COLORS.black,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyOrdersSubtitle: {
        fontSize: rf(13.5),
        color: COLORS.gray[500],
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: moderateScale(24),
    },
    shopNowButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    shopNowButtonText: {
        color: COLORS.white,
        fontSize: rf(15),
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    retryButton: {
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    retryButtonText: {
        color: COLORS.primary,
        fontSize: rf(14),
        fontWeight: '700',
    },
    // --- Skeleton Loader ---
    orderSkeletonCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: moderateScale(18),
        marginBottom: moderateScale(20),
        borderWidth: 1,
        borderColor: COLORS.gray[100],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    skeletonLine: {
        height: 14,
        borderRadius: 8,
        backgroundColor: COLORS.gray[200],
        width: '100%',
    },
    emptyWishlist: {
        alignItems: 'center',
        padding: SIZES.padding * 2,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    emptyWishlistText: {
        fontSize: SIZES.h3,
        color: COLORS.gray[600],
        marginBottom: SIZES.padding * 2,
        textAlign: 'center',
    },
    wishlistGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    wishlistItem: {
        width: (SIZES.width - 48) / 2,
        marginBottom: SIZES.padding,
        position: 'relative',
    },
    wishlistImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    wishlistTitle: {
        fontSize: SIZES.body2,
        color: COLORS.gray[800],
        marginBottom: 4,
        height: 40,
    },
    wishlistPrice: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    wishlistDeleteBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    wishlistDeleteIcon: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 15,
    },
    addressCard: {
        backgroundColor: COLORS.gray[100],
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.base,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    addressName: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    defaultBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    defaultBadgeText: {
        color: COLORS.white,
        fontSize: SIZES.body4,
        fontWeight: '600',
        marginLeft: 4,
    },
    addressText: {
        fontSize: SIZES.body2,
        color: COLORS.gray[600],
        marginBottom: 2,
    },
    addressActions: {
        flexDirection: 'row',
        marginTop: SIZES.padding,
        gap: 8,
    },
    editButton: {
        flex: 1,
    },
    deleteButton: {
        flex: 1,
    },
    addButton: {
        marginTop: SIZES.base,
    },
    paymentCard: {
        backgroundColor: COLORS.gray[100],
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.base,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentInfo: {
        marginLeft: SIZES.padding,
    },
    cardBrand: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    cardNumber: {
        fontSize: SIZES.body3,
        color: COLORS.gray[600],
        marginVertical: 2,
    },
    cardExpiry: {
        fontSize: SIZES.body3,
        color: COLORS.gray[600],
    },
    paypalEmail: {
        fontSize: SIZES.body1,
        color: COLORS.black,
        fontWeight: '500',
    },
    defaultPaymentBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    defaultPaymentText: {
        color: COLORS.white,
        fontSize: SIZES.body4,
        fontWeight: '600',
    },
    settingsSection: {
        padding: SIZES.padding,
    },
    settingsGroup: {
        marginBottom: SIZES.padding * 1.5,
    },
    settingsGroupTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: SIZES.base,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    setting3DCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        // High Quality 3D Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    settingIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 2,
    },
    settingDetail: {
        fontSize: 13,
        color: COLORS.gray[500],
        fontWeight: '500',
    },
    settingChevron: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    finoraCardContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    finoraCardGradient: {
        width: '100%',
        height: 220,
        backgroundColor: '#0F2C59', // Deep Blue Base
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        // Card Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    cardDecorCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    chipImage: {
        width: 55,
        height: 40,
        resizeMode: 'contain',
        opacity: 0.9,
    },
    contactlessIcon: {
        position: 'absolute',
        left: 65, // Adjusted for image spacing
        top: 8,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '90deg' }],
    },
    signalLine: {
        position: 'absolute',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        borderTopLeftRadius: 20,
    },
    eyeIconWrapper: {
        // Removed - replaced with closeIconWrapper
    },
    closeIconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Subtle red tint
        borderWidth: 1,
        borderColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,
    },
    eyeIconInner: {
        // Removed
    },
    cardContentArea: {
        flex: 1,
        justifyContent: 'center',
    },
    checkBalanceBtnOverlay: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'center',
    },
    checkBalanceBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardInputsContainer: {
        width: '100%',
    },
    cardNumberInput: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        marginBottom: 15,
        paddingVertical: 5,
        fontFamily: 'monospace'
    },
    cardRowInputs: {
        flexDirection: 'row',
        justifyContent: 'center', // Centered as requested
        alignItems: 'center', // Ensure alignment
        gap: 30, // Spacing between inputs
        marginBottom: 18, // Adjusted as requested
    },
    cardInputWrapper: {
        height: 40,
        justifyContent: 'flex-end',
    },
    cardFloatingInput: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 2,
        fontFamily: 'monospace',
        textAlign: 'left',
        width: '100%',
    },
    balanceDisplay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    cardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 25,
    },
    cardLabelSmall: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginBottom: 2,
    },
    cardHolderName: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    verifyBalanceBtn: {
        marginTop: 0,
        marginBottom: 15,
    },
    addMethodBtn: {
        marginTop: 10,
    },
    logoutButton: {
        width: '94%',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 50, // Extra space for TabBar and safe areas
    },
});

export default ProfileScreen;