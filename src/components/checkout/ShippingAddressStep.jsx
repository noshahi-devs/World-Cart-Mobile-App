import React, { useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rf, moderateScale } from '../../utils/responsive';
import Button from '../Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const ShippingAddressStep = ({
    shippingData,
    setShippingData,
    onSuccess,
    showErrorModal,
    insets
}) => {
    // Input refs for keyboard navigation
    const countryRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const addressRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);
    const postalCodeRef = useRef(null);

    const [showCountryPicker, setShowCountryPicker] = React.useState(false);
    const [showPhoneCodePicker, setShowPhoneCodePicker] = React.useState(false);
    const [phoneCode, setPhoneCode] = React.useState('+1');

    const countries = [
        { code: '+1', flag: '🇺🇸', name: 'United States', aliases: ['US', 'USA'] },
        { code: '+44', flag: '🇬🇧', name: 'United Kingdom', aliases: ['UK', 'GB', 'Britain'] },
        { code: '+92', flag: '🇵🇰', name: 'Pakistan', aliases: ['PK'] },
        { code: '+91', flag: '🇮🇳', name: 'India', aliases: ['IN'] },
        { code: '+1', flag: '🇨🇦', name: 'Canada', aliases: ['CA'] },
        { code: '+61', flag: '🇦🇺', name: 'Australia', aliases: ['AU'] },
        { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates', aliases: ['UAE'] },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', aliases: ['SA', 'KSA'] },
        { code: '+49', flag: '🇩🇪', name: 'Germany', aliases: ['DE'] },
        { code: '+33', flag: '🇫🇷', name: 'France', aliases: ['FR'] },
    ];

    // Auto-update phone code when country changes
    React.useEffect(() => {
        if (shippingData.country) {
            const normalizedInput = shippingData.country.trim().toLowerCase();
            const found = countries.find(c =>
                c.name.toLowerCase() === normalizedInput ||
                c.aliases.some(a => a.toLowerCase() === normalizedInput)
            );
            if (found) {
                setPhoneCode(found.code);
            }
        }
    }, [shippingData.country]);

    // Internal validation logic
    const validateShipping = () => {
        if (!shippingData.country.trim()) {
            showErrorModal('Please enter your country');
            return false;
        }
        if (!shippingData.firstName.trim()) {
            showErrorModal('Please enter your first name');
            return false;
        }
        if (!shippingData.lastName.trim()) {
            showErrorModal('Please enter your last name');
            return false;
        }
        if (!shippingData.phone.trim()) {
            showErrorModal('Please enter your phone number');
            return false;
        }
        if (!shippingData.email.trim()) {
            showErrorModal('Please enter your email address');
            return false;
        }
        if (!shippingData.address.trim()) {
            showErrorModal('Please enter your street address');
            return false;
        }
        if (!shippingData.city.trim()) {
            showErrorModal('Please enter your city');
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        if (validateShipping()) {
            onSuccess();
        }
    };

    return (
        <ScrollView
            style={styles.stepScrollView}
            contentContainerStyle={[styles.stepContentContainer, { paddingBottom: insets.bottom + 1 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        >
            <View style={styles.card3DWrapper}>
                {/* 3D Stacked Layers */}
                <View style={styles.cardLayerBack} />
                <View style={styles.cardLayerMiddle} />

                <View style={styles.card3DContent}>
                    <Text style={styles.stepTitle}>Shipping Address</Text>

                    {/* 1. Country Information - Searchable Input */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.countryInputWrapper}>
                            <View style={styles.flagAdornment}>
                                <Text style={styles.flagLarge}>
                                    {countries.find(c =>
                                        c.name.toLowerCase() === shippingData.country.trim().toLowerCase() ||
                                        c.aliases.some(a => a.toLowerCase() === shippingData.country.trim().toLowerCase())
                                    )?.flag || '🌍'}
                                </Text>
                            </View>
                            <TextInput
                                ref={countryRef}
                                style={[styles.input3D, styles.countryInput]}
                                placeholder="Type country name... *"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.country}
                                onChangeText={(text) => {
                                    setShippingData({ ...shippingData, country: text });
                                    setShowCountryPicker(text.length > 0);
                                }}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => firstNameRef.current?.focus()}
                            />
                        </View>

                        {showCountryPicker && shippingData.country.length > 0 && (
                            <View style={styles.dropdownContainer}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                    {countries
                                        .filter(c => {
                                            const search = shippingData.country.toLowerCase();
                                            const matchesName = c.name.toLowerCase().includes(search);
                                            const matchesAlias = c.aliases.some(a => a.toLowerCase().startsWith(search));
                                            const isExactMatch = c.name.toLowerCase() === search;
                                            return (matchesName || matchesAlias) && !isExactMatch;
                                        })
                                        .map((country, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setShippingData({ ...shippingData, country: country.name });
                                                    setShowCountryPicker(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownFlag}>{country.flag}</Text>
                                                <Text style={styles.dropdownText}>{country.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* 2 & 3. First & Last Name */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputWrapper, styles.halfInput]}>
                            <TextInput
                                ref={firstNameRef}
                                style={styles.input3D}
                                placeholder="First Name *"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.firstName}
                                onChangeText={(text) => setShippingData({ ...shippingData, firstName: text })}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => lastNameRef.current?.focus()}
                            />
                        </View>
                        <View style={[styles.inputWrapper, styles.halfInput]}>
                            <TextInput
                                ref={lastNameRef}
                                style={styles.input3D}
                                placeholder="Last Name *"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.lastName}
                                onChangeText={(text) => setShippingData({ ...shippingData, lastName: text })}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => phoneRef.current?.focus()}
                            />
                        </View>
                    </View>

                    {/* 4. Phone Number */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.phoneContainer}>
                            <TouchableOpacity
                                style={styles.countrySelector}
                                onPress={() => setShowPhoneCodePicker(!showPhoneCodePicker)}
                            >
                                <Text style={styles.flagSmall}>{countries.find(c => c.code === phoneCode)?.flag || '🇺🇸'}</Text>
                                <Text style={styles.countryCodeText}>{phoneCode}</Text>
                                <Ionicons name="chevron-down" size={14} color={COLORS.gray[400]} />
                            </TouchableOpacity>
                            <TextInput
                                ref={phoneRef}
                                style={styles.phoneInputNext}
                                placeholder="Phone Number *"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.phone}
                                onChangeText={(text) => setShippingData({ ...shippingData, phone: text })}
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                        </View>

                        {showPhoneCodePicker && (
                            <View style={styles.dropdownContainer}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                    {countries.map((country, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setPhoneCode(country.code);
                                                setShowPhoneCodePicker(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownFlag}>{country.flag}</Text>
                                            <Text style={styles.dropdownText}>{country.name} ({country.code})</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* 5. Email Address */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={emailRef}
                            style={styles.input3D}
                            placeholder="Email Address (Gmail etc.) *"
                            placeholderTextColor={COLORS.gray[400]}
                            value={shippingData.email}
                            onChangeText={(text) => setShippingData({ ...shippingData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => addressRef.current?.focus()}
                        />
                    </View>

                    {/* 6. Street Address */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={addressRef}
                            style={styles.input3D}
                            placeholder="Street Address *"
                            placeholderTextColor={COLORS.gray[400]}
                            value={shippingData.address}
                            onChangeText={(text) => setShippingData({ ...shippingData, address: text })}
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => stateRef.current?.focus()}
                        />
                    </View>

                    {/* 7 & 8. Province/State & City */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputWrapper, styles.halfInput]}>
                            <TextInput
                                ref={stateRef}
                                style={styles.input3D}
                                placeholder="Province/State"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.state}
                                onChangeText={(text) => setShippingData({ ...shippingData, state: text })}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => cityRef.current?.focus()}
                            />
                        </View>
                        <View style={[styles.inputWrapper, styles.halfInput]}>
                            <TextInput
                                ref={cityRef}
                                style={styles.input3D}
                                placeholder="City *"
                                placeholderTextColor={COLORS.gray[400]}
                                value={shippingData.city}
                                onChangeText={(text) => setShippingData({ ...shippingData, city: text })}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => postalCodeRef.current?.focus()}
                            />
                        </View>
                    </View>

                    {/* 9. Postal Code */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={postalCodeRef}
                            style={styles.input3D}
                            placeholder="Postal Code"
                            placeholderTextColor={COLORS.gray[400]}
                            value={shippingData.postalCode}
                            onChangeText={(text) => setShippingData({ ...shippingData, postalCode: text })}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>
                </View>
            </View>

            <View style={[styles.stepButtons, { paddingBottom: insets.bottom + 20 }]}>
                <Button
                    title="Continue to Payment"
                    onPress={handleContinue}
                    size="large"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    stepScrollView: {
        flex: 1,
    },
    stepContentContainer: {
        padding: SIZES.padding,
    },
    card3DWrapper: {
        marginBottom: moderateScale(25),
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
    stepTitle: {
        fontSize: rf(20),
        fontWeight: '900',
        color: COLORS.black,
        marginBottom: moderateScale(20),
        textAlign: 'center',
    },
    inputWrapper: {
        marginBottom: SIZES.base,
    },
    input3D: {
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        padding: SIZES.padding,
        fontSize: SIZES.body1,
        color: COLORS.black,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    stepButtons: {
        marginTop: SIZES.padding,
        width: '100%',
    },
    nextButton: {
        marginTop: SIZES.base,
    },
    countryInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
        overflow: 'hidden',
    },
    flagAdornment: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0,
    },
    flagLarge: {
        fontSize: 24,
    },
    countryInput: {
        flex: 1,
        borderWidth: 0,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        paddingLeft: 4,
    },
    dropdownContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        marginTop: 4,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        ...SHADOWS.medium,
        zIndex: 1000,
        elevation: 1000,
        maxHeight: 200,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    dropdownFlag: {
        fontSize: 20,
        marginRight: 10,
    },
    dropdownText: {
        fontSize: SIZES.body2,
        color: COLORS.black,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        ...SHADOWS.light,
        overflow: 'hidden',
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: COLORS.gray[50],
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: COLORS.gray[200],
    },
    flagSmall: {
        fontSize: 18,
        marginRight: 4,
    },
    countryCodeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
        marginRight: 4,
    },
    phoneInputNext: {
        flex: 1,
        padding: SIZES.padding,
        fontSize: SIZES.body1,
        color: COLORS.black,
    },
});

export default ShippingAddressStep;
