// Product categories and their respective items
const productCategories = [
    'Dresses', 'Tops', 'Jeans', 'Jackets', 'Shoes', 'Bags', 'Accessories',
    'Activewear', 'Sweaters', 'Skirts', 'Suits', 'Swimwear'
];

const adjectives = [
    'Classic', 'Modern', 'Vintage', 'Elegant', 'Casual', 'Premium', 'Luxury',
    'Minimalist', 'Trendy', 'Chic', 'Stylish', 'Urban', 'Bohemian', 'Sporty',
    'Cozy', 'Sleek', 'Bold', 'Refined', 'Essential', 'Signature'
];

const materials = [
    'Cotton', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Cashmere',
    'Velvet', 'Satin', 'Jersey', 'Tweed', 'Suede', 'Canvas', 'Polyester'
];

const colors = [
    ['Black', 'White'], ['Navy', 'Grey'], ['Cream', 'Brown'], ['Red', 'Pink'],
    ['Blue', 'Green'], ['Burgundy', 'Tan'], ['Olive', 'Khaki'], ['Coral', 'Peach'],
    ['Lavender', 'Mint'], ['Charcoal', 'Ivory'], ['Teal', 'Mustard'], ['Rose', 'Sage']
];

const sizes = [
    ['XS', 'S', 'M', 'L', 'XL'],
    ['S', 'M', 'L'],
    ['M', 'L', 'XL'],
    ['6', '7', '8', '9', '10'],
    ['One Size'],
    ['S', 'M', 'L', 'XL', 'XXL']
];

const descriptions = [
    'Perfect for everyday wear with premium quality fabric.',
    'Designed with comfort and style in mind for the modern fashionista.',
    'A timeless piece that belongs in every wardrobe.',
    'Crafted with attention to detail for the discerning customer.',
    'Lightweight and breathable, ideal for all seasons.',
    'Statement piece that elevates any outfit effortlessly.',
    'Versatile design that transitions from day to night seamlessly.',
    'Premium materials ensure long-lasting quality and comfort.',
    'Contemporary design meets classic elegance.',
    'A must-have addition to your collection.'
];

const storeNames = [
    'Fashion Hub', 'Urban Style', 'Chic Boutique', 'TrendSetter', 'Vogue Valley',
    'Elite Wear', 'Modern Threads', 'Style Loft', 'Couture Corner', 'Runway Ready'
];

const brands = [
    'Zara', 'H&M', 'Gucci', 'Nike', 'Adidas', 'Uniqlo', 'Levis', 'Calvin Klein',
    'Ralph Lauren', 'Tommy Hilfiger', 'Forever 21', 'Gap', 'Puma', 'Under Armour',
    'North Face', 'Patagonia', 'Columbia', 'Vans', 'Converse', 'Reebok'
];

// Generate 150+ products
const generateProducts = () => {
    const products = [];

    // Category specific image IDs from Unsplash (curated for high-quality e-commerce)
    const categoryImages = {
        'Dresses': ['photo-1515372039744-b8f02a3ae446', 'photo-1496747611176-843222e1e57c'],
        'Tops': ['photo-1551163943-3f6a855d1153', 'photo-1503342217505-b0a15ec3261c'],
        'Jeans': ['photo-1542272604-787c3835535d', 'photo-1604176354204-926873ff3da9'],
        'Jackets': ['photo-1551028719-00167b16eac5', 'photo-1591047139829-d91aecb6caea'],
        'Shoes': ['photo-1542291026-7eec264c27ff', 'photo-1549298916-b41d501d3772'],
        'Bags': ['photo-1584917033904-47e14f071bbb', 'photo-1548036328-c9fa89d128fa'],
        'Accessories': ['photo-1535633302743-2092d0473551', 'photo-1515562141521-5a8b3af09ee8'],
        'Activewear': ['photo-1518310383802-640c2de311b2', 'photo-1483721310020-03333e577076'],
        'Sweaters': ['photo-1556905055-8f358a7a47b2', 'photo-1551821419-ed013b0c9ca8'],
        'Skirts': ['photo-1583496661160-fb5886a0aaaa', 'photo-1456885284447-7dd4bb8c204d'],
        'Suits': ['photo-1594932224011-04e389531861', 'photo-1507679799987-c73779587ccf'],
        'Swimwear': ['photo-1502030059105-aa7282f65ca2', 'photo-1531046039523-7a9173f4e1f5']
    };

    for (let i = 1; i <= 150; i++) {
        const categoryIndex = i % productCategories.length;
        const category = productCategories[categoryIndex];
        const imageIds = categoryImages[category] || ['photo-1483985988355-763728e1935b']; // fallback fashion
        const imageId = imageIds[i % imageIds.length];

        const adjectiveIndex = i % adjectives.length;
        const materialIndex = i % materials.length;
        const colorIndex = i % colors.length;
        const sizeIndex = i % sizes.length;
        const descIndex = i % descriptions.length;
        const storeIndex = i % storeNames.length;
        const brandIndex = i % brands.length;

        const basePrice = 15 + (i % 100) + Math.floor(Math.random() * 50);
        const discount = [15, 20, 25, 30, 35, 40][i % 6];
        const oldPrice = Math.round(basePrice / (1 - discount / 100));

        // Direct Unsplash Image URL (More reliable)
        // Using w=800 for optimization and q=80 for quality
        const mainImage = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=80`;
        const galleryImages = [
            mainImage,
            `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=80&blend=000000&blend-alpha=10`, // subtle variation
            `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80`, // lifestyle fallback
            `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80`  // store fallback
        ];

        // Random stock between 0 and 50 (some out of stock)
        const stock = Math.floor(Math.random() * 51);

        products.push({
            id: String(i),
            title: `${adjectives[adjectiveIndex]} ${materials[materialIndex]} ${category}`,
            category: category,
            storeName: storeNames[storeIndex],
            brand: brands[brandIndex],
            price: basePrice,
            oldPrice: oldPrice,
            discount: `${discount}%`,
            discountValue: discount,
            image: mainImage,
            images: galleryImages,
            hoverImage: galleryImages[1],
            sizes: sizes[sizeIndex],
            colors: colors[colorIndex],
            description: descriptions[descIndex],
            rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
            reviews: 50 + Math.floor(Math.random() * 500),
            wishlisted: i % 7 === 0,
            inCart: false,
            cartQuantity: 0,
            stock: stock,
            inStock: stock > 0
        });
    }

    return products;
};

export const products = generateProducts();

export const categories = [
    { "id": "c1", "name": "Women", "image": require('../assets/Women.png') },
    { "id": "c2", "name": "Men", "image": require('../assets/Men.png') },
    { "id": "c3", "name": "Kids", "image": require('../assets/Kids.png') },
    { "id": "c4", "name": "Beauty", "image": require('../assets/Beauty_Health.png') },
    { "id": "c5", "name": "Shoes", "image": require('../assets/Shoes.png') },
    { "id": "c6", "name": "Accessories", "image": require('../assets/Jewelry_Accessories.png') },
    { "id": "c7", "name": "Bags", "image": require('../assets/Bags_Luggage.png') },
    { "id": "c8", "name": "Home", "image": require('../assets/Home_Living.png') },
    { "id": "c9", "name": "Electronics", "image": require('../assets/Electronics.png') },
    { "id": "c10", "name": "Sports", "image": require('../assets/Sports_Outdoor.png') },
    { "id": "c11", "name": "Appliances", "image": require('../assets/Home_Appliance.png') },
    { "id": "c12", "name": "Auto", "image": require('../assets/Automotive.png') }
];

export const banners = [
    require('../assets/Banner1.png'),
    require('../assets/Banner2.png'),
    require('../assets/Banner3.png'),
    "https://picsum.photos/800/400?random=201",
    "https://picsum.photos/800/400?random=202",
    "https://picsum.photos/800/400?random=203",
    "https://picsum.photos/800/400?random=204",
];

export const promoBanner = require('../assets/Banner3.png');

export const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (234) 567-8900",
    membershipLevel: "Gold Member",
    loyaltyPoints: 2450,
    joinedDate: "January 2023",
    totalOrders: 12,
    totalSpent: 856.50
};

export const orders = [
    {
        id: "ORD001",
        date: "2024-02-15",
        items: 3,
        total: 145.99,
        status: "Delivered",
        tracking: "TRK7890123456"
    },
    {
        id: "ORD002",
        date: "2024-02-10",
        items: 2,
        total: 89.50,
        status: "Shipped",
        tracking: "TRK1234567890"
    },
    {
        id: "ORD003",
        date: "2024-02-05",
        items: 1,
        total: 65.00,
        status: "Processing",
        tracking: null
    },
    {
        id: "ORD004",
        date: "2024-01-28",
        items: 4,
        total: 234.00,
        status: "Delivered",
        tracking: "TRK9876543210"
    },
    {
        id: "ORD005",
        date: "2024-01-15",
        items: 2,
        total: 78.50,
        status: "Delivered",
        tracking: "TRK5432109876"
    }
];

export const addresses = [
    {
        id: "1",
        name: "Home",
        address: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        phone: "+1 (234) 567-8900",
        isDefault: true
    },
    {
        id: "2",
        name: "Office",
        address: "456 Business Ave, Suite 1200",
        city: "New York",
        state: "NY",
        zip: "10002",
        phone: "+1 (234) 567-8901",
        isDefault: false
    },
    {
        id: "3",
        name: "Parent's House",
        address: "789 Family Lane",
        city: "Brooklyn",
        state: "NY",
        zip: "11201",
        phone: "+1 (234) 567-8902",
        isDefault: false
    }
];

export const paymentMethods = [
    {
        id: "1",
        type: "card",
        last4: "4242",
        brand: "Visa",
        expiry: "12/25",
        isDefault: true
    },
    {
        id: "2",
        type: "card",
        last4: "5555",
        brand: "Mastercard",
        expiry: "08/26",
        isDefault: false
    },
    {
        id: "3",
        type: "paypal",
        email: "john.doe@paypal.com",
        isDefault: false
    }
];