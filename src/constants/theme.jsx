import { Platform } from 'react-native';
import resp, { moderateScale, rf } from '../utils/responsive';

const { width, height } = resp;

export const COLORS = {
    primary: '#1c71d8',
    secondary: '#FF3B30',
    success: '#4CAF50',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
        100: '#F8F9FA',
        200: '#E9ECEF',
        300: '#DEE2E6',
        400: '#CED4DA',
        500: '#ADB5BD',
        600: '#6C757D',
        700: '#495057',
        800: '#343A40',
        900: '#212529',
    },
    // 3D Gradient Colors
    gradient: {
        primary: ['#1a1a2e', '#16213e', '#0f3460'],
        secondary: ['#FF6B6B', '#FF3B30', '#C62828'],
        success: ['#66BB6A', '#4CAF50', '#388E3C'],
        premium: ['#2C3E50', '#1a1a2e', '#000000'],
    },
};

export const SIZES = {
    // Global sizes
    base: moderateScale(8),
    font: rf(14),
    radius: moderateScale(12),
    radius3D: moderateScale(16),
    padding: moderateScale(16),

    // Font sizes
    h1: rf(30),
    h2: rf(22),
    h3: rf(18),
    h4: rf(16),
    body1: rf(16),
    body2: rf(14),
    body3: rf(12),
    body4: rf(10),

    // App dimensions
    width,
    height,
    isTablet: resp.isTablet(),
};

// 3D Shadow Presets
export const SHADOWS = {
    // Light 3D Shadow
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            },
        }),
    },
    // Medium 3D Shadow
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
            },
        }),
    },
    // Strong 3D Shadow (for cards and buttons)
    strong: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
        ...Platform.select({
            web: {
                boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
            },
        }),
    },
    // Extra Strong 3D Shadow (for modals and floating elements)
    extraStrong: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 20,
        ...Platform.select({
            web: {
                boxShadow: '0px 16px 24px rgba(0,0,0,0.25)',
            },
        }),
    },
    // 3D Card Shadow (layered effect)
    card3D: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
        ...Platform.select({
            web: {
                boxShadow: '4px 8px 12px rgba(0,0,0,0.2)',
            },
        }),
    },
    // Button 3D Shadow
    button3D: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
        ...Platform.select({
            web: {
                boxShadow: '0px 6px 10px rgba(0,0,0,0.25)',
            },
        }),
    },
    // Pressed button shadow (smaller)
    buttonPressed: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
            },
        }),
    },
    // Premium floating shadow
    floating: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 25,
        ...Platform.select({
            web: {
                boxShadow: '0px 20px 30px rgba(0,0,0,0.3)',
            },
        }),
    },
    // Colored shadows
    coloredPrimary: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        ...Platform.select({
            web: {
                boxShadow: `0px 8px 12px ${COLORS.primary}66`, // 40% opacity
            },
        }),
    },
    coloredSuccess: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        ...Platform.select({
            web: {
                boxShadow: `0px 8px 12px ${COLORS.success}66`,
            },
        }),
    },
    coloredDanger: {
        shadowColor: COLORS.danger,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        ...Platform.select({
            web: {
                boxShadow: `0px 8px 12px ${COLORS.danger}66`,
            },
        }),
    },
};

// 3D Card Styles
export const CARD_3D = {
    wrapper: {
        position: 'relative',
    },
    backLayer: {
        position: 'absolute',
        top: 6,
        left: 3,
        right: -3,
        bottom: -6,
        backgroundColor: 'rgba(0,0,0,0.12)',
        borderRadius: SIZES.radius3D,
    },
    middleLayer: {
        position: 'absolute',
        top: 3,
        left: 1.5,
        right: -1.5,
        bottom: -3,
        backgroundColor: 'rgba(0,0,0,0.06)',
        borderRadius: SIZES.radius3D - 2,
    },
    content: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius3D,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
            },
            android: {
                elevation: 10,
            },
        }),
    },
};

// Button 3D Styles
export const BUTTON_3D = {
    primary: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        ...SHADOWS.button3D,
        // Bottom border for 3D effect
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },
    secondary: {
        backgroundColor: COLORS.gray[100],
        borderRadius: SIZES.radius,
        ...SHADOWS.medium,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.gray[300],
    },
};