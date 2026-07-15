import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import nitroLogo from '../assets/images/nitrostore_logo_1783941902397.jpg';

interface PreloaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  "CONNECTING TO NITROSTORE NETWORK...",
  "SECURING GATEWAY PROTOCOLS...",
  "LOADING DIGITAL ASSETS...",
  "OPTIMIZING PREMIUM INVENTORY...",
  "GETTING SYSTEMS READY..."
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Dynamic text cycle
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    // Smooth, paced progress simulation for best visual experience
    const startTime = Date.now();
    const duration = 4000; // 4.0 seconds total loader duration for cinematic appearance

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(calculatedProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Short delay at 100% for smooth transition
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div id="preloader-overlay" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden">
      {/* Dark cyber grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Atmospheric neon glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Central Core */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-md"
          />
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-indigo-400/20">
            <img 
              src={nitroLogo} 
              alt="Nitro Store Logo" 
              className="w-14 h-14 object-cover animate-pulse"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Brand Header */}
        <h2 className="font-sans font-black tracking-widest text-2xl uppercase mb-1">
          NITRO<span className="text-indigo-500 font-extrabold">STORE</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mb-10">
          The Ultimate Premium Gateway
        </p>

        {/* Loading status details */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end text-[10px] font-extrabold text-indigo-400/90 tracking-widest uppercase">
            <span className="flex items-center gap-1.5 h-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTextIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-block"
                >
                  {loadingTexts[currentTextIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-indigo-300 font-mono text-xs">{progress}%</span>
          </div>

          {/* Premium Progress Bar Wrapper */}
          <div className="relative h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[2px]">
            {/* Loading Fill Track */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
            >
              {/* Sliding glow shine */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:40px_100%] animate-[shimmer_1.5s_infinite] rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Tech Badges below bar */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-900/60 w-full justify-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-500" /> Secure SSL</span>
          <span className="h-1 w-1 rounded-full bg-slate-800"></span>
          <span className="flex items-center gap-1"><Cpu size={11} className="text-indigo-500" /> Fast Sync</span>
          <span className="h-1 w-1 rounded-full bg-slate-800"></span>
          <span className="flex items-center gap-1"><Sparkles size={11} className="text-purple-500" /> 100% Legal</span>
        </div>
      </div>
    </div>
  );
};
