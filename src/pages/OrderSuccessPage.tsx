import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import { SEOHead } from '@/components/SEOHead';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber;

  useEffect(() => {
    if (!orderNumber) navigate('/', { replace: true });
  }, [orderNumber, navigate]);

  if (!orderNumber) return null;

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '8801534756278';

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <SEOHead title="Order Placed" url="/order-success" />
      <NavigationBar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <CheckCircle size={64} className="text-gold mx-auto" />
        </motion.div>

        <h1 className="font-display font-medium text-4xl text-bark mt-6">Order Placed!</h1>
        <p className="font-body text-bark-mid mt-2">Thank you. We'll confirm your order shortly.</p>

        <div className="bg-white border border-border px-6 py-4 mt-8 rounded-sm">
          <p className="font-body text-xs text-bark-muted uppercase tracking-widest mb-1">Order Number</p>
          <p className="font-body font-semibold text-lg text-bark">{orderNumber}</p>
        </div>

        <div className="mt-6 font-body text-sm text-bark-muted space-y-1">
          <p>Estimated delivery: 2–4 business days</p>
          <p>Delivery charge: ৳60 (Dhaka) · ৳120 (outside Dhaka)</p>
        </div>

        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full max-w-[320px] h-[48px] border border-gold text-gold font-body text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold hover:text-bark transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          <MessageCircle size={16} />
          Track via WhatsApp
        </a>

        <button
          onClick={() => navigate('/shop')}
          className="mt-4 font-body text-sm text-gold hover:underline underline-offset-4 cursor-pointer active:scale-[0.97] transition-transform"
        >
          Continue Shopping →
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
