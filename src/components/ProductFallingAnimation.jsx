import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const ProductFallingAnimation = forwardRef((props, ref) => {
    const [elements, setElements] = useState([]);
    const nextId = useRef(0);

    useImperativeHandle(ref, () => ({
        trigger: (imageUri) => {
            const newElements = Array.from({ length: 12 }).map(() => ({
                id: nextId.current++,
                x: Math.random() * width,
                size: 30 + Math.random() * 30, // Slightly larger for images
                delay: Math.random() * 800,
                duration: 2500 + Math.random() * 1500,
                color: [COLORS.primary, '#4D94FF', '#80B3FF', '#B3D1FF'][Math.floor(Math.random() * 4)],
                icon: ['cart', 'bag-handle', 'gift', 'cart-outline'][Math.floor(Math.random() * 4)],
                imageUri: imageUri || null
            }));
            setElements(prev => [...prev, ...newElements]);
        }
    }));

    const removeElement = (id) => {
        setElements(prev => prev.filter(e => e.id !== id));
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {elements.map(element => (
                <FallingElement
                    key={element.id}
                    element={element}
                    onComplete={() => removeElement(element.id)}
                />
            ))}
        </View>
    );
});

const FallingElement = ({ element, onComplete }) => {
    const fallAnim = useRef(new Animated.Value(-60)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const driftAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fallAnim, {
                toValue: height + 60,
                duration: element.duration,
                delay: element.delay,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ),
            Animated.sequence([
                Animated.delay(element.delay),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(driftAnim, {
                            toValue: 30,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(driftAnim, {
                            toValue: -30,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        })
                    ])
                )
            ])
        ]).start(({ finished }) => {
            if (finished) onComplete();
        });
    }, []);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const opacity = fallAnim.interpolate({
        inputRange: [-60, 0, height * 0.5, height * 0.8],
        outputRange: [0, 1, 1, 0],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View
            style={[
                styles.element,
                {
                    left: element.x,
                    opacity: opacity,
                    transform: [
                        { translateY: fallAnim },
                        { translateX: driftAnim },
                        { rotate: rotation }
                    ],
                }
            ]}
        >
            {element.imageUri ? (
                <View style={styles.imageWrapper}>
                    <Animated.Image
                        source={{ uri: element.imageUri }}
                        style={{ width: element.size, height: element.size, borderRadius: element.size / 4 }}
                        resizeMode="contain"
                    />
                </View>
            ) : (
                <Ionicons name={element.icon} size={element.size} color={element.color} />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        elevation: 9999,
    },
    element: {
        position: 'absolute',
    },
    imageWrapper: {
        padding: 4,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        ...SHADOWS.light,
    }
});

export default ProductFallingAnimation;
