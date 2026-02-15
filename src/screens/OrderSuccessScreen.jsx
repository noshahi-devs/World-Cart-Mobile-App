import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { rf, moderateScale } from '../utils/responsive';
import { ShieldCheck3D } from '../components/ThreeDIcons';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { COLORS, SIZES } from '../constants/theme';

const OrderSuccessScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { orderId, shippingData, items, total } = route.params || {};

    const displayOrderId = orderId || `#WC${Date.now().toString().slice(-8)}`;


    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        // Entrance animation sequence
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 80,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous pulse animation for the success circle
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleTrackOrder = () => {
        navigation.navigate('OrderTracking', {
            orderId: displayOrderId,
            shippingData,
            items,
            total
        });
    };

    const handleContinueShopping = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    return (
        <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
            {/* Background decoration */}
            <View style={styles.backgroundDecor}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Content Card with Icon inside */}
                <View style={styles.contentCardWrapper}>
                    <View style={styles.cardLayerBack} />
                    <View style={styles.cardLayerMiddle} />

                    <Animated.View
                        style={[
                            styles.contentCard,
                            {
                                opacity: opacityAnim,
                                transform: [{ scale: scaleAnim }],
                            }
                        ]}
                    >
                        {/* Success Icon inside card */}
                        <Animated.View
                            style={[
                                styles.successCircleWrapper,
                                {
                                    transform: [{ scale: pulseAnim }],
                                }
                            ]}
                        >
                            <ShieldCheck3D size={120} />
                        </Animated.View>

                        <Text style={styles.successTitle}>Order Placed!</Text>
                        <Text style={styles.successSubtitle}>Successfully</Text>
                        <Text style={styles.successMessage}>
                            Thank you for shopping with us! Your order has been confirmed and will be shipped soon.
                        </Text>

                        <View style={styles.orderIdContainer}>
                            <Text style={styles.orderIdLabel}>Order ID</Text>
                            <Text style={styles.orderId}>{displayOrderId}</Text>
                        </View>

                        <View style={styles.estimatedDelivery}>
                            <Text style={styles.deliveryLabel}>📦 Estimated Delivery</Text>
                            <Text style={styles.deliveryDate}>3-5 Business Days</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* Buttons */}
                <Animated.View
                    style={[
                        styles.buttonsContainer,
                        {
                            opacity: opacityAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Button
                        title="Track Order"
                        onPress={handleTrackOrder}
                        variant="primary"
                        size="large"
                        style={styles.trackButton}
                    />
                    <Button
                        title="Continue Shopping"
                        onPress={handleContinueShopping}
                        variant="outline"
                        size="large"
                        style={styles.continueButton}
                    />
                </Animated.View>
            </ScrollView>

            {/* Custom Modal for Track Order */}
            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                type="info"
                title="Order Tracking"
                message={`Your order ${displayOrderId} is being processed.\n\n📍 Status: Processing\n📦 Estimated: 3-5 business days\n📧 Tracking updates via email`}
                primaryButton={{
                    text: 'Got It',
                    onPress: () => { },
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    backgroundDecor: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(76, 175, 80, 0.08)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding * 1.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding * 1.5,
        paddingVertical: 30,
    },
    successCircleWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },
    successCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        // Clean spread shadow
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
    },
    contentCardWrapper: {
        position: 'relative',
        marginBottom: moderateScale(25),
        width: '100%',
    },
    cardLayerBack: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: -10,
        bottom: -20,
        backgroundColor: '#4CAF50' + '10',
        borderRadius: 24,
        zIndex: -2,
    },
    cardLayerMiddle: {
        position: 'absolute',
        top: 10,
        left: 5,
        right: -5,
        bottom: -10,
        backgroundColor: '#4CAF50' + '20',
        borderRadius: 24,
        zIndex: -1,
    },
    contentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: moderateScale(24),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    successTitle: {
        fontSize: rf(28),
        fontWeight: '900',
        color: COLORS.black,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: rf(28),
        fontWeight: '900',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 16,
    },
    successMessage: {
        fontSize: 15,
        color: COLORS.gray[600],
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    orderIdContainer: {
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        padding: SIZES.padding,
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        borderStyle: 'dashed',
    },
    orderIdLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 4,
    },
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        letterSpacing: 1,
    },
    estimatedDelivery: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: SIZES.padding,
    },
    deliveryLabel: {
        fontSize: 14,
        color: COLORS.gray[700],
    },
    deliveryDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    trackButton: {
        width: '100%',
    },
    continueButton: {
        width: '100%',
    },
});

export default OrderSuccessScreen;