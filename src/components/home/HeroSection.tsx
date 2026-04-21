import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import heroStillLife from '@/assets/hero-beaded-necklace.png';

const HeroSection = () => (
  <section className="relative w-full bg-ivory overflow-hidden">
    {/* Subtle grid texture overlay */}
    <div
      className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--bark)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--bark)) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }}
    />

    <div className="relative max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 lg:min-h-[86vh]">
      {/* LEFT — Editorial text panel */}
      <div className="lg:col-span-7 flex flex-col justify-between px-5 md:px-12 lg:px-16 py-7 md:py-12 lg:py-20 order-2 lg:order-1">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-bark-muted"
        >
          <span>N°01 — Heirloom Edit</span>
          <span className="flex items-center gap-3">
            <span className="w-12 h-px bg-bark/20" />
            Spring / Summer 2025
          </span>
        </motion.div>

        {/* Centerpiece content */}
        <div className="flex-1 flex flex-col justify-center py-2 md:py-12 lg:py-0 max-w-[640px]">
          {/* Issue number — oversized */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute top-20 right-12 hidden lg:block pointer-events-none"
          >
            <span
              className="font-display italic text-bark/[0.04] leading-none select-none"
              style={{ fontSize: 'clamp(8rem, 18vw, 16rem)' }}
            >
              01
            </span>
          </motion.div>

          {/* Tag chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 self-start mb-4 md:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-crimson" />
            <span className="font-body text-[11px] uppercase tracking-[0.25em] text-bark-mid">
              Made by hand · in small batches
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-bark leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.1rem, 7.5vw, 6rem)' }}
          >
            Worn slowly,
            <br />
            <span className="italic font-light text-bark-mid">made to be</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-[1] text-bark">remembered.</span>
              <span className="absolute left-0 right-0 bottom-[0.1em] h-[0.18em] bg-gold/40 -z-0" />
            </span>
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-body text-[14px] md:text-base text-bark-mid leading-[1.6] mt-4 md:mt-8 max-w-[460px]"
          >
            Each piece is shaped, set and finished by a single pair of hands —
            because jewelry meant to outlive a generation deserves the time of
            one.
          </motion.p>

          {/* CTA cluster */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-bark text-ivory font-body text-sm tracking-wide px-7 py-4 rounded-full hover:bg-bark-mid transition-all duration-300 hover:gap-4"
            >
              <span>Browse the Edit</span>
              <span className="w-7 h-7 rounded-full bg-gold flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={14} className="text-bark" strokeWidth={2.2} />
              </span>
            </Link>

            <Link
              to="/mystery-collection/build"
              className="font-body text-sm text-bark underline underline-offset-[6px] decoration-gold decoration-2 hover:decoration-bark transition-all"
            >
              Or build your own box ✦
            </Link>
          </motion.div>
        </div>

        {/* Bottom row — quiet credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="hidden lg:grid grid-cols-3 gap-8 pt-8 border-t border-bark/10 max-w-[560px]"
        >
          <div>
            <div className="font-display text-2xl text-bark">2,400+</div>
            <div className="font-body text-[11px] uppercase tracking-[0.2em] text-bark-muted mt-1">
              Pieces shipped
            </div>
          </div>
          <div>
            <div className="font-display text-2xl text-bark inline-flex items-center gap-1.5">
              4.9
              <Star size={14} className="fill-gold text-gold" />
            </div>
            <div className="font-body text-[11px] uppercase tracking-[0.2em] text-bark-muted mt-1">
              Customer rating
            </div>
          </div>
          <div>
            <div className="font-display text-2xl text-bark">৳0</div>
            <div className="font-body text-[11px] uppercase tracking-[0.2em] text-bark-muted mt-1">
              Dhaka delivery
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Image panel as art frame */}
      <div className="lg:col-span-5 relative order-1 lg:order-2 h-[34vh] md:h-[55vh] lg:h-auto lg:min-h-full">
        {/* Bark background extends behind */}
        <div className="absolute inset-0 bg-bark" />

        {/* Image with gentle inset frame */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 lg:inset-y-12 lg:inset-x-8"
        >
          <img
            src={heroStillLife}
            alt="Handcrafted Nore'e beaded necklace duo in black and white crystal beads with gold accents on satin red drape"
            className="w-full h-full object-cover"
            loading="eager"
            width={1080}
            height={1600}
          />

          {/* Floating caption tag — bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 max-w-[220px] bg-ivory/95 backdrop-blur-sm px-4 py-3 shadow-lg"
          >
            <div className="font-body text-[10px] uppercase tracking-[0.25em] text-bark-muted">
              Featured
            </div>
            <div className="font-display italic text-bark text-base mt-0.5 leading-tight">
              Noir & Ivory beaded choker
            </div>
            <div className="font-body text-[11px] text-gold mt-2">
              Hand-strung crystal · gold-tone
            </div>
          </motion.div>

          {/* Top-right index marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-2"
          >
            <span className="w-8 h-px bg-ivory/60" />
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-ivory">
              FIG. 01
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* Bottom marquee — running tagline */}
    <div className="relative border-y border-bark/10 bg-ivory-warm overflow-hidden">
      <div className="flex animate-marquee-x whitespace-nowrap py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="font-display italic text-bark text-xl mx-8 inline-flex items-center gap-8"
          >
            Heirloom-inspired
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Hand-finished in Dhaka
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Cash on delivery
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
