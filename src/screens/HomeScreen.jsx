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
import { banners, promoBanner, aboutData } from '../constants/data';
import { COLORS, SIZES } from '../constants/theme';

// New Components
import HomeBanner from '../components/home/HomeBanner';
import HomeCategorySection from '../components/home/HomeCategorySection';
import HomeProductSection from '../components/home/HomeProductSection';
import DiscoveryBanner from '../components/home/DiscoveryBanner';
import { catalogService } from '../services/catalogService';
import { ActivityIndicator } from 'react-native';

const HomeScreen = ({ navigation }) => {
    // Removed products from useCart - now using API data only
    const { getCartItemCount } = useCart();
    const insets = useSafeAreaInsets();

    // State for live data
    const [liveCategories, setLiveCategories] = useState([]);
    const [liveProducts, setLiveProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showSearch, setShowSearch] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setIsLoading(true);
            const [cats, prods] = await Promise.all([
                catalogService.getAllCategories(),
                catalogService.getProductsForHome()
            ]);
            setLiveCategories(cats || []);
            setLiveProducts(prods || []);
        } catch (error) {
            console.error('Home Data Fetch Error:', error);
            // No fallback - show empty state
        } finally {
            setIsLoading(false);
        }
    };

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

    // Use only API data - no fallback
    const displayProducts = liveProducts;
    const displayCategories = liveCategories;

    // Safety check for products
    const safeProducts = Array.isArray(displayProducts) ? displayProducts : [];

    const filteredProducts = searchQuery
        ? safeProducts.filter(product =>
            product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : safeProducts;

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
        navigation.navigate('ProductList', {
            title: category.name || category.title,
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

    const handleProductPress = (product) => {
        // Robust ID selection:
        // 1. prefer productId if it exists and is not empty GUID
        // 2. fallback to id if it exists and is not empty GUID
        let targetId = null;
        const emptyGuid = '00000000-0000-0000-0000-000000000000';

        if (product.productId && product.productId !== emptyGuid) {
            targetId = product.productId;
        } else if (product.id && product.id !== emptyGuid) {
            targetId = product.id;
        }

        if (targetId) {
            navigation.navigate('ProductDetail', { productId: targetId });
        } else {
            console.warn('Home: Invalid product ID pressed:', product);
        }
    };

    // Expand data for "more items" feel if needed
    const expandedCategories = displayCategories.length < 5 ? [...displayCategories, ...displayCategories] : displayCategories;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                title="World-Cart"
                leftIcon="logo"
                onLeftPress={() => setShowAboutModal(true)}
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
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Fetching latest products...</Text>
                        </View>
                    ) : (!showSearch || !searchQuery ? (
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
                                onPressProduct={handleProductPress}
                                onSeeAllPress={() => handleSeeAllProducts('Featured Products', 'featured')}
                            />
                        </>
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <HomeProductSection
                                title={`Results for "${searchQuery}"`}
                                products={filteredProducts}
                                onPressProduct={handleProductPress}
                            />
                        </View>
                    ))}
                </View>
            </Animated.ScrollView>

            <CustomModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                primaryButton={{
                    text: "Shop Now",
                    onPress: () => setShowModal(false)
                }}
            />

            {/* About Modal */}
            <CustomModal
                visible={showAboutModal}
                onClose={() => setShowAboutModal(false)}
                title={aboutData.title}
                message={aboutData.message}
                type="info"
                icon={
                    <Image
                        source={require('../assets/icons/World-Cart.png')}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                        resizeMode="cover"
                    />
                }
                primaryButton={{
                    text: "Got it",
                    onPress: () => setShowAboutModal(false)
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
    loadingContainer: {
        paddingVertical: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.gray[500],
        fontSize: 14,
        fontWeight: '500',
    }
});

export default HomeScreen;
