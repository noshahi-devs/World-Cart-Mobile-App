import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Easing,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { moderateScale, rf } from '../../utils/responsive';

const DiscoveryBanner = ({ banners = [] }) => {
    const { width } = useWindowDimensions();
    // --- Discovery Banner Professional Melt Animation ---
    const [promoIdx, setPromoIdx] = useState(0);
    const promoFadeAnim = useRef(new Animated.Value(1)).current;

    const bannerHorizontalMargin = width >= 768 ? moderateScale(25) : SIZES.padding;

    useEffect(() => {
        if (!banners || banners.length === 0) return;

        const totalCycleTime = 8000; // 4s Stay + 4s Melt
        const animationDuration = 4000;

        const interval = setInterval(() => {
            // Start the 4s Melt transition
            Animated.timing(promoFadeAnim, {
                toValue: 0,
                duration: animationDuration,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                // Once melted, switch state to next image and reset opacity
                setPromoIdx((prev) => (prev + 1) % banners.length);
                promoFadeAnim.setValue(1);
            });
        }, totalCycleTime);

        return () => clearInterval(interval);
    }, [banners.length]);

    // Helper to resolve image source
    const getBannerSource = (index) => {
        const item = banners[index % banners.length];
        return typeof item === 'number' ? item : { uri: item };
    };

    if (!banners || banners.length === 0) return null;

    return (
        <View style={[styles.promoBannerContainer, { marginHorizontal: bannerHorizontalMargin }]}>
            <View style={styles.promoBannerWrapper3D}>
                {/* Background Image (The image being revealed) */}
                <Image
                    source={getBannerSource(promoIdx + 1)}
                    style={[styles.promoBannerImage, { position: 'absolute' }]}
                    resizeMode="cover"
                />
                {/* Top Image (The image melting away) */}
                <Animated.Image
                    source={getBannerSource(promoIdx)}
                    style={[
                        styles.promoBannerImage,
                        { opacity: promoFadeAnim }
                    ]}
                    resizeMode="cover"
                />
                <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>LIMITED TIME</Text>
                </View>
                <View style={styles.promoBannerOverlay1}>
                    <Text style={styles.promoTitle}>Discover World-Cart</Text>
                </View>
                <View style={styles.promoBannerOverlay}>
                    <Text style={styles.promoSubtitle}>Elite Collection Just for You</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    promoBannerContainer: {
        marginBottom: moderateScale(20),
    },
    promoBannerWrapper3D: {
        borderRadius: moderateScale(20),
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    promoBannerImage: {
        width: '100%',
        height: moderateScale(150),
    },
    promoBannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: moderateScale(12),
        paddingBottom: moderateScale(10),
        justifyContent: 'flex-end',
    },
    promoBannerOverlay1: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: moderateScale(12),
        paddingBottom: moderateScale(25),
        justifyContent: 'flex-end',
    },
    promoBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        zIndex: 20,
    },
    promoBadgeText: {
        color: COLORS.white,
        fontSize: rf(10),
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    promoTitle: {
        fontSize: rf(18),
        fontWeight: '900',
        color: COLORS.white,
        lineHeight: rf(24),
        ...Platform.select({
            web: {
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            },
            default: {
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
            },
        }),
    },
    promoSubtitle: {
        fontSize: rf(12),
        color: COLORS.white,
        opacity: 0.9,
    },
});

export default DiscoveryBanner;
