
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import ProductCard from '../ProductCard';
import { moderateScale, rf } from '../../utils/responsive';


const HomeProductSection = ({ title, products = [], layout = 'grid', onPressProduct, onSeeAllPress }) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    // Responsive card width for horizontal scroll
    const horizontalCardWidth = isTablet ? width * 0.3 : width * 0.45;
    const horizontalSnapInterval = horizontalCardWidth + 16;


    if (!products || !Array.isArray(products) || products.length === 0) {
        return null;
    }

    const renderHorizontalItem = ({ item }) => {
        if (!item) return null;
        return (
            <ProductCard
                product={item}
                onPress={() => onPressProduct && onPressProduct(item)}
                containerStyle={{
                    width: horizontalCardWidth,
                    marginHorizontal: 0,
                    marginRight: 16,
                }}
            />
        );
    };

    return (
        <View style={styles.section}>

            <View style={styles.sectionHeader3D}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => onSeeAllPress && onSeeAllPress()}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            {layout === 'horizontal' ? (
                <FlatList
                    data={products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderHorizontalItem}
                    keyExtractor={(item, index) => `${title}-hz-${item.id}-${index}`}
                    contentContainerStyle={styles.horizontalListContent}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={horizontalSnapInterval}
                />
            ) : (
                <View style={styles.productsGrid}>
                    {products.map((product, index) => (
                        product ? (
                            <ProductCard
                                key={`${title}-grid-${product.id}-${index}`}
                                product={product}
                                onPress={() => onPressProduct && onPressProduct(product)}
                            />
                        ) : null
                    ))}
                </View>
            )}
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
        fontSize: SIZES.h3,
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
        fontSize: SIZES.body3,
        color: COLORS.gray[700],
        fontWeight: '600',
    },
    horizontalListContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: SIZES.base,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SIZES.base,
        justifyContent: 'center',
    },
});

export default HomeProductSection;
