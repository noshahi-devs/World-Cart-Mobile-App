import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';
import { moderateScale, rf } from '../../utils/responsive';

const HomeBanner = ({ banners = [] }) => {
    const { width } = useWindowDimensions();
    // One banner per screen: capped for desktop to avoid extreme stretching
    const ITEM_WIDTH = Math.min(width, 1200);
    const CONTAINER_PADDING = 0;
    const [activeBanner, setActiveBanner] = useState(0);
    const flatListRef = useRef(null);
    const scrollInterval = useRef(null);
    const currIndexRef = useRef(1); // Start at the first real item
    const scrollX = useRef(new Animated.Value(0)).current;

    // Triple-buffer for ultra-smooth infinite loop [A,B,C, A,B,C, A,B,C]
    const loopData = banners.length > 0
        ? [...banners, ...banners, ...banners]
        : [];

    const handleInfiniteScroll = (index) => {
        const itemCount = banners.length;
        let targetIndex = index;

        // If we cross into the third set, jump back to the middle set
        if (index >= itemCount * 2) {
            targetIndex = index - itemCount;
            flatListRef.current?.scrollToOffset({
                offset: targetIndex * ITEM_WIDTH,
                animated: false
            });
        }
        // If we cross into the first set, jump forward to the middle set
        else if (index < itemCount) {
            targetIndex = index + itemCount;
            flatListRef.current?.scrollToOffset({
                offset: targetIndex * ITEM_WIDTH,
                animated: false
            });
        }

        currIndexRef.current = targetIndex;
        setActiveBanner(targetIndex % itemCount);
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        scrollInterval.current = setInterval(() => {
            if (banners.length > 0) {
                const nextIndex = currIndexRef.current + 1;

                // Animated scroll to next
                flatListRef.current?.scrollToOffset({
                    offset: nextIndex * ITEM_WIDTH,
                    animated: true,
                });

                // Immediately update current index for next tick
                currIndexRef.current = nextIndex;

                // Check if we need to loop back after the animation
                // 600ms is standard duration for scrollToOffset
                setTimeout(() => {
                    handleInfiniteScroll(nextIndex);
                }, 600);
            }
        }, 6000);
    };

    const stopAutoScroll = () => {
        if (scrollInterval.current) clearInterval(scrollInterval.current);
    };

    useEffect(() => {
        if (banners.length === 0) return;

        // Initial setup: JUMP TO THE MIDDLE SET
        const initialIndex = banners.length;
        currIndexRef.current = initialIndex;

        const timer = setTimeout(() => {
            flatListRef.current?.scrollToOffset({
                offset: initialIndex * ITEM_WIDTH,
                animated: false
            });
            scrollX.setValue(initialIndex * ITEM_WIDTH);
            setActiveBanner(0);
            startAutoScroll();
        }, 100);

        return () => {
            clearTimeout(timer);
            stopAutoScroll();
        };
    }, [banners.length]);

    if (!banners || banners.length === 0) return null;

    const bannerHorizontalMargin = width >= 768 ? moderateScale(12) : moderateScale(8);

    const renderBannerItem = ({ item, index }) => {
        const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1.02, 0.94],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ width: ITEM_WIDTH, paddingVertical: moderateScale(15) }}>
                <Animated.View style={[
                    styles.bannerItemWrapper,
                    {
                        transform: [{ scale }],
                        opacity,
                        marginHorizontal: bannerHorizontalMargin,
                    }
                ]}>
                    {/* Layered 3D Effect - Back Stack */}
                    <View style={styles.bannerLayerBack} />
                    <View style={styles.bannerLayerMiddle} />

                    {/* Main Content Card */}
                    <View style={styles.bannerWrapper3D}>
                        <Image
                            source={typeof item === 'number' ? item : { uri: item }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.bannerGradient} />
                        <View style={styles.bannerBadge}>
                            <Text style={styles.bannerBadgeText}>HOT</Text>
                        </View>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>Summer Sale</Text>
                            <Text style={styles.bannerSubtitle}>Up to 50% OFF</Text>
                            <TouchableOpacity
                                style={[styles.bannerButton, { backgroundColor: COLORS.white }]}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.bannerButtonText, { color: COLORS.primary }]}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={styles.bannerSection}>
            <Animated.FlatList
                ref={flatListRef}
                data={loopData}
                horizontal
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {
                        useNativeDriver: true,
                        listener: (event) => {
                            // Update dots instantly while scrolling
                            const offsetX = event.nativeEvent.contentOffset.x;
                            const index = Math.round(offsetX / ITEM_WIDTH);
                            const realIndex = index % banners.length;
                            if (realIndex !== activeBanner) {
                                setActiveBanner(realIndex);
                            }
                        }
                    }
                )}
                onScrollBeginDrag={stopAutoScroll}
                onScrollEndDrag={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                    handleInfiniteScroll(index);
                    startAutoScroll();
                }}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                    handleInfiniteScroll(index);
                }}
                renderItem={renderBannerItem}
                keyExtractor={(_, index) => `banner-${index}`}
                contentContainerStyle={[styles.bannerListContent, { paddingHorizontal: CONTAINER_PADDING }]}
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                })}
            />
            <View style={styles.bannerDots}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.bannerDot3D,
                            activeBanner === index && styles.activeBannerDot3D
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bannerSection: {
        marginTop: 1,
        marginBottom: SIZES.padding,
        paddingVertical: 10, // Increased to prevent scaling/badge clipping
    },
    bannerListContent: {
        // padding managed inline
    },
    bannerItem: {
        // width managed inline
        paddingHorizontal: 5, // No internal padding to keep snap accurate
    },
    bannerItemWrapper: {
        height: moderateScale(200),
        position: 'relative',
    },
    bannerLayerBack: {
        position: 'absolute',
        top: 12,
        left: 6,
        right: -6,
        bottom: -12,
        backgroundColor: COLORS.primary + '15', // Subtle primary tint
        borderRadius: 24,
        zIndex: -2,
    },
    bannerLayerMiddle: {
        position: 'absolute',
        top: 6,
        left: 3,
        right: -3,
        bottom: -6,
        backgroundColor: COLORS.primary + '25',
        borderRadius: 24,
        zIndex: -1,
    },
    bannerWrapper3D: {
        flex: 1,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        // Extreme 3D Shadow with Primary Color
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 15,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingBottom: 12, // Reduced to move content further down
        zIndex: 10,
    },
    bannerContent1: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingTop: 12, // Reduced to move content further down
        marginTop: 25,
        zIndex: 10,
    },
    bannerBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 50,
        // Small 3D shadow for badge
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    bannerBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    bannerTitle: {
        fontSize: rf(26),
        fontWeight: '900',
        color: COLORS.white,
        lineHeight: rf(32),
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 1, height: 2 },
                textShadowRadius: 4,
            },
            android: {
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 1, height: 2 },
                textShadowRadius: 4,
            },
            web: {
                textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
            },
        }),
    },
    bannerSubtitle: {
        fontSize: rf(16),
        color: COLORS.white,
        opacity: 0.95,
        fontWeight: '600',
    },
    bannerButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 10,
        ...SHADOWS.light,
    },
    bannerButtonText: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 12,
    },
    bannerDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    bannerDot3D: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: COLORS.gray[400],
        marginHorizontal: 3,
    },
    activeBannerDot3D: {
        backgroundColor: COLORS.primary,
        width: 20,
        ...SHADOWS.light,
    },
});

export default HomeBanner;
