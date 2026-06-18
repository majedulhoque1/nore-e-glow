/**
 * The infinite-loop brand bar — a thin band that bridges the dark hero into the
 * cream content with a continuously scrolling mantra. Decorative (aria-hidden);
 * the same phrases live as real, readable copy elsewhere on the page.
 *
 * Mechanics: two identical tracks sit side-by-side (total width = 2× one track)
 * and the row translates by exactly -50% (animate-marquee-x), so the loop is
 * seamless. Edges fade via .mask-fade-x. Honours prefers-reduced-motion.
 */
const PHRASES = [
  'Hand-finished in Dhaka',
  'Made to be passed down',
  'Cash on delivery, nationwide',
  'Cared for over WhatsApp',
  'Worn into memory',
];

const Track = () => (
  <div className="flex shrink-0 items-center">
    {PHRASES.map((phrase) => (
      <span key={phrase} className="flex items-center whitespace-nowrap">
        <span className="font-body text-[11px] uppercase tracking-[0.28em] text-ivory/75">
          {phrase}
        </span>
        <span className="mx-7 text-gold-light/70 text-[11px]">✦</span>
      </span>
    ))}
  </div>
);

const MarqueeBar = () => (
  <div
    aria-hidden
    className="relative overflow-hidden bg-noir border-y border-gold/20 py-3.5"
  >
    <div className="absolute inset-0 bg-gold-sheen opacity-[0.04]" />
    <div className="relative mask-fade-x">
      <div
        className="flex w-max animate-marquee-x motion-reduce:animate-none"
        style={{ animationDuration: '11s' }}
      >
        <Track />
        <Track />
      </div>
    </div>
  </div>
);

export default MarqueeBar;
