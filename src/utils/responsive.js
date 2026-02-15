import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Capped width for scaling on large screens (Web/Tablet)
const getCappedWidth = () => {
    if (Platform.OS === 'web') {
        // More conservative scaling for web to prevent oversized elements
        return Math.min(SCREEN_WIDTH, 500);
    }
    return Math.min(SCREEN_WIDTH, 600);
};

/**
 * Scaled Width: Scale size based on screen width
 */
export const scale = (size) => {
    const cappedWidth = getCappedWidth();
    return (cappedWidth / guidelineBaseWidth) * size;
};

/**
 * Scaled Height: Scale size based on screen height
 */
export const verticalScale = (size) => {
    const cappedHeight = Math.min(SCREEN_HEIGHT, 1000);
    return (cappedHeight / guidelineBaseHeight) * size;
};

/**
 * Moderate Scale: Scale size with a factor to prevent too much scaling on tablets
 */
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Check if the device is a tablet
 */
export const isTablet = () => {
    return SCREEN_WIDTH >= 768;
};

/**
 * Get dynamic column count for grids
 */
export const getColumnCount = () => {
    if (SCREEN_WIDTH >= 1440) return 5; // Elite Desktop
    if (SCREEN_WIDTH >= 1024) return 4; // Desktop/Large Tablet
    if (SCREEN_WIDTH >= 768) return 3;  // Tablet
    return 2;                           // Phone
};

/**
 * Responsive Font Size
 */
export const rf = (size) => {
    const cappedWidth = getCappedWidth();
    const scaleFactor = cappedWidth / guidelineBaseWidth;
    const newSize = size * scaleFactor;

    const roundedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
    return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
};

const resp = {
    scale,
    verticalScale,
    moderateScale,
    isTablet,
    getColumnCount,
    rf,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
};

export default resp;

