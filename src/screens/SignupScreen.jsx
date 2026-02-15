import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { rf, moderateScale } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { signup } = useAuth();

    // States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const insets = useSafeAreaInsets();
    const [selectedCountry, setSelectedCountry] = useState({ code: '+1', flag: '🇺🇸', name: 'United States' });
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);

    const [errors, setErrors] = useState({});

    // Refs for keyboard navigation
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const countries = [
        { code: '+1', flag: '🇺🇸', name: 'United States' },
        { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
        { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+1', flag: '🇨🇦', name: 'Canada' },
        { code: '+61', flag: '🇦🇺', name: 'Australia' },
        { code: '+971', flag: '🇦🇪', name: 'UAE' },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
        { code: '+49', flag: '🇩🇪', name: 'Germany' },
        { code: '+33', flag: '🇫🇷', name: 'France' },
        { code: '+90', flag: '🇹🇷', name: 'Turkey' },
        { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
        { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
        { code: '+974', flag: '🇶🇦', name: 'Qatar' },
        { code: '+39', flag: '🇮🇹', name: 'Italy' },
        { code: '+81', flag: '🇯🇵', name: 'Japan' },
        { code: '+55', flag: '🇧🇷', name: 'Brazil' },
        { code: '+34', flag: '🇪🇸', name: 'Spain' },
        { code: '+86', flag: '🇨🇳', name: 'China' },
        { code: '+7', flag: '🇷🇺', name: 'Russia' },
    ];



    const phoneLabelAnim = useRef(new Animated.Value(phone ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(phoneLabelAnim, {
            toValue: (isPhoneFocused || phone) ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();
    }, [isPhoneFocused, phone]);

    const phoneLabelStyle = {
        position: 'absolute',
        left: phoneLabelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [Platform.OS === 'web' ? 100 : 95, 16],
        }),
        top: phoneLabelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [15, -10],
        }),
        fontSize: phoneLabelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: phoneLabelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [propsError('phone') ? COLORS.danger : COLORS.gray[500], propsError('phone') ? COLORS.danger : COLORS.primary],
        }),
        backgroundColor: phoneLabelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', COLORS.white],
        }),
        paddingHorizontal: 4,
        borderRadius: 4,
        zIndex: 10,
    };

    function propsError(field) {
        return errors[field] ? true : false;
    }

    const handleSignup = async () => {
        let newErrors = {};
        let isValid = true;

        if (!firstName) { newErrors.firstName = true; isValid = false; }
        if (!lastName) { newErrors.lastName = true; isValid = false; }
        if (!email) { newErrors.email = true; isValid = false; }
        if (!phone) { newErrors.phone = true; isValid = false; }
        if (!password) { newErrors.password = true; isValid = false; }
        if (!confirmPassword) { newErrors.confirmPassword = true; isValid = false; }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            newErrors.password = true;
            newErrors.confirmPassword = true;
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            setError('Please fill in check marked fields');
            return;
        }

        const result = await signup({
            firstName,
            lastName,
            email,
            phone: `${selectedCountry.code}${phone}`,
            password,
            country: selectedCountry.name
        });

        if (result.success) {
            navigation.replace('Verification', { email });
        } else {
            setError(result.message);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="Sign Up"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    style={styles.stepScrollView}
                    contentContainerStyle={styles.stepContentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                    bounces={false}
                >
                    <View style={styles.mainContent}>
                        <View style={styles.card3DWrapper}>
                            {/* 3D Stacked Layers */}
                            <View style={styles.cardLayerBack} />
                            <View style={styles.cardLayerMiddle} />

                            <View style={styles.card3DContent}>
                                <Text style={styles.formTitle}>Create Account</Text>
                                <Text style={styles.subtitle}>Join us and start shopping today!</Text>

                                <View style={styles.inputsSection}>
                                    <FloatingLabelInput
                                        innerRef={firstNameRef}
                                        label="First Name"
                                        value={firstName}
                                        onChangeText={(text) => { setFirstName(text); setErrors({ ...errors, firstName: false }); }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => lastNameRef.current?.focus()}
                                        blurOnSubmit={false}
                                        error={errors.firstName}
                                    />

                                    <FloatingLabelInput
                                        innerRef={lastNameRef}
                                        label="Last Name"
                                        value={lastName}
                                        onChangeText={(text) => { setLastName(text); setErrors({ ...errors, lastName: false }); }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => phoneRef.current?.focus()}
                                        blurOnSubmit={false}
                                        error={errors.lastName}
                                    />

                                    <View style={styles.phoneSection}>
                                        <Animated.Text style={phoneLabelStyle}>Phone Number</Animated.Text>
                                        <View style={[
                                            styles.phoneContainer,
                                            { borderColor: errors.phone ? COLORS.danger : (isPhoneFocused ? COLORS.primary : COLORS.gray[200]) }
                                        ]}>
                                            <TouchableOpacity
                                                style={styles.countrySelector}
                                                onPress={() => setShowCountryPicker(!showCountryPicker)}
                                            >
                                                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                                                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                                                <Ionicons name="chevron-down" size={16} color={COLORS.gray[400]} />
                                            </TouchableOpacity>
                                            <TextInput
                                                ref={phoneRef}
                                                style={styles.phoneInput}
                                                placeholder=""
                                                placeholderTextColor={COLORS.gray[400]}
                                                keyboardType="phone-pad"
                                                value={phone}
                                                onChangeText={(text) => { setPhone(text); setErrors({ ...errors, phone: false }); }}
                                                onFocus={() => setIsPhoneFocused(true)}
                                                onBlur={() => setIsPhoneFocused(false)}
                                                returnKeyType="next"
                                                onSubmitEditing={() => emailRef.current?.focus()}
                                                blurOnSubmit={false}
                                            />
                                        </View>
                                        {showCountryPicker && (
                                            <View
                                                style={styles.dropdownContainer}
                                                onStartShouldSetResponderCapture={() => true}
                                            >
                                                <ScrollView
                                                    style={styles.dropdownScroll}
                                                    nestedScrollEnabled={true}
                                                    keyboardShouldPersistTaps="always"
                                                    showsVerticalScrollIndicator={true}
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                >
                                                    {countries.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={styles.dropdownItem}
                                                            onPress={() => {
                                                                setSelectedCountry(item);
                                                                setShowCountryPicker(false);
                                                            }}
                                                            activeOpacity={0.7}
                                                        >
                                                            <Text style={styles.dropdownFlag}>{item.flag}</Text>
                                                            <Text style={styles.dropdownText}>{item.name} ({item.code})</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}
                                    </View>

                                    <FloatingLabelInput
                                        innerRef={emailRef}
                                        label="Email Address"
                                        value={email}
                                        onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: false }); }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                        blurOnSubmit={false}
                                        error={errors.email}
                                    />

                                    <FloatingLabelInput
                                        innerRef={passwordRef}
                                        label="Password"
                                        value={password}
                                        onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: false }); }}
                                        isPassword={true}
                                        returnKeyType="next"
                                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                        blurOnSubmit={false}
                                        error={errors.password}
                                    />

                                    <FloatingLabelInput
                                        innerRef={confirmPasswordRef}
                                        label="Confirm Password"
                                        value={confirmPassword}
                                        onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: false }); }}
                                        isPassword={true}
                                        returnKeyType="done"
                                        onSubmitEditing={handleSignup}
                                        error={errors.confirmPassword}
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={styles.button3D}
                                    onPress={handleSignup}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.loginText}>Log In</Text>
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
        marginBottom: moderateScale(25),
        textAlign: 'center',
        lineHeight: rf(20),
    },
    inputsSection: {
    },
    phoneSection: {
        position: 'relative',
        zIndex: 100,
        marginBottom: 20, // Match FloatingLabelInput marginBottom
    },

    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.gray[200],
        overflow: 'hidden',
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 14, // Match FloatingLabelInput
        backgroundColor: COLORS.gray[100],
        borderRightWidth: 1,
        borderRightColor: COLORS.gray[200],
    },
    flag: {
        fontSize: rf(18),
        marginRight: 4,
    },
    countryCode: {
        fontSize: rf(16), // Match FloatingLabelInput
        color: COLORS.black,
        marginRight: 2,
        fontWeight: '700',
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 14, // Match FloatingLabelInput
        paddingHorizontal: 16,
        fontSize: rf(16), // Match FloatingLabelInput
        color: COLORS.black,
        fontWeight: '500',
    },
    button3D: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: moderateScale(16),
        width: '100%',
        maxWidth: 500,
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
    loginText: {
        color: COLORS.primary,
        fontWeight: '900',
        fontSize: rf(14),
    },
    errorText: {
        color: COLORS.danger,
        fontSize: rf(12),
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    dropdownContainer: {
        position: 'absolute',
        top: '102%',
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.gray[200],
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 25,
        zIndex: 9999,
        maxHeight: 250, // Fixed height ensures ScrollView scrolls
    },
    dropdownScroll: {
        flex: 1,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    dropdownFlag: {
        fontSize: rf(20),
        marginRight: 12,
    },
    dropdownText: {
        fontSize: rf(16),
        color: COLORS.black,
        fontWeight: '500',
    }
});

export default SignupScreen;