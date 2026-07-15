import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Rocket, HeartHandshake, Zap, Users, MessageSquare, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onBrowseStore: (category?: string) => void;
  onContactSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseStore, onContactSupport }) => {
  const { socialLinks } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.12, 1],
      opacity: [0.3, 0.45, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div id="hero-section" className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 py-12 md:py-20 flex flex-col justify-center">
      
      {/* Dynamic Background Grid and Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35"></div>
      
      {/* Floating Purple & Cyan Orbs */}
      <motion.div 
        variants={glowVariants}
        animate="animate"
        className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"
      />
      <motion.div 
        variants={glowVariants}
        animate="animate"
        className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[140px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <div className="flex flex-col items-center justify-center">
          
          {/* Main Hero content: Text & CTA */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-6 max-w-3xl"
          >
            {/* Promo Tag */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-900/60 text-indigo-400 text-xs font-bold self-center shadow-inner"
            >
              <Sparkles size={13} className="text-purple-400 animate-spin" />
              <span>PREMIUM DIGITAL CODES & GAMING SUBSCRIPTIONS</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white"
            >
              Get Discord <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nitro & Gaming IDs</span> Instantly
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Welcome to the ultimate hub for premium digital keys, accounts, and server boosts. Safe, legal, verified, and delivered to your email instantly with 24/7 dedicated support.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
            >
              <button 
                id="hero-buy-nitro"
                onClick={() => onBrowseStore('nitro')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold tracking-wider text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/45 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                🛒 BUY DISCORD NITRO
              </button>
              
              <button 
                id="hero-browse-all"
                onClick={() => onBrowseStore('all')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Browse Marketplace
              </button>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-900 w-full"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">1k+</span>
                <span className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider text-center">Happy Orders</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">100%</span>
                <span className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider text-center">Secured Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none bg-gradient-to-r from-pink-300 to-indigo-300 bg-clip-text text-transparent">4.9/5</span>
                <span className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider text-center">Trust Score</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white leading-none bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">30 Min</span>
                <span className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider text-center">Superfast Delivery</span>
              </div>
            </motion.div>
          </motion.div>
          
        </div>

        {/* Feature Icons Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-slate-900">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-850 hover:bg-slate-900/60 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Rocket className="text-indigo-400" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">Blazing Fast Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">Our system claims, packages, and outputs your keys within seconds of payment approval.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-850 hover:bg-slate-900/60 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Shield className="text-purple-400" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">Unmatched Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">All game logins, accounts, and gift cards are safely purchased with absolute full warranty support.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-850 hover:bg-slate-900/60 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
              <HeartHandshake className="text-pink-400" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">Elite Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">We are committed to resolving your disputes, custom orders, or queries instantly. Get in touch anytime!</p>
            </div>
          </motion.div>

        </div>

        {/* Quick Social Channels Section */}
        <div className="flex flex-col items-center justify-center text-center mt-20 p-8 rounded-3xl bg-indigo-950/15 border border-indigo-900/30">
          <h3 className="text-lg font-extrabold text-white tracking-wide uppercase mb-2">Join Our Community Channels</h3>
          <p className="text-xs text-slate-400 font-semibold max-w-lg mb-6">Stay up to date with new product releases, updates, and 24/7 direct operator live support.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              id="hero-discord-join"
              href={socialLinks.discord} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-extrabold tracking-wider uppercase transition-colors"
            >
              <Users size={16} />
              Discord Community
            </a>
            <a 
              id="hero-telegram-join"
              href={socialLinks.telegram} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24A1DE] hover:bg-[#1D82B2] text-white text-xs font-extrabold tracking-wider uppercase transition-colors"
            >
              <MessageSquare size={16} />
              Telegram Channel
            </a>
            <button 
              id="hero-ticket-raise"
              onClick={onContactSupport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer"
            >
              <Award size={16} />
              Get Support Direct
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
