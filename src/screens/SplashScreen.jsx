import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
    StatusBar,
    Easing,
} from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const cartBounce = useRef(new Animated.Value(0)).current;

    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // ===== LOGO ENTRANCE =====
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // ===== FLOATING EFFECT =====
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // ===== CART BOUNCE =====
        Animated.loop(
            Animated.sequence([
                Animated.spring(cartBounce, {
                    toValue: -8,
                    friction: 4,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.spring(cartBounce, {
                    toValue: 0,
                    friction: 4,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // ===== PROGRESS =====
        progressAnim.addListener(({ value }) => {
            setPercentage(Math.floor(value * 100));
        });

        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();

        // ===== EXIT =====
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start(() => onFinish && onFinish());
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* SVG BACKGROUND GRADIENT */}
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <SvgGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0" stopColor="#0F0F1A" />
                        <Stop offset="0.5" stopColor="#1A1A2E" />
                        <Stop offset="1" stopColor="#16213E" />
                    </SvgGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>

            {/* LOGO */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: floatAnim },
                        ],
                    },
                ]}
            >
                <View style={styles.logoGlow} />

                <Image
                    source={require('../assets/icons/World-Cart.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* BRAND TEXT */}
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.brand}>WORLD-CART</Text>
                <Text style={styles.tagline}>Your Global Marketplace</Text>
            </Animated.View>

            {/* CART ICON */}
            <Animated.Text
                style={[
                    styles.cart,
                    { transform: [{ translateY: cartBounce }] },
                ]}
            >
                🛒
            </Animated.Text>

            {/* PROGRESS BAR */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[styles.progressFill, { width: progressWidth }]}
                    />
                </View>

                <Text style={styles.percent}>{percentage}%</Text>
                <Text style={styles.loadingText}>
                    PREPARING YOUR EXPERIENCE
                </Text>
            </View>

            <Text style={styles.copyright}>
                © 2026 WORLD-CART
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoContainer: {
        width: width * 0.6,
        height: width * 0.6,
        backgroundColor: '#FFFFFF',
        borderRadius: (width * 0.6) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
        // Premium Shadow
        elevation: 25,
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },

    logoGlow: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: width,
        backgroundColor: '#6C5CE7',
        opacity: 0.2,
        zIndex: -1,
    },

    logo: {
        width: '100%',
        height: '100%',
    },

    brand: {
        fontSize: width * 0.09,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 4,
        textAlign: 'center',
    },

    tagline: {
        fontSize: width * 0.04,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginTop: 5,
        letterSpacing: 1,
    },

    cart: {
        position: 'absolute',
        bottom: height * 0.25,
        fontSize: 28,
    },

    progressContainer: {
        position: 'absolute',
        bottom: 70,
        width: '80%',
        alignItems: 'center',
    },

    progressTrack: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6C5CE7',
    },

    percent: {
        marginTop: 8,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    loadingText: {
        marginTop: 5,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 2,
    },

    copyright: {
        position: 'absolute',
        bottom: 20,
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
    },
});

export default SplashScreen;