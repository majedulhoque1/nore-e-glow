import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface Props {
  to: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  cta: string;
  delay?: number;
}

export const MysteryChoiceCard = ({ to, eyebrow, title, subtitle, description, icon: Icon, cta, delay = 0 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={to}
        className="group block bg-ivory-warm border border-border hover:border-gold rounded-[2px] p-8 md:p-10 h-full transition-colors duration-300 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-bark/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors">
              <Icon size={22} className="text-gold" strokeWidth={1.4} />
            </div>
            <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">{eyebrow}</span>
          </div>

          <h3 className="font-display font-medium text-bark leading-[1.1]" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2rem)' }}>
            {title}
          </h3>
          <p className="font-display italic text-gold mt-1.5" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)' }}>
            {subtitle}
          </p>

          <p className="font-body text-sm text-bark-mid mt-4 leading-relaxed">
            {description}
          </p>

          <div className="mt-7 inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-[0.1em] text-bark group-hover:text-gold transition-colors">
            {cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
