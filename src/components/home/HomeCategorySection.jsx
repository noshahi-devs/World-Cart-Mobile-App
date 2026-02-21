
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import CategoryCard from '../CategoryCard';
import { rf, moderateScale } from '../../utils/responsive';


const HomeCategorySection = ({ categories = [], onCategoryPress, onSeeAllPress }) => {


    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return null;
    }

    const renderCategoryItem = ({ item }) => {
        if (!item) return null;
        return (
            <CategoryCard
                category={item}
                onPress={() => onCategoryPress && onCategoryPress(item)}
            />
        );
    };

    return (
        <View style={styles.section}>

            <View style={styles.sectionHeader3D}>
                <Text style={styles.sectionTitle}>Shop by Category</Text>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => onSeeAllPress && onSeeAllPress()}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}

                renderItem={renderCategoryItem}
                keyExtractor={(item, index) => `${item.categoryId || item.id}-${index}`}
                contentContainerStyle={styles.categoriesContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: SIZES.padding * 1.5,
    },
    sectionHeader3D: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
        paddingHorizontal: SIZES.padding,
    },
    sectionTitle: {
        fontSize: rf(18),
        fontWeight: 'bold',
        color: COLORS.black,
    },
    seeAllButton: {
        backgroundColor: COLORS.gray[200],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    seeAllText: {
        fontSize: rf(12),
        color: COLORS.gray[700],
        fontWeight: '600',
    },
    categoriesContent: {
        paddingHorizontal: SIZES.padding,
    },
});

export default HomeCategorySection;
