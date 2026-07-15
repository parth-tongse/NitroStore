import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Copy, AlertTriangle, Cpu, CreditCard, QrCode, Coins, Check, Download, ExternalLink } from 'lucide-react';
import { useStore, CartItem } from '../context/StoreContext';
import { Order } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onClearCart }) => {
  const { cart, currentUser, createOrder, upiId, qrCodeUrl } = useStore();

  // Form states
  const [userName, setUserName] = useState(currentUser?.username || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto' | 'card'>('upi');

  // Payment states
  const [utrNumber, setUtrNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentInputError, setPaymentInputError] = useState('');

  // Checkout phase
  // 'form' | 'payment' | 'processing' | 'success'
  const [phase, setPhase] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('Syncing checkout details...');
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedSuccessOrderId, setCopiedSuccessOrderId] = useState<string | null>(null);

  // Card details mock state
  const [cardName, setCardName] = useState(currentUser?.username || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Sync user info if user changes
  React.useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.username);
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    setPaidAmount(totalPrice.toFixed(2));
    setUtrNumber('');
    setPhoneNumber('');
    setPaymentInputError('');
    setPhase('payment');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleConfirmPayment = () => {
    if (!utrNumber.trim()) {
      setPaymentInputError('UTR Number/Transaction ID is required to verify your payment!');
      return;
    }
    if (!paidAmount.trim()) {
      setPaymentInputError('Please enter the paid amount!');
      return;
    }
    if (!phoneNumber.trim()) {
      setPaymentInputError('Phone Number is required so admins can contact you!');
      return;
    }
    setPaymentInputError('');
    startPaymentSimulation();
  };

  const startPaymentSimulation = () => {
    setPhase('processing');
    setProcessingProgress(0);

    const statusMessages = [
      { prg: 10, msg: 'Initializing secure transaction tunnel...' },
      { prg: 25, msg: 'Validating buyer digital credentials...' },
      { prg: 50, msg: 'Awaiting network gateway confirmation...' },
      { prg: 75, msg: 'Payment verified! Allocating product serials...' },
      { prg: 90, msg: 'Minting invoice and cryptographic claim tokens...' },
      { prg: 100, msg: 'Transaction complete!' }
    ];

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const next = prev + 5;
        const currentMsg = statusMessages.find(m => next >= m.prg && prev < m.prg);
        if (currentMsg) {
          setProcessingStatus(currentMsg.msg);
        }

        if (next >= 100) {
          clearInterval(interval);
          // Create orders in the state
          const orders = createOrder({
            userName,
            userEmail,
            items: cart,
            paymentMethod: paymentMethod === 'upi' ? 'UPI (QR Code)' : paymentMethod === 'crypto' ? 'USDT (TRC20)' : 'Credit Card',
            notes,
            utr: utrNumber,
            paidAmount: paidAmount || `₹${totalPrice}`,
            phone: phoneNumber
          });
          setCompletedOrders(orders);
          onClearCart();
          setPhase('success');
          return 100;
        }
        return next;
      });
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => phase !== 'processing' && onClose()}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Dialog Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl z-10"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex flex-col">
                <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest uppercase">Secure Checkout Gateway</span>
                <span className="text-base font-black text-white mt-0.5 uppercase tracking-wide">
                  {phase === 'form' && '1. Delivery Details'}
                  {phase === 'payment' && '2. Payment Transfer'}
                  {phase === 'processing' && '3. Validating Ledger...'}
                  {phase === 'success' && '🔥 Transaction Success'}
                </span>
              </div>
              
              {phase !== 'processing' && (
                <button 
                  id="checkout-close"
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Inner Content */}
            <div className="p-6">
              
              {/* PHASE 1: FORM DETAILS */}
              {phase === 'form' && (
                <form id="checkout-details-form" onSubmit={handleNextToPayment} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Full Name</label>
                        <span className="text-[8px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Verified Account</span>
                      </div>
                      <input 
                        id="checkout-name"
                        type="text"
                        required
                        readOnly
                        value={userName}
                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed shadow-inner"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email (for Digital Delivery)</label>
                        <span className="text-[8px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Verified Account</span>
                      </div>
                      <input 
                        id="checkout-email"
                        type="email"
                        required
                        readOnly
                        value={userEmail}
                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Delivery Notes / Discord username (Optional)</label>
                      <textarea 
                        id="checkout-notes"
                        placeholder="Include your discord username (e.g., aman#1234) or specific delivery request details here."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2.5}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner resize-none"
                      />
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase">Cart Items ({totalItems}):</span>
                    <span className="font-black text-white text-lg">₹{totalPrice}</span>
                  </div>

                  <button 
                    id="checkout-form-submit"
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Continue to Payment
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}

              {/* PHASE 2: PAYMENT TRANSFER */}
              {phase === 'payment' && (
                <div className="space-y-4">
                  {/* Method View Detail (UPI QR Code only as requested) */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col justify-center items-center">
                    
                    <div className="text-center flex flex-col items-center space-y-3 w-full">
                      <div className="p-2 bg-white rounded-xl shadow-lg relative">
                        <img 
                          src={qrCodeUrl ? qrCodeUrl : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}%26pn=NitroStore%26cu=INR`} 
                          alt="Payment QR Code"
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-200">Scan QR using GPay, PhonePe, or BHIM</span>
                        <span className="text-[10px] text-indigo-400 font-bold mt-0.5">UPI ID: {upiId}</span>
                      </div>
                      <button 
                        id="copy-upi-btn"
                        type="button"
                        onClick={() => handleCopyText(upiId)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedText ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        {copiedText ? 'Copied' : 'Copy UPI ID'}
                      </button>
                    </div>

                  </div>

                  {/* Payment Verification Form */}
                  <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-850 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest border-b border-slate-850 pb-1">
                      Verify Transfer & Details
                    </span>

                    {paymentInputError && (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-semibold rounded-lg text-center animate-pulse">
                        ⚠️ {paymentInputError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                          UTR Number / Ref No *
                        </label>
                        <input
                          id="checkout-payment-utr"
                          type="text"
                          required
                          placeholder="12-digit UTR No"
                          value={utrNumber}
                          onChange={(e) => {
                            setUtrNumber(e.target.value);
                            setPaymentInputError('');
                          }}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                          Amount Paid (₹) *
                        </label>
                        <input
                          id="checkout-payment-amount"
                          type="text"
                          required
                          placeholder={totalPrice.toString()}
                          value={paidAmount}
                          onChange={(e) => {
                            setPaidAmount(e.target.value);
                            setPaymentInputError('');
                          }}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="checkout-payment-phone"
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPaymentInputError('');
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      id="checkout-pay-back"
                      onClick={() => setPhase('form')}
                      className="px-4.5 py-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ArrowLeft size={13} />
                      Back
                    </button>
                    
                    <button 
                      id="checkout-pay-approve"
                      onClick={handleConfirmPayment}
                      className="flex-grow py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      ✔️ Submit Verification & Order
                    </button>
                  </div>
                </div>
              )}

              {/* PHASE 3: PROCESSING LOADER */}
              {phase === 'processing' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="relative flex items-center justify-center">
                    {/* Ring loader */}
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-900/40 border-t-indigo-500 animate-spin"></div>
                    <Cpu size={24} className="text-indigo-400 absolute animate-pulse" />
                  </div>

                  <div className="text-center space-y-2">
                    <h4 className="text-base font-black text-white tracking-wide uppercase">Verifying Network Ledger</h4>
                    <p className="text-xs text-indigo-400 font-mono">{processingStatus}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-850">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-150"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-500 font-mono">{processingProgress}% Complete</span>
                </div>
              )}

              {/* PHASE 4: SUCCESS RECEIPT */}
              {phase === 'success' && (
                <div className="space-y-5">
                  {/* Big Check Badge */}
                  <div className="text-center space-y-2">
                    <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Order Submitted!</h3>
                    <p className="text-xs text-amber-400 font-extrabold px-2 py-1.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                      Under 30 min me aapse store ke admins ya malik aapse contact karenge aur aapko aapka order email ya phone no pe mill jayega.
                    </p>
                  </div>

                  {/* Submitted payment credentials box */}
                  <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-2.5 text-xs">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-1">
                      Submitted Verification Credentials
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Phone Number:</span>
                        <strong className="text-white font-mono">{phoneNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Email:</span>
                        <strong className="text-white font-mono truncate block">{userEmail}</strong>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">UTR Number:</span>
                        <strong className="text-indigo-400 font-mono">{utrNumber}</strong>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Paid Amount:</span>
                        <strong className="text-emerald-400 font-mono">₹{paidAmount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Items Card */}
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto p-3 bg-slate-950/40 border border-slate-850 rounded-2xl scrollbar-thin">
                    <div className="flex justify-between items-center mb-1">
                      <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        Ordered Products & Order IDs
                      </span>
                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wide bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Copy ID for Ticket
                      </span>
                    </div>
                    {completedOrders.map((order) => (
                      <div key={order.id} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-[11px] gap-2">
                        <span className="text-slate-300 font-bold truncate max-w-[180px]">{order.productName} (x{order.quantity})</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-indigo-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">#{order.id}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(order.id);
                              setCopiedSuccessOrderId(order.id);
                              setTimeout(() => setCopiedSuccessOrderId(null), 2000);
                            }}
                            className="p-1 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 rounded cursor-pointer transition-all flex items-center justify-center"
                            title="Copy Order ID"
                          >
                            {copiedSuccessOrderId === order.id ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Warning advice */}
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-semibold rounded-xl flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-indigo-400" />
                    <span>Store administrators are actively reviewing your UTR number & transaction ledger. You will receive an email/message shortly once validated.</span>
                  </div>

                  {/* Finished Done */}
                  <button 
                    id="checkout-success-close"
                    onClick={() => {
                      setPhase('form');
                      setProcessingProgress(0);
                      setUtrNumber('');
                      setPhoneNumber('');
                      setPaidAmount('');
                      setPaymentInputError('');
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Done & Return to Market
                  </button>
                </div>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
