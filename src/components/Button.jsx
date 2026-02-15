import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View } from 'react-native';
import { PlusIcon, LogoutIcon } from './TabIcons';
import { COLORS, SIZES } from '../constants/theme';

// Icon mapping for common button icons
const getIconComponent = (iconName) => {
    const iconMap = {
        'plus': PlusIcon,
        'logout': LogoutIcon,
    };
    return iconMap[iconName] || null;
};

const Button = ({
    title,
    subTitle,
    onPress,
    variant = 'primary', // primary, secondary, outline, danger
    size = 'medium', // small, medium, large
    icon,
    loading = false,
    disabled = false,
    style
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary': return styles.secondary;
            case 'outline': return styles.outline;
            case 'danger': return styles.danger;
            default: return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineText;
            default: return styles.btnText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small': return styles.small;
            case 'large': return styles.large;
            default: return styles.medium;
        }
    };

    const get3DShadowColor = () => {
        switch (variant) {
            case 'primary': return '#1a5fb4'; // Dark blue shadow
            case 'danger': return COLORS.danger;
            case 'secondary': return '#263238'; // Dark slate shadow
            default: return 'rgba(0,0,0,0.2)';
        }
    };

    return (
        <Animated.View
            style={[
                styles.buttonWrapper,
                { transform: [{ scale: scaleAnim }] },
                style,
            ]}
        >
            {/* 3D Back Layer - Button Shadow */}
            <View style={[
                styles.btn3DBack,
                { backgroundColor: get3DShadowColor() },
                variant === 'outline' && styles.btn3DBackOutline,
            ]} />

            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={[
                    styles.btn,
                    getVariantStyle(),
                    getSizeStyle(),
                    disabled && styles.disabled,
                    loading && styles.loading,
                ]}
                activeOpacity={0.9}
            >
                {loading ? (
                    <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
                ) : (
                    <View style={styles.contentContainer}>
                        <View style={styles.row}>
                            {icon && (
                                <View style={styles.iconContainer}>
                                    {React.isValidElement(icon) ? icon : (() => {
                                        const IconComponent = getIconComponent(icon);
                                        return IconComponent && <IconComponent size={22} color={variant === 'outline' ? COLORS.primary : COLORS.white} />;
                                    })()}
                                </View>
                            )}
                            <Text
                                style={[getTextStyle(), size === 'small' && styles.smallText]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {title}
                            </Text>
                        </View>
                        {subTitle && (
                            <Text style={styles.subText} numberOfLines={1} adjustsFontSizeToFit>{subTitle}</Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        position: 'relative',
        width: '100%',
        alignSelf: 'center',
    },
    btn3DBack: {
        position: 'absolute',
        top: 4,
        left: 0,
        right: 0,
        bottom: -4,
        borderRadius: 15,
        zIndex: 1,
    },
    btn3DBackOutline: {
        backgroundColor: 'rgba(0,0,0,0.08)',
    },
    btn: {
        backgroundColor: '#1c71d8',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3584e4',
        zIndex: 2,
        transform: [{ translateY: -3 }],
        // Shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    primary: {
        backgroundColor: '#1c71d8',
        borderColor: '#3584e4',
    },
    secondary: {
        backgroundColor: '#455a64',
        borderColor: '#607d8b',
    },
    danger: {
        backgroundColor: COLORS.danger,
        borderColor: '#ff5252',
    },
    outline: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
        transform: [{ translateY: 0 }], // No lift for outline normally
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    small: {
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 26,
    },
    large: {
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'serif',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    outlineText: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 14,
    },
    subText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '400',
        marginTop: 2,
    },
    iconContainer: {
        marginRight: 10,
    },
    disabled: {
        opacity: 0.5,
    },
    loading: {
        opacity: 0.9,
    },
});

export default Button;