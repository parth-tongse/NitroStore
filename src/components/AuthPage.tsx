import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Sparkles, Shield, Rocket, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const { login, signup } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form states
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail) {
      setError('Please provide your email address.');
      return;
    }

    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    // Role is automatically determined securely inside StoreContext
    const res = login(loginEmail, loginPassword, 'customer');
    if (res.success) {
      onAuthSuccess();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    // Role is automatically determined securely inside StoreContext
    const res = signup(signupUsername, signupEmail, signupPassword, 'customer');
    if (res.success) {
      onAuthSuccess();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div id="auth-page-section" className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"></div>
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl relative z-10">
        
        {/* Left Column: Promo Banner */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-b from-slate-950 to-slate-900 h-full flex-col justify-between border-r border-slate-850">
          <div className="space-y-6">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs">N</div>
              <span className="text-xs font-black text-white tracking-widest uppercase">NitroStore Auth</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black text-white leading-tight">Create an account and claim benefits:</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Join 15,000+ gamers and developers buying high quality Discord Nitro subscriptions and gaming keys safely.</p>
            </div>

            <ul className="space-y-3 text-[11px] text-slate-300 font-semibold">
              <li className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md flex items-center justify-center"><Check size={11} /></div>
                <span>Sync Order Claims history</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md flex items-center justify-center"><Check size={11} /></div>
                <span>Submit and track tickets</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md flex items-center justify-center"><Check size={11} /></div>
                <span>Access premium customer support desk</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-8">
            <Shield size={14} className="text-indigo-400 shrink-0" />
            <span>Guaranteed cryptographically secure credentials storage.</span>
          </div>
        </div>

        {/* Right Column: Forms panel */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* Tab switches */}
          <div className="flex items-center justify-center gap-2 bg-slate-950 p-1 rounded-2xl mb-8 w-60 mx-auto border border-slate-850">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`relative flex-1 py-2 rounded-xl text-xs font-bold tracking-wide uppercase cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'login' ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'login' && (
                <motion.div 
                  layoutId="authActiveTabUnderlay"
                  className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/20"
                />
              )}
              Log In
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`relative flex-1 py-2 rounded-xl text-xs font-bold tracking-wide uppercase cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'signup' ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'signup' && (
                <motion.div 
                  layoutId="authActiveTabUnderlay"
                  className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/20"
                />
              )}
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl mb-6 flex items-center gap-2">
              <Sparkles size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Customer bypass hint */}
          <div className="mb-6 p-3 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center text-[10px] text-slate-400">
            <span>💡 Quick test login details:</span>
            <button 
              id="bypass-login-fill"
              onClick={() => {
                setError('');
                if (activeTab === 'login') {
                  setLoginEmail('customer@gmail.com');
                  setLoginPassword('customer123');
                } else {
                  setSignupEmail('customer@gmail.com');
                  setSignupUsername('GamerAman');
                  setSignupPassword('customer123');
                }
              }}
              className="text-xs text-indigo-400 font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-500/20 cursor-pointer transition-colors"
            >
              Fill Customer Info
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Mail size={14} /></span>
                  <input 
                    id="login-email-input"
                    type="email"
                    required
                    placeholder="e.g. parthtongse66@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Lock size={14} /></span>
                  <input 
                    id="login-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>
              </div>

              <button 
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                Continue to Store
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form id="signup-form" onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Username / Nickname</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><User size={14} /></span>
                  <input 
                    id="signup-username-input"
                    type="text"
                    required
                    placeholder="e.g. Aman Kumar"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Mail size={14} /></span>
                  <input 
                    id="signup-email-input"
                    type="email"
                    required
                    placeholder="e.g. aman.kumar@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Create Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Lock size={14} /></span>
                  <input 
                    id="signup-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                  />
                </div>
              </div>

              <button 
                id="signup-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                Register & Sign In
                <ArrowRight size={14} />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
