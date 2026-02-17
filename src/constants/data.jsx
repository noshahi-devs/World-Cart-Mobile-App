// ============================================
// BACKEND-DRIVEN DATA
// ============================================
// Products and Categories are now fetched from backend APIs:
// - Categories: /api/services/app/Category/GetAll
// - Products: /api/services/app/Homepage/GetAllProductsForCards
// - Product Detail: /api/services/app/Homepage/GetProductDetail
//
// This file only contains UI-specific static data

// ============================================
// BANNERS (UI Content - Keep for now)
// ============================================
export const banners = [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
];

export const promoBanner = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";

// ============================================
// ABOUT DATA (App Information)
// ============================================
export const aboutData = {
    title: 'The World-Cart Evolution',
    message: 'World-Cart is the definitive future of the global 3D e-commerce experience.\n\n🌏 OUR VISION\nWe believe shopping should be extraordinary. By combining cutting-edge 3D rendering with seamless logistics, we bring the premium store experience directly to your fingertips.\n\n💎 UNCOMPROMISED QUALITY\nEvery seller on our platform undergoes a rigorous 5-step verification process. From material sourcing to final delivery, we ensure that every product meets our "Elite Standard".\n\n🚀 INNOVATION AT SCALE\n● Presence: Serving customers in over 50+ countries.\n● Network: Partnered with 100,000+ verified premium brands.\n● Logistics: Real-time global tracking with eco-friendly packaging.'
};

// ============================================
// USER PROFILE DATA (Mock - Replace with API later)
// ============================================
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

// ============================================
// ORDERS DATA (Mock - Replace with API later)
// ============================================
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

// ============================================
// ADDRESSES DATA (Mock - Replace with API later)
// ============================================
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

// ============================================
// PAYMENT METHODS DATA (Mock - Replace with API later)
// ============================================
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