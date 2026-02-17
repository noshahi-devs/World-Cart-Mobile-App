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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';
import CustomModal from '../components/CustomModal';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { rf, moderateScale } from '../utils/responsive';
import { Lock3D, Close3D } from '../components/ThreeDIcons';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { resetPassword } = useAuth();

    // params expected from deep link or passed manually
    const { userId, token } = route.params || {};

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await resetPassword({
                userId: userId || 0,
                token: token || '',
                newPassword
            });

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                setError(result.message || 'Failed to reset password');
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
                title="Create New Password"
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
                            <Lock3D size={60} color={COLORS.secondary} focused />
                        </View>
                    </View>

                    <Text style={styles.title}>Secure Your Account</Text>
                    <Text style={styles.subtitle}>
                        Please enter your new password below.
                    </Text>

                    <View style={styles.card3D}>
                        <FloatingLabelInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={(text) => { setNewPassword(text); setError(''); }}
                            isPassword
                            error={!!error}
                        />

                        <FloatingLabelInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                            isPassword
                            error={!!error}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button3D, isLoading && styles.buttonDisabled]}
                            onPress={handleResetPassword}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.buttonText}>Reset Password</Text>
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
                title="Success!"
                message="Your password has been successfully reset. You can now log in with your new password."
                primaryButton={{
                    text: 'Login Now',
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
        marginTop: 5,
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

export default ResetPasswordScreen;
