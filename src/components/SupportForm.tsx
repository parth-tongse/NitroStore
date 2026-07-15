import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, AlertCircle, CheckCircle, HelpCircle, ChevronDown, ChevronUp, Clock, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SupportForm: React.FC = () => {
  const { tickets, createTicket, socialLinks } = useStore();
  
  // Submit ticket states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Discord Nitro Claim Error');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  // Active FAQ states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How long does automated instant delivery take?',
      a: 'Automated items (like Discord Nitro 1 Month/1 Year or Steam keys) are delivered instantly. As soon as the transaction ledger validates your payment, your gift vouchers/keys appear on the success window and are sent to your email.'
    },
    {
      q: 'What should I do if a Discord Nitro link says "Already Claimed"?',
      a: 'Do not worry! This occasionally happens due to cache delays on Discord endpoints. Simply submit a support ticket below or join our Discord channel. Our admins will verify the logs and dispatch a brand-new working link to you within minutes.'
    },
    {
      q: 'How is the delivery managed for manual items (like Modded GTA accounts)?',
      a: 'For manual products, our customer operator must hand-package and transfer the account details. This typically completes within 15 to 30 minutes. You will receive login instructions directly in your support inbox and email.'
    },
    {
      q: 'Which payment options do you support?',
      a: 'We support local Indian UPI codes (PhonePe, Google Pay, Paytm), leading international credit/debit cards, and secured crypto tokens (USDT over Tron TRC-20 network).'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    createTicket({
      name,
      email,
      subject,
      message,
      orderId: orderId.trim() || undefined
    });

    setName('');
    setEmail('');
    setOrderId('');
    setMessage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Filter tickets matching user search email or order ID
  const userTickets = React.useMemo(() => {
    const query = searchEmail.trim().toLowerCase();
    if (!query) return [];
    return tickets.filter(t => 
      t.email.toLowerCase().includes(query) || 
      (t.orderId && t.orderId.toLowerCase().includes(query)) ||
      t.id.toLowerCase().includes(query)
    );
  }, [tickets, searchEmail]);

  return (
    <div id="support-section" className="bg-slate-950 py-16 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">Dedicated Support Desk</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">Need Help? Let's Connect</h2>
          <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">Have a dispute, payment delay, or want a custom wholesale quote? Open a support ticket below or check our fast self-service FAQs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Ticket Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-6 sm:p-8 bg-slate-900/60 border border-slate-900 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Create Support Ticket</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Response Guarantee: Within 15-30 minutes</p>
                </div>
              </div>

              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-start gap-2.5"
                >
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span>Ticket Submitted Successfully!</span>
                    <p className="text-[10px] text-emerald-500/80 mt-1 font-medium">We have logged your ticket in our admin workspace. Enter your email in the "Check Ticket Status" search box below to track responses!</p>
                  </div>
                </motion.div>
              )}

              <form id="support-ticket-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Your Name</label>
                    <input 
                      id="support-name"
                      type="text"
                      required
                      placeholder="e.g. Aman Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Registered Email Address</label>
                    <input 
                      id="support-email"
                      type="email"
                      required
                      placeholder="e.g. aman.kumar@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Select Subject Category</label>
                    <select 
                      id="support-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      <option value="Discord Nitro Claim Error">Discord Nitro Claim Error</option>
                      <option value="Payment Transferred but Key Not Received">Payment Sent but Key Not Received</option>
                      <option value="Custom Gaming ID order query">Custom Game ID Wholesale Request</option>
                      <option value="Other Technical / Account Issue">Other Technical Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Order ID (Optional)</label>
                    <input 
                      id="support-order-id"
                      type="text"
                      placeholder="e.g. ord-8k3m (Found in your claims)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Detailed Message</label>
                  <textarea 
                    id="support-message"
                    required
                    placeholder="Describe your issue with order number, transaction details, or screenshots details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4.5}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner resize-none"
                  />
                </div>

                <button 
                  id="support-ticket-submit"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  🚀 Dispatch Ticket
                </button>
              </form>
            </div>

            {/* TICKET STATUS / TRACKING CARD */}
            <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-3xl shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Clock size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Track Your Ticket Status</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Search previous inquiries and admin responses</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  id="ticket-search-email"
                  type="text"
                  placeholder="Enter registered email or Order ID (e.g. ord-8k3m)"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                />
              </div>

              {searchEmail.trim() && (
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Found ({userTickets.length}) Tickets:</span>
                  
                  {userTickets.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                      No tickets located matching search query.
                    </div>
                  ) : (
                    userTickets.map((t) => (
                      <div key={t.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-white">{t.subject}</span>
                            <span className="text-[9px] font-mono text-slate-500 mt-0.5 flex items-center flex-wrap gap-1.5">
                              <span>{t.id} • {new Date(t.createdAt).toLocaleDateString()}</span>
                              {t.orderId && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-900/40 text-indigo-400 font-bold text-[8px] uppercase tracking-wide">
                                  Order: #{t.orderId}
                                </span>
                              )}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            t.status === 'open' 
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                              : t.status === 'replied'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 italic leading-relaxed font-semibold">
                          " {t.message} "
                        </p>

                        {/* Admin reply panel */}
                        {t.reply && (
                          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1.5 relative">
                            {/* top tag */}
                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">👑 Admin Dispatch Desk:</span>
                            <p className="text-[11px] text-indigo-200 font-semibold leading-relaxed">
                              {t.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: FAQs Accordion */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-slate-900/60 border border-slate-900 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Frequently Asked FAQs</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quick answers to typical buyers queries</p>
                </div>
              </div>

              {/* Accordion container */}
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-850 bg-slate-950/40 rounded-xl overflow-hidden">
                    <button
                      id={`faq-btn-${i}`}
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-white hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {activeFaq === i ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {activeFaq === i && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="p-4 pt-0 text-[11px] text-slate-400 font-medium leading-relaxed border-t border-slate-850/40">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Support Warning Card */}
            <div className="p-6 bg-indigo-950/15 border border-indigo-900/20 rounded-3xl space-y-4">
              <ShieldAlert size={28} className="text-indigo-400" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white uppercase tracking-wide">Prefer Email or Custom Telegram Orders?</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">You can directly write to our technical support desk at <span className="text-slate-200 font-bold">{socialLinks.supportEmail}</span> for bulk wholesale requirements or inquiries. Please do not submit duplicate tickets for the same request.</p>
              </div>
            </div>

            {/* Developer Credits Card */}
            <div className="p-6 bg-slate-900/60 border border-slate-900 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-indigo-500 shrink-0 bg-slate-950 group">
                  <img 
                    src="/developer_parth.jpg" 
                    onError={(e) => {
                      // Fallback to a high quality avatar image or a standard developer illustration
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80';
                    }}
                    alt="Parth Tongse" 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest font-mono">
                    👑 Lead Portal Developer
                  </span>
                  <h4 className="text-base font-black text-white leading-tight">Parth Tongse</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    This website is Developed by <span className="text-slate-200 font-extrabold">Parth Tongse</span>.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850/40 text-[9px] text-slate-400 leading-relaxed space-y-2">
                <p>
                  Sare software, database architecture, design models, aur integrated systems ke proprietary rights aur copyrights <span className="text-indigo-400 font-bold">Parth Tongse</span> ke pass surakshit hain.
                </p>
                <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                  <span>Registered & Licensed (Apache 2.0 / All Rights Reserved)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
