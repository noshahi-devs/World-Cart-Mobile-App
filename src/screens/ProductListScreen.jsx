
import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const ProductListScreen = ({ route, navigation }) => {
    // Get title, sort type, filter id, and search query from navigation params
    const { title = 'Products', filterType, filterId, searchQuery } = route.params || {};
    const { products } = useCart();
    const insets = useSafeAreaInsets();

    const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];

        let result = [...products];

        // 1. Basic filtering by type (e.g. Featured, New Arrivals)
        if (filterType === 'featured') {
            // For now, just slice or logic (mock logic: featured often means curated or popular)
            // Just return all for now as "Featured Products" usually implies curated list
            // Or maybe filter by rating > 4?
            result = result.filter(p => p.rating > 4.5);
        } else if (filterType === 'new_arrivals') {
            // Mock logic: assume higher IDs are newer or just slice the middle
            result = result.slice(6, 20);
        } else if (filterType === 'trending') {
            // Mock logic: based on reviews count?
            result = result.filter(p => p.reviews > 200).slice(0, 20);
        } else if (filterType === 'for_you') {
            // Random or personalized logic: slice end
            result = result.slice(0, 10);
        } else if (filterType === 'category' && filterId) {
            // Category filtering would normally happen here if products had categoryId
            // Since data.jsx doesn't have explicit categoryId mapping (just strings), we skip exact filtering
            // But we can filter by title/description containing the category name loosely
            // For now, return all to keep it simple as data structure is dynamic
        }

        // 2. Search query filtering (if passed)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // If result is empty (e.g. no matches), return original list as fallback or empty
        return result.length > 0 ? result : products;
    }, [products, filterType, filterId, searchQuery]);


    const renderItem = ({ item }) => (
        <View style={styles.itemWrapper}>
            <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
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
            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
                columnWrapperStyle={styles.columnWrapper}
            />
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
});

export default ProductListScreen;
