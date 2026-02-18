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
    error
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

    const borderColor = error ? COLORS.danger : (isFocused ? COLORS.primary : COLORS.gray[300]);

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {/* The inputContainer is the bordered box */}
            <View style={[styles.inputContainer, { borderColor, borderWidth: isFocused ? 2 : 1.5 }]}>

                {/* Floating label — absolutely positioned inside inputContainer */}
                <Animated.Text
                    style={[
                        styles.label,
                        {
                            top: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [14, -10], // 14 = centered inside box, -10 = above border
                            }),
                            fontSize: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, 12],
                            }),
                            color: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [
                                    error ? COLORS.danger : COLORS.gray[400],
                                    error ? COLORS.danger : COLORS.primary,
                                ],
                            }),
                        }
                    ]}
                >
                    {label}
                </Animated.Text>

                {/* Actual TextInput */}
                <TextInput
                    ref={innerRef}
                    style={[styles.input, inputStyle]}
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
                            name={showPassword ? 'eye-off' : 'eye'}
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
    // Outer wrapper — has top margin so the floating label (top: -10) is visible
    wrapper: {
        marginTop: 16,
        marginBottom: 20,
    },
    // The visible bordered box — label is positioned absolute INSIDE this
    inputContainer: {
        position: 'relative',        // label is absolute relative to THIS
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 14,
        paddingRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    // Floating label — absolute inside inputContainer
    label: {
        position: 'absolute',
        left: 16,
        backgroundColor: COLORS.white,
        paddingHorizontal: 4,
        zIndex: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 15,
        color: COLORS.black,
        fontWeight: '500',
    },
    iconButton: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FloatingLabelInput;
