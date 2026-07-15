import React from 'react';
import { ShoppingCart, LogOut, User, LayoutDashboard, ShieldCheck, HelpCircle, FileText, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import nitroLogo from '../assets/images/nitrostore_logo_1783941902397.jpg';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenCart }) => {
  const { currentUser, logout, cart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-900 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md shadow-indigo-500/20">
              <img 
                src={nitroLogo} 
                alt="Nitro Store Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -inset-0.5 border border-indigo-500/20 rounded-xl pointer-events-none"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight leading-none bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">NITRO</span>
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase leading-none">STORE</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              id="nav-home"
              onClick={() => handleTabChange('home')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentTab === 'home' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              id="nav-store"
              onClick={() => handleTabChange('store')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentTab === 'store' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Browse Store
            </button>
            <button 
              id="nav-support"
              onClick={() => handleTabChange('support')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentTab === 'support' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact Support
            </button>
            <button 
              id="nav-reviews"
              onClick={() => handleTabChange('reviews')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentTab === 'reviews' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Reviews
            </button>
            <button 
              id="nav-terms"
              onClick={() => handleTabChange('terms')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentTab === 'terms' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Terms & Conditions
            </button>
            {currentUser && (
              <button 
                id="nav-orders"
                onClick={() => handleTabChange('orders')}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  currentTab === 'orders' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                My Purchases
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Cart Trigger */}
            <button 
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-indigo-400 transition-all cursor-pointer"
            >
              <ShoppingCart size={19} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-md shadow-purple-900 animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Session Handler */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-200">{currentUser.username}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                    {currentUser.role === 'admin' ? '👑 Admin' : 'Customer'}
                  </span>
                </div>
                
                {currentUser.role === 'admin' && (
                  <button 
                    id="nav-admin-dashboard"
                    onClick={() => handleTabChange('admin')}
                    title="Admin Dashboard"
                    className="p-2 rounded-lg bg-slate-900 border border-indigo-900/50 text-indigo-400 hover:bg-indigo-950/30 hover:text-indigo-300 transition-all cursor-pointer"
                  >
                    <LayoutDashboard size={18} />
                  </button>
                )}

                <button 
                  id="nav-logout-btn"
                  onClick={() => {
                    logout();
                    handleTabChange('home');
                  }}
                  title="Logout"
                  className="p-2 rounded-lg bg-slate-900 border border-rose-950/50 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                id="nav-login-btn"
                onClick={() => handleTabChange('auth')}
                className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 transition-all duration-300 cursor-pointer"
              >
                <User size={15} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart Trigger Mobile */}
            <button 
              id="nav-cart-mobile"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button 
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950 px-4 py-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <button 
            id="mobile-nav-home"
            onClick={() => handleTabChange('home')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'home' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Home
          </button>
          <button 
            id="mobile-nav-store"
            onClick={() => handleTabChange('store')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'store' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Browse Store
          </button>
          <button 
            id="mobile-nav-support"
            onClick={() => handleTabChange('support')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'support' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Contact Support
          </button>
          <button 
            id="mobile-nav-reviews"
            onClick={() => handleTabChange('reviews')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'reviews' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Reviews
          </button>
          <button 
            id="mobile-nav-terms"
            onClick={() => handleTabChange('terms')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'terms' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Terms & Conditions
          </button>

          {currentUser && (
            <button 
              id="mobile-nav-orders"
              onClick={() => handleTabChange('orders')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'orders' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              My Purchases
            </button>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <button 
              id="mobile-nav-admin"
              onClick={() => handleTabChange('admin')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'admin' ? 'bg-indigo-600/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              👑 Admin Dashboard
            </button>
          )}

          <div className="pt-4 border-t border-slate-900 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200">{currentUser.username}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">{currentUser.role === 'admin' ? '👑 Admin' : 'Customer'}</span>
                </div>
                <button 
                  id="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    handleTabChange('home');
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold py-1.5 px-3 rounded-lg bg-rose-950/20 border border-rose-950/50"
                >
                  <LogOut size={13} />
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                id="mobile-login-btn"
                onClick={() => handleTabChange('auth')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold text-center tracking-wide flex items-center justify-center gap-2"
              >
                <User size={15} />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
