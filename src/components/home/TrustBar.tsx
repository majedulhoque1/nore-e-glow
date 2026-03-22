import { Truck, MapPin, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { icon: Truck, text: 'Cash on Delivery' },
  { icon: MapPin, text: 'Delivered Nationwide' },
  { icon: RefreshCw, text: 'Easy Exchange' },
];

const TrustBar = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className="bg-ivory-warm border-y border-border py-5 px-6"
  >
    <div className="max-w-[1400px] mx-auto hidden md:flex md:flex-row items-center justify-center gap-12">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <item.icon size={18} className="text-gold" />
          <span className="font-body font-medium text-[13px] text-bark">{item.text}</span>
          {i < items.length - 1 && (
            <div className="hidden md:block ml-10 h-4 border-r border-border" />
          )}
        </div>
      ))}
    </div>
  </motion.section>
);

export default TrustBar;
