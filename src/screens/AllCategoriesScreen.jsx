
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import { catalogService } from '../services/catalogService';
import { COLORS, SIZES } from '../constants/theme';

const AllCategoriesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await catalogService.getAllCategories();
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <CategoryCard
                category={item}
                onPress={() => {
                    navigation.navigate('ProductList', {
                        title: item.name,
                        filterType: 'category',
                        categoryId: item.id
                    });
                }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title="All Categories"
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={4}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    listContent: {
        padding: SIZES.padding,
        paddingTop: SIZES.padding * 1.5,
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.gray[600],
        fontSize: 14,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AllCategoriesScreen;
