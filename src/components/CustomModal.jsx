import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { Check3D, Close3D, ShieldCheck3D } from './ThreeDIcons';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const CustomModal = ({
    visible,
    onClose,
    title,
    message,
    type = 'info', // 'success', 'warning', 'error', 'info', 'confirm'
    primaryButton,
    secondaryButton,
    icon,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const iconScaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Icon Pulse Animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(iconScaleAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(iconScaleAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            slideAnim.setValue(50);
            iconScaleAnim.setValue(1);
        }
    }, [visible]);

    const getTypeColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'warning': return '#FF9800';
            case 'error': return '#F44336';
            case 'confirm': return COLORS.primary;
            default: return COLORS.primary;
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'success': return <ShieldCheck3D size={42} />;
            case 'confirm': return <ShieldCheck3D size={42} />;
            case 'warning': return <Close3D size={40} color="#fff" />; // Or a warning icon
            case 'error': return <Close3D size={40} color="#fff" />;
            default: return <ShieldCheck3D size={42} />;
        }
    };

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />

                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    opacity: opacityAnim,
                                    transform: [
                                        { scale: scaleAnim },
                                        { translateY: slideAnim },
                                    ],
                                },
                            ]}
                        >
                            {/* 3D Card Effect */}
                            <View style={styles.modal3DWrapper}>
                                <View style={styles.modal3DBack} />
                                <View style={styles.modal3DMiddle} />
                                <View style={styles.modalContent}>
                                    {/* Icon Circle */}
                                    {(type !== 'info' || icon) && (
                                        <Animated.View
                                            style={[
                                                styles.iconCircleWrapper,
                                                {
                                                    shadowColor: getTypeColor(),
                                                    transform: [{ scale: iconScaleAnim }]
                                                }
                                            ]}
                                        >
                                            <View style={[styles.iconCircle, { backgroundColor: getTypeColor() }]}>
                                                {icon || getTypeIcon()}
                                            </View>
                                        </Animated.View>
                                    )}

                                    {/* Title */}
                                    <Text style={styles.title}>{title}</Text>

                                    {/* Message */}
                                    <Text style={styles.message}>{message}</Text>

                                    {/* Buttons */}
                                    <View style={styles.buttonContainer}>
                                        {secondaryButton && (
                                            <TouchableOpacity
                                                style={styles.secondaryButton}
                                                onPress={() => {
                                                    secondaryButton.onPress?.();
                                                    handleClose();
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={styles.secondaryButtonText}
                                                    numberOfLines={1}
                                                    adjustsFontSizeToFit
                                                >
                                                    {secondaryButton.text}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {primaryButton && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.primaryButton,
                                                    { backgroundColor: getTypeColor() },
                                                ]}
                                                onPress={() => {
                                                    primaryButton.onPress?.();
                                                    handleClose();
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={styles.primaryButtonText}
                                                    numberOfLines={1}
                                                    adjustsFontSizeToFit
                                                >
                                                    {primaryButton.text}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        width: width * 0.9,
        maxWidth: 400,
    },
    modal3DWrapper: {
        position: 'relative',
        paddingTop: 40, // Space for the floating icon
    },
    modal3DBack: {
        borderRadius: 26,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingBottom: 28,
        paddingTop: 50, // Increased top padding to accommodate the floating icon
        alignItems: 'center',
        // Strong 3D Shadow
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 15 },
                shadowOpacity: 0.3,
                shadowRadius: 25,
            },
            android: {
                elevation: 20,
            },
            web: {
                boxShadow: '0px 15px 25px rgba(0,0,0,0.3)',
            },
        }),
    },
    iconCircleWrapper: {
        position: 'absolute',
        top: -42, // Relative to modalContent due to paddingTop on wrapper
        alignSelf: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        padding: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 12,
            },
            web: {
                boxShadow: '0px 10px 15px rgba(0,0,0,0.3)',
            },
        }),
        zIndex: 10,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    // ... (other styles remain)
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginTop: 12,
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        // Stronger 3D spread shadow for Right Button
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px 5px 12px rgba(0,0,0,0.35)',
            },
        }),
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.gray[100],
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0px 5px 10px rgba(0,0,0,0.15)',
            },
        }),
    },
    secondaryButtonText: {
        color: COLORS.gray[700],
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomModal;
