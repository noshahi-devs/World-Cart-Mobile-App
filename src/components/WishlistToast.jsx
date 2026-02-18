import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { rf } from '../utils/responsive';

const { width } = Dimensions.get('window');

const WishlistToast = forwardRef((props, ref) => {
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
                    toValue: 20,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();

            timerRef.current = setTimeout(hide, 4000);
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
                    <Ionicons name="heart" size={20} color={COLORS.white} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.message}>{message}</Text>
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
        top: 40,
        left: 20,
        right: 20,
        zIndex: 10000,
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
        shadowColor: COLORS.secondary,
        shadowOpacity: 0.15,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontSize: rf(14),
        color: COLORS.black,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    }
});

export default WishlistToast;
