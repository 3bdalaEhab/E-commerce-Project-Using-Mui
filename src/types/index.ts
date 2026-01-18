// API Response Types
export interface ApiResponse<T> {
    statusMsg?: string;
    message?: string;
    data?: T;
    results?: number;
    metadata?: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
    };
}

// Product Types
export interface Product {
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    images: string[];
    category: Category;
    subcategory: SubCategory[];
    brand?: Brand;
    ratingsAverage: number;
    ratingsQuantity: number;
    createdAt: string;
    updatedAt: string;
}

// Category Types
export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

// Brand Types
export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

// Cart Types
export interface CartItem {
    count: number;
    _id: string;
    product: Product | string;
    price: number;
}

export interface Cart {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    totalCartPrice: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartResponse {
    status: string;
    numOfCartItems: number;
    cartId?: string;
    data: Cart;
}

// Wishlist Types
export interface WishlistResponse {
    status: string;
    count: number;
    data: Product[];
}

// User/Auth Types
export interface User {
    name: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}

export interface ForgotPasswordCredentials {
    email: string;
}

export interface AuthResponse {
    message: string;
    user?: User;
    token?: string;
}

// Order Types
export interface Address {
    _id: string;
    name: string;
    details: string;
    phone: string;
    city: string;
}

export interface ShippingAddress {
    details: string;
    phone: string;
    city: string;
}

export interface Order {
    _id: string;
    user: string;
    cartItems: CartItem[];
    totalOrderPrice: number;
    paymentMethodType: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress: ShippingAddress;
    createdAt?: string;
    updatedAt?: string;
}
