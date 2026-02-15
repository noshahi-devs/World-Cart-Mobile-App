
import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import AllCategoriesScreen from '../screens/AllCategoriesScreen';
import ProductListScreen from '../screens/ProductListScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerificationScreen from '../screens/VerificationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { COLORS } from '../constants/theme';
import {
    HomeOutline,
    HomeFilled,
    CartOutline,
    CartFilled,
    ProfileOutline,
    ProfileFilled,
} from '../components/TabIcons';
import { Home3D, Cart3D, Profile3D } from '../components/ThreeDIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    // Improved thresholds
    // Gesture modes usually have insets.bottom around 15-30
    // Button modes usually have insets.bottom around 40-50
    const isGestureMode = insets.bottom > 0 && insets.bottom < 35;
    const isButtonMode = insets.bottom >= 35;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size }) => {
                    const iconSize = 32;

                    if (route.name === 'Home') {
                        return <Home3D size={iconSize} focused={focused} />;
                    } else if (route.name === 'Cart') {
                        return <Cart3D size={iconSize} focused={focused} />;
                    } else if (route.name === 'Profile') {
                        return <Profile3D size={iconSize} focused={focused} />;
                    }
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray[400],
                headerShown: false,
                tabBarStyle: {
                    // Restore dynamic heights based on navigation mode
                    height: isButtonMode ? 65 : (isGestureMode ? 85 : 75),
                    paddingTop: 12,
                    paddingBottom: isButtonMode ? 4 : (isGestureMode ? 24 : 12),
                    backgroundColor: COLORS.white,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 4,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const insets = useSafeAreaInsets();
    const isButtonMode = insets.bottom >= 35;

    return (
        <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
            <View style={{ flex: 1, backgroundColor: COLORS.white }}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} />
                    <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
                    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
                    <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
                    <Stack.Screen name="ProductList" component={ProductListScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />

                    {/* Auth Screens */}
                    <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen name="Verification" component={VerificationScreen} />
                    </Stack.Group>
                </Stack.Navigator>
            </View>

            {/* Dark Box for System Navigation Bar */}
            {isButtonMode && (
                <View
                    style={{
                        height: insets.bottom,
                        backgroundColor: '#1A1A1A',
                        width: '100%',
                    }}
                />
            )}
        </View>
    );
};

export default AppNavigator;