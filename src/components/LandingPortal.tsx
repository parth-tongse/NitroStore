import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Gamepad2, ArrowRight, Gift, Users, HeartHandshake } from 'lucide-react';
import nitroLogo from '../assets/images/nitrostore_logo_1783941902397.jpg';

interface LandingPortalProps {
  onEnter: () => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({ onEnter }) => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 18 }
    }
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.4, 0.25],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div id="landing-portal" className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between">
      {/* Immersive Cyber-grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Atmospheric Neon Orbs */}
      <motion.div 
        variants={glowVariants}
        animate="animate"
        className="absolute top-1/4 left-1/12 w-80 h-80 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"
      />
      <motion.div 
        variants={glowVariants}
        animate="animate"
        className="absolute bottom-1/3 right-1/12 w-96 h-96 rounded-full bg-purple-600/15 blur-[140px] pointer-events-none"
      />
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[160px] pointer-events-none"
      />

      {/* Top Header branding (minimalist) */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <img 
              src={nitroLogo} 
              alt="Nitro Store Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-sans font-black tracking-widest text-lg uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            NITRO<span className="text-indigo-500 font-extrabold">STORE</span>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-900 px-3.5 py-1.5 rounded-full text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Verified Shop</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-8"
          >
            {/* Elegant badge tag */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-xs font-bold shadow-inner"
            >
              <Sparkles size={14} className="text-purple-400 animate-pulse" />
              <span className="tracking-wider uppercase">Welcome to the Ultimate Digital Hub</span>
            </motion.div>

            {/* Giant Immersive Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white max-w-3xl"
            >
              Welcome To <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nitro Store</span>
            </motion.h1>

            {/* Simple Descriptive Copy */}
            <motion.p 
              variants={itemVariants}
              className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Access premium Discord Nitro, gaming accounts, gift keys, and server boosts instantly. 
              Safe, legal, and backed by a comprehensive full-warranty service delivered straight to your email.
            </motion.p>

            {/* Direct CTA Enter Button */}
            <motion.div 
              variants={itemVariants}
              className="pt-4"
            >
              <button
                id="enter-store-btn"
                onClick={onEnter}
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold tracking-widest text-sm shadow-2xl shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <span>ENTER THE NITROSTORE</span>
                <ArrowRight size={16} className="text-white group-hover:translate-x-1.5 transition-transform" />
                
                {/* Subtle outer glow layer */}
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity pointer-events-none -z-10" />
              </button>
            </motion.div>

            {/* Key Showcase Items (Interactive Cards with No Telemetry) */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-900/60 w-full max-w-3xl mt-8"
            >
              <div className="group bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col items-center hover:border-indigo-900/60 hover:bg-slate-900/50 transition-all">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <Gift className="text-indigo-400" size={20} />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">Discord Nitro</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1.5 text-center">
                  Get classic and boost tiers immediately loaded with maximum discount rates.
                </p>
              </div>

              <div className="group bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col items-center hover:border-purple-900/60 hover:bg-slate-900/50 transition-all">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                  <Gamepad2 className="text-purple-400" size={20} />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">Gaming Accounts</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1.5 text-center">
                  Full access titles, premium level passes, and custom gaming skins.
                </p>
              </div>

              <div className="group bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col items-center hover:border-pink-900/60 hover:bg-slate-900/50 transition-all">
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3">
                  <Shield className="text-pink-400" size={20} />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">Full Warranty</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1.5 text-center">
                  Complete buyer security with legal processing and 24/7 client claims.
                </p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </main>

      {/* Footer statistics branding */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Users size={12} className="text-indigo-500" /> 1K+ ACTIVE CUSTOMERS</span>
          <span className="flex items-center gap-1.5"><HeartHandshake size={12} className="text-pink-500" /> 100% SECURE DELIVERY</span>
        </div>
        <div>
          <span>© 2026 NITROSTORE. NOT AFFILIATED WITH DISCORD OR RIOT GAMES.</span>
        </div>
      </footer>
    </div>
  );
};
