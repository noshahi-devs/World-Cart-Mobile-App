import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const HeartFallingAnimation = forwardRef((props, ref) => {
    const [hearts, setHearts] = useState([]);
    const nextId = useRef(0);

    useImperativeHandle(ref, () => ({
        trigger: () => {
            const newHearts = Array.from({ length: 15 }).map(() => ({
                id: nextId.current++,
                x: Math.random() * width,
                size: 15 + Math.random() * 25,
                delay: Math.random() * 1000,
                duration: 2000 + Math.random() * 2000,
                color: [COLORS.secondary, '#FF4D4D', '#FF8080', '#FFB3B3'][Math.floor(Math.random() * 4)]
            }));
            setHearts(prev => [...prev, ...newHearts]);
        }
    }));

    const removeHeart = (id) => {
        setHearts(prev => prev.filter(h => h.id !== id));
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {hearts.map(heart => (
                <FallingHeart
                    key={heart.id}
                    heart={heart}
                    onComplete={() => removeHeart(heart.id)}
                />
            ))}
        </View>
    );
});

const FallingHeart = ({ heart, onComplete }) => {
    const fallAnim = useRef(new Animated.Value(-50)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const driftAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fallAnim, {
                toValue: height + 50,
                duration: heart.duration,
                delay: heart.delay,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ),
            Animated.sequence([
                Animated.delay(heart.delay),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(driftAnim, {
                            toValue: 20,
                            duration: 1000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(driftAnim, {
                            toValue: -20,
                            duration: 1000,
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
        inputRange: [-50, 0, height * 0.4, height * 0.7],
        outputRange: [0, 1, 1, 0],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View
            style={[
                styles.heart,
                {
                    left: heart.x,
                    opacity: opacity,
                    transform: [
                        { translateY: fallAnim },
                        { translateX: driftAnim },
                        { rotate: rotation }
                    ],
                }
            ]}
        >
            <Ionicons name="heart" size={heart.size} color={heart.color} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        elevation: 9999,
    },
    heart: {
        position: 'absolute',
    },
});

export default HeartFallingAnimation;
