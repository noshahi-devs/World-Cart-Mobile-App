import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
    SafeAreaView,
    Linking,
    ScrollView,
    Platform,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { rf, moderateScale } from '../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomModal from '../components/CustomModal';

const GoogleColors = {
    red: '#EA4335',
    blue: '#4285F4',
    yellow: '#FBBC05',
    green: '#34A853'
};

const VerificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params || {};

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const [showResendModal, setShowResendModal] = React.useState(false);
    const [showGmailErrorModal, setShowGmailErrorModal] = React.useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
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
                    }),
                ])
            )
        ]).start();
    }, []);

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const handleOpenGmail = async () => {
        const schemes = Platform.select({
            android: [
                'googlegmail://',
                'intent://#Intent;scheme=googlegmail;package=com.google.android.gm;end'
            ],
            ios: [
                'googlegmail://',
                'message://'
            ],
            default: ['mailto:']
        });

        const tryOpening = async (url) => {
            try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                    return true;
                }
            } catch (e) {
                return false;
            }
            return false;
        };

        let opened = false;
        for (const url of schemes) {
            if (await tryOpening(url)) {
                opened = true;
                break;
            }
        }

        if (!opened) {
            // Fallback to web if app fails
            try {
                await Linking.openURL('https://mail.google.com/mail/u/0/#inbox');
            } catch (e) {
                setShowGmailErrorModal(true);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <View style={styles.brandBar}>
                        <View style={[styles.bar, { backgroundColor: GoogleColors.blue }]} />
                        <View style={[styles.bar, { backgroundColor: GoogleColors.red }]} />
                        <View style={[styles.bar, { backgroundColor: GoogleColors.yellow }]} />
                        <View style={[styles.bar, { backgroundColor: GoogleColors.green }]} />
                    </View>
                    <Animated.View style={[styles.iconContainer, { transform: [{ translateY }] }]}>
                        <View style={styles.iconCircle}>
                            <Image
                                source={require('../assets/icons/gmail-logo.png')}
                                style={{ width: 80, height: 80 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.iconShadow} />
                    </Animated.View>
                    <Text style={styles.title}>Check Your Email</Text>
                    <Text style={styles.description}>
                        {`We've sent a verification link to\n`}
                        <Text style={styles.emailText}>{email || "your email address"}</Text>
                    </Text>
                    <View style={styles.card3D}>
                        <View style={styles.cardHeaderStrip}>
                            <View style={[styles.strip, { backgroundColor: GoogleColors.blue }]} />
                            <View style={[styles.strip, { backgroundColor: GoogleColors.red }]} />
                            <View style={[styles.strip, { backgroundColor: GoogleColors.yellow }]} />
                            <View style={[styles.strip, { backgroundColor: GoogleColors.green }]} />
                        </View>
                        <Text style={styles.infoText}>{`Please check your inbox (and spam folder) to verify your account. Once verified, you can log in to explore World-Cart.`}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.openGmailButton}
                        onPress={handleOpenGmail}
                        activeOpacity={0.8}
                    ><Ionicons name="mail" size={24} color={COLORS.white} style={{ marginRight: 12 }} /><Text style={styles.openGmailButtonText}>{`Open Gmail App`}</Text></TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.replace('Login')}
                        activeOpacity={0.8}
                    ><Text style={styles.loginButtonText}>{`Go to Login`}</Text></TouchableOpacity>
                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={() => setShowResendModal(true)}
                    ><Text style={styles.resendText}>{`Didn't receive code? `}<Text style={styles.resendLink}>{`Resend`}</Text></Text></TouchableOpacity>
                </Animated.View>
            </ScrollView>

            <CustomModal
                visible={showResendModal}
                onClose={() => setShowResendModal(false)}
                type="success"
                title="Email Resent!"
                message={`We've sent a new verification link to:\n${email || "your email address"}\n\nPlease check your inbox and spam folder.`}
                primaryButton={{
                    text: "Got it",
                    onPress: () => setShowResendModal(false)
                }}
            />

            <CustomModal
                visible={showGmailErrorModal}
                onClose={() => setShowGmailErrorModal(false)}
                type="error"
                title="Gmail Not Found"
                message="We couldn't detect the Gmail app on your device. Would you like to open it in your web browser instead?"
                primaryButton={{
                    text: "Open Browser",
                    onPress: () => Linking.openURL('https://mail.google.com')
                }}
                secondaryButton={{
                    text: "Cancel",
                    onPress: () => setShowGmailErrorModal(false)
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: moderateScale(30),
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 1.5,
    },
    brandBar: {
        flexDirection: 'row',
        width: 120,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 50,
        alignSelf: 'center',
        ...SHADOWS.small,
    },
    bar: {
        flex: 1,
        height: '100%',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    iconCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: COLORS.gray[100],
        zIndex: 2,
    },
    iconShadow: {
        width: 80,
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 50,
        marginTop: 10,
        transform: [{ scaleX: 1.5 }],
    },
    title: {
        fontSize: rf(28),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: rf(16),
        color: COLORS.gray[500],
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    emailText: {
        color: GoogleColors.blue,
        fontWeight: '700',
    },
    card3D: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        ...SHADOWS.medium,
        marginBottom: 40,
        width: '100%',
        overflow: 'hidden',
    },
    cardHeaderStrip: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
    },
    strip: {
        flex: 1,
        height: '100%',
    },
    infoText: {
        fontSize: rf(14),
        color: COLORS.gray[600],
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 5,
    },
    openGmailButton: {
        flexDirection: 'row',
        backgroundColor: GoogleColors.red,
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
        marginBottom: 15,
        shadowColor: GoogleColors.red,
        shadowOpacity: 0.3,
    },
    openGmailButtonText: {
        color: COLORS.white,
        fontSize: rf(16),
        fontWeight: '900',
        letterSpacing: 1,
    },
    loginButton: {
        backgroundColor: COLORS.black,
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: rf(16),
        fontWeight: '900',
        letterSpacing: 1,
    },
    resendButton: {
        marginTop: 25,
    },
    resendText: {
        fontSize: rf(14),
        color: COLORS.gray[500],
    },
    resendLink: {
        color: GoogleColors.red,
        fontWeight: '700',
    },
});

export default VerificationScreen;