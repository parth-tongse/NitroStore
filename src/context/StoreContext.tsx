import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Ticket, SocialLinks, Review, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_TICKETS, DEFAULT_SOCIAL_LINKS, INITIAL_REVIEWS } from '../data/mockData';

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed:", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem failed:", e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem failed:", e);
    }
  }
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserSession {
  username: string;
  email: string;
  role: 'customer' | 'admin';
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  tickets: Ticket[];
  socialLinks: SocialLinks;
  currentUser: UserSession | null;
  cart: CartItem[];
  productsLoaded: boolean;
  
  // Auth actions
  login: (email: string, password: string, role: 'customer' | 'admin', name?: string) => { success: boolean; error?: string };
  signup: (username: string, email: string, password: string, role: 'customer' | 'admin') => { success: boolean; error?: string };
  logout: () => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions
  createOrder: (orderData: {
    userName: string;
    userEmail: string;
    items: CartItem[];
    paymentMethod: string;
    notes?: string;
    utr?: string;
    paidAmount?: string;
    phone?: string;
  }) => Order[];
  updateOrderStatus: (id: string, status: 'pending' | 'delivered' | 'cancelled', deliveryData?: string) => void;
  
  // Support actions
  createTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => void;
  replyToTicket: (id: string, reply: string) => void;
  closeTicket: (id: string) => void;
  
  // Social links action
  updateSocialLinks: (links: SocialLinks) => void;
  
  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Payment dynamic configuration
  upiId: string;
  qrCodeUrl: string;
  updatePaymentDetails: (upiId: string, qrCodeUrl: string) => void;

  // Review actions
  reviews: Review[];
  createReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export interface RegisteredUser {
  username: string;
  email: string;
  role: 'customer' | 'admin';
  password: string;
}

const DEFAULT_REGISTERED_USERS: RegisteredUser[] = [
  { username: 'GamerAman', email: 'customer@gmail.com', role: 'customer', password: 'customer123' },
  { username: 'Parth Admin', email: 'parthtongse66@gmail.com', role: 'admin', password: 'Parth@#172005' }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  
  // Payment gateway configuration
  const [upiId, setUpiId] = useState('narutogaming172009@okhdfcbank');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Load initial data from localStorage or mock data
  useEffect(() => {
    try {
      // Check for URL-based reset / clear / logout query parameters
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('logout') || urlParams.has('clear') || urlParams.has('reset')) {
          safeLocalStorage.removeItem('ns_user');
          setCurrentUser(null);
          
          if (urlParams.has('clear') || urlParams.has('reset')) {
            safeLocalStorage.removeItem('ns_products');
            safeLocalStorage.removeItem('ns_orders');
            safeLocalStorage.removeItem('ns_tickets');
            safeLocalStorage.removeItem('ns_reviews');
            safeLocalStorage.removeItem('ns_social');
            safeLocalStorage.removeItem('ns_upi_id');
            safeLocalStorage.removeItem('ns_qr_code_url');
            safeLocalStorage.removeItem('ns_registered_users');
          }
          
          // Clear query parameters from address bar gracefully
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }

      const storedProducts = safeLocalStorage.getItem('ns_products');
      let initialProductsList = INITIAL_PRODUCTS;
      
      if (storedProducts) {
        try {
          initialProductsList = JSON.parse(storedProducts);
        } catch (e) {
          initialProductsList = INITIAL_PRODUCTS;
        }
      }
      setProducts(initialProductsList);

      // Async fetch products from backend server to synchronize
      fetch('/api/products')
        .then(res => res.json())
        .then(serverProducts => {
          if (serverProducts && Array.isArray(serverProducts) && serverProducts.length > 0) {
            setProducts(serverProducts);
            safeLocalStorage.setItem('ns_products', JSON.stringify(serverProducts));
          } else {
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialProductsList)
            }).catch(err => console.error("Failed to upload local products to server:", err));
          }
        })
        .catch(err => console.error("Failed to fetch products from server:", err));

      // Load orders
      const storedOrders = safeLocalStorage.getItem('ns_orders');
      let initialOrdersList = INITIAL_ORDERS;
      if (storedOrders) {
        try {
          let parsed = JSON.parse(storedOrders);
          if (parsed.some((o: any) => ['ORD-984321', 'ORD-765123', 'ORD-432109'].includes(o.id))) {
            parsed = [];
            safeLocalStorage.setItem('ns_orders', JSON.stringify([]));
          }
          initialOrdersList = parsed;
        } catch (e) {
          initialOrdersList = INITIAL_ORDERS;
        }
      }
      setOrders(initialOrdersList);

      // Async fetch orders from backend server to synchronize
      fetch('/api/orders')
        .then(res => res.json())
        .then(serverOrders => {
          if (serverOrders && Array.isArray(serverOrders) && serverOrders.length > 0) {
            setOrders(serverOrders);
            safeLocalStorage.setItem('ns_orders', JSON.stringify(serverOrders));
          } else if (initialOrdersList.length > 0) {
            fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialOrdersList)
            }).catch(err => console.error("Failed to upload local orders to server:", err));
          }
        })
        .catch(err => console.error("Failed to fetch orders from server:", err));

      // Load tickets
      const storedTickets = safeLocalStorage.getItem('ns_tickets');
      let initialTicketsList = INITIAL_TICKETS;
      if (storedTickets) {
        try {
          let parsed = JSON.parse(storedTickets);
          if (parsed.some((t: any) => ['TCK-2941', 'TCK-1048'].includes(t.id))) {
            parsed = [];
            safeLocalStorage.setItem('ns_tickets', JSON.stringify([]));
          }
          initialTicketsList = parsed;
        } catch (e) {
          initialTicketsList = INITIAL_TICKETS;
        }
      }
      setTickets(initialTicketsList);

      // Async fetch tickets from backend server to synchronize
      fetch('/api/tickets')
        .then(res => res.json())
        .then(serverTickets => {
          if (serverTickets && Array.isArray(serverTickets) && serverTickets.length > 0) {
            setTickets(serverTickets);
            safeLocalStorage.setItem('ns_tickets', JSON.stringify(serverTickets));
          } else if (initialTicketsList.length > 0) {
            fetch('/api/tickets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialTicketsList)
            }).catch(err => console.error("Failed to upload local tickets to server:", err));
          }
        })
        .catch(err => console.error("Failed to fetch tickets from server:", err));

      // Load reviews
      const storedReviews = safeLocalStorage.getItem('ns_reviews');
      let initialReviewsList = INITIAL_REVIEWS;
      if (storedReviews) {
        try {
          initialReviewsList = JSON.parse(storedReviews);
        } catch (e) {
          initialReviewsList = INITIAL_REVIEWS;
        }
      }
      setReviews(initialReviewsList);

      // Async fetch reviews from backend server to synchronize
      fetch('/api/reviews')
        .then(res => res.json())
        .then(serverReviews => {
          if (serverReviews && Array.isArray(serverReviews) && serverReviews.length > 0) {
            setReviews(serverReviews);
            safeLocalStorage.setItem('ns_reviews', JSON.stringify(serverReviews));
          } else if (initialReviewsList.length > 0) {
            fetch('/api/reviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialReviewsList)
            }).catch(err => console.error("Failed to upload local reviews to server:", err));
          }
        })
        .catch(err => console.error("Failed to fetch reviews from server:", err));

      const storedSocial = safeLocalStorage.getItem('ns_social');
      if (storedSocial) {
        setSocialLinks(JSON.parse(storedSocial));
      } else {
        setSocialLinks(DEFAULT_SOCIAL_LINKS);
        safeLocalStorage.setItem('ns_social', JSON.stringify(DEFAULT_SOCIAL_LINKS));
      }

      const storedUser = safeLocalStorage.getItem('ns_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedUpiId = safeLocalStorage.getItem('ns_upi_id');
      if (storedUpiId && storedUpiId !== 'nitrostoresell@okaxis') {
        setUpiId(storedUpiId);
      } else {
        const defaultUpi = import.meta.env.VITE_STORE_UPI_ID || 'narutogaming172009@okhdfcbank';
        setUpiId(defaultUpi);
        safeLocalStorage.setItem('ns_upi_id', defaultUpi);
      }

      const storedQrCodeUrl = safeLocalStorage.getItem('ns_qr_code_url');
      if (storedQrCodeUrl) {
        setQrCodeUrl(storedQrCodeUrl);
      } else {
        const defaultQr = import.meta.env.VITE_STORE_QR_CODE_URL || '';
        setQrCodeUrl(defaultQr);
        safeLocalStorage.setItem('ns_qr_code_url', defaultQr);
      }

      // Load registered users from safeLocalStorage first
      const storedRegisteredUsers = safeLocalStorage.getItem('ns_registered_users');
      let initialUsersList = DEFAULT_REGISTERED_USERS;
      if (storedRegisteredUsers) {
        try {
          initialUsersList = JSON.parse(storedRegisteredUsers);
        } catch (e) {}
      }
      setRegisteredUsers(initialUsersList);

      // Async fetch users from backend server to synchronize
      fetch('/api/users')
        .then(res => res.json())
        .then(serverUsers => {
          if (serverUsers && Array.isArray(serverUsers) && serverUsers.length > 0) {
            // Merge server users with DEFAULT_REGISTERED_USERS
            let merged = [...serverUsers];
            DEFAULT_REGISTERED_USERS.forEach(defUser => {
              if (!merged.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
                merged.push(defUser);
              }
            });
            setRegisteredUsers(merged);
            safeLocalStorage.setItem('ns_registered_users', JSON.stringify(merged));
          } else {
            // Upload current users list to server to initialize
            fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialUsersList)
            }).catch(err => console.error("Failed to upload local users to server:", err));
          }
        })
        .catch(err => console.error("Failed to fetch users from server:", err));

    } catch (e) {
      console.error("Failed to load state", e);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setTickets(INITIAL_TICKETS);
      setSocialLinks(DEFAULT_SOCIAL_LINKS);
      setRegisteredUsers(DEFAULT_REGISTERED_USERS);
    }
    setProductsLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ns_products' && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
      if (e.key === 'ns_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'ns_tickets' && e.newValue) {
        setTickets(JSON.parse(e.newValue));
      }
      if (e.key === 'ns_social' && e.newValue) {
        setSocialLinks(JSON.parse(e.newValue));
      }
      if (e.key === 'ns_upi_id' && e.newValue) {
        setUpiId(e.newValue);
      }
      if (e.key === 'ns_qr_code_url' && e.newValue) {
        setQrCodeUrl(e.newValue);
      }
      if (e.key === 'ns_registered_users' && e.newValue) {
        setRegisteredUsers(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Connect to SSE real-time stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    function connectSSE() {
      console.log("[SSE] Attempting real-time channel connection...");
      eventSource = new EventSource('/api/updates');

      eventSource.onmessage = (event) => {
        if (event.data === ':ok' || event.data === ':keepalive' || event.data === ':ping') return;
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'orders_updated') {
            console.log("[SSE] Received real-time orders update:", data.orders.length);
            setOrders(data.orders);
            safeLocalStorage.setItem('ns_orders', JSON.stringify(data.orders));
            
            if (data.newOrders && data.newOrders.length > 0) {
              console.log("[SSE] Dispatching new orders notification:", data.newOrders);
              const customEvent = new CustomEvent('ns_new_orders', { detail: data.newOrders });
              window.dispatchEvent(customEvent);
            }
          }
          
          if (data.type === 'tickets_updated') {
            console.log("[SSE] Received real-time tickets update:", data.tickets.length);
            setTickets(data.tickets);
            safeLocalStorage.setItem('ns_tickets', JSON.stringify(data.tickets));
            
            if (data.newTickets && data.newTickets.length > 0) {
              console.log("[SSE] Dispatching new tickets notification:", data.newTickets);
              const customEvent = new CustomEvent('ns_new_tickets', { detail: data.newTickets });
              window.dispatchEvent(customEvent);
            }
          }
          
          if (data.type === 'products_updated') {
            console.log("[SSE] Received real-time products update:", data.products.length);
            setProducts(data.products);
            safeLocalStorage.setItem('ns_products', JSON.stringify(data.products));
          }

          if (data.type === 'reviews_updated') {
            console.log("[SSE] Received real-time reviews update:", data.reviews.length);
            setReviews(data.reviews);
            safeLocalStorage.setItem('ns_reviews', JSON.stringify(data.reviews));
          }

          if (data.type === 'users_updated') {
            console.log("[SSE] Received real-time users update:", data.users.length);
            setRegisteredUsers(data.users);
            safeLocalStorage.setItem('ns_registered_users', JSON.stringify(data.users));
          }
        } catch (err) {
          console.error("[SSE] Error parsing SSE event:", err);
        }
      };

      eventSource.onerror = (err) => {
        // Handle reconnection silently without logging warnings or errors in the console
        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          eventSource.close();
          eventSource = null;
          reconnectTimeout = setTimeout(connectSSE, 3000);
        }
      };
    }

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  // Sync state helpers
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    safeLocalStorage.setItem('ns_products', JSON.stringify(newProducts));
    
    // Sync to server-side products.json
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProducts)
    }).catch(err => console.error("Failed to sync products to server:", err));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    safeLocalStorage.setItem('ns_orders', JSON.stringify(newOrders));
    
    // Sync to server-side orders.json
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrders)
    }).catch(err => console.error("Failed to sync orders to server:", err));
  };

  const saveTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    safeLocalStorage.setItem('ns_tickets', JSON.stringify(newTickets));
    
    // Sync to server-side tickets.json
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTickets)
    }).catch(err => console.error("Failed to sync tickets to server:", err));
  };

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    safeLocalStorage.setItem('ns_reviews', JSON.stringify(newReviews));
    
    // Sync to server-side reviews.json
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReviews)
    }).catch(err => console.error("Failed to sync reviews to server:", err));
  };

  const saveSocialLinks = (newSocial: SocialLinks) => {
    setSocialLinks(newSocial);
    safeLocalStorage.setItem('ns_social', JSON.stringify(newSocial));
  };

  // Auth Operations
  const saveRegisteredUsers = (newUsers: RegisteredUser[]) => {
    setRegisteredUsers(newUsers);
    safeLocalStorage.setItem('ns_registered_users', JSON.stringify(newUsers));
    
    // Sync to server-side users.json
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUsers)
    }).catch(err => console.error("Failed to sync users to server:", err));
  };

  const login = (email: string, password: string, role: 'customer' | 'admin', name?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user is registered in registeredUsers list
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!foundUser) {
      // Log unregistered login failure
      fetch('/api/logs/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, action: 'login_failed_unregistered', username: 'Unknown' })
      }).catch(err => console.error("Failed to log auth:", err));

      return { 
        success: false, 
        error: "This email is not registered. Please sign up first." 
      };
    }

    // Verify Password match - trim both sides to avoid accidental whitespaces
    if (foundUser.password && foundUser.password.trim() !== password.trim()) {
      // Log wrong password login failure
      fetch('/api/logs/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, action: 'login_failed_wrong_password', username: foundUser.username })
      }).catch(err => console.error("Failed to log auth:", err));

      return {
        success: false,
        error: "Incorrect password. Please enter the correct password."
      };
    } else if (!foundUser.password) {
      // If password field is missing from storage, initialize it now with what they entered
      foundUser.password = password.trim();
      const updatedUsers = registeredUsers.map(u => 
        u.email.toLowerCase() === normalizedEmail ? { ...u, password: password.trim() } : u
      );
      saveRegisteredUsers(updatedUsers);
    }

    // Determine secure role: only parthtongse66@gmail.com can be admin
    const finalRole = normalizedEmail === 'parthtongse66@gmail.com' ? 'admin' : foundUser.role;

    const session: UserSession = {
      username: foundUser.username,
      email: foundUser.email,
      role: finalRole
    };
    setCurrentUser(session);
    safeLocalStorage.setItem('ns_user', JSON.stringify(session));

    // Log successful login
    fetch('/api/logs/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password, action: 'login_success', username: foundUser.username })
    }).catch(err => console.error("Failed to log auth:", err));

    return { success: true };
  };

  const signup = (username: string, email: string, password: string, role: 'customer' | 'admin') => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const exists = registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      // Log failed signup (already registered)
      fetch('/api/logs/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, action: 'signup_failed_already_exists', username: username })
      }).catch(err => console.error("Failed to log auth:", err));

      return { 
        success: false, 
        error: "This email is already registered. Please login instead." 
      };
    }

    // Determine role
    const finalRole = normalizedEmail === 'parthtongse66@gmail.com' ? 'admin' : 'customer';

    let displayUsername = username.trim();
    if (displayUsername) {
      displayUsername = displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1);
    } else {
      displayUsername = normalizedEmail.split('@')[0];
      displayUsername = displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1);
    }

    const newUser: RegisteredUser = {
      username: displayUsername,
      email: normalizedEmail,
      role: finalRole,
      password: password
    };

    const updatedUsers = [...registeredUsers, newUser];
    saveRegisteredUsers(updatedUsers);

    const session: UserSession = {
      username: displayUsername,
      email: normalizedEmail,
      role: finalRole
    };
    setCurrentUser(session);
    safeLocalStorage.setItem('ns_user', JSON.stringify(session));

    // Log successful signup
    fetch('/api/logs/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password, action: 'signup_success', username: displayUsername })
    }).catch(err => console.error("Failed to log auth:", err));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    safeLocalStorage.removeItem('ns_user');
    setCart([]);
  };

  // Product Operations
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...prod, id };
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
  };

  // Order Operations
  const createOrder = (orderData: {
    userName: string;
    userEmail: string;
    items: CartItem[];
    paymentMethod: string;
    notes?: string;
    utr?: string;
    paidAmount?: string;
    phone?: string;
  }) => {
    const timestamp = new Date().toISOString();
    const newOrders: Order[] = orderData.items.map((item, idx) => {
      // Stock system disabled per user request

      return {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userName: orderData.userName,
        userEmail: orderData.userEmail,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
        status: 'pending', // Always pending initially, requiring admin check!
        paymentMethod: orderData.paymentMethod,
        createdAt: timestamp,
        notes: orderData.notes,
        utr: orderData.utr,
        paidAmount: orderData.paidAmount,
        phone: orderData.phone
      };
    });

    const updatedOrders = [...newOrders, ...orders];
    saveOrders(updatedOrders);

    // Log order creation to activity logs
    newOrders.forEach(ord => {
      fetch('/api/logs/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ord.userEmail,
          username: ord.userName,
          action: 'create_order',
          details: `Placed order ${ord.id} for ${ord.quantity}x ${ord.productName} (Total: ₹${ord.totalPrice}) using ${ord.paymentMethod}. Phone: ${ord.phone || 'N/A'}, UTR: ${ord.utr || 'N/A'}`
        })
      }).catch(err => console.error("Failed to write activity log:", err));
    });

    return newOrders;
  };

  const updateOrderStatus = (id: string, status: 'pending' | 'delivered' | 'cancelled', deliveryData?: string) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status,
          deliveryData: deliveryData !== undefined ? deliveryData : o.deliveryData
        };
      }
      return o;
    });
    saveOrders(updated);
  };

  // Support Ticket Operations
  const createTicket = (ticketFields: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticketFields,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    const updated = [newTicket, ...tickets];
    saveTickets(updated);

    // Log ticket creation to activity logs
    fetch('/api/logs/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newTicket.email,
        username: newTicket.name,
        action: 'create_ticket',
        details: `Created support ticket ${newTicket.id} with subject: "${newTicket.subject}" and message: "${newTicket.message}"`
      })
    }).catch(err => console.error("Failed to write activity log:", err));
  };

  const replyToTicket = (id: string, replyText: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'replied' as const,
          reply: replyText
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  const closeTicket = (id: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'closed' as const
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  // Reviews Operations
  const createReview = (reviewFields: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewFields,
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Log review creation to activity logs
    fetch('/api/logs/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser?.email || 'anonymous@gmail.com',
        username: newReview.name,
        action: 'create_review',
        details: `Submitted review ${newReview.id} with rating ${newReview.rating} and comment: "${newReview.comment}"`
      })
    }).catch(err => console.error("Failed to write activity log:", err));
  };

  // Social Links Operations
  const updateSocialLinks = (links: SocialLinks) => {
    saveSocialLinks(links);
  };

  // Cart Operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updatePaymentDetails = (newUpiId: string, newQrCodeUrl: string) => {
    setUpiId(newUpiId);
    setQrCodeUrl(newQrCodeUrl);
    safeLocalStorage.setItem('ns_upi_id', newUpiId);
    safeLocalStorage.setItem('ns_qr_code_url', newQrCodeUrl);
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      tickets,
      socialLinks,
      currentUser,
      cart,
      productsLoaded,
      upiId,
      qrCodeUrl,
      updatePaymentDetails,
      login,
      signup,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      createOrder,
      updateOrderStatus,
      createTicket,
      replyToTicket,
      closeTicket,
      updateSocialLinks,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      reviews,
      createReview
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
