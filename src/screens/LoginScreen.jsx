import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rf, moderateScale } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';
import CustomModal from '../components/CustomModal';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const insets = useSafeAreaInsets();

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const passwordRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        // Reset errors
        setEmailError(false);
        setPasswordError(false);
        setError('');

        let hasError = false;
        if (!email) {
            setEmailError(true);
            hasError = true;
        }
        if (!password) {
            setPasswordError(true);
            hasError = true;
        }

        if (hasError) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password, rememberMe);

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                setError(result.message);
                setEmailError(true);
                setPasswordError(true);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
            setEmailError(true);
            setPasswordError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateAfterLogin = () => {
        setShowSuccessModal(false);
        const params = route.params || {};
        const { returnTo } = params;

        // Remove returnTo from params to avoid passing it back
        const targetParams = { ...params };
        delete targetParams.returnTo;

        if (returnTo) {
            // Simplified navigation - React Navigation will find the screen
            navigation.navigate(returnTo, targetParams);
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // Default fallback
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'Profile' } }],
            });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="Login"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <CustomModal
                visible={showSuccessModal}
                onClose={navigateAfterLogin}
                type="success"
                title="Login Successful!"
                message="Welcome back! Your secure session has been restored. Ready to explore World-Cart?"
                primaryButton={{
                    text: "Let's Go",
                    onPress: navigateAfterLogin
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.stepScrollView}
                    contentContainerStyle={styles.stepContentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                >
                    <View style={styles.mainContent}>
                        <View style={styles.card3DWrapper}>
                            {/* 3D Stacked Layers */}
                            <View style={styles.cardLayerBack} />
                            <View style={styles.cardLayerMiddle} />

                            <View style={styles.card3DContent}>
                                <Text style={styles.formTitle}>Welcome Back!</Text>
                                <Text style={styles.subtitle}>
                                    Sign in to access your account
                                </Text>

                                <View style={styles.inputsSection}>
                                    <FloatingLabelInput
                                        label="Email or Phone Number"
                                        value={email}
                                        onChangeText={(text) => { setEmail(text); setEmailError(false); setError(''); }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                        blurOnSubmit={false}
                                        error={emailError}
                                    />

                                    <FloatingLabelInput
                                        innerRef={passwordRef}
                                        label="Password"
                                        value={password}
                                        onChangeText={(text) => { setPassword(text); setPasswordError(false); setError(''); }}
                                        isPassword={true}
                                        returnKeyType="done"
                                        onSubmitEditing={handleLogin}
                                        error={passwordError}
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <View style={styles.optionsRow}>
                                    <View style={styles.rememberRow}>
                                        <Switch
                                            value={rememberMe}
                                            onValueChange={setRememberMe}
                                            trackColor={{ false: COLORS.gray[200], true: COLORS.primary }}
                                            thumbColor={COLORS.white}
                                            style={{ transform: [{ scale: moderateScale(0.8) }] }}
                                        />
                                        <Text style={styles.rememberText}>Remember Me</Text>
                                    </View>

                                    <TouchableOpacity activeOpacity={0.7}>
                                        <Text style={styles.forgotText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button3D, isLoading && styles.buttonDisabled]}
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.buttonText}>Login</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                        <Text style={styles.signupText}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    stepScrollView: {
        flex: 1,
    },
    stepContentContainer: {
        flexGrow: 1,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        paddingVertical: moderateScale(40),
        minHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card3DWrapper: {
        width: '100%',
        maxWidth: 500,
        marginBottom: SIZES.padding,
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
        padding: moderateScale(24),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 15,
    },
    formTitle: {
        fontSize: rf(24),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: rf(14),
        color: COLORS.gray[500],
        marginBottom: moderateScale(30),
        textAlign: 'center',
        lineHeight: rf(20),
    },
    inputsSection: {
        // Gap is handled by component marginBottom
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: moderateScale(20),
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        marginLeft: 8,
        fontSize: rf(13),
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    forgotText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: rf(13),
    },
    button3D: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: moderateScale(16),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        marginTop: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: rf(16),
        fontWeight: '900',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: moderateScale(30),
    },
    footerText: {
        color: COLORS.gray[500],
        fontSize: rf(14),
    },
    signupText: {
        color: COLORS.primary,
        fontWeight: '900',
        fontSize: rf(14),
    },
    errorText: {
        color: COLORS.danger,
        fontSize: rf(12),
        marginTop: -10,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    }
});

export default LoginScreen;
