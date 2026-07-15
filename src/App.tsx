import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportForm } from './components/SupportForm';
import { TermsSection } from './components/TermsSection';
import { AuthPage } from './components/AuthPage';
import { AdminPanel } from './components/AdminPanel';
import { CustomerOrders } from './components/CustomerOrders';
import { ReviewsSection } from './components/ReviewsSection';
import { BackgroundMusic } from './components/BackgroundMusic';
import { AIChatBot } from './components/AIChatBot';
import { LandingPortal } from './components/LandingPortal';
import { Preloader } from './components/Preloader';
import { Mail, MessageSquare, ShieldAlert, Zap, Compass, Twitter, Youtube, ArrowUpRight, Lock } from 'lucide-react';

function AppContent() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [storeCategoryFilter, setStoreCategoryFilter] = useState<string>('all');
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authWarning, setAuthWarning] = useState<boolean>(false);

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const { addToCart, socialLinks, currentUser, login, cart } = useStore();

  const handleBrowseStore = (category: string = 'all', searchQuery: string = '') => {
    setStoreCategoryFilter('all');
    setStoreSearchQuery(searchQuery);
    setCurrentTab('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleBuyNow = (product: any) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const isPublicPage = ['home', 'store', 'support', 'terms', 'reviews'].includes(currentTab);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  if (!hasEntered) {
    return <LandingPortal onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div id="application-root" className="min-h-screen flex flex-col bg-slate-950 font-sans selection:bg-indigo-600/30 selection:text-white">
      
      {/* Universal Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-950 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 flex items-center justify-center gap-1.5 shadow-md z-50">
        <Zap size={11} className="text-amber-400 animate-pulse shrink-0" />
        <span>Welcome To Nitro Store</span>
      </div>

      {/* Main navigation header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Active page views */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <Hero 
            onBrowseStore={handleBrowseStore} 
            onContactSupport={() => setCurrentTab('support')} 
          />
        )}

        {currentTab === 'store' && (
          <Marketplace 
            initialCategoryFilter={storeCategoryFilter}
            initialSearchQuery={storeSearchQuery}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentTab === 'support' && (
          <SupportForm />
        )}

        {currentTab === 'reviews' && (
          <ReviewsSection />
        )}

        {currentTab === 'terms' && (
          <TermsSection />
        )}

        {currentTab === 'auth' && (
          <div className="max-w-4xl mx-auto px-4 w-full animate-fadeIn space-y-4">
            {authWarning && (
              <div className="p-4.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-start gap-3.5 text-xs text-indigo-300 shadow-xl mt-8">
                <Lock size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm font-black uppercase tracking-wide block mb-1">Authentication Required!</strong>
                  <span className="font-semibold text-slate-300">Bina login ya sign up kiye aap products ko order nahi kar sakte. Please naya account banayein ya login karein taaki aapka purchase verification secure rahe.</span>
                </div>
              </div>
            )}
            <AuthPage onAuthSuccess={() => {
              setAuthWarning(false);
              if (cart.length > 0) {
                setCurrentTab('store');
                setIsCheckoutOpen(true);
              } else {
                setCurrentTab('home');
              }
            }} />
          </div>
        )}

        {currentTab === 'orders' && (
          <CustomerOrders />
        )}

        {currentTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanel />
        )}

        {currentTab === 'admin' && currentUser?.role !== 'admin' && (
          <div className="py-20 px-4 max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Admin Gateway</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restricted operations center. Authenticate with secure administrator keys to gain permission.
              </p>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
                {adminError}
              </div>
            )}

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setAdminError('');
                if (!adminEmail.trim() || !adminPassword.trim()) {
                  setAdminError('Please fill in both administration credentials.');
                  return;
                }
                
                // Secure check: Only parthtongse66@gmail.com with Parth@#172005 password is permitted as admin
                if (adminEmail.toLowerCase() !== 'parthtongse66@gmail.com' || adminPassword !== 'Parth@#172005') {
                  setAdminError('Access Denied: Invalid admin email or password.');
                  return;
                }

                const res = login(adminEmail, adminPassword, 'admin', 'Parth Admin');
                if (!res.success) {
                  setAdminError('Invalid administrative signature.');
                }
              }}
              className="space-y-4 bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-2xl relative z-10"
            >
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Admin Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Mail size={14} /></span>
                  <input 
                    type="email"
                    required
                    placeholder="parthtongse66@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-rose-600 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Access Key / Password</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-rose-600 shadow-inner"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                Authenticate Gateway
              </button>


            </form>
          </div>
        )}
      </main>

      {/* Cart Drawer overlay */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          if (!currentUser) {
            setAuthWarning(true);
            setCurrentTab('auth');
          } else {
            setAuthWarning(false);
            setIsCheckoutOpen(true);
          }
        }}
      />

      {/* Checkout Gateway modal dialog */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onClearCart={() => {}}
      />

      {/* Global Brand Footer */}
      {isPublicPage && (
        <footer id="app-footer" className="bg-slate-950 border-t border-slate-900 py-12 text-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Brand Col */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg">N</div>
                  <span className="font-black text-white text-lg tracking-wider">NITROSTORE</span>
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-semibold">
                  The ultimate elite digital keys distributor. Specialized in legal, anti-revoke Discord Nitro codes, gaming coins, premade GTA logins, and bulk gaming activation vouchers.
                </p>
                <div className="flex items-center gap-3">
                  <a href={socialLinks.discord} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-400 border border-slate-850 cursor-pointer">
                    <Compass size={14} />
                  </a>
                  <a href={socialLinks.telegram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-400 border border-slate-850 cursor-pointer">
                    <MessageSquare size={14} />
                  </a>
                  <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-sky-950/20 text-slate-400 hover:text-sky-400 border border-slate-850 cursor-pointer">
                    <Twitter size={14} />
                  </a>
                  <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-850 cursor-pointer">
                    <Youtube size={14} />
                  </a>
                </div>
              </div>

              {/* Navigation column shortcuts */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Digital Catalog</h4>
                <div className="flex flex-col gap-2 text-[11px] font-semibold text-slate-400">
                  <button onClick={() => handleBrowseStore('all', 'nitro')} className="text-left hover:text-indigo-400 transition-colors">Discord Nitro Vouchers</button>
                  <button onClick={() => handleBrowseStore('all', 'valorant')} className="text-left hover:text-indigo-400 transition-colors">Game Gift Cards</button>
                  <button onClick={() => handleBrowseStore('all', 'gta')} className="text-left hover:text-indigo-400 transition-colors">GTA Online Logins</button>
                  <button onClick={() => handleBrowseStore('all', 'spotify')} className="text-left hover:text-indigo-400 transition-colors">Premium Music Subs</button>
                </div>
              </div>

              {/* Legal and Support info */}
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Support Inquiries</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                  In case of claim errors or failed codes, please raise an inquiry or contact us at: <br />
                  <span className="text-indigo-400 font-bold">{socialLinks.supportEmail}</span>
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setCurrentTab('terms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-850 hover:border-slate-800 px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    Read Replacement Warranty
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>

            </div>

            {/* Copyright block with dynamic domain indicator */}
            <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>© 2026 NitroStore Inc. All Rights Reserved. Not affiliated with Discord Inc. or Riot Games.</span>
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-900 px-3 py-1.5 rounded-full text-[9px] text-emerald-400 font-extrabold tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE DOMAIN: {(import.meta as any).env?.VITE_APP_URL || window.location.origin}</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Global Background Music Controller */}
      <BackgroundMusic />

      {/* Global AI Chatbot Controller */}
      <AIChatBot />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
