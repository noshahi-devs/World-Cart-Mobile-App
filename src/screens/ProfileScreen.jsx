
import React, { useState, useEffect, useRef } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PayPalIcon } from '../components/TabIcons';
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
import { profileData, orders, addresses, paymentMethods } from '../constants/data.jsx';
import { COLORS, SIZES } from '../constants/theme';
import { moderateScale, rf, verticalScale } from '../utils/responsive';
import { CreditCardIcon } from '../components/TabIcons';
import { useWishlist } from '../context/WishlistContext';

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

    const renderOrders = () => (
        <View style={styles.sectionContent}>
            {orders.map((order) => (
                <View key={order.id} style={styles.orderCardWrapper}>
                    <View style={styles.orderLayerBack} />
                    <View style={styles.orderLayerMiddle} />
                    <TouchableOpacity style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderId}>Order #{order.id}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                        </View>
                        <View style={styles.orderDetails}>
                            <Text style={styles.orderItems}>{order.items} items</Text>
                            <Text style={styles.orderTotal}>${Number(order.total || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.orderFooter}>
                            <View style={[
                                styles.orderStatus,
                                order.status === 'Delivered' && styles.statusDelivered,
                                order.status === 'Shipped' && styles.statusShipped,
                                order.status === 'Processing' && styles.statusProcessing
                            ]}>
                                <Text style={styles.orderStatusText}>{order.status}</Text>
                            </View>
                            {order.tracking && (
                                <TouchableOpacity
                                    style={styles.trackButton}
                                    onPress={() => navigation.navigate('OrderTracking', { orderId: `#WC${order.id}` })}
                                >
                                    <Text style={styles.trackButtonText}>Track</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

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

    const renderPayments = () => (
        <View style={styles.sectionContent}>
            {paymentMethods.map((method) => (
                <View key={method.id} style={styles.paymentCard}>
                    <View style={styles.paymentHeader}>
                        {method.type === 'card' ? (
                            <CreditCardIcon size={24} color={COLORS.gray[800]} />
                        ) : (
                            <PayPalIcon size={24} color="#0070BA" />
                        )}
                        <View style={styles.paymentInfo}>
                            {method.type === 'card' ? (
                                <>
                                    <Text style={styles.cardBrand}>{method.brand}</Text>
                                    <Text style={styles.cardNumber}>•••• {method.last4}</Text>
                                    <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
                                </>
                            ) : (
                                <Text style={styles.paypalEmail}>{method.email}</Text>
                            )}
                        </View>
                    </View>
                    {method.isDefault && (
                        <View style={styles.defaultPaymentBadge}>
                            <Text style={styles.defaultPaymentText}>Default</Text>
                        </View>
                    )}
                </View>
            ))}
            <Button
                title="Add Payment Method"
                variant="outline"
                icon="plus"
                style={styles.addButton}
            />
        </View>
    );

    const profileNavItems = [
        { id: 'orders', label: 'My Orders', IconComponent: Package3D },
        { id: 'wishlist', label: 'My Wishlist', IconComponent: Heart3D },
        { id: 'address', label: 'Address', IconComponent: MapMarker3D },
        { id: 'payments', label: 'Payments', IconComponent: CreditCard3D }
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
                    {profileNavItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.profileNavItem,
                                activeSection === item.id && styles.activeProfileNavItem
                            ]}
                            onPress={() => setActiveSection(item.id)}
                        >
                            <item.IconComponent
                                size={20}
                                color={activeSection === item.id ? COLORS.primary : COLORS.gray[600]}
                            />
                            <Text style={[
                                styles.profileNavText,
                                activeSection === item.id && styles.activeProfileNavText
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content Section */}
                {activeSection === 'orders' && renderOrders()}
                {activeSection === 'wishlist' && renderWishlist()}
                {activeSection === 'address' && renderAddresses()}
                {activeSection === 'payments' && renderPayments()}

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
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.base,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    profileNavItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SIZES.base,
        borderRadius: 8,
    },
    activeProfileNavItem: {
        backgroundColor: COLORS.gray[100],
    },
    profileNavText: {
        fontSize: SIZES.body3,
        color: COLORS.gray[600],
        marginTop: 4,
    },
    activeProfileNavText: {
        color: COLORS.primary,
        fontWeight: '600',
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
    orderStatusText: {
        fontSize: SIZES.body3,
        fontWeight: '600',
        color: COLORS.gray[800],
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
    logoutButton: {
        width: '94%',
        alignSelf: 'center',
    },
});

export default ProfileScreen;