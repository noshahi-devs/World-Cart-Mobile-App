import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';
import Header from '../components/Header';
import { Search3D, Close3D } from '../components/ThreeDIcons';
import { useCart } from '../context/CartContext';
import { categories, banners, promoBanner } from '../constants/data';
import { COLORS, SIZES } from '../constants/theme';

// New Components
import HomeBanner from '../components/home/HomeBanner';
import HomeCategorySection from '../components/home/HomeCategorySection';
import HomeProductSection from '../components/home/HomeProductSection';
import DiscoveryBanner from '../components/home/DiscoveryBanner';

const HomeScreen = ({ navigation }) => {
    const { products = [], getCartItemCount } = useCart();
    const insets = useSafeAreaInsets();
    const [showSearch, setShowSearch] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        if (isAnimating) return;

        const opening = !showSearch;

        if (opening) {
            setShowSearch(true);
            setIsAnimating(true);
            Animated.spring(searchAnim, {
                toValue: 1,
                tension: 80,
                friction: 12,
                useNativeDriver: true
            }).start(() => setIsAnimating(false));
        } else {
            // Instant close for layout logic
            setShowSearch(false);
            setIsAnimating(false);
            searchAnim.setValue(0);
            setSearchQuery('');
        }
    };

    // Safety check for products
    const safeProducts = Array.isArray(products) ? products : [];

    const filteredProducts = searchQuery
        ? safeProducts.filter(product =>
            product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : safeProducts;

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
        // Implement category filtering or navigation
        // For now navigation to ProductList with category filter
        navigation.navigate('ProductList', {
            title: category.name,
            filterType: 'category',
            categoryId: category.id
        });
    };

    const handleSeeAllCategories = () => {
        navigation.navigate('AllCategories');
    };

    const handleSeeAllProducts = (title, type) => {
        navigation.navigate('ProductList', {
            title: title,
            filterType: type
        });
    };


    // Expand data for "more items" feel
    const expandedCategories = [...categories, ...categories, ...categories];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                title="World-Cart"
                leftIcon="logo"
                rightIcon={showSearch ? "close" : "search"}
                onRightPress={toggleSearch}
            />

            {/* Animated Search Bar */}
            {showSearch && (
                <Animated.View style={[
                    styles.searchWrapper3D,
                    {
                        opacity: searchAnim,
                        transform: [
                            {
                                scale: searchAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.1, 1]
                                })
                            },
                            {
                                translateX: searchAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [150, 0]
                                })
                            },
                            {
                                translateY: searchAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0]
                                })
                            }
                        ]
                    }
                ]}>
                    <View style={styles.searchContainer3D}>
                        <TextInput
                            style={styles.searchInput3D}
                            placeholder="Search extraordinary products..."
                            placeholderTextColor={COLORS.gray[400]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => {/* Logic for submit if needed */ }}
                            returnKeyType="search"
                            autoFocus
                        />
                        <View style={styles.searchActions}>
                            {searchQuery.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setSearchQuery('')}
                                    style={styles.clearButton3D}
                                >
                                    <Close3D size={20} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.searchIconButton}
                                activeOpacity={0.7}
                            >
                                <Search3D size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            )}

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: 100 + insets.bottom } // Add padding for bottom tabs
                ]}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.responsiveContainer}>
                    {!showSearch || !searchQuery ? (
                        <>
                            {/* Banners */}
                            <HomeBanner banners={banners} />

                            {/* Categories - Expanded List */}
                            <HomeCategorySection
                                categories={expandedCategories}
                                onCategoryPress={handleCategoryPress}
                                onSeeAllPress={handleSeeAllCategories}
                            />

                            {/* Middle Promo Banner - Now in its own component */}
                            <DiscoveryBanner banners={banners} />

                            {/* Featured Products */}
                            <HomeProductSection
                                title="Featured Products"
                                products={safeProducts.slice(0, 12)}
                                onPressProduct={(product) => navigation.navigate('ProductDetail', { productId: product.id })}
                                onSeeAllPress={() => handleSeeAllProducts('Featured Products', 'featured')}
                            />
                        </>
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <HomeProductSection
                                title={`Results for "${searchQuery}"`}
                                products={filteredProducts}
                                onPressProduct={(product) => navigation.navigate('ProductDetail', { productId: product.id })}
                            />
                        </View>
                    )}
                </View>
            </Animated.ScrollView>

            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title="Welcome!"
                message="Explore the best products in 3D style."
                primaryButton={{
                    text: "Shop Now",
                    onPress: () => setShowModal(false)
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    searchWrapper3D: {
        width: '100%',
        paddingHorizontal: SIZES.padding,
        marginTop: 10,
        marginBottom: 5,
        zIndex: 10,
    },
    searchContainer3D: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: COLORS.gray[200],
        // Premium 3D spread shadow
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    searchInput3D: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.black,
        paddingVertical: 0,
    },
    searchActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchIconButton: {
        padding: 4,
        marginLeft: 4,
    },
    clearButton3D: {
        padding: 4,
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
    },
    responsiveContainer: {
        width: '100%',
        maxWidth: 1200, // Elite Desktop constraint
        alignSelf: 'center',
    },
});

export default HomeScreen;
