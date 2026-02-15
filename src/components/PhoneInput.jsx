
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const PhoneInput = ({ value, onChangeText, selectedCountry, onPressCountry }) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: 16,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -10],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [COLORS.gray[400], COLORS.primary],
        }),
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 4,
        zIndex: 1,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    };

    return (
        <View style={styles.inputGroup}>
            <Animated.Text style={labelStyle} pointerEvents="none">
                Phone Number
            </Animated.Text>
            <View style={[
                styles.input,
                styles.phoneInputContainer,
                { borderColor: isFocused ? COLORS.primary : COLORS.gray[200] }
            ]}>
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={onPressCountry}
                >
                    <Text style={{ fontSize: 24, marginRight: 4 }}>{selectedCountry?.flag || '🌍'}</Text>
                    <Text style={styles.countryCode}>{selectedCountry?.dial_code || '+1'}</Text>
                </TouchableOpacity>
                <View style={styles.phoneDivider} />
                <TextInput
                    style={styles.phoneInput}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="phone-pad"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
        marginTop: 16,
        position: 'relative',
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        borderWidth: 1.5,
        borderColor: COLORS.gray[200],
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    phoneDivider: {
        width: 1,
        height: '60%',
        backgroundColor: COLORS.gray[300],
        marginHorizontal: 10,
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 5,
    },
});

export default PhoneInput;
