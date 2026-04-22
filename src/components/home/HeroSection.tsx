import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import heroImage from '@/assets/hero-editorial-v2.jpg';

const HeroSection = () => (
  <section className="relative w-full bg-ivory">
    <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 lg:min-h-[82vh]">
      {/* LEFT — Editorial text panel */}
      <div className="lg:col-span-6 flex flex-col justify-between px-6 md:px-12 lg:px-16 py-10 md:py-14 lg:py-20 order-2 lg:order-1">
        {/* Top meta */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.3em] text-bark-muted"
        >
          <span className="w-8 h-px bg-gold" />
          <span>The Heirloom Edit · No 01</span>
        </motion.div>

        {/* Centerpiece */}
        <div className="flex-1 flex flex-col justify-center py-10 md:py-14 lg:py-0 max-w-[560px]">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-bark leading-[0.95] tracking-[-0.015em] font-light"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.2rem)' }}
          >
            Quiet pieces,
            <br />
            <span className="italic text-bark-mid">made to be</span>
            <br />
            remembered.
          </motion.h1>

          {/* Hairline divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-gold/50 w-20 mt-8 origin-left"
          />

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-body text-[14px] md:text-[15px] text-bark-mid leading-[1.7] mt-6 max-w-[440px]"
          >
            Heirloom-inspired jewelry, hand-finished in Dhaka.
            Shaped slowly, set by hand, finished to outlive the season.
          </motion.p>

          {/* CTA cluster */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-bark text-ivory font-body text-[12px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-bark-mid transition-all duration-300"
            >
              <span>Browse the Edit</span>
              <ArrowUpRight size={14} strokeWidth={1.8} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>

            <Link
              to="/mystery-collection/build"
              className="font-body text-[12px] uppercase tracking-[0.2em] text-bark-mid hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              <span className="text-gold">✦</span>
              Build your own box
            </Link>
          </motion.div>
        </div>

        {/* Bottom credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="hidden lg:flex items-center gap-8 pt-8 border-t border-bark/10 max-w-[480px]"
        >
          <div className="font-body text-[10.5px] uppercase tracking-[0.22em] text-bark-muted">
            Hand-finished in Dhaka
          </div>
          <span className="w-1 h-1 rounded-full bg-gold" />
          <div className="font-body text-[10.5px] uppercase tracking-[0.22em] text-bark-muted">
            Cash on delivery
          </div>
          <span className="w-1 h-1 rounded-full bg-gold" />
          <div className="font-body text-[10.5px] uppercase tracking-[0.22em] text-bark-muted">
            3-day exchange
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Image panel */}
      <div className="lg:col-span-6 relative order-1 lg:order-2 h-[52vh] md:h-[62vh] lg:h-auto lg:min-h-full bg-ivory-warm">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 overflow-hidden"
        >
          <img
            src={heroImage}
            alt="Crimson garnet and pearl beaded necklace draped over driftwood — heirloom jewelry by Nore'e"
            className="w-full h-full object-cover"
            loading="eager"
            width={1280}
            height={1600}
          />

          {/* Editorial caption — bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 max-w-[200px]"
          >
            <div className="bg-ivory/95 backdrop-blur-sm px-4 py-3 border-l-2 border-gold">
              <div className="font-body text-[9.5px] uppercase tracking-[0.28em] text-bark-muted">
                Featured · Fig. 01
              </div>
              <div className="font-display italic text-bark text-[15px] mt-1 leading-tight">
                Garnet & Pearl strand
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* Bottom marquee */}
    <div className="relative border-y border-bark/8 bg-ivory-warm overflow-hidden mask-fade-x">
      <div className="flex animate-marquee-x whitespace-nowrap py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="font-display italic text-bark text-lg mx-8 inline-flex items-center gap-8"
          >
            Heirloom-inspired
            <span className="w-1 h-1 rounded-full bg-gold" />
            Hand-finished in Dhaka
            <span className="w-1 h-1 rounded-full bg-gold" />
            Cash on delivery
            <span className="w-1 h-1 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
