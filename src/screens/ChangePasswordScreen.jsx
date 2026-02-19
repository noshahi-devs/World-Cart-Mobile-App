import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Save, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { Check3D, Close3D } from '../components/ThreeDIcons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ChangePasswordScreen = ({ navigation }) => {
    const { changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        icon: null,
        primaryButton: null,
    });

    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const showModal = (config) => {
        setModalConfig({ ...config, visible: true });
    };

    const hideModal = () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
    };

    const handleSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showModal({
                title: 'Missing Fields',
                message: 'All fields are required to change your password.',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'OK', onPress: hideModal }
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            showModal({
                title: 'Password Mismatch',
                message: 'The new password and confirmation password do not match.',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'OK', onPress: hideModal }
            });
            return;
        }

        if (newPassword.length < 6) {
            showModal({
                title: 'Too Weak',
                message: 'New password must be at least 6 characters long.',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'OK', onPress: hideModal }
            });
            return;
        }

        setLoading(true);
        const result = await changePassword(currentPassword, newPassword);
        setLoading(false);

        if (result.success) {
            showModal({
                title: 'Password Changed!',
                message: 'Your security credentials have been updated successfully.',
                type: 'success',
                icon: <Check3D size={50} />,
                primaryButton: {
                    text: 'Great!',
                    onPress: () => {
                        hideModal();
                        navigation.goBack();
                    }
                }
            });
        } else {
            showModal({
                title: 'Update Failed',
                message: result.message || 'Incorrect current password or server error.',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'Try Again', onPress: hideModal }
            });
        }
    };

    const PasswordInput = ({ label, value, setValue, show, setShow, refIn, onSubmit, returnKeyType }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <Lock size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
                <TextInput
                    ref={refIn}
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor={COLORS.gray[400]}
                    secureTextEntry={!show}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmit}
                    autoCapitalize="none"
                />
                <Button
                    variant="ghost"
                    size="small"
                    onPress={() => setShow(!show)}
                    style={styles.eyeIcon}
                    icon={show ? <EyeOff size={20} color={COLORS.gray[500]} /> : <Eye size={20} color={COLORS.gray[500]} />}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Change Password"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.infoBox}>
                        <View style={styles.infoIconCircle}>
                            <Lock size={24} color={COLORS.primary} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.infoText}>
                            Protect your account by creating a strong password with at least 6 characters.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            setValue={setCurrentPassword}
                            show={showCurrent}
                            setShow={setShowCurrent}
                            returnKeyType="next"
                            onSubmit={() => newPasswordRef.current?.focus()}
                        />

                        <PasswordInput
                            refIn={newPasswordRef}
                            label="New Password"
                            value={newPassword}
                            setValue={setNewPassword}
                            show={showNew}
                            setShow={setShowNew}
                            returnKeyType="next"
                            onSubmit={() => confirmPasswordRef.current?.focus()}
                        />

                        <PasswordInput
                            refIn={confirmPasswordRef}
                            label="Confirm New Password"
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            show={showConfirm}
                            setShow={setShowConfirm}
                            returnKeyType="done"
                            onSubmit={handleSave}
                        />
                    </View>

                    <Button
                        title={loading ? "Updating..." : "Update Password"}
                        onPress={handleSave}
                        size="large"
                        loading={loading}
                        style={styles.saveButton}
                        icon={!loading && <Save size={20} color={COLORS.white} />}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomModal
                visible={modalConfig.visible}
                onClose={hideModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                icon={modalConfig.icon}
                primaryButton={modalConfig.primaryButton}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    scrollContent: {
        padding: SIZES.padding,
    },
    infoBox: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    infoIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        ...SHADOWS.small,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SIZES.padding,
        ...SHADOWS.medium,
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        ...SHADOWS.light,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
    },
    eyeIcon: {
        marginLeft: 8,
        padding: 0,
        width: 40,
        height: 40,
    },
    saveButton: {
        borderRadius: 16,
        ...SHADOWS.medium,
    }
});

export default ChangePasswordScreen;
