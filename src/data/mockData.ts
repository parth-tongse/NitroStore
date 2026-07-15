export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string; // Unsplash image or vector description
  stock: number;
  badge?: string;
  deliveryType: 'instant' | 'manual';
  features: string[];
}

export interface Order {
  id: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  deliveryData?: string; // key, token, or instructions
  notes?: string;
  utr?: string;
  paidAmount?: string;
  phone?: string;
}

export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  reply?: string;
  createdAt: string;
  orderId?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  orderId?: string;
  productName?: string;
  isVerifiedPurchase?: boolean;
}

export interface SocialLinks {
  discord: string;
  telegram: string;
  youtube: string;
  twitter: string;
  supportEmail: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1784003222051",
    name: "Discord Nitro Ids (2 Week) Unclaimed",
    description: "Get the full Discord experience with 2 free Server Boosts, custom emojis, custom profiles, larger 100MB file uploads, and HD video streaming.",
    price: 10,
    originalPrice: 15,
    category: "all",
    stock: 0,
    badge: "👑 PREMIUM ACCOUNT",
    deliveryType: "manual",
    image: "https://i0.wp.com/news.seagm.com/wp-content/uploads/2025/11/Discord-Nitro-2-week-free-trial.jpg?w=844&ssl=1",
    features: [
      "Delivered within 30 minutes",
      "Use custom emojis globally",
      "Custom Profile banners & animations"
    ]
  },
  {
    id: "nitro-boost-1m",
    name: "Discord Nitro Ids (1 Month)",
    description: "Get the full Discord experience with 2 free Server Boosts, custom emojis, custom profiles, larger 100MB file uploads, and HD video streaming.",
    price: 45,
    originalPrice: 55,
    category: "all",
    image: "https://d2a3xaszyiwsbd.cloudfront.net/prod/products/zs7ADBKXTubtLEjaFl6g1KkEdVIFKxmRrZ2kslST.jpg",
    stock: 100,
    badge: "🔥 BEST SELLER",
    deliveryType: "manual",
    features: [
      "2 Server Boosts included",
      "Custom Profiles & Themes",
      "HD Video Streaming (1080p 60fps)",
      "100MB Upload Limit",
      "Instant Automated Delivery"
    ]
  },
  {
    id: "nitro-boost-1y",
    name: "Discord Nitro Ids (1 Month) unclaimed",
    description: "Get the full Discord experience with 2 free Server Boosts, custom emojis, custom profiles, larger 100MB file uploads, and HD video streaming.",
    price: 20,
    originalPrice: 27,
    category: "all",
    image: "https://d2a3xaszyiwsbd.cloudfront.net/prod/products/zs7ADBKXTubtLEjaFl6g1KkEdVIFKxmRrZ2kslST.jpg",
    stock: 50,
    badge: "💎 BEST SELLER",
    deliveryType: "manual",
    features: [
      "12 Months full Nitro",
      "Use custom emojis globally",
      "Custom Profile banners & animations",
      "Automated Instant Delivery"
    ]
  },
  {
    id: "nitro-classic-1m",
    name: "Discord 14x server Boost (1 month)",
    description: "Enjoy essential custom chat features including custom emojis, animated avatars, custom tag, and 50MB file uploads without Server Boosts.",
    price: 300,
    originalPrice: 350,
    category: "all",
    image: "https://images.g2a.com/300x400/1x1x1/discord-server-boost-14x-1-month-discord-boost-activation-link-global-i10000502884001/8c28b74faf8445948fc97091",
    stock: 87,
    badge: "⚡ CHEAPEST",
    deliveryType: "manual",
    features: [
      "Custom animated emojis anywhere",
      "Animated avatar and custom tag",
      "50MB file uploading",
      "Screen sharing up to 1080p 30fps",
      "Instant Automated Delivery"
    ]
  },
  {
    id: "gta-modded-pc",
    name: "Instagram 1k Real Follow",
    description: "Real And Online Followers",
    price: 60,
    originalPrice: 80,
    category: "all",
    image: "https://cdn.pixabay.com/photo/2016/12/04/18/58/instagram-1882330_1280.png",
    stock: 10000000,
    badge: "👑BEST SELLER",
    deliveryType: "manual",
    features: [
      "Delivered within 30 minutes",
      "Best and high Quality Accounts",
      "Old And Active Followers"
    ]
  },
  {
    id: "valorant-1000vp",
    name: "Discord Server online 1K Members",
    description: "Bot Add mandatory",
    price: 260,
    originalPrice: 300,
    category: "all",
    image: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-color-icon.png",
    stock: 1000000,
    badge: "🎮BEST SELLER",
    deliveryType: "manual",
    features: [
      "Full Safe",
      "All Accounts Are Active",
      "Best And High Quality Accounts"
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TICKETS: Ticket[] = [];

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  discord: import.meta.env.VITE_STORE_DISCORD || 'https://discord.gg/dostana',
  telegram: import.meta.env.VITE_STORE_TELEGRAM || 'https://telegram.me/NitroStoreofficial',
  youtube: import.meta.env.VITE_STORE_YOUTUBE || 'https://youtube.com/@NarutoGaming-x6j',
  twitter: import.meta.env.VITE_STORE_TWITTER || '#',
  supportEmail: import.meta.env.VITE_STORE_SUPPORT_EMAIL || 'parthtongse66@gmail.com'
};

export const INITIAL_REVIEWS: Review[] = [];

