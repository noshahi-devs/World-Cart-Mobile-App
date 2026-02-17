
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { Check3D, Close3D } from '../components/ThreeDIcons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateProfile } = useAuth();
    const insets = useSafeAreaInsets();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [country, setCountry] = useState(user?.country || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || null);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        icon: null,
        primaryButton: null,
        secondaryButton: null
    });

    const showModal = (config) => {
        setModalConfig({ ...config, visible: true });
    };

    const hideModal = () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
    };

    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showModal({
                title: 'Permission Denied',
                message: 'Sorry, we need camera roll permissions to make this work!',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'OK', onPress: hideModal }
            });
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !email) {
            showModal({
                title: 'Missing Details',
                message: 'Please fill in all mandatory fields (Name, Email).',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'OK', onPress: hideModal }
            });
            return;
        }

        setLoading(true);
        const result = await updateProfile({
            firstName,
            lastName,
            email,
            phone,
            country,
            profileImage
        });
        setLoading(false);

        if (result.success) {
            showModal({
                title: 'Profile Updated!',
                message: 'Your profile details have been successfully saved.',
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
                message: result.message || 'Failed to update profile. Please try again.',
                type: 'error',
                icon: <Close3D size={50} />,
                primaryButton: { text: 'Try Again', onPress: hideModal }
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Edit Profile"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                >
                    {/* Profile Picture Section - Top Prominent */}
                    <View style={styles.profileHeaderCard}>
                        {/* Decorative Premium Background Elements */}
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />

                        <View style={styles.profileImageContainer}>
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={require('../assets/icons/World-Cart.png')}
                                    style={styles.image}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Enter first name"
                                    placeholderTextColor={COLORS.gray[400]}
                                    returnKeyType="next"
                                    onSubmitEditing={() => lastNameRef.current?.focus()}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={lastNameRef}
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Enter last name"
                                    placeholderTextColor={COLORS.gray[400]}
                                    returnKeyType="next"
                                    onSubmitEditing={() => phoneRef.current?.focus()}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={phoneRef}
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter phone number"
                                    placeholderTextColor={COLORS.gray[400]}
                                    keyboardType="phone-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailRef.current?.focus()}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={emailRef}
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter email"
                                    placeholderTextColor={COLORS.gray[400]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Country</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="Enter country"
                                    placeholderTextColor={COLORS.gray[400]}
                                />
                            </View>
                        </View>
                    </View>

                    <Button
                        title={loading ? "Saving..." : "Save Changes"}
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
                secondaryButton={modalConfig.secondaryButton}
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
    profileHeaderCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        paddingVertical: 30,
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
        position: 'relative',
        overflow: 'hidden',
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    decorCircle1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#E3F2FD', // Light Blue
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -20,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FCE4EC', // Light Pink
        opacity: 0.6,
    },
    profileImageContainer: {
        position: 'relative',
        zIndex: 1,
    },
    imageWrapper: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: COLORS.white,
        backgroundColor: COLORS.white,
        padding: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.gray[100],
    },
    editIconWrapper: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
        ...SHADOWS.small,
    },
    changePhotoText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SIZES.padding,
        ...SHADOWS.medium,
        marginBottom: 24,
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
        ...SHADOWS.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
    },
    saveButton: {
        marginBottom: 10,
        borderRadius: 16,
        ...SHADOWS.medium,
    }
});

export default EditProfileScreen;
