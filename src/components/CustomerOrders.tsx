import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Clock, CheckCircle2, Copy, Check, Ticket, HelpCircle, ExternalLink, ShieldCheck, ArrowRight, CornerDownRight, RefreshCw, Star, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../data/mockData';

export const CustomerOrders: React.FC = () => {
  const { orders, currentUser, updateOrderStatus, reviews, createReview } = useStore();
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [copiedKeyText, setCopiedKeyText] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');

  // Local state for direct order reviews
  const [orderRatings, setOrderRatings] = useState<Record<string, number>>({});
  const [orderComments, setOrderComments] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState<Record<string, boolean>>({});

  // Filter orders for the current user
  const userOrders = React.useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(o => o.userEmail.toLowerCase() === currentUser.email.toLowerCase());
  }, [orders, currentUser]);

  const filteredOrders = React.useMemo(() => {
    return userOrders.filter(o => {
      const matchesSearch = o.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [userOrders, searchTerm, statusFilter]);

  const stats = React.useMemo(() => {
    const total = userOrders.length;
    const delivered = userOrders.filter(o => o.status === 'delivered').length;
    const pending = userOrders.filter(o => o.status === 'pending').length;
    return { total, delivered, pending };
  }, [userOrders]);

  const handleCopy = (text: string, id: string, type: 'order' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(id);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } else {
      setCopiedKeyText(id);
      setTimeout(() => setCopiedKeyText(null), 2000);
    }
  };

  if (!currentUser) {
    return (
      <div className="py-20 flex flex-col items-center justify-center max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-wide">Sign In to View Orders</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            To view your claimed gift cards, active premium subscriptions, and serial codes, please log in to your secure client profile.
          </p>
        </div>
        <button 
          id="orders-sign-in-prompt"
          onClick={() => {
            // Trigger auth tab change
            const authBtn = document.getElementById('nav-login-btn') || document.getElementById('mobile-login-btn');
            authBtn?.click();
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
        >
          Sign In Now
          <ArrowRight size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-400 font-extrabold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded">Secure Claims Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">My Purchased Products</h1>
          <p className="text-xs text-slate-400">View activation keys, instant gift links, and tracking details for orders on <span className="text-slate-300 font-bold">{currentUser.email}</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Claims</span>
            <span className="text-lg font-black text-white mt-1">{stats.total}</span>
          </div>
          <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[10px] text-emerald-500 font-bold uppercase">Delivered</span>
            <span className="text-lg font-black text-emerald-400 mt-1">{stats.delivered}</span>
          </div>
          <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[10px] text-amber-500 font-bold uppercase">Pending</span>
            <span className="text-lg font-black text-amber-400 mt-1">{stats.pending}</span>
          </div>
        </div>
      </div>

      {userOrders.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-white uppercase">No Purchases Logged</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't locate any active product claims linked to your email address. Visit the marketplace to buy high-quality premium subscriptions.
            </p>
          </div>
          <button 
            id="browse-store-from-empty"
            onClick={() => {
              const storeTab = document.getElementById('nav-store') || document.getElementById('mobile-nav-store');
              storeTab?.click();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase transition-all shadow-md cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        /* Order Lists and Filters */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900 p-3 border border-slate-850 rounded-2xl">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Search size={14} /></span>
              <input 
                type="text" 
                placeholder="Search products or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto">
              {(['all', 'pending', 'delivered', 'cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-grow sm:flex-grow-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                    statusFilter === status 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List Container */}
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-3xl overflow-hidden shadow-lg p-5 flex flex-col gap-4 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                    {/* Left Side: Product Meta */}
                    <div className="flex items-center gap-4.5">
                      <div className="relative shrink-0">
                        <img 
                          src={order.productImage} 
                          alt={order.productName} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-800 shadow-inner"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                          x{order.quantity}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 tracking-wider">ID: #{order.id}</span>
                          <button
                            onClick={() => handleCopy(order.id, order.id, 'order')}
                            className="p-1 rounded bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-850"
                            title="Copy Order ID"
                          >
                            {copiedOrderId === order.id ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                          </button>
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wide leading-tight">{order.productName}</h3>
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-3">
                          <span>Paid: <strong className="text-white">₹{order.totalPrice}</strong> via {order.paymentMethod}</span>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle / Right Side: Claim Code Box or Queue State */}
                    <div className="w-full md:w-auto md:max-w-md shrink-0 flex flex-col space-y-2">
                      
                      {order.status === 'delivered' && (
                        <div className="space-y-1 w-full md:min-w-[280px]">
                          <span className="block text-[8px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Delivered / Ready to Claim
                          </span>
                          
                          {order.deliveryData ? (
                            <div className="relative group bg-slate-950 border border-indigo-950/40 rounded-xl p-3 flex items-center justify-between gap-3 font-mono text-[10px] text-indigo-300">
                              <span className="truncate select-all max-w-[220px] whitespace-pre-wrap">{order.deliveryData}</span>
                              <button
                                onClick={() => handleCopy(order.deliveryData || '', order.id, 'key')}
                                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy Voucher/Link Code"
                              >
                                {copiedKeyText === order.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                              </button>
                            </div>
                          ) : (
                            <div className="p-3 bg-slate-950 rounded-xl text-[10px] text-slate-400 font-medium italic border border-slate-850">
                              Claim code not dispatched. Please contact support.
                            </div>
                          )}
                        </div>
                      )}

                      {order.status === 'pending' && (
                        <div className="p-3.5 bg-slate-950/60 border border-amber-500/20 rounded-2xl md:min-w-[280px] space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-extrabold text-amber-400 uppercase tracking-wide">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                              Awaiting Dispatch
                            </span>
                            <span>Queue Position #3</span>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-500 h-full w-[45%] animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                              Under 30 min me aapse store ke admins ya malik aapse contact karenge aur aapko aapka order email ya phone no pe mill jayega.
                            </p>
                          </div>
                        </div>
                      )}

                      {order.status === 'cancelled' && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center md:min-w-[280px]">
                          <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest">Transaction Void / Cancelled</span>
                          <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-relaxed">This order was cancelled. Please raise a ticket if this was a system error.</p>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Direct Star Feedback Section */}
                  {order.status === 'delivered' && (
                    <div className="pt-4 border-t border-slate-850/60 flex flex-col gap-3">
                      {reviews.some(r => r.orderId === order.id) || orderSuccess[order.id] ? (
                        <div className="flex items-center justify-between gap-3 p-3 bg-emerald-950/15 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} />
                            Aapka order review submit ho gaya hai! Feedback live hub par synchronized hai. Thank you!
                          </span>
                          <span className="flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 shrink-0">
                            {reviews.find(r => r.orderId === order.id)?.rating || orderRatings[order.id] || 5} ★
                          </span>
                        </div>
                      ) : (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const rating = orderRatings[order.id] || 5;
                            const commentText = orderComments[order.id] || '';
                            if (!commentText.trim()) return;

                            createReview({
                              name: currentUser?.username || 'Verified Buyer',
                              rating,
                              comment: commentText.trim(),
                              productName: order.productName,
                              orderId: order.id,
                              isVerifiedPurchase: true
                            });

                            setOrderSuccess(prev => ({ ...prev, [order.id]: true }));
                          }}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-850/70"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-grow">
                            {/* Star Rating Picker */}
                            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850 shrink-0">
                              <span className="text-[8px] font-black uppercase text-slate-500 mr-1">Rating:</span>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const activeRating = orderRatings[order.id] || 5;
                                return (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setOrderRatings(prev => ({ ...prev, [order.id]: star }))}
                                    className="p-0.5 hover:scale-125 transition-transform"
                                  >
                                    <Star 
                                      size={12} 
                                      className={`${
                                        star <= activeRating 
                                          ? 'text-amber-400 fill-amber-400' 
                                          : 'text-slate-800'
                                      } transition-colors`}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Comment Input text box */}
                            <input 
                              type="text"
                              required
                              placeholder="Direct feed back deyein yaha se (e.g. Awesome speed, fast key activation!)..."
                              value={orderComments[order.id] || ''}
                              onChange={(e) => setOrderComments(prev => ({ ...prev, [order.id]: e.target.value }))}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
