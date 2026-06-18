import { Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { icon: Truck, title: 'Cash on Delivery', sub: 'Pay when it arrives' },
  { icon: ShieldCheck, title: 'Hand-finished', sub: 'Small-batch quality' },
  { icon: MessageCircle, title: 'WhatsApp Care', sub: 'Replies in minutes' },
];

const TrustBar = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.6 }}
    className="hidden md:block bg-ivory-warm border-y border-gold/15 py-8"
  >
    <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-3 gap-6 items-center">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
            <item.icon size={18} className="text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-body font-medium text-[13px] text-bark uppercase tracking-[0.12em]">{item.title}</p>
            <p className="font-body text-[12px] text-bark-mid mt-0.5 italic">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

export default TrustBar;
