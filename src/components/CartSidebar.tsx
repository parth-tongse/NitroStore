import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, currentUser } = useStore();

  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950 backdrop-blur-xs cursor-pointer"
          />

          {/* Sidebar drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between h-full"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-indigo-400" />
                  <h3 className="text-base font-black text-white tracking-wide uppercase">Shopping Cart ({totalItems})</h3>
                </div>
                <button 
                  id="close-cart-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-2/3 text-center">
                    <ShoppingBag size={48} className="text-slate-600 mb-4 animate-bounce" />
                    <h4 className="text-sm font-bold text-slate-300">Your Cart is Empty</h4>
                    <p className="text-xs text-slate-500 max-w-[240px] mt-2 leading-relaxed">Add high-demand Discord Nitro subs or gaming accounts from the marketplace to get started.</p>
                    <button 
                      id="cart-start-shopping"
                      onClick={onClose}
                      className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center gap-3.5"
                    >
                      {/* Product Thumbnail */}
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="h-14 w-14 rounded-lg object-cover bg-slate-900 border border-slate-800"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-grow flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-white truncate">{item.product.name}</span>
                        <span className="text-xs font-black text-indigo-400 mt-1">₹{item.product.price} each</span>
                        
                        {/* Control actions bar */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button 
                              id={`minus-qty-${item.product.id}`}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-extrabold px-2 text-slate-200">{item.quantity}</span>
                            <button 
                              id={`plus-qty-${item.product.id}`}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <span className="text-xs font-black text-slate-300">₹{item.product.price * item.quantity}</span>
                        </div>
                      </div>

                      {/* Remove Trash */}
                      <button 
                        id={`remove-cart-item-${item.product.id}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-950/40 cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Bottom Totals Area */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-800 bg-slate-950/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subtotal</span>
                    <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 flex items-center gap-2 text-[10px] text-slate-400 font-semibold leading-relaxed">
                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                    <span>Instant activation links will be delivered securely upon payment verification. No fees applied.</span>
                  </div>

                  <button 
                    id="cart-checkout-btn"
                    onClick={onCheckout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {!currentUser && <Lock size={14} className="text-indigo-200" />}
                    {currentUser ? "🚀 Proceed to Checkout" : "Login to Checkout"}
                  </button>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
};
