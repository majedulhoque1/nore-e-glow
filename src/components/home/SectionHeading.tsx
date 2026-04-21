import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: ReactNode;
  numeral?: string;
  align?: 'left' | 'center';
  subtitle?: string;
  rightSlot?: ReactNode;
}

const SectionHeading = ({ eyebrow, title, numeral, align = 'center', subtitle, rightSlot }: Props) => {
  const isCenter = align === 'center';
  return (
    <div className={`flex ${isCenter ? 'flex-col items-center text-center' : 'items-end justify-between gap-6'} mb-10 md:mb-14`}>
      <div className={isCenter ? 'flex flex-col items-center' : ''}>
        <div className={`flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}>
          {numeral && (
            <span className="numeral text-gold/70 text-3xl md:text-4xl select-none">{numeral}</span>
          )}
          <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-gold">
            {eyebrow}
          </span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`font-display font-light text-bark mt-3 leading-[1.05] ${isCenter ? '' : 'max-w-[560px]'}`}
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <p className={`font-body font-light text-bark-mid mt-4 max-w-[460px] ${isCenter ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
        {isCenter && <div className="rule-gold-solid w-10 mt-5 opacity-50" />}
      </div>
      {rightSlot && !isCenter && <div className="hidden md:block">{rightSlot}</div>}
    </div>
  );
};

export default SectionHeading;
