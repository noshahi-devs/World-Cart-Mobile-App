import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { rf } from '../utils/responsive';

const { width } = Dimensions.get('window');

const CartToast = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const timerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        show: (msg) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setMessage(msg);
            setVisible(true);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 30, // Slightly lower than wishlist for better visibility if both shown?
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();

            timerRef.current = setTimeout(hide, 3000); // 3 seconds for cart
        }
    }));

    const hide = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setVisible(false));
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.toast}>
                <View style={styles.iconCircle}>
                    <Ionicons name="cart" size={20} color={COLORS.white} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Added to Cart!</Text>
                    <Text style={styles.message} numberOfLines={1}>{message}</Text>
                </View>
                <TouchableOpacity onPress={hide} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10001,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1.5,
        borderColor: COLORS.gray[100],
        ...SHADOWS.medium,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: rf(14),
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    message: {
        fontSize: rf(12),
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    closeButton: {
        padding: 4,
    }
});

export default CartToast;
