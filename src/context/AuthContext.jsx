
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User object if logged in, null otherwise
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user session
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const userData = await AsyncStorage.getItem('userSession');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, rememberMe) => {
        // Simulate API call / Mock storage check
        // In real app: verify credentials against database/API

        // For this demo: check against stored "users" key or just simulate success if valid format
        try {
            const storedUsers = await AsyncStorage.getItem('users');
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            // Simple user find (supporting email, phone, or user ID)
            const foundUser = users.find(u =>
                (u.email === email || u.phone === email || u.id === email) && u.password === password
            );

            if (foundUser) {
                const sessionUser = { ...foundUser, password: '' }; // Remove sensitive pass

                // If "Remember Me" is true, we persist; otherwise, we might use a temporary session
                // For this simple mock, we just persist always if logged in, but in pro app, session management differs
                if (rememberMe) {
                    await AsyncStorage.setItem('userSession', JSON.stringify(sessionUser));
                } else {
                    // Logic for session-only storage (not implemented in simple AsyncStorage mock without session storage equivalent)
                    // We'll just set it for now
                    await AsyncStorage.setItem('userSession', JSON.stringify(sessionUser));
                }

                setUser(sessionUser);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid email or password.' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed due to error.' };
        }
    };

    const signup = async ({ firstName, lastName, phone, country, email, password }) => {
        // Simulate API call / Mock storage insert
        try {
            const storedUsers = await AsyncStorage.getItem('users');
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            // Check duplicate
            if (users.find(u => u.email === email)) {
                return { success: false, message: 'Email already registered.' };
            }

            const newUser = {
                id: Date.now().toString(),
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email,
                phone,
                country,
                password
            };
            users.push(newUser);

            await AsyncStorage.setItem('users', JSON.stringify(users));

            // DISABLED: Auto login after signup
            // We want the user to verify email and سپس login manually
            // const sessionUser = { ...newUser, password: '' };
            // await AsyncStorage.setItem('userSession', JSON.stringify(sessionUser));
            // setUser(sessionUser);

            return { success: true };
        } catch (error) {
            return { success: false, message: 'Signup failed.' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userSession');
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const storedUsers = await AsyncStorage.getItem('users');
            let users = storedUsers ? JSON.parse(storedUsers) : [];

            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                // Determine new name if first/last changed
                const firstName = profileData.firstName !== undefined ? profileData.firstName : users[userIndex].firstName;
                const lastName = profileData.lastName !== undefined ? profileData.lastName : users[userIndex].lastName;

                const updatedUser = {
                    ...users[userIndex],
                    ...profileData,
                    name: `${firstName} ${lastName}`.trim()
                };

                users[userIndex] = updatedUser;

                await AsyncStorage.setItem('users', JSON.stringify(users));

                const sessionUser = { ...updatedUser, password: '' };
                await AsyncStorage.setItem('userSession', JSON.stringify(sessionUser));
                setUser(sessionUser);

                return { success: true };
            }
            return { success: false, message: 'User not found.' };
        } catch (error) {
            console.error("Update profile error", error);
            return { success: false, message: 'Update failed.' };
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
