
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { catalogService } from '../services/catalogService';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const ProductListScreen = ({ route, navigation }) => {
    // Get title, sort type, filter id, and search query from navigation params
    const { title = 'Products', filterType, categoryId, searchQuery } = route.params || {};
    const insets = useSafeAreaInsets();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [categoryId, filterType]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch more products (up to 100) and filter client-side for now
            const data = await catalogService.getProductListingsAcrossStores(0, 100);
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];

        let result = [...products];

        // TODO: When backend provides category filter API, use it instead
        // For now, basic client-side filtering
        if (filterType === 'category' && categoryId) {
            // Filter by category when backend supports it
            // result = result.filter(p => p.categoryId === categoryId);
        }

        // Search query filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(query) ||
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [products, filterType, categoryId, searchQuery]);


    const renderItem = ({ item }) => (
        <View style={styles.itemWrapper}>
            <ProductCard
                product={item}
                onPress={() => {
                    // Prioritize productId, fallback to id, but check for empty GUID
                    const targetId = item.productId || item.id;
                    if (targetId && targetId !== '00000000-0000-0000-0000-000000000000') {
                        navigation.navigate('ProductDetail', {
                            productId: targetId,
                            storeProductId: item.storeProductId || item.id // Favor explicit storeProductId, fallback to id
                        });
                    } else {
                        console.warn('Invalid product ID:', item);
                    }
                }}
                containerStyle={{ width: '100%', marginHorizontal: 0, marginBottom: 0 }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title={title}
                leftIcon="arrow-left"
                onLeftPress={() => navigation.goBack()}
                rightIcon="search"
            // Implement search functionality here?
            />
            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id || item.productId || item.storeProductId}-${index}`}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + 20 }
                    ]}
                    columnWrapperStyle={styles.columnWrapper}
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
        padding: SIZES.base,
        paddingTop: SIZES.padding,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.base,
    },
    itemWrapper: {
        width: (width - SIZES.padding * 2 - SIZES.base) / 2,
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

export default ProductListScreen;
