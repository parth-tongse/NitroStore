import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, MessageSquare, Check, Search, PenTool, Flame, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export const ReviewsSection: React.FC = () => {
  const { reviews, createReview, currentUser, orders } = useStore();
  
  // Submission Form State
  const [name, setName] = useState(currentUser?.username || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('General Store Review');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtering & Searching State
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | number>('all');

  // Find delivered user orders to let them choose
  const eligibleProductsForReview = useMemo(() => {
    if (!currentUser) return [];
    // Filter delivered orders for this user
    const userDelivered = orders.filter(
      (o) => o.userEmail.toLowerCase() === currentUser.email.toLowerCase() && o.status === 'delivered'
    );
    // Return unique product names
    const uniqueNames = Array.from(new Set(userDelivered.map((o) => o.productName)));
    return uniqueNames;
  }, [orders, currentUser]);

  // Calculations for overall stats
  const stats = useMemo(() => {
    const totalCount = reviews.length;
    if (totalCount === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / totalCount) * 10) / 10;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const val = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[val] += 1;
    });

    return {
      average,
      total: totalCount,
      distribution
    };
  }, [reviews]);

  // Filtered reviews to display
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.productName && r.productName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.length < 5) {
      setErrorMessage('Please share a review comment (minimum 5 characters).');
      return;
    }

    const isVerified = currentUser ? eligibleProductsForReview.includes(selectedProduct) : false;

    createReview({
      name: name.trim(),
      rating,
      comment: comment.trim(),
      productName: selectedProduct === 'General Store Review' ? undefined : selectedProduct,
      isVerifiedPurchase: isVerified
    });

    // Reset fields
    setComment('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div id="reviews-section-viewport" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      
      {/* Heading / Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          <Flame size={12} className="animate-pulse" />
          Client Feedback Hub
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Customer <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Reviews</span>
        </h2>
        <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
          Dekhein hamare customers ka feedback, ratings, aur unka experience. Aap bhi apna review direct share kar sakte hain star ratings ke sath!
        </p>
      </div>

      {/* Grid Layout: Stats and Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Stats Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6 shadow-2xl">
          <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Flame size={16} className="text-indigo-400" />
            Overall Satisfaction
          </h3>

          <div className="flex items-center gap-6 p-4 bg-slate-950 border border-slate-850 rounded-2xl">
            <div className="text-center space-y-1">
              <span className="block text-4xl md:text-5xl font-black text-white font-mono">{stats.average || '0.0'}</span>
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Out of 5 Stars</span>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={`${
                      star <= Math.round(stats.average) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-slate-800'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 font-bold">
                Based on <span className="text-indigo-400 font-bold">{stats.total} total</span> reviews received.
              </p>
            </div>
          </div>

          {/* Stars distribution progress bars */}
          <div className="space-y-3">
            {([5, 4, 3, 2, 1] as const).map((starNum) => {
              const count = stats.distribution[starNum] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={starNum} className="flex items-center gap-3 text-xs">
                  <button 
                    onClick={() => setRatingFilter(starNum === ratingFilter ? 'all' : starNum)}
                    className={`flex items-center gap-1 min-w-[45px] hover:text-white font-bold transition-all ${
                      ratingFilter === starNum ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  >
                    <span>{starNum}</span>
                    <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                  </button>

                  <div className="flex-1 h-2 bg-slate-950 border border-slate-850 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 font-bold w-8 text-right">
                    {count} ({Math.round(percent)}%)
                  </span>
                </div>
              );
            })}
          </div>

          {ratingFilter !== 'all' && (
            <button
              onClick={() => setRatingFilter('all')}
              className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 rounded-xl transition-all cursor-pointer"
            >
              Clear Filter (Showing {ratingFilter} Stars Only)
            </button>
          )}
        </div>

        {/* Right Side: Write a Review Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-5 shadow-2xl relative">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <PenTool size={16} className="text-indigo-400" />
              Write Your Feedback
            </h3>
            <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-wider">
              Real-time update
            </span>
          </div>

          {showSuccess ? (
            <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-center space-y-2 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
                <Check size={24} />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Review Added Successfully!</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                Aapka review live support channel aur stats board pe instant synchronize ho chuka hai. Thank you so much for your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Your Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Link to Purchased Item</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="General Store Review">General Store / Website Review</option>
                    {eligibleProductsForReview.map((prodName) => (
                      <option key={prodName} value={prodName}>
                        🎮 {prodName} (Verified Purchase)
                      </option>
                    ))}
                    {!currentUser && (
                      <option disabled value="">
                        Sign in to link delivered orders
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Interactive Star Picker */}
              <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Select Rating</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-none">Give stars based on your experience</p>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star 
                          size={24} 
                          className={`${
                            isLit 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-800'
                          } transition-all`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-black text-slate-400 ml-2 uppercase tracking-wide font-mono min-w-[40px]">
                    {hoverRating !== null ? `${hoverRating}.0` : `${rating}.0`}
                  </span>
                </div>
              </div>

              {/* Comment Text */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Detailed Review & Comment</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Review share karein... Aapko deliver milne me kitna time laga? Keys active thi?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 shadow-inner resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 cursor-pointer"
              >
                Submit Live Review
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Bottom Section: Search, Filters, and Customer Feedbacks List */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6 shadow-2xl">
        
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              Customer Testimonials ({filteredReviews.length})
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search input */}
            <div className="relative flex-grow sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={14} />
              </span>
              <input 
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Quick Star Filters */}
            <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-0.5 overflow-hidden shrink-0">
              <button
                onClick={() => setRatingFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  ratingFilter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => setRatingFilter(val)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-0.5 cursor-pointer ${
                    ratingFilter === val 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{val}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedbacks Grid List */}
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center mx-auto text-slate-600">
              <Search size={20} />
            </div>
            <p className="text-xs text-slate-500 font-bold">No customer reviews located matching current search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-4 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:bg-slate-950 transition-all shadow-inner"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{rev.name}</span>
                    <span className="text-[9px] font-mono text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Ratings Row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={11} 
                          className={`${
                            star <= rev.rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-800'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Verified purchase badge */}
                    {rev.isVerifiedPurchase && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Check size={9} /> Verified Buyer
                      </span>
                    )}

                    {/* Associated product name */}
                    {rev.productName && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 max-w-[150px] truncate">
                        <ShoppingBag size={9} /> {rev.productName}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold italic">
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
