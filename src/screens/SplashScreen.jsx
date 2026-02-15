import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, StatusBar, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;

    // Background Pulse Values - Syncing with breathing
    const pulse1 = useRef(new Animated.Value(0)).current;
    const pulse2 = useRef(new Animated.Value(0)).current;

    // Text Reveal Values
    const textY = useRef(new Animated.Value(20)).current;
    const greetingFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Initial Reveal & Staggered Content Entry
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 15,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(textY, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                })
            ]),
            Animated.timing(greetingFade, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();

        // 2. Master Sync: Breathing + Pulse Waves (4000ms Total Cycle)
        const breatheIn = () => {
            pulse1.setValue(0);
            Animated.timing(pulse1, {
                toValue: 1,
                duration: 2500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start();

            Animated.timing(breatheAnim, {
                toValue: 1.15,
                duration: 2000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }).start(() => breatheOut());
        };

        const breatheOut = () => {
            pulse2.setValue(0);
            Animated.timing(pulse2, {
                toValue: 1,
                duration: 2500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start();

            Animated.timing(breatheAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }).start(() => breatheIn());
        };

        breatheIn();

        // 3. Progress Bar Fill
        Animated.timing(progressWidth, {
            toValue: 1,
            duration: 3800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
        }).start();

        // 4. Exit Logic
        const exitTimer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }).start(() => {
                if (onFinish) onFinish();
            });
        }, 4500);

        return () => clearTimeout(exitTimer);
    }, []);

    // Interpolations for Pulse Waves
    const pulseScale1 = pulse1.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.5]
    });
    const pulseOpacity1 = pulse1.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 0.2, 0]
    });

    const pulseScale2 = pulse2.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.5]
    });
    const pulseOpacity2 = pulse2.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 0.2, 0]
    });

    const progressBar = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <View style={styles.pulseContainer}>
                <Animated.View style={[styles.pulse, { transform: [{ scale: pulseScale1 }], opacity: pulseOpacity1 }]} />
                <Animated.View style={[styles.pulse, { transform: [{ scale: pulseScale2 }], opacity: pulseOpacity2 }]} />
            </View>

            <Animated.View style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                <Animated.View style={[
                    styles.logoWrapper,
                    { transform: [{ scale: breatheAnim }] }
                ]}>
                    <View style={styles.logoCard}>
                        <Image
                            source={require('../assets/Main-World-Cart.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: textY }] }}>
                    <Text style={styles.appName}>WORLD-CART</Text>
                    <View style={styles.accentLine} />
                </Animated.View>

                <Animated.View style={[styles.greetingWrapper, { opacity: greetingFade }]}>
                    <Text style={styles.greeting}>Elevating Your Style</Text>
                    <Text style={styles.subGreeting}>A global marketplace at your fingertips</Text>
                </Animated.View>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.loaderTrack}>
                    <Animated.View style={[styles.loaderFill, { width: progressBar }]} />
                </View>
                <Text style={styles.loadingText}>Initializing Experience...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulse: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#000000',
        position: 'absolute',
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    logoWrapper: {
        marginBottom: 30,
    },
    logoCard: {
        width: 160,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 45,
        padding: 5,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: '90%',
        height: '90%',
    },
    appName: {
        fontSize: width * 0.1, // Responsive font size
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 4,
        textAlign: 'center',
    },
    accentLine: {
        width: 60,
        height: 4,
        backgroundColor: '#000000',
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 2,
    },
    greetingWrapper: {
        marginTop: 25,
        alignItems: 'center',
    },
    greeting: {
        fontSize: Math.min(width * 0.05, 20),
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    subGreeting: {
        fontSize: Math.min(width * 0.035, 15),
        color: '#888',
        fontWeight: '400',
        letterSpacing: 0.5,
    },
    footer: {
        position: 'absolute',
        bottom: 70,
        width: '100%',
        paddingHorizontal: 50,
        alignItems: 'center',
    },
    loaderTrack: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 1,
        overflow: 'hidden',
        marginBottom: 15,
    },
    loaderFill: {
        height: '100%',
        backgroundColor: '#000000',
    },
    loadingText: {
        fontSize: 12,
        color: '#AAA',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 2,
    }
});

export default SplashScreen;
