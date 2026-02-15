import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { ArrowLeft3D, Search3D, Trash3D, Heart3D, Logout3D, Close3D } from './ThreeDIcons';
import { COLORS, SIZES } from '../constants/theme';
import { rf, moderateScale } from '../utils/responsive';

const getIconComponent = (iconName) => {
    const iconMap = {
        'arrow-left': ArrowLeft3D,
        'search': Search3D,
        'trash': Trash3D,
        'heart': (props) => <Heart3D {...props} focused={true} />,
        'heart-outline': Heart3D,
        'logout': Logout3D,
        'close': Close3D,
    };
    return iconMap[iconName] || null;
};

const Header = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress, badge }) => {
    const { width } = useWindowDimensions();
    const isLarge = width > 768;
    const iconSize = isLarge ? 28 : 24;

    return (
        <View style={[styles.container, { height: isLarge ? 80 : 64 }]}>
            {leftIcon ? (
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onLeftPress}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconButtonInner, { width: isLarge ? 50 : 44, height: isLarge ? 50 : 44 }]}>
                        {leftIcon === 'logo' ? (
                            <Image
                                source={require('../assets/World-Cart.png')}
                                style={[styles.logoImage, { width: isLarge ? 50 : 40, height: isLarge ? 50 : 40 }]}
                                resizeMode="contain"
                            />
                        ) : (() => {
                            const IconComponent = getIconComponent(leftIcon);
                            return IconComponent ? <IconComponent size={iconSize} color={COLORS.black} /> : null;
                        })()}
                    </View>
                </TouchableOpacity>
            ) : <View style={styles.placeholder} />}

            <View style={styles.titleContainer}>
                <Text style={[styles.title, { fontSize: isLarge ? rf(22) : rf(20) }]} numberOfLines={1}>{title}</Text>
            </View>

            {rightIcon ? (
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onRightPress}
                    activeOpacity={0.8}
                >
                    <View style={[
                        styles.iconButtonInner,
                        { width: isLarge ? 50 : 44, height: isLarge ? 50 : 44 },
                        rightIcon === 'heart' && styles.heartFilledButton
                    ]}>
                        {rightIcon === 'logo' ? (
                            <Image
                                source={require('../assets/World-Cart.png')}
                                style={[styles.logoImage, { width: isLarge ? 50 : 40, height: isLarge ? 50 : 40 }]}
                                resizeMode="contain"
                            />
                        ) : (() => {
                            const IconComponent = getIconComponent(rightIcon);
                            const iconColor = rightIcon === 'heart' ? COLORS.secondary :
                                rightIcon === 'trash' ? COLORS.danger :
                                    rightIcon === 'logout' ? COLORS.danger : COLORS.black;
                            return IconComponent ? <IconComponent size={iconSize} color={iconColor} /> : null;
                        })()}
                    </View>
                    {badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ) : <View style={styles.placeholder} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    iconButton: {
        position: 'relative',
    },
    iconButtonInner: {
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    heartFilledButton: {
        backgroundColor: '#FFEBEE',
    },
    placeholder: {
        width: 44,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontWeight: '900',
        color: COLORS.black,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.secondary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    logoImage: {
    },
});

export default Header;