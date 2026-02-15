
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../constants/data';
import { COLORS, SIZES } from '../constants/theme';

const AllCategoriesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    // Replicate the dense data feel for the full screen view
    const expandedCategories = [...categories, ...categories, ...categories];

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
            <FlatList
                data={expandedCategories}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={4}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
                showsVerticalScrollIndicator={false}
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
        padding: SIZES.padding,
        paddingTop: SIZES.padding * 1.5,
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
});

export default AllCategoriesScreen;
