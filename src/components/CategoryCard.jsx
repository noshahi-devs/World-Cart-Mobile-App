import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, useWindowDimensions } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { moderateScale, rf } from '../utils/responsive';
import { resolveImagePath } from '../utils/imagePathHelper';

const CategoryCard = ({ category, onPress }) => {
    const { width } = useWindowDimensions();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Scale card size slightly on tablets
    const cardSize = width > 768 ? moderateScale(84) : moderateScale(76);
    const iconSize = width > 768 ? moderateScale(72) : moderateScale(64);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
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

    // Handle both API format (imageUrl) and legacy format (image)
    const imageSource = typeof category.image === 'number'
        ? category.image
        : { uri: resolveImagePath(category.imageUrl || category.image) };

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={[styles.container, { width: cardSize }]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={[styles.iconContainer, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <Text style={styles.name}>{category.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginRight: moderateScale(14),
    },
    container: {
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: rf(11),
        color: COLORS.gray[700],
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default CategoryCard;