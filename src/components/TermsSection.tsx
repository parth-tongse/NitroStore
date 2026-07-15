import React from 'react';
import { ShieldCheck, Scale, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

export const TermsSection: React.FC = () => {
  return (
    <div id="terms-section" className="bg-slate-950 py-16 text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">Legal Safe Harbor</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">Terms & Conditions</h2>
          <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">Please read our digital usage policies, transaction contracts, and replacement guidelines carefully before completing your orders.</p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 bg-slate-900/40 border border-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <Lock size={18} />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">1. No-Refunds Policy for Claimed Keys</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed pl-7">
              All digital assets, codes, Discord Nitro gift vouchers, game logins, and subscription tokens are single-use cryptographic objects. Once an activation URL or license code is revealed, displayed, or claimed in the buyer's success receipt window, it is considered <strong>fully consumed</strong>. Therefore, we maintain a strict <strong>NO REFUNDS</strong>, <strong>NO EXCHANGE</strong> policy for successfully generated keys.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <RefreshCw size={18} />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">2. Replacement Guarantee & Warranty</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed pl-7">
              We provide a <strong>100% Anti-Revoke Replacement Guarantee</strong> on all premium subscription gift links. In the highly rare occurrence that a generated Discord gift link claims to be "Already Redeemed" or "Invalid", or a game activation code does not operate correctly:
            </p>
            <ul className="list-disc pl-14 text-xs text-slate-400 space-y-1.5 font-medium">
              <li>You must open a support ticket within 48 hours of your payment timeline.</li>
              <li>Provide your valid invoice ID and clear screenshot proof of the error returned by Discord or the game client.</li>
              <li>Our operators will review the ledger logs and instantly dispatch a replacement key if found faulty.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <ShieldCheck size={18} />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">3. Account Ownership & Transfers</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed pl-7">
              For manual deliveries involving pre-loaded game logins (such as GTA V Modded Accounts or Nitro Badged Accounts):
              Upon delivery of login credentials (email and password), the buyer is required to immediately log in, change password, and attach their personal phone number or 2-Factor Authentication (2FA). We bear no legal or technical liability for accounts that are lost or stolen due to buyer negligence post-delivery.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">4. Anti-Fraud Security Measures</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed pl-7 text-rose-300">
              We operate advanced automated anti-fraud fraud protection tools. Any buyer attempting fraudulent credit card chargebacks, fake payment submissions, or chargeback threats will be subject to:
              Permanent blacklisting of their IP address, hardware ID, and email credentials across all partner networks; Immediate remote revocation of all claims and active subscription keys; Logging of fraudulent actions to international database clearinghouses.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <Scale size={18} />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">5. Service Availability Thresholds</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed pl-7">
              While our online system works 24/7/365 to deliver automated orders within seconds, manual dispatches are subject to operator shifts. Standard manual order dispatches complete within 15 to 30 minutes, but please permit up to 12 hours during high-demand stock drops.
            </p>
          </div>

        </div>

        {/* Footer legal claim */}
        <div className="mt-12 text-center text-[10px] text-slate-500 font-semibold leading-relaxed">
          By continuing your checkout, purchasing, or listing products on NitroStore, you explicitly agree, confirm, and sign to abide by all the clauses, policies, and liability exemptions listed above.
        </div>

      </div>
    </div>
  );
};
