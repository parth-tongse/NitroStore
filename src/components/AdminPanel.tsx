import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingCart, PlusCircle, PenTool, MessageSquare, Settings, DollarSign, Clock, CheckCircle, Trash2, Edit, Save, X, Plus, Trash, Globe, Send, Mail, Bell, Terminal, FileText, RefreshCw, Activity } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Ticket, SocialLinks } from '../data/mockData';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    tickets,
    socialLinks,
    upiId,
    qrCodeUrl,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    replyToTicket,
    closeTicket,
    updateSocialLinks,
    updatePaymentDetails
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'orders' | 'products' | 'tickets' | 'settings' | 'logs'>('dashboard');

  // Real-time toast notifications list
  const [toasts, setToasts] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'order' | 'ticket';
  }[]>([]);

  // Loud attention-grabbing bell chime sound using Web Audio API (Ding Dong effect with high-fidelity metallic overtones)
  const playLoudNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBellStrike = (time: number, baseFreq: number, duration: number) => {
        // A physical bell sound consists of a fundamental frequency combined with multiple higher-pitched overtones decaying at different speeds
        const overtones = [
          { ratio: 1.0, type: 'sine' as OscillatorType, volume: 0.6, decay: duration },
          { ratio: 1.5, type: 'sine' as OscillatorType, volume: 0.35, decay: duration * 0.7 },
          { ratio: 2.0, type: 'sine' as OscillatorType, volume: 0.25, decay: duration * 0.5 },
          { ratio: 2.6, type: 'triangle' as OscillatorType, volume: 0.18, decay: duration * 0.4 },
          { ratio: 3.1, type: 'sine' as OscillatorType, volume: 0.12, decay: duration * 0.3 },
          { ratio: 4.2, type: 'sine' as OscillatorType, volume: 0.08, decay: duration * 0.2 }
        ];

        overtones.forEach(overtone => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = overtone.type;
          osc.frequency.setValueAtTime(baseFreq * overtone.ratio, time);
          
          // Instant loud attack, followed by beautiful exponential decay for ring-out
          gainNode.gain.setValueAtTime(0, time);
          gainNode.gain.linearRampToValueAtTime(overtone.volume * 0.6, time + 0.008); 
          gainNode.gain.exponentialRampToValueAtTime(0.001, time + overtone.decay);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start(time);
          osc.stop(time + overtone.decay + 0.1);
        });
      };

      const now = audioCtx.currentTime;
      // High-pitched bright brass strike "Ding" (B5) followed by deep warm resonance "Dong" (G5)
      playBellStrike(now, 987.77, 2.0);
      playBellStrike(now + 0.35, 783.99, 2.8);
    } catch (error) {
      console.error("Failed to play real-time bell chime sound:", error);
    }
  };

  // Register real-time notification listener on mount
  useEffect(() => {
    const handleNewOrders = (e: Event) => {
      const customEvent = e as CustomEvent<Order[]>;
      const newOrdersList = customEvent.detail;
      if (!newOrdersList || newOrdersList.length === 0) return;
      
      // Play loud, sharp beep sequence
      playLoudNotificationSound();
      
      // Map to visual toasts and self-dismiss
      const newToasts = newOrdersList.map(order => {
        const toastId = `toast-order-${order.id}-${Date.now()}-${Math.random()}`;
        
        // Set self-dismiss timeout
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toastId));
        }, 12000);

        return {
          id: toastId,
          title: "🚨 NAYA ORDER AAYA HAI!",
          message: `Order ID: ${order.id} placed by ${order.userName} for ${order.productName} (Qty: ${order.quantity}) - Price: ₹${order.totalPrice}`,
          type: 'order' as const
        };
      });
      
      setToasts(prev => [...prev, ...newToasts]);
    };

    const handleNewTickets = (e: Event) => {
      const customEvent = e as CustomEvent<Ticket[]>;
      const newTicketsList = customEvent.detail;
      if (!newTicketsList || newTicketsList.length === 0) return;
      
      playLoudNotificationSound();
      
      const newToasts = newTicketsList.map(ticket => {
        const toastId = `toast-ticket-${ticket.id}-${Date.now()}-${Math.random()}`;
        
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toastId));
        }, 12000);

        return {
          id: toastId,
          title: "💬 SUPPORT TICKET RECEIVED",
          message: `Ticket ID: ${ticket.id} from ${ticket.name} (${ticket.email}): ${ticket.subject}`,
          type: 'ticket' as const
        };
      });
      
      setToasts(prev => [...prev, ...newToasts]);
    };

    window.addEventListener('ns_new_orders', handleNewOrders);
    window.addEventListener('ns_new_tickets', handleNewTickets);
    
    return () => {
      window.removeEventListener('ns_new_orders', handleNewOrders);
      window.removeEventListener('ns_new_tickets', handleNewTickets);
    };
  }, []);

  // Stats Calculator
  const stats = React.useMemo(() => {
    const totalSales = orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + o.totalPrice, 0);
    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const activeTicketsCount = tickets.filter(t => t.status === 'open').length;
    const totalProductsCount = products.length;

    return {
      totalSales,
      pendingOrdersCount,
      activeTicketsCount,
      totalProductsCount
    };
  }, [orders, tickets, products]);

  // Order filtration states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [deliveryKeyText, setDeliveryKeyText] = useState('');

  const filteredOrders = React.useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.userEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.productName.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Support ticket replies state
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'open' | 'replied'>('all');
  const [ticketSearch, setTicketSearch] = useState('');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  const filteredTickets = React.useMemo(() => {
    return tickets.filter(t => {
      const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
      const matchSearch = !ticketSearch.trim() || 
                          t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.name.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.email.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.message.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          (t.orderId && t.orderId.toLowerCase().includes(ticketSearch.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [tickets, ticketStatusFilter, ticketSearch]);

  // Product CRUD states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<string>('all');
  const [prodStock, setProdStock] = useState('');
  const [prodBadge, setProdBadge] = useState('');
  const [prodDelivery, setProdDelivery] = useState<'instant' | 'manual'>('instant');
  const [prodImage, setProdImage] = useState('');
  const [featureItem, setFeatureItem] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([]);

  // Default beautiful image presets
  const imagePresets = [
    { label: 'Purple Wave (Nitro)', url: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cyan Grid (Classic)', url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80' },
    { label: 'Gaming Setup (Accounts)', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Gold Loot (Keys)', url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Abstract Music (Spotify)', url: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleAddFeature = () => {
    if (featureItem.trim()) {
      setFeaturesList([...featuresList, featureItem.trim()]);
      setFeatureItem('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdCategory('all');
    setProdStock('');
    setProdBadge('');
    setProdDelivery('instant');
    setProdImage(imagePresets[0].url);
    setFeaturesList([]);
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setProdCategory(p.category);
    setProdStock(p.stock.toString());
    setProdBadge(p.badge || '');
    setProdDelivery(p.deliveryType);
    setProdImage(p.image);
    setFeaturesList(p.features);
    setShowProductForm(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodPrice) return;

    const parsedProduct = {
      name: prodName,
      description: prodDesc,
      price: parseFloat(prodPrice),
      originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
      category: prodCategory,
      stock: prodStock ? parseInt(prodStock) : 9999,
      badge: prodBadge || undefined,
      deliveryType: prodDelivery,
      image: prodImage,
      features: featuresList.length > 0 ? featuresList : ['Secured premium delivery']
    };

    if (editingProductId) {
      updateProduct(editingProductId, parsedProduct);
    } else {
      addProduct(parsedProduct);
    }

    setShowProductForm(false);
  };

  // Social handles state
  const [discordLink, setDiscordLink] = useState(socialLinks.discord);
  const [telegramLink, setTelegramLink] = useState(socialLinks.telegram);
  const [youtubeLink, setYoutubeLink] = useState(socialLinks.youtube);
  const [twitterLink, setTwitterLink] = useState(socialLinks.twitter);
  const [supportEmailAddress, setSupportEmailAddress] = useState(socialLinks.supportEmail);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);

  // Dynamic payment states
  const [adminUpiId, setAdminUpiId] = useState(upiId);
  const [adminQrCodeUrl, setAdminQrCodeUrl] = useState(qrCodeUrl);

  // System Log Viewer state
  const [logFiles, setLogFiles] = useState<{ authLogs: any[]; activityLogs: any[] }>({ authLogs: [], activityLogs: [] });
  const [selectedLogType, setSelectedLogType] = useState<'auth' | 'activity'>('auth');
  const [selectedLogFile, setSelectedLogFile] = useState<string | null>(null);
  const [selectedLogContent, setSelectedLogContent] = useState<string>('');
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Fetch log files listing
  const fetchLogFilesList = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/logs/list');
      if (res.ok) {
        const data = await res.json();
        setLogFiles({
          authLogs: data.authLogs || [],
          activityLogs: data.activityLogs || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch logs list:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Fetch specific log file contents
  const fetchLogFileContent = async (type: 'auth' | 'activity', filename: string) => {
    setIsLoadingContent(true);
    setSelectedLogFile(filename);
    setSelectedLogType(type);
    setSelectedLogContent('');
    try {
      const res = await fetch(`/api/logs/view?type=${type}&name=${encodeURIComponent(filename)}`);
      if (res.ok) {
        const text = await res.text();
        setSelectedLogContent(text);
      } else {
        setSelectedLogContent("Failed to load log file content.");
      }
    } catch (err) {
      console.error("Failed to fetch log file content:", err);
      setSelectedLogContent("An error occurred while loading log file contents.");
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Load log file list when logs tab is opened
  useEffect(() => {
    if (activeSubTab === 'logs') {
      fetchLogFilesList();
      setSelectedLogFile(null);
      setSelectedLogContent('');
    }
  }, [activeSubTab]);

  const handleSaveSocialSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks({
      discord: discordLink,
      telegram: telegramLink,
      youtube: youtubeLink,
      twitter: twitterLink,
      supportEmail: supportEmailAddress
    });
    updatePaymentDetails(adminUpiId, adminQrCodeUrl);
    setShowSettingsSuccess(true);
    setTimeout(() => setShowSettingsSuccess(false), 3000);
  };

  return (
    <div id="admin-panel-container" className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Settings size={14} className="animate-spin" />
              <span className="text-xs font-black tracking-widest uppercase">Central Command</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">Admin Operations</h2>
            <p className="text-xs text-slate-400 font-medium mt-1.5">Manage stock files, track client payments, deploy digital keys, and reply support tickets.</p>
          </div>

          {/* Sub tabs navigation */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'products', label: 'Products Catalog', icon: PlusCircle },
              { id: 'tickets', label: 'Support Inquiries', icon: MessageSquare },
              { id: 'settings', label: 'Social & Brand Settings', icon: Settings },
              { id: 'logs', label: 'Logs & Activity', icon: Terminal }
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  id={`admin-tab-${sub.id}`}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${
                    activeSubTab === sub.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                      : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB TAB 1: DASHBOARD STATS */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Sales (INR)</span>
                  <h4 className="text-2xl font-black text-white tracking-tight mt-1">₹{stats.totalSales}</h4>
                </div>
                <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-xl"><DollarSign size={24} /></div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Pending Dispatches</span>
                  <h4 className="text-2xl font-black text-white tracking-tight mt-1">{stats.pendingOrdersCount}</h4>
                </div>
                <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center rounded-xl"><Clock size={24} className="animate-pulse" /></div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Open Ticket Tickets</span>
                  <h4 className="text-2xl font-black text-white tracking-tight mt-1">{stats.activeTicketsCount}</h4>
                </div>
                <div className="h-12 w-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center rounded-xl"><MessageSquare size={24} /></div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active Products</span>
                  <h4 className="text-2xl font-black text-white tracking-tight mt-1">{stats.totalProductsCount}</h4>
                </div>
                <div className="h-12 w-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center rounded-xl"><PlusCircle size={24} /></div>
              </div>

            </div>

            {/* Live System Status & Controls Banner */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-850/70 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-indigo-950/10">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="relative mt-1 sm:mt-0 flex-shrink-0">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    Live Event Stream Activated
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md uppercase tracking-normal">Connected</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                    This admin panel automatically updates in real-time when clients buy items or submit support inquiries. An urgent alarm plays to notify you instantly when away.
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="admin-test-sound-btn"
                onClick={playLoudNotificationSound}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-center"
              >
                🔊 Play Test Alarm Sound
              </button>
            </div>

            {/* Quick overview of pending dispatches */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Quick pending orders list */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-900 rounded-3xl p-6.5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Action Required: Pending Deliveries</h3>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">{stats.pendingOrdersCount} Orders</span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin">
                  {orders.filter(o => o.status === 'pending').length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500 font-bold">
                      🎉 All orders fully dispatched! Excellent job.
                    </div>
                  ) : (
                    orders.filter(o => o.status === 'pending').map((ord) => (
                      <div key={ord.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <img src={ord.productImage} alt={ord.productName} className="h-11 w-11 object-cover bg-slate-900 border border-slate-800 rounded-lg" />
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white">{ord.productName} (x{ord.quantity})</span>
                            <span className="text-[9px] text-slate-500 mt-1 font-semibold">{ord.userName} ({ord.userEmail}) • {ord.id}</span>
                          </div>
                        </div>

                        <button 
                          id={`dispatch-dash-${ord.id}`}
                          onClick={() => {
                            setSelectedOrderForDelivery(ord);
                            setDeliveryKeyText('');
                            setActiveSubTab('orders');
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer whitespace-nowrap self-start md:self-center"
                        >
                          Dispatch Code / Login
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick pending support inquiries */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-900 rounded-3xl p-6.5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Critical Tickets</h3>
                  <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider">{stats.activeTicketsCount} Open</span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin">
                  {tickets.filter(t => t.status === 'open').length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500 font-bold">
                      🎉 No active support disputes or inquiries. Clean inbox!
                    </div>
                  ) : (
                    tickets.filter(t => t.status === 'open').map((tck) => (
                      <div key={tck.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2 cursor-pointer hover:border-slate-800 transition-colors" onClick={() => { setActiveTicket(tck); setTicketReplyText(''); setActiveSubTab('tickets'); }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white truncate max-w-[200px]">{tck.subject}</span>
                          <span className="text-[8px] font-bold text-slate-500 font-mono">{tck.id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                          "{tck.message}"
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-indigo-400 font-semibold">{tck.name} ({tck.email})</span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(tck.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUB TAB 2: ORDERS MANAGER */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter controls panel */}
            <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-850 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              
              <div className="flex-1 max-w-sm">
                <input 
                  id="order-admin-search"
                  type="text"
                  placeholder="Filter by Order ID, Client name, Email, Product..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-xl shrink-0">
                {(['all', 'pending', 'delivered'] as const).map((status) => (
                  <button
                    key={status}
                    id={`ord-status-tab-${status}`}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                      orderStatusFilter === status 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders list container */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 border border-slate-900 rounded-2xl text-xs text-slate-500 font-bold">
                  No orders matched current selection scope.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.id} id={`admin-ord-card-${ord.id}`} className="p-5 rounded-2xl bg-slate-900 border border-slate-850 flex flex-col space-y-4">
                    
                    {/* Header info block */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-850/60">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white flex items-center gap-2">
                          Invoice ID: <span className="text-indigo-400 font-mono">{ord.id}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 font-semibold">{new Date(ord.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                          Method: {ord.paymentMethod}
                        </span>
                        
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          ord.status === 'pending' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : ord.status === 'delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Product / Client details block */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Product Thumbnail */}
                      <div className="md:col-span-6 flex gap-3">
                        <img src={ord.productImage} alt={ord.productName} className="h-14 w-14 object-cover rounded-lg bg-slate-950 border border-slate-800" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-extrabold text-white truncate">{ord.productName}</span>
                          <span className="text-xs text-slate-400 mt-1.5 font-bold">Price: ₹{ord.totalPrice} (Qty: {ord.quantity})</span>
                        </div>
                      </div>

                      {/* Client metrics */}
                      <div className="md:col-span-6 flex flex-col justify-center border-l md:border-l border-slate-850/60 pl-0 md:pl-6 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Recipient Credentials</span>
                        <div className="text-xs font-bold text-slate-200">{ord.userName} ({ord.userEmail})</div>
                        {ord.phone && (
                          <div className="text-xs text-indigo-400 font-bold">
                            📞 Phone/WhatsApp: <span className="font-mono text-slate-200">{ord.phone}</span>
                          </div>
                        )}
                        {(ord.utr || ord.paidAmount) && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] pt-1">
                            {ord.utr && (
                              <div className="text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 font-mono">
                                UTR: <span className="text-slate-100">{ord.utr}</span>
                              </div>
                            )}
                            {ord.paidAmount && (
                              <div className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-mono">
                                Paid: <span className="text-slate-100">{ord.paidAmount}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {ord.notes && <span className="text-[10px] text-slate-400 italic block">" Note: {ord.notes} "</span>}
                      </div>

                    </div>

                    {/* Delivery content block / Actions */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
                      {ord.status === 'pending' ? (
                        <div className="space-y-3.5">
                          {selectedOrderForDelivery?.id === ord.id ? (
                            <div className="space-y-3">
                              <label className="block text-[9px] font-black text-amber-400 uppercase tracking-widest">Input claim vouchers / keys / account logins details:</label>
                              <textarea 
                                id={`delivery-key-textarea-${ord.id}`}
                                required
                                rows={2.5}
                                placeholder="Paste gift claims links (one per line) or write game log credentials here..."
                                value={deliveryKeyText}
                                onChange={(e) => setDeliveryKeyText(e.target.value)}
                                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <button 
                                  id={`submit-delivery-btn-${ord.id}`}
                                  onClick={() => {
                                    if (deliveryKeyText.trim()) {
                                      updateOrderStatus(ord.id, 'delivered', deliveryKeyText);
                                      setSelectedOrderForDelivery(null);
                                      setDeliveryKeyText('');
                                    }
                                  }}
                                  className="px-4.5 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                                >
                                  Mark as Dispatched
                                </button>
                                <button 
                                  id={`cancel-delivery-btn-${ord.id}`}
                                  onClick={() => setSelectedOrderForDelivery(null)}
                                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-semibold italic">Requires active dispatches of licensing claims codes...</span>
                              <button 
                                id={`start-delivery-btn-${ord.id}`}
                                onClick={() => setSelectedOrderForDelivery(ord)}
                                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase border border-amber-500/20 rounded-xl cursor-pointer transition-colors"
                              >
                                Dispatch Order Link
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-xs">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Claim Details (Dispatched):</span>
                          <p className="font-mono text-[10px] text-indigo-300 leading-relaxed whitespace-pre-wrap select-all">
                            {ord.deliveryData || 'No claiming details supplied.'}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* SUB TAB 3: PRODUCTS MANAGER */}
        {activeSubTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header controls bar */}
            <div className="flex justify-between items-center bg-slate-900 p-4.5 rounded-2xl border border-slate-850">
              <span className="text-xs font-bold text-slate-400 uppercase">Manage Stock items count: {products.length}</span>
              <button 
                id="admin-add-product-btn"
                onClick={handleOpenAddProduct}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                Create New Product
              </button>
            </div>

            {/* Products catalog list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} id={`admin-prod-card-${p.id}`} className="p-4.5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <img src={p.image} alt={p.name} className="h-11 w-11 object-cover rounded-lg bg-slate-950 border border-slate-800" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-white truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase">{p.category} • Price: ₹{p.price}</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {p.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1">
                      <span>Status: {p.stock === 0 ? <strong className="text-rose-400 font-bold uppercase">Out of Stock</strong> : <strong className="text-emerald-400 font-bold uppercase">In Stock</strong>}</span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 uppercase text-[9px] text-slate-300">{p.deliveryType} Delivery</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-850/60">
                    <button 
                      id={`edit-prod-${p.id}`}
                      onClick={() => handleOpenEditProduct(p)}
                      className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-indigo-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Edit size={11} />
                      Modify Edit
                    </button>
                    <button 
                      id={`delete-prod-${p.id}`}
                      onClick={() => deleteProduct(p.id)}
                      className="py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-950/40 text-rose-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CREATE / EDIT PRODUCT FORM DIALOG */}
            <AnimatePresence>
              {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs cursor-pointer" onClick={() => setShowProductForm(false)} />
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-xl bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-white uppercase tracking-wide">
                        {editingProductId ? '✏️ Edit Product Details' : '➕ Create New Store Product'}
                      </h3>
                      <button 
                        id="close-prod-form"
                        onClick={() => setShowProductForm(false)}
                        className="p-1 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <form id="admin-prod-catalog-form" onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs font-semibold">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Product Title</label>
                          <input 
                            id="form-prod-name"
                            type="text" 
                            required 
                            placeholder="e.g. Discord Nitro Classic (1 Month)"
                            value={prodName} 
                            onChange={(e) => setProdName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Product Category</label>
                          <select 
                            id="form-prod-category"
                            value={prodCategory} 
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="all">🔥 All Products</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Description Brief</label>
                        <textarea 
                          id="form-prod-desc"
                          required 
                          rows={2.5}
                          placeholder="Provide a detailed description of features, benefits, and specifications..."
                          value={prodDesc} 
                          onChange={(e) => setProdDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount Price (₹)</label>
                          <input 
                            id="form-prod-price"
                            type="number" 
                            step="1" 
                            required 
                            placeholder="249"
                            value={prodPrice} 
                            onChange={(e) => setProdPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Original Retail Price (₹)</label>
                          <input 
                            id="form-prod-origprice"
                            type="number" 
                            step="1" 
                            placeholder="799"
                            value={prodOriginalPrice} 
                            onChange={(e) => setProdOriginalPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Promo Badge Tag (Optional)</label>
                          <input 
                            id="form-prod-badge"
                            type="text" 
                            placeholder="e.g. 🔥 HOT SELL, 75% OFF"
                            value={prodBadge} 
                            onChange={(e) => setProdBadge(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Scope</label>
                          <select 
                            id="form-prod-delivery"
                            value={prodDelivery} 
                            onChange={(e) => setProdDelivery(e.target.value as any)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="instant">Instant Automated Claim Links</option>
                            <option value="manual">Manual dispatch - 15M waiting average</option>
                          </select>
                        </div>
                      </div>

                      {/* Stock Status Selector Buttons */}
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Product Stock Status</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            id="stock-status-in-stock"
                            type="button"
                            onClick={() => setProdStock('9999')}
                            className={`py-2 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              parseInt(prodStock) > 0 || !prodStock
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${parseInt(prodStock) > 0 || !prodStock ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                            In Stock
                          </button>
                          <button
                            id="stock-status-out-of-stock"
                            type="button"
                            onClick={() => setProdStock('0')}
                            className={`py-2 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              parseInt(prodStock) === 0 && prodStock !== ''
                                ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                                : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${parseInt(prodStock) === 0 && prodStock !== '' ? 'bg-rose-400 animate-pulse' : 'bg-slate-500'}`}></span>
                            Out of Stock
                          </button>
                        </div>
                      </div>

                      {/* Cover Selection Preset */}
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cover Image Source</label>
                        <div className="grid grid-cols-1 gap-2">
                          <input 
                            id="form-prod-image-url"
                            type="text" 
                            placeholder="Paste custom graphic URL or choose preset below..."
                            value={prodImage} 
                            onChange={(e) => setProdImage(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                          {/* Presets flex list */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {imagePresets.map((preset, idx) => (
                              <button
                                key={idx}
                                id={`img-preset-${idx}`}
                                type="button"
                                onClick={() => setProdImage(preset.url)}
                                className={`px-2 py-1 rounded text-[8px] font-bold border transition-all cursor-pointer ${
                                  prodImage === preset.url 
                                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                    : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Features bullets manager */}
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Add Feature Highlights ({featuresList.length})</label>
                        <div className="flex gap-2">
                          <input 
                            id="form-feature-item-input"
                            type="text" 
                            placeholder="e.g. 2 Server Boosts included"
                            value={featureItem} 
                            onChange={(e) => setFeatureItem(e.target.value)}
                            className="flex-grow px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                          />
                          <button 
                            id="add-feature-btn"
                            type="button"
                            onClick={handleAddFeature}
                            className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>
                        {/* Bullets grid */}
                        {featuresList.length > 0 && (
                          <div className="mt-2.5 p-2.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                            {featuresList.map((f, i) => (
                              <div key={i} className="flex items-center justify-between text-[10px] text-slate-300 font-semibold bg-slate-900 border border-slate-850 px-2 py-1 rounded-md">
                                <span className="truncate max-w-[400px]">{f}</span>
                                <button 
                                  id={`remove-feature-item-${i}`}
                                  type="button" 
                                  onClick={() => handleRemoveFeature(i)}
                                  className="text-rose-400 hover:text-rose-300 cursor-pointer"
                                >
                                  <Trash size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button 
                        id="save-product-submit"
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-black text-xs uppercase tracking-wider transition-all"
                      >
                        ✔️ Save Product Details
                      </button>

                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* SUB TAB 4: SUPPORT TICKETS REPLIES */}
        {activeSubTab === 'tickets' && (
          <div className="space-y-6">
            
            {/* Filters panel */}
            <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow">
                <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Critical disputes list: {tickets.length} total</span>
                <input 
                  type="text"
                  placeholder="Search by Order ID, Email, Name, or ID..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 w-full max-w-xs"
                />
              </div>
              
              <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-xl self-end md:self-auto">
                {(['all', 'open', 'replied'] as const).map((status) => (
                  <button
                    key={status}
                    id={`tck-status-tab-${status}`}
                    onClick={() => setTicketStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                      ticketStatusFilter === status 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets stack */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Tickets index list (left / bottom) */}
              <div className="md:col-span-6 space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/40 border border-slate-900 rounded-2xl text-xs text-slate-500 font-bold">
                    No active tickets located matching selected filter.
                  </div>
                ) : (
                  filteredTickets.map((tck) => (
                    <div 
                      key={tck.id} 
                      id={`admin-tck-row-${tck.id}`}
                      onClick={() => {
                        setActiveTicket(tck);
                        setTicketReplyText(tck.reply || '');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        activeTicket?.id === tck.id 
                          ? 'bg-slate-900 border-indigo-600' 
                          : 'bg-slate-900/50 border-slate-850/80 hover:bg-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white truncate max-w-[200px]">{tck.subject}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                          tck.status === 'open' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : tck.status === 'replied'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-slate-950 border-slate-850 text-slate-500'
                        }`}>
                          {tck.status}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2 line-clamp-2">
                        "{tck.message}"
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-850/40 mt-3 text-[9px] text-slate-500">
                        <span className="font-bold text-indigo-400">
                          {tck.name} ({tck.email})
                          {tck.orderId && (
                            <span className="ml-2 bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/40 font-mono font-bold text-[8px] uppercase tracking-wide">
                              Order: #{tck.orderId}
                            </span>
                          )}
                        </span>
                        <span className="font-mono">{new Date(tck.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply viewport panel (right / top) */}
              <div className="md:col-span-6">
                {activeTicket ? (
                  <div id="ticket-reply-viewport" className="p-6 bg-slate-900 border border-slate-850 rounded-3xl space-y-6 shadow-xl">
                    <div className="flex justify-between items-start pb-4 border-b border-slate-850">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest font-mono">Invoice ticket ID: {activeTicket.id}</span>
                          {activeTicket.orderId && (
                            <span className="text-[9px] font-black bg-indigo-950 border border-indigo-900/40 text-indigo-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                              Order: #{activeTicket.orderId}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-extrabold text-white mt-1 leading-tight">{activeTicket.subject}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                        activeTicket.status === 'open' 
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {activeTicket.status}
                      </span>
                    </div>

                    {/* Query details bubble */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Client query description ({activeTicket.name}):</span>
                      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[11px] text-slate-300 leading-relaxed font-semibold italic">
                        "{activeTicket.message}"
                      </div>
                    </div>

                    {/* Dispatch Reply input */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Operator response text:</label>
                      <textarea 
                        id="ticket-admin-reply-textarea"
                        required
                        rows={4}
                        placeholder="Type standard support instructions or dispatch alternative claims code links here..."
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none"
                      />
                      
                      <div className="flex gap-2">
                        <button 
                          id="ticket-admin-send-reply"
                          onClick={() => {
                            if (ticketReplyText.trim()) {
                              replyToTicket(activeTicket.id, ticketReplyText);
                              // Sync state in viewport
                              setActiveTicket({
                                ...activeTicket,
                                status: 'replied',
                                reply: ticketReplyText
                              });
                              setTicketReplyText('');
                            }
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors shadow-md"
                        >
                          <Send size={12} />
                          Dispatch Reply
                        </button>

                        {activeTicket.status !== 'closed' && (
                          <button 
                            id="ticket-admin-close"
                            onClick={() => {
                              closeTicket(activeTicket.id);
                              setActiveTicket({
                                ...activeTicket,
                                status: 'closed'
                              });
                            }}
                            className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-950/40 text-[10px] font-bold uppercase rounded-xl cursor-pointer transition-all"
                          >
                            Close Ticket
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-10 bg-slate-900/20 border border-dashed border-slate-850 rounded-3xl text-center text-xs text-slate-500 font-bold">
                    Select a ticket from the list on the left to read details and write official admin responses.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SUB TAB 5: SETTINGS */}
        {activeSubTab === 'settings' && (
          <form id="admin-settings-form" onSubmit={handleSaveSocialSettings} className="max-w-2xl bg-slate-900 border border-slate-850 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
              <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Socials & Core Brand configuration</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Edit community links rendered site-wide across sections</p>
              </div>
            </div>

            {showSettingsSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle size={14} className="shrink-0" />
                <span>Social Links updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Discord invite url</label>
                <input 
                  id="settings-discord"
                  type="text" 
                  value={discordLink} 
                  onChange={(e) => setDiscordLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Telegram channel url</label>
                <input 
                  id="settings-telegram"
                  type="text" 
                  value={telegramLink} 
                  onChange={(e) => setTelegramLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">YouTube channel url</label>
                <input 
                  id="settings-youtube"
                  type="text" 
                  value={youtubeLink} 
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Twitter channel url</label>
                <input 
                  id="settings-twitter"
                  type="text" 
                  value={twitterLink} 
                  onChange={(e) => setTwitterLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Support email credentials</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Mail size={14} /></span>
                <input 
                  id="settings-email"
                  type="email" 
                  value={supportEmailAddress} 
                  onChange={(e) => setSupportEmailAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
            </div>

            {/* UPI & Payment Config Section */}
            <div className="pt-4 border-t border-slate-850/60 space-y-4">
              <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-wider">
                💰 UPI Payment Gateway Setup
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    UPI ID (For Payments)
                  </label>
                  <input 
                    id="settings-upi-id"
                    type="text" 
                    value={adminUpiId} 
                    onChange={(e) => setAdminUpiId(e.target.value)}
                    placeholder="e.g. narutogaming172009@okhdfcbank"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
                  />
                  <p className="text-[9px] text-slate-500 font-medium mt-1">
                    Is UPI ID par custom order amounts seedhe transfer honge.
                  </p>
                </div>

                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Custom QR Code Image URL (Optional)
                  </label>
                  <input 
                    id="settings-qr-url"
                    type="text" 
                    value={adminQrCodeUrl} 
                    onChange={(e) => setAdminQrCodeUrl(e.target.value)}
                    placeholder="e.g. https://imgur.com/your-qr-image.png"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  <p className="text-[9px] text-slate-500 font-medium mt-1">
                    Khali chhodne par aapke UPI ID ke mutabik automatic QR code generate ho jayega!
                  </p>
                </div>
              </div>

              {/* Dynamic QR Preview Box */}
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Live QR Code Scanner Preview
                </span>
                <div className="p-2.5 bg-white rounded-xl shadow-md">
                  <img 
                    src={adminQrCodeUrl ? adminQrCodeUrl : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${adminUpiId}%26pn=NitroStore%26cu=INR`} 
                    alt="Admin Setup QR Preview"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <span className="text-[9px] text-indigo-400 font-black font-mono">
                  {adminQrCodeUrl ? "Using Custom QR Image Link" : `Dynamic QR for: ${adminUpiId}`}
                </span>
              </div>
            </div>

            <button 
              id="settings-save-btn"
              type="submit"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
            >
              <Save size={13} />
              Save Configuration Settings
            </button>
          </form>
        )}

        {/* SUB TAB 6: SYSTEM LOGS & SECURITY DEPOSITORIES */}
        {activeSubTab === 'logs' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header / Info bar */}
            <div className="p-6 bg-slate-900 border border-slate-850 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={18} className="text-indigo-400" />
                  System Storage & Security Logs
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">
                  Secure server-side flat file folders monitoring logins (credentials included) and real-time storefront events.
                  <span className="text-indigo-400 font-semibold ml-1">🗑️ Storage automatic reset rule: Logs older than 30 days are automatically deleted on new activities.</span>
                </p>
              </div>
              <button
                type="button"
                id="logs-refresh-btn"
                onClick={fetchLogFilesList}
                disabled={isLoadingLogs}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center disabled:opacity-50"
              >
                <RefreshCw size={12} className={isLoadingLogs ? "animate-spin" : ""} />
                {isLoadingLogs ? "Reading Folders..." : "Reload Directories"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Directory Structure / Folders */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-6">
                
                {/* Auth logs folder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="text-indigo-400">📁</span>
                      logs/auth/ (Creds & Logins)
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[8px] font-extrabold font-mono">
                      {logFiles.authLogs.length} Files
                    </span>
                  </div>

                  <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-thin">
                    {logFiles.authLogs.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-500 font-bold">
                        Empty Folder. No auth logs registered today.
                      </div>
                    ) : (
                      logFiles.authLogs.map((file: any) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => fetchLogFileContent('auth', file.name)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            selectedLogFile === file.name && selectedLogType === 'auth'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={12} className={selectedLogFile === file.name ? "text-white" : "text-indigo-400"} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-2">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Activity logs folder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="text-emerald-400">📁</span>
                      logs/activity/ (Store Logs)
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8px] font-extrabold font-mono">
                      {logFiles.activityLogs.length} Files
                    </span>
                  </div>

                  <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-thin">
                    {logFiles.activityLogs.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-500 font-bold">
                        Empty Folder. No activities logged yet.
                      </div>
                    ) : (
                      logFiles.activityLogs.map((file: any) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => fetchLogFileContent('activity', file.name)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            selectedLogFile === file.name && selectedLogType === 'activity'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Activity size={12} className={selectedLogFile === file.name ? "text-white" : "text-emerald-400"} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-2">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Side: Log Terminal / Console View */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-900 rounded-3xl p-6 flex flex-col min-h-[450px]">
                
                {selectedLogFile ? (
                  <div className="space-y-4 flex-1 flex flex-col">
                    
                    {/* Active File Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-850">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${selectedLogType === 'auth' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                          <h4 className="text-sm font-black text-white font-mono">{selectedLogFile}</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                          Path: logs/{selectedLogType}/{selectedLogFile}
                        </span>
                      </div>
                      
                      {/* Search & Actions */}
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Search lines..."
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-44"
                        />
                        <button
                          type="button"
                          onClick={() => fetchLogFileContent(selectedLogType, selectedLogFile)}
                          disabled={isLoadingContent}
                          className="p-1.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title="Refresh content"
                        >
                          <RefreshCw size={13} className={isLoadingContent ? "animate-spin" : ""} />
                        </button>
                      </div>
                    </div>

                    {/* Console View */}
                    <div className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl p-4.5 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[400px] scrollbar-thin select-text relative">
                      {isLoadingContent ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw size={18} className="text-indigo-400 animate-spin" />
                            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Loading entries...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {selectedLogContent
                            .split('\n')
                            .filter(line => line.trim() !== '')
                            .filter(line => line.toLowerCase().includes(logSearchQuery.toLowerCase()))
                            .length === 0 ? (
                              <div className="text-slate-600 italic py-10 text-center font-bold">
                                {logSearchQuery ? "No entries match your search filter." : "Log file is empty."}
                              </div>
                            ) : (
                              selectedLogContent
                                .split('\n')
                                .filter(line => line.trim() !== '')
                                .filter(line => line.toLowerCase().includes(logSearchQuery.toLowerCase()))
                                .map((line: string, idx: number) => {
                                  // Code color highlights for extreme clarity and aesthetic pairing
                                  let textColor = "text-emerald-400/90";
                                  if (line.includes("login_failed") || line.includes("signup_failed") || line.includes("fail")) {
                                    textColor = "text-rose-400 font-semibold";
                                  } else if (line.includes("login_success") || line.includes("signup_success")) {
                                    textColor = "text-cyan-400 font-bold";
                                  } else if (line.includes("create_order")) {
                                    textColor = "text-indigo-300";
                                  } else if (line.includes("create_ticket")) {
                                    textColor = "text-amber-300";
                                  }

                                  return (
                                    <div key={idx} className={`hover:bg-slate-900/50 py-0.5 px-1 rounded transition-colors whitespace-pre-wrap ${textColor}`}>
                                      {line}
                                    </div>
                                  );
                                })
                            )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold font-mono bg-slate-950/20 px-1 py-1 rounded-lg">
                      <span>Total Lines: {selectedLogContent.split('\n').filter(l => l.trim() !== '').length}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedLogContent);
                          alert("Logs copied to clipboard!");
                        }}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider text-[9px] font-black"
                      >
                        Copy All Contents
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-600 animate-pulse">
                      <Terminal size={24} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">No Log File Selected</h4>
                      <p className="text-[10px] text-slate-500 font-medium max-w-sm leading-relaxed">
                        Select an active daily log file from the left directory to audit login credentials, passwords, failed attempts, and storefront activities.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Real-time floating absolute toasts stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl shadow-2xl border pointer-events-auto flex gap-3.5 items-start ${
                toast.type === 'order'
                  ? 'bg-gradient-to-br from-indigo-950 to-slate-900 border-indigo-500/50 shadow-indigo-950/40 text-slate-100'
                  : 'bg-gradient-to-br from-rose-950 to-slate-900 border-rose-500/50 shadow-rose-950/40 text-slate-100'
              }`}
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${toast.type === 'order' ? 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-400' : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'}`}>
                <Bell size={16} className="animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`block text-[10px] font-black uppercase tracking-widest ${toast.type === 'order' ? 'text-indigo-400' : 'text-rose-400'}`}>
                  {toast.title}
                </span>
                <p className="text-[11px] text-slate-300 font-bold leading-relaxed mt-1 font-sans">
                  {toast.message}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (toast.type === 'order') {
                        setActiveSubTab('orders');
                      } else {
                        setActiveSubTab('tickets');
                      }
                      setToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/15 rounded-md text-white transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mt-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};
