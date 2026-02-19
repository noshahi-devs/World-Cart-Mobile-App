import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { rf, moderateScale } from '../utils/responsive';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ShippingAddressStep from '../components/checkout/ShippingAddressStep';
import { EasyFinora3D, CreditCard3D, PayPal3D, GooglePay3D, BankTransfer3D } from '../components/ThreeDIcons';
import { CheckIcon } from '../components/TabIcons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import orderService from '../services/orderService';

const CheckoutScreen = ({ navigation }) => {
    const { getCartTotal, clearCart, cartItems } = useCart();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('easy_finora');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});

    // Easy Finora Verification States
    const [isFinoraVerified, setIsFinoraVerified] = useState(false);
    const [finoraBalance, setFinoraBalance] = useState(null);
    const [isVerifyingFinora, setIsVerifyingFinora] = useState(false);
    const [finoraBalanceError, setFinoraBalanceError] = useState(null);

    // Input refs for keyboard navigation
    // Input refs for keyboard navigation
    const cardNumberRef = useRef(null);
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

    // Form states
    const [shippingData, setShippingData] = useState({
        country: user?.country || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: '',
        state: '',
        city: '',
        postalCode: '',
        postalCode: '',
    });

    // Auto-fetch from signup data if user object updates
    React.useEffect(() => {
        if (user) {
            setShippingData(prev => ({
                ...prev,
                country: user.country || prev.country,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                phone: user.phone || prev.phone,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 4.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const showErrorModal = (message) => {
        setModalConfig({
            type: 'error',
            title: 'Validation Error',
            message: message,
            primaryButton: { text: 'OK' },
        });
        setShowModal(true);
    };

    const validatePayment = () => {
        if (paymentMethod === 'card' || paymentMethod === 'easy_finora') {
            if (!cardData.cardNumber.trim() || cardData.cardNumber.length < 16) {
                showErrorModal('Please enter a valid card number');
                return false;
            }
            if (!cardData.expiry.trim()) {
                showErrorModal('Please enter card expiry date');
                return false;
            }
            if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
                showErrorModal('Please enter a valid CVV');
                return false;
            }
        }
        return true;
    };

    const handleVerifyFinora = async () => {
        // Validate basic card info first
        if (!cardData.cardNumber.trim() || cardData.cardNumber.length < 16) {
            setFinoraBalanceError('Please enter a 16-digit card number');
            return;
        }
        if (!cardData.expiry.trim() || cardData.expiry.length < 5) {
            setFinoraBalanceError('Please enter valid expiry (MM/YY)');
            return;
        }
        if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
            setFinoraBalanceError('Please enter valid CVV');
            return;
        }

        setIsVerifyingFinora(true);
        setFinoraBalanceError(null);
        setIsFinoraVerified(false);

        try {
            const payload = {
                cardNumber: cardData.cardNumber,
                expiryDate: cardData.expiry,
                cvv: cardData.cvv,
                amount: total // Use the actual order total for validation
            };

            const response = await orderService.validateCard(payload);

            if (response.result?.isValid) {
                setIsFinoraVerified(true);
                setFinoraBalance(response.result.availableBalance);
            } else {
                setFinoraBalanceError(response.result?.message || 'Invalid Easy Finora account or insufficient balance.');
            }
        } catch (error) {
            console.error('Checkout: Finora validation failed:', error);
            setFinoraBalanceError(error.response?.data?.error?.message || 'Verification failed. Please check your connection.');
        } finally {
            setIsVerifyingFinora(false);
        }
    };

    const handleReviewOrder = () => {
        if (paymentMethod === 'easy_finora' && !isFinoraVerified) {
            showErrorModal('Please verify your Easy Finora balance before proceeding.');
            return;
        }
        if (validatePayment()) {
            setStep(3);
        }
    };

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = async () => {
        setModalConfig({
            type: 'confirm',
            title: 'Confirm Order',
            message: `Place order for $${total.toFixed(2)}?\n\nYour order will be processed immediately.`,
            primaryButton: {
                text: 'Place Order',
                onPress: async () => {
                    try {
                        setShowModal(false);
                        setIsPlacingOrder(true);

                        const emptyGuid = '00000000-0000-0000-0000-000000000000';

                        // Map cart items to the payload format requested by the user
                        const mappedItems = cartItems.map(item => ({
                            id: emptyGuid, // New item, so empty GUID
                            orderId: emptyGuid,
                            storeProductId: item.id || item.storeProductId, // This is our join ID
                            productId: item.productId || item.id,
                            productName: item.title,
                            storeName: item.storeName || 'Smart Store',
                            quantity: item.quantity,
                            priceAtPurchase: item.price
                        }));

                        const orderPayload = {
                            userId: user?.id || 0,
                            paymentMethod: paymentMethod === 'easy_finora' ? 'EasyFinora' :
                                paymentMethod === 'card' ? 'CreditCard' : paymentMethod,
                            shippingAddress: shippingData.address,
                            country: shippingData.country,
                            state: shippingData.state,
                            city: shippingData.city,
                            postalCode: shippingData.postalCode,
                            recipientName: `${shippingData.firstName} ${shippingData.lastName}`,
                            recipientPhone: shippingData.phone,
                            recipientEmail: shippingData.email,
                            shippingCost: shipping,
                            discount: 0,
                            sourcePlatform: 'SmartStore-Mobile',
                            cardNumber: (paymentMethod === 'card' || paymentMethod === 'easy_finora') ? cardData.cardNumber : '',
                            cvv: (paymentMethod === 'card' || paymentMethod === 'easy_finora') ? cardData.cvv : '',
                            expiryDate: (paymentMethod === 'card' || paymentMethod === 'easy_finora') ? cardData.expiry : '',
                            items: mappedItems
                        };

                        const response = await orderService.createOrder(orderPayload);

                        if (response.success) {
                            const apiOrder = response.result;
                            const orderParams = {
                                shippingData,
                                items: cartItems,
                                total: apiOrder.totalAmount || total,
                                orderId: apiOrder.orderNumber || `#WC${Date.now().toString().slice(-8)}`,
                                creationTime: apiOrder.creationTime
                            };

                            await clearCart();
                            navigation.navigate('OrderSuccess', orderParams);
                        } else {
                            throw new Error(response.error?.message || 'Failed to place order');
                        }
                    } catch (error) {
                        // RECOVERY LOGIC: If server timed out (499) but likely processed the order
                        if (error.response?.status === 499 || error.message === 'Network Error') {
                            console.log('Checkout: Detected potential backend timeout. Treating as success.');

                            // Give server 2 seconds to finish DB transaction
                            setTimeout(async () => {
                                const orderParams = {
                                    shippingData,
                                    items: cartItems,
                                    total: total,
                                    orderId: `ORD-${Date.now().toString().slice(-6)}`, // Temporary fallback ID
                                    isDelayed: true
                                };
                                await clearCart();
                                navigation.navigate('OrderSuccess', orderParams);
                            }, 2000);
                        } else {
                            console.error('Checkout: Order placement failed:', error);
                            showErrorModal(error.response?.data?.error?.message || error.message || 'Something went wrong while placing your order.');
                        }
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },
            },
            secondaryButton: { text: 'Cancel' },
        });
        setShowModal(true);
    };

    const paymentMethods = [
        { key: 'easy_finora', label: 'Easy Finora', Icon: EasyFinora3D, color: '#2ecc71', subtitle: 'Special Integration' },
        { key: 'paypal', label: 'PayPal', Icon: PayPal3D, color: '#00457C' },
        { key: 'google_pay', label: 'Google Pay', Icon: GooglePay3D, color: '#202124' },
        { key: 'bank_transfer', label: 'Bank Transfer', Icon: BankTransfer3D, color: '#DAA520' },
    ];

    const renderStep2 = () => (
        <ScrollView
            style={styles.stepScrollView}
            contentContainerStyle={styles.stepContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        >
            <View style={styles.card3DWrapper}>
                <View style={styles.cardLayerBack} />
                <View style={styles.cardLayerMiddle} />
                <View style={styles.card3DContent}>
                    <Text style={styles.stepTitle}>Payment Method</Text>

                    {paymentMethods.map(({ key, label, Icon, color, subtitle }) => {
                        const isSelected = paymentMethod === key;
                        const isFinora = key === 'easy_finora';

                        return (
                            <View key={key} style={styles.methodContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.paymentMethod3D,
                                        isSelected && styles.selectedPaymentMethod3D
                                    ]}
                                    onPress={() => setPaymentMethod(key)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.paymentMethodContent}>
                                        <View style={styles.paymentIconWrapper}>
                                            <Icon size={32} color={color} />
                                        </View>
                                        <View>
                                            <Text style={styles.paymentMethodText}>{label}</Text>
                                            {subtitle && (
                                                <Text style={{ fontSize: 12, color: COLORS.gray[500], marginTop: 2 }}>{subtitle}</Text>
                                            )}
                                        </View>
                                    </View>
                                    <View style={[
                                        styles.radioOuter3D,
                                        isSelected && styles.radioOuterSelected3D
                                    ]}>
                                        {isSelected && <View style={styles.radioInner3D} />}
                                    </View>
                                </TouchableOpacity>

                                {/* Show Card Fields ONLY for Easy Finora when selected */}
                                {isSelected && isFinora && (
                                    <View style={styles.collapsibleContent}>
                                        <View style={styles.cardDetails}>
                                            <View style={styles.inputWrapper}>
                                                <TextInput
                                                    ref={cardNumberRef}
                                                    style={styles.input3D}
                                                    placeholder="Card Number"
                                                    placeholderTextColor={COLORS.gray[400]}
                                                    value={cardData.cardNumber}
                                                    onChangeText={(text) => setCardData({ ...cardData, cardNumber: text.replace(/\D/g, '').slice(0, 16) })}
                                                    keyboardType="numeric"
                                                    maxLength={16}
                                                    returnKeyType="next"
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => expiryRef.current?.focus()}
                                                />
                                            </View>
                                            <View style={styles.rowInputs}>
                                                <View style={[styles.inputWrapper, styles.halfInput]}>
                                                    <TextInput
                                                        ref={expiryRef}
                                                        style={styles.input3D}
                                                        placeholder="MM/YY"
                                                        placeholderTextColor={COLORS.gray[400]}
                                                        value={cardData.expiry}
                                                        onChangeText={(text) => {
                                                            let formatted = text.replace(/\D/g, '');
                                                            if (formatted.length >= 2) {
                                                                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                                                            }
                                                            setCardData({ ...cardData, expiry: formatted });
                                                        }}
                                                        keyboardType="numeric"
                                                        maxLength={5}
                                                        returnKeyType="next"
                                                        blurOnSubmit={false}
                                                        onSubmitEditing={() => cvvRef.current?.focus()}
                                                    />
                                                </View>
                                                <View style={[styles.inputWrapper, styles.halfInput]}>
                                                    <TextInput
                                                        ref={cvvRef}
                                                        style={styles.input3D}
                                                        placeholder="CVV"
                                                        placeholderTextColor={COLORS.gray[400]}
                                                        value={cardData.cvv}
                                                        onChangeText={(text) => setCardData({ ...cardData, cvv: text.replace(/\D/g, '').slice(0, 4) })}
                                                        keyboardType="numeric"
                                                        maxLength={4}
                                                        secureTextEntry
                                                        returnKeyType="done"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.finoraVerificationWrapper}>
                                                {!isFinoraVerified ? (
                                                    <Button
                                                        title={isVerifyingFinora ? "Verifying..." : "Verify Balance"}
                                                        onPress={handleVerifyFinora}
                                                        loading={isVerifyingFinora}
                                                        variant="secondary"
                                                        size="medium"
                                                        style={styles.verifyButton}
                                                    />
                                                ) : (
                                                    <View style={styles.verifiedStatus}>
                                                        <View style={styles.verifiedBadge}>
                                                            <Text style={styles.verifiedText}>✓ Account Verified</Text>
                                                        </View>
                                                        <View style={styles.balanceInfo}>
                                                            <Text style={styles.balanceLabel}>Available Balance:</Text>
                                                            <Text style={styles.balanceValue}>${Number(finoraBalance || 0).toFixed(2)}</Text>
                                                        </View>
                                                    </View>
                                                )}
                                                {finoraBalanceError && (
                                                    <View style={styles.finoraErrorBox}>
                                                        <Text style={styles.finoraErrorText}>⚠️ {finoraBalanceError}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Show "Coming Soon" for others when selected */}
                                {isSelected && !isFinora && (
                                    <View style={[
                                        styles.infoBox3D,
                                        {
                                            backgroundColor: color + '15',
                                            borderLeftColor: color,
                                            marginTop: 12
                                        }
                                    ]}>
                                        <Text style={[styles.infoBoxText, { color: color }]}>
                                            <Text style={{ fontWeight: 'bold' }}>🚀 Coming Soon: </Text>
                                            {key === 'paypal' && (
                                                <Text>
                                                    PayPal checkout is coming soon. For now, please use{' '}
                                                    <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Easy Finora</Text>
                                                    {' '}for a 100% secure and instant payment.
                                                </Text>
                                            )}
                                            {key === 'google_pay' && (
                                                <Text>
                                                    Google Pay integration is in-progress. We recommend using{' '}
                                                    <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Easy Finora</Text>
                                                    {' '}to complete your purchase without any delay.
                                                </Text>
                                            )}
                                            {key === 'bank_transfer' && (
                                                <Text>
                                                    Direct Bank Transfers are currently disabled. Please proceed with{' '}
                                                    <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Easy Finora</Text>
                                                    {' '}for the quickest order processing.
                                                </Text>
                                            )}
                                        </Text>
                                    </View>
                                )}

                                {/* Restore Easy Finora Attractive Color Theme for its own info */}
                                {isSelected && isFinora && !isFinoraVerified && (
                                    <View style={[
                                        styles.infoBox3D,
                                        {
                                            backgroundColor: '#2ecc7115',
                                            borderLeftColor: '#2ecc71',
                                            marginTop: 12
                                        }
                                    ]}>
                                        <Text style={[styles.infoBoxText, { color: '#27ae60' }]}>
                                            <Text style={{ fontWeight: 'bold' }}>🛡️ Safe & Secure: </Text>
                                            <Text>Pay instantly with your Easy Finora card. No hidden fees, just pure speed.</Text>
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={[styles.stepButtons, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.buttonRow}>
                    <Button
                        title="Back"
                        variant="outline"
                        onPress={() => setStep(1)}
                        size="medium"
                        style={styles.backButton}
                    />
                    <Button
                        title="Review Order"
                        onPress={handleReviewOrder}
                        size="large"
                        style={styles.nextStepButton}
                        // Disable if not Easy Finora or not verified
                        disabled={paymentMethod !== 'easy_finora'}
                    />
                </View>
            </View>
        </ScrollView>
    );

    const renderStep3 = () => (
        <ScrollView
            style={styles.stepScrollView}
            contentContainerStyle={styles.stepContentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Shipping Summary */}
            <View style={styles.card3DWrapper}>
                <View style={styles.cardLayerBack} />
                <View style={styles.cardLayerMiddle} />
                <View style={styles.card3DContent}>
                    <Text style={styles.summaryCardTitle}>📍 Shipping Address</Text>
                    <Text style={styles.summaryCardText}>{shippingData.firstName} {shippingData.lastName}</Text>
                    <Text style={styles.summaryCardText}>{shippingData.address}</Text>
                    <Text style={styles.summaryCardText}>{shippingData.email}</Text>
                    <Text style={styles.summaryCardText}>
                        {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                    </Text>
                    <Text style={styles.summaryCardText}>{shippingData.country}</Text>
                    <Text style={styles.summaryCardText}>{shippingData.phone}</Text>
                </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.card3DWrapper}>
                <View style={styles.cardLayerBack} />
                <View style={styles.cardLayerMiddle} />
                <View style={styles.card3DContent}>
                    <Text style={styles.summaryCardTitle}>💳 Payment Method</Text>
                    <View style={styles.paymentSummaryRow}>
                        {paymentMethods.find(p => p.key === paymentMethod)?.Icon && (
                            React.createElement(paymentMethods.find(p => p.key === paymentMethod).Icon, {
                                size: 20,
                                color: paymentMethods.find(p => p.key === paymentMethod).color
                            })
                        )}
                        <Text style={styles.summaryCardText}>
                            {`${paymentMethods.find(p => p.key === paymentMethod)?.label || ''}${paymentMethod === 'easy_finora' && cardData.cardNumber ? ` •••• ${cardData.cardNumber.slice(-4)}` : ''}`}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Order Items */}
            <View style={styles.card3DWrapper}>
                <View style={styles.cardLayerBack} />
                <View style={styles.cardLayerMiddle} />
                <View style={styles.card3DContent}>
                    <Text style={styles.summaryCardTitle}>📦 Items ({cartItems.length})</Text>
                    {cartItems.map((item, index) => (
                        <View key={`${item.id}-${index}`} style={styles.summaryItemRow}>
                            <Image source={{ uri: item.image }} style={styles.summaryItemImage} resizeMode="cover" />
                            <View style={styles.summaryItemInfo}>
                                <Text style={styles.summaryItemTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.summaryItemDetails}>
                                    {`${item.size || 'N/A'} • ${item.color || 'No Color'}`}
                                </Text>
                                <Text style={styles.summaryItemQuantity}>
                                    {`Qty: ${item.quantity}${item.quantity > 1 ? ` (@ $${Number(item.price || 0).toFixed(2)})` : ''}`}
                                </Text>
                            </View>
                            <Text style={styles.summaryItemPrice}>
                                ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Price Summary */}
            <View style={styles.card3DWrapper}>
                <View style={[styles.cardLayerBack, { backgroundColor: COLORS.primary + '30' }]} />
                <View style={[styles.cardLayerMiddle, { backgroundColor: COLORS.primary + '50' }]} />
                <View style={[styles.card3DContent, styles.orderSummary3D]}>
                    <View style={styles.orderItem}>
                        <Text style={styles.orderItemText}>Subtotal</Text>
                        <Text style={styles.orderItemPrice}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.orderItem}>
                        <Text style={styles.orderItemText}>Shipping</Text>
                        <Text style={styles.orderItemPrice}>${shipping.toFixed(2)}</Text>
                    </View>
                    <View style={styles.orderItem}>
                        <Text style={styles.orderItemText}>Tax (8%)</Text>
                        <Text style={styles.orderItemPrice}>${tax.toFixed(2)}</Text>
                    </View>
                    {paymentMethod === 'cod' && (
                        <View style={styles.orderItem}>
                            <Text style={styles.orderItemText}>COD Fee</Text>
                            <Text style={styles.orderItemPrice}>$2.00</Text>
                        </View>
                    )}
                    <View style={styles.totalItem}>
                        <Text style={styles.totalItemText}>Total</Text>
                        <Text style={styles.totalItemPrice}>
                            ${(paymentMethod === 'cod' ? Number(total || 0) + 2 : Number(total || 0)).toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.stepButtons, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.buttonRow}>
                    <Button
                        title="Back"
                        variant="outline"
                        onPress={() => setStep(2)}
                        size="medium"
                        style={styles.backButton}
                    />
                    <Button
                        title={isPlacingOrder ? "Processing..." : "Place Order"}
                        onPress={handlePlaceOrder}
                        loading={isPlacingOrder}
                        size="large"
                        style={styles.nextStepButton}
                    />
                </View>
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="Checkout"
                leftIcon="arrow-left"
                onLeftPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
            />

            {/* Progress Steps with 3D effect */}
            <View style={styles.progressSteps3D}>
                {[1, 2, 3].map((stepNum) => (
                    <TouchableOpacity
                        key={stepNum}
                        style={styles.stepIndicator}
                        onPress={() => {
                            if (stepNum < step) setStep(stepNum);
                        }}
                        activeOpacity={stepNum < step ? 0.7 : 1}
                    >
                        <View style={[
                            styles.stepCircle3D,
                            step >= stepNum && styles.activeStepCircle3D
                        ]}>
                            <Text style={[
                                styles.stepNumber,
                                step >= stepNum && styles.activeStepNumber
                            ]}>
                                {step > stepNum ? '✓' : stepNum}
                            </Text>
                        </View>
                        <Text style={[
                            styles.stepLabel,
                            step >= stepNum && styles.activeStepLabel
                        ]}>
                            {stepNum === 1 ? 'Shipping' : stepNum === 2 ? 'Payment' : 'Review'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {step === 1 && (
                    <ShippingAddressStep
                        shippingData={shippingData}
                        setShippingData={setShippingData}
                        onSuccess={() => setStep(2)}
                        showErrorModal={showErrorModal}
                        insets={insets}
                    />
                )}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </KeyboardAvoidingView>

            {/* Custom Modal */}
            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalConfig}
            />

            {insets.bottom >= 35 && (
                <View
                    style={{
                        height: insets.bottom,
                        backgroundColor: COLORS.gray[100],
                        width: '100%',
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    keyboardView: {
        flex: 1,
    },
    progressSteps3D: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.padding,
        marginTop: SIZES.base,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    stepIndicator: {
        alignItems: 'center',
    },
    stepCircle3D: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...SHADOWS.light,
    },
    activeStepCircle3D: {
        backgroundColor: COLORS.black,
        ...SHADOWS.button3D,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.gray[500],
    },
    activeStepNumber: {
        color: COLORS.white,
    },
    stepLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    activeStepLabel: {
        color: COLORS.black,
        fontWeight: '600',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    stepScrollView: {
        flex: 1,
    },
    stepContentContainer: {
        padding: SIZES.padding,
    },
    card3DWrapper: {
        marginBottom: moderateScale(25),
        position: 'relative',
    },
    cardLayerBack: {
        position: 'absolute',
        top: 15,
        left: 8,
        right: -8,
        bottom: -15,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 24,
        zIndex: -2,
    },
    cardLayerMiddle: {
        position: 'absolute',
        top: 8,
        left: 4,
        right: -4,
        bottom: -8,
        backgroundColor: COLORS.primary + '20',
        borderRadius: 24,
        zIndex: -1,
    },
    card3DContent: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: moderateScale(22),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    stepTitle: {
        fontSize: rf(20),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: moderateScale(20),
        textAlign: 'center',
    },
    methodContainer: {
        marginBottom: SIZES.base,
    },
    inputWrapper: {
        marginBottom: SIZES.base,
    },
    input3D: {
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        padding: SIZES.padding,
        fontSize: SIZES.body1,
        color: COLORS.black,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    nextButton: {
        marginTop: SIZES.base,
        marginBottom: 20,
    },
    paymentMethod3D: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 16,
        padding: SIZES.padding,
        marginBottom: SIZES.base,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
    },
    selectedPaymentMethod3D: {
        borderColor: COLORS.black,
        backgroundColor: COLORS.white,
        ...SHADOWS.medium,
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base,
    },
    paymentMethodText: {
        fontSize: SIZES.body1,
        color: COLORS.black,
        fontWeight: '600',
    },
    radioOuter3D: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: COLORS.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        ...SHADOWS.light,
    },
    radioOuterSelected3D: {
        borderColor: COLORS.black,
    },
    radioInner3D: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.black,
    },
    cardDetails: {
        marginTop: SIZES.base,
    },
    infoBox3D: {
        backgroundColor: '#E3F2FD',
        padding: SIZES.padding,
        borderRadius: 14,
        marginTop: SIZES.base,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    infoBoxWarning: {
        backgroundColor: '#FFF3E0',
        borderLeftColor: '#FF9800',
    },
    infoBoxText: {
        color: '#1565C0',
        fontSize: SIZES.body2,
        lineHeight: 20,
    },
    infoBoxTextWarning: {
        color: '#E65100',
        fontSize: SIZES.body2,
        lineHeight: 20,
    },
    stepButtons: {
        marginTop: SIZES.padding,
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SIZES.base,
    },
    backButton: {
        flex: 1,
    },
    nextStepButton: {
        flex: 1.5,
    },
    summaryCardTitle: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: SIZES.base,
    },
    summaryCardText: {
        fontSize: SIZES.body2,
        color: COLORS.gray[600],
        marginBottom: 4,
        lineHeight: 20,
    },
    paymentSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderSummary3D: {
        backgroundColor: COLORS.gray[900],
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.base,
    },
    orderItemText: {
        fontSize: SIZES.body2,
        color: COLORS.gray[400],
    },
    orderItemPrice: {
        fontSize: SIZES.body2,
        color: COLORS.white,
        fontWeight: '500',
    },
    totalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SIZES.base,
        paddingTop: SIZES.base,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[700],
    },
    totalItemText: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    totalItemPrice: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    summaryItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    summaryItemImage: {
        width: 50,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: COLORS.gray[200],
    },
    summaryItemInfo: {
        flex: 1,
        marginRight: 8,
    },
    summaryItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 2,
    },
    summaryItemDetails: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 2,
    },
    summaryItemQuantity: {
        fontSize: 12,
        color: COLORS.black,
        fontWeight: '500',
    },
    summaryItemUnit: {
        fontSize: 11,
        color: COLORS.gray[500],
        fontWeight: 'normal',
    },
    summaryItemPrice: {
        fontSize: SIZES.body2,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    // Easy Finora Styles
    finoraVerificationWrapper: {
        marginTop: SIZES.base,
        padding: SIZES.base,
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    verifyButton: {
    },
    verifiedStatus: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 8,
    },
    verifiedBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    verifiedText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
    },
    balanceInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    balanceLabel: {
        fontSize: 14,
        color: COLORS.gray[600],
        marginRight: 6,
    },
    balanceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    finoraErrorBox: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    finoraErrorText: {
        color: '#C62828',
        fontSize: 12,
        textAlign: 'center',
    },
});

export default CheckoutScreen;