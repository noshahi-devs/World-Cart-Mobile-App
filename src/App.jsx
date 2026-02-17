import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function configureNavigationBar() {
            if (Platform.OS === 'android') {
                try {
                    // Fix for edge-to-edge warning
                    // await NavigationBar.setBackgroundColorAsync('transparent');
                } catch (e) {
                    console.log('Navigation Bar Error:', e);
                }
            }
        }
        configureNavigationBar();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <CartProvider>
                        <NavigationContainer>
                            <AppNavigator />
                            <StatusBar style="dark" backgroundColor="#FFFFFF" />
                        </NavigationContainer>
                    </CartProvider>
                </AuthProvider>
            </SafeAreaProvider>

            {isLoading && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
                    <SplashScreen onFinish={() => setIsLoading(false)} />
                </View>
            )}
        </View>
    );
}
