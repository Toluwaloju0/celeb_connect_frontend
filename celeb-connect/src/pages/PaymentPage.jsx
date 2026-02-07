import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-[#1a1a1a] border border-brand-goldDim/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
         {/* Background Effect */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

         <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
               <CreditCard size={32} />
            </div>
            <h1 className="text-2xl font-serif text-white font-bold mb-2">Secure Payment</h1>
            <p className="text-brand-muted text-sm">Complete your booking for Reference ID:</p>
            <p className="text-white font-mono font-bold mt-1 tracking-wider">{bookingId}</p>
         </div>

         <div className="bg-[#121212] border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
               <span className="text-sm text-gray-400">Service Fee</span>
               <span className="text-white font-bold">$1,500.00</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
               <span className="text-sm text-gray-400">Processing</span>
               <span className="text-white font-bold">$50.00</span>
            </div>
            <div className="flex justify-between items-center text-brand-gold">
               <span className="text-sm font-bold">Total</span>
               <span className="text-xl font-serif font-bold">$1,550.00</span>
            </div>
         </div>

         <button 
           onClick={() => { alert('Payment Simulation Successful'); navigate('/my-bookings'); }}
           className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-gold/10 flex items-center justify-center gap-2 mb-4"
         >
            Pay Now <ArrowLeft className="rotate-180" size={18} />
         </button>

         <button onClick={() => navigate('/my-bookings')} className="w-full text-brand-muted text-sm hover:text-white">
            Cancel Payment
         </button>

         <div className="mt-8 flex justify-center gap-4 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck size={12}/> SSL Secure</span>
            <span>256-bit Encryption</span>
         </div>
      </div>

    </div>
  );
};

export default PaymentPage;