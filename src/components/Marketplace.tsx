import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Zap, ShieldAlert, BadgeInfo, ShoppingCart, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/mockData';

interface MarketplaceProps {
  initialCategoryFilter?: string;
  initialSearchQuery?: string;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  initialCategoryFilter = 'all', 
  initialSearchQuery = '',
  onAddToCart, 
  onBuyNow 
}) => {
  const { products, productsLoaded } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync initialCategoryFilter when it changes externally
  React.useEffect(() => {
    setSelectedCategory(initialCategoryFilter);
  }, [initialCategoryFilter]);

  // Sync initialSearchQuery when it changes externally
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const categories = [
    { id: 'all', label: '🔥 All Products' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div id="marketplace-section" className="bg-slate-950 py-12 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">Interactive Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1.5 tracking-tight">Browse Premium Marketplace</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Select your favorites, checkout securely, and claim instantly with direct key claims.</p>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <Search size={16} />
            </span>
            <input 
              id="product-search-input"
              type="text"
              placeholder="Search products, keys, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800/80 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-900 mb-10 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.div 
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/15"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {!productsLoaded ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Syncing digital vault...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/20 border border-slate-900/60 max-w-md mx-auto">
            <SlidersHorizontal size={36} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No Products Found</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">We couldn't find any products matching your search criteria or category filter. Try refining your keywords!</p>
            <button 
              id="clear-filters-btn"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-6 px-4.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-bold transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => {
                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                const isOutOfStock = p.stock === 0;
                
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    id={`product-card-${p.id}`}
                    className="group relative flex flex-col h-full rounded-2xl bg-slate-900/50 border border-slate-900 hover:border-slate-800 hover:bg-slate-900 transition-all overflow-hidden shadow-md"
                  >
                    {/* Badge Pill */}
                    {p.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-[10px] font-black text-white tracking-widest shadow-lg shadow-indigo-950 uppercase border border-indigo-400/25">
                          {p.badge}
                        </span>
                      </div>
                    )}

                    {/* Stock status indicator top right */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/80 border border-slate-850 px-2 py-1 rounded-lg">
                      <span className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isOutOfStock ? 'Out Of Stock' : 'In Stock'}
                        </span>
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                      
                      {/* Delivery Mode indicator */}
                      <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold text-slate-300 flex items-center gap-1 bg-slate-950/70 border border-slate-850 px-2 py-0.5 rounded">
                        <Zap size={10} className="text-cyan-400 animate-pulse" />
                        {p.deliveryType === 'instant' ? 'Instant Delivery' : 'Delivered in 30M'}
                      </span>
                    </div>

                    {/* Details content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Name / Description */}
                      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 tracking-tight leading-snug cursor-pointer transition-colors" onClick={() => setSelectedProduct(p)}>
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">
                        {p.description}
                      </p>

                      {/* Flex Grow spacer */}
                      <div className="flex-grow"></div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-2 mt-4.5">
                        <span className="text-xl font-black text-white">₹{p.price}</span>
                      </div>

                      {/* Purchase buttons */}
                      <div className="grid grid-cols-5 gap-2 mt-5">
                        {/* Info Button */}
                        <button 
                          id={`info-btn-${p.id}`}
                          onClick={() => setSelectedProduct(p)}
                          title="View Details"
                          className="col-span-1 flex items-center justify-center py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <BadgeInfo size={16} />
                        </button>
                        
                        {/* Add to Cart */}
                        <button 
                          id={`add-cart-btn-${p.id}`}
                          onClick={() => !isOutOfStock && onAddToCart(p)}
                          disabled={isOutOfStock}
                          title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                          className={`col-span-1 flex items-center justify-center py-2.5 rounded-xl border transition-all ${
                            isOutOfStock 
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed' 
                              : 'cursor-pointer bg-slate-900 border-slate-850 hover:border-slate-700 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300'
                          }`}
                        >
                          <ShoppingCart size={16} />
                        </button>

                        {/* Buy Now */}
                        <button 
                          id={`buy-now-btn-${p.id}`}
                          onClick={() => !isOutOfStock && onBuyNow(p)}
                          disabled={isOutOfStock}
                          className={`col-span-3 py-2.5 rounded-xl font-extrabold text-[11px] tracking-wider uppercase transition-all shadow-md ${
                            isOutOfStock 
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed' 
                              : 'cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/50 hover:shadow-indigo-950/70'
                          }`}
                        >
                          {isOutOfStock ? '❌ Sold Out' : '⚡ Buy Now'}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              {/* Close Button */}
              <button 
                id="close-detail-modal"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-all z-20 cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Visual Cover (left / top) */}
                <div className="md:col-span-5 relative aspect-video md:aspect-auto md:h-full min-h-[220px]">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="object-cover w-full h-full opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
                  
                  {selectedProduct.badge && (
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-indigo-600 text-[10px] font-black text-white tracking-widest uppercase">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>

                {/* Details Area (right / bottom) */}
                <div className="md:col-span-7 p-6 md:p-8 flex flex-col h-full justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase bg-indigo-950/60 border border-indigo-900/30 px-2 py-0.5 rounded-md">
                      {selectedProduct.category}
                    </span>
                    
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3">
                      {selectedProduct.name}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-3">
                      {selectedProduct.description}
                    </p>

                    {/* Bullet Features */}
                    <div className="mt-5">
                      <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2.5">Key Product Benefits:</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Delivery type warning */}
                    <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center gap-3">
                      <Zap size={16} className="text-cyan-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">
                          {selectedProduct.deliveryType === 'instant' ? 'Instant Key delivery' : 'Manual Operators delivery'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {selectedProduct.deliveryType === 'instant' 
                            ? 'Delivered to your claim URL instantly after payment check.' 
                            : 'Requires active delivery within 15-30 minutes by our customer desk.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions area */}
                  <div className="mt-8 pt-5 border-t border-slate-850 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Total Price</span>
                      <span className="text-2xl font-black text-white">₹{selectedProduct.price}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        id="modal-add-cart"
                        onClick={() => {
                          if (selectedProduct.stock !== 0) {
                            onAddToCart(selectedProduct);
                            setSelectedProduct(null);
                          }
                        }}
                        disabled={selectedProduct.stock === 0}
                        className={`p-3 rounded-xl border transition-all ${
                          selectedProduct.stock === 0
                            ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                            : 'cursor-pointer bg-slate-950 border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-indigo-300'
                        }`}
                      >
                        <ShoppingCart size={18} />
                      </button>

                      <button 
                        id="modal-buy-now"
                        onClick={() => {
                          if (selectedProduct.stock !== 0) {
                            onBuyNow(selectedProduct);
                            setSelectedProduct(null);
                          }
                        }}
                        disabled={selectedProduct.stock === 0}
                        className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all ${
                          selectedProduct.stock === 0
                            ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                            : 'cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                        }`}
                      >
                        {selectedProduct.stock === 0 ? '❌ Sold Out' : '⚡ Buy Instantly'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
