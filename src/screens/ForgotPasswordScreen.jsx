import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';
import CustomModal from '../components/CustomModal';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { rf, moderateScale } from '../utils/responsive';
import { Mail3D, Close3D } from '../components/ThreeDIcons';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleResetRequest = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setShowSuccessModal(true);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Forgot Password"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Mail3D size={60} color={COLORS.primary} focused />
                        </View>
                    </View>

                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we'll send you a code to reset your password.
                    </Text>

                    <View style={styles.card3D}>
                        <FloatingLabelInput
                            label="Email Address"
                            value={email}
                            onChangeText={(text) => { setEmail(text); setError(''); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={!!error}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button3D, isLoading && styles.buttonDisabled]}
                            onPress={handleResetRequest}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomModal
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Login');
                }}
                type="success"
                title="Email Sent!"
                message={`We've sent a password reset link to ${email}. Please check your inbox and spam folder.`}
                primaryButton={{
                    text: 'Back to Login',
                    onPress: () => {
                        setShowSuccessModal(false);
                        navigation.navigate('Login');
                    }
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
        padding: SIZES.padding * 1.5,
        alignItems: 'center',
    },
    iconContainer: {
        marginTop: 40,
        marginBottom: 30,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    title: {
        fontSize: rf(24),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: rf(14),
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    card3D: {
        width: '100%',
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        borderRadius: 20,
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    errorText: {
        color: COLORS.error,
        fontSize: rf(12),
        marginTop: -10,
        marginBottom: 20,
        marginLeft: 5,
    },
    button3D: {
        backgroundColor: COLORS.black,
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: rf(16),
        fontWeight: '900',
        letterSpacing: 1,
    }
});

export default ForgotPasswordScreen;
