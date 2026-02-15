import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { Package3D, Check3D, MapMarker3D } from '../components/ThreeDIcons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderTrackingScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, shippingData, items, total } = route.params || {};

    // Mock Timeline Data - Can be dynamic later
    const timeline = [
        { title: 'Order Placed', time: 'Just Now', status: 'completed', description: 'We have received your order.' },
        { title: 'Order Confirmed', time: 'Expected Soon', status: 'active', description: 'Your order is being verified.' },
        { title: 'Shipped', time: 'Expected Tomorrow', status: 'pending', description: 'Your package will be on the way.' },
        { title: 'Out for Delivery', time: 'In 3-5 Days', status: 'pending', description: 'Local courier will deliver it.' },
        { title: 'Delivered', time: 'In 3-5 Days', status: 'pending', description: 'Package delivered to you.' },
    ];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="Track Order"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Order ID Card */}
                <Animated.View style={[styles.card3D, { opacity: fadeAnim }]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.orderLabel}>Order ID</Text>
                            <Text style={styles.orderValue}>{orderId || '#WC-PENDING'}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Processing</Text>
                        </View>
                    </View>
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                        <Text style={styles.deliveryDate}>3-5 Business Days</Text>
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.supportButton}>
                        <Text style={styles.supportText}>Need Help?</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Timeline */}
                <View style={styles.timelineContainer}>
                    <Text style={styles.sectionTitle}>Order Status</Text>
                    {timeline.map((step, index) => {
                        const isLast = index === timeline.length - 1;
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';

                        return (
                            <View key={index} style={styles.timelineItem}>
                                {/* Left Side: Time */}
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText} numberOfLines={1}>{step.time.split(',')[0].trim()}</Text>
                                    <Text style={styles.dateText}>{step.time.split(',')[1]?.trim()}</Text>
                                </View>

                                {/* Middle: Line & Dot */}
                                <View style={styles.timelineIndicator}>
                                    <View style={[
                                        styles.dot,
                                        (isCompleted || isActive) && styles.activeDot,
                                        isActive && styles.pulsingDot
                                    ]}>
                                        {isCompleted && <View style={styles.innerDot} />}
                                    </View>
                                    {!isLast && (
                                        <View style={[
                                            styles.line,
                                            (isCompleted) && styles.activeLine
                                        ]} />
                                    )}
                                </View>

                                {/* Right Side: Details */}
                                <View style={[styles.stepContent, isLast && { paddingBottom: 0 }]}>
                                    <Text style={[
                                        styles.stepTitle,
                                        (isCompleted || isActive) && styles.activeStepTitle
                                    ]}>{step.title}</Text>
                                    <Text style={styles.stepDesc}>{step.description}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Shipping Details */}
                <Text style={styles.sectionTitle}>Shipping Details</Text>
                <View style={styles.card3D}>
                    <View style={styles.addressRow}>
                        <View style={styles.iconContainer}>
                            <MapMarker3D size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressName}>
                                {shippingData?.firstName} {shippingData?.lastName}
                            </Text>
                            <Text style={styles.addressText}>{shippingData?.address}</Text>
                            <Text style={styles.addressText}>
                                {shippingData?.city}, {shippingData?.state} {shippingData?.postalCode}
                            </Text>
                            <Text style={styles.addressText}>{shippingData?.country}</Text>
                            <Text style={styles.phoneText}>{shippingData?.phone}</Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <Text style={styles.sectionTitle}>Items in Order</Text>
                <View style={[styles.card3D, { paddingBottom: 8 }]}>
                    {items && items.length > 0 ? items.map((item, index) => (
                        <View key={item.id || index} style={[styles.itemRow, { marginBottom: 16 }]}>
                            <Image source={{ uri: item.image }} style={styles.itemImagePlaceholder} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.itemDetail}>
                                    {item.size ? `Size: ${item.size} • ` : ''}
                                    Qty: {item.quantity || 1}
                                </Text>
                                <Text style={styles.itemPrice}>${(item.price || 0).toFixed(2)}</Text>
                            </View>
                            <Text style={styles.itemTotal}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
                        </View>
                    )) : (
                        <Text style={styles.stepDesc}>No items found in this order.</Text>
                    )}

                    {total && (
                        <>
                            <View style={styles.divider} />
                            <View style={[styles.itemRow, { marginTop: 8 }]}>
                                <Text style={[styles.itemTitle, { flex: 1 }]}>Total Amount Paid</Text>
                                <Text style={[styles.itemTotal, { color: COLORS.primary, fontSize: 18 }]}>
                                    ${total.toFixed(2)}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    contentContainer: {
        padding: SIZES.padding,
    },
    card3D: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SIZES.padding,
        marginBottom: 24,
        ...SHADOWS.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 4,
    },
    orderValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    statusBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#2196F3',
        fontWeight: '600',
        fontSize: 12,
    },
    deliveryInfo: {
        marginBottom: 16,
    },
    deliveryLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    deliveryDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginBottom: 12,
    },
    supportButton: {
        alignItems: 'center',
    },
    supportText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 16,
        marginLeft: 4,
    },
    timelineContainer: {
        marginLeft: 4,
        marginBottom: 24,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 80,
    },
    timeContainer: {
        width: 70,
        alignItems: 'flex-end',
        paddingRight: 12,
        paddingTop: 2,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.black,
    },
    dateText: {
        fontSize: 10,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    timelineIndicator: {
        alignItems: 'center',
        width: 20,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.gray[300],
        borderWidth: 2,
        borderColor: COLORS.white,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    pulsingDot: {
        backgroundColor: COLORS.primary, // Add animation here if needed
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    innerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.white,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: COLORS.gray[200],
        marginVertical: -2,
    },
    activeLine: {
        backgroundColor: COLORS.primary,
    },
    stepContent: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 30, // Spacing for next item
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.gray[400],
        marginBottom: 4,
    },
    activeStepTitle: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    stepDesc: {
        fontSize: 13,
        color: COLORS.gray[500],
        lineHeight: 18,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressInfo: {
        flex: 1,
    },
    addressName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 13,
        color: COLORS.gray[600],
        marginBottom: 2,
    },
    phoneText: {
        fontSize: 13,
        color: COLORS.gray[600],
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.gray[300],
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
    },
    itemDetail: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 12,
        color: COLORS.gray[800],
        marginTop: 2,
        fontWeight: '500',
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
    }
});

export default OrderTrackingScreen;
