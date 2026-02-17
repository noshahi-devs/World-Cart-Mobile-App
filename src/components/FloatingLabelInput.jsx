import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    containerStyle,
    inputStyle,
    isPassword,
    keyboardType,
    autoCapitalize,
    returnKeyType,
    onSubmitEditing,
    blurOnSubmit,
    innerRef,
    error // New error prop
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            outputRange: [18, -12], // Moved higher up
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [error ? COLORS.danger : COLORS.gray[500], error ? COLORS.danger : COLORS.primary],
        }),
        backgroundColor: COLORS.white,
        paddingHorizontal: 4,
        zIndex: 1,
    };

    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Animated.Text style={labelStyle}>
                {label}
            </Animated.Text>
            <View style={[
                styles.inputContainer,
                {
                    borderColor: error ? COLORS.danger : (isFocused ? COLORS.primary : COLORS.gray[200]),
                    borderWidth: isFocused ? 2 : 1, // Thicker border on focus
                    shadowOpacity: isFocused ? 0.1 : 0.05, // Dynamic shadow
                    elevation: isFocused ? 4 : 1,
                }
            ]}>
                <TextInput
                    ref={innerRef}
                    style={[
                        styles.input,
                        inputStyle
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !showPassword}
                    placeholder=""
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={blurOnSubmit}
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={22}
                            color={isFocused ? COLORS.primary : COLORS.gray[400]}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 22, // Increased spacing
        position: 'relative',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderColor: COLORS.gray[200],
        paddingRight: 12,
        // Default Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 6,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16, // Increased padding
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
    },
    iconButton: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default FloatingLabelInput;
