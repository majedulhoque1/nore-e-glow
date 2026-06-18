import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Sparkles, ArrowRight, Gift } from 'lucide-react';

const BuildBoxPromo = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient - warm gold/bark tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-bark via-bark-mid to-bark" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-crimson blur-[80px]" />
      </div>
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/40 rounded-full mb-6">
              <Sparkles size={14} className="text-gold" />
              <span className="font-body text-[11px] uppercase tracking-[0.15em] text-gold font-medium">
                New Feature
              </span>
            </div>

            <h2 className="font-display italic font-light text-ivory text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] mb-4">
              Build Your <span className="text-gold">Own Box</span>
            </h2>
            
            <p className="font-body text-sm text-ivory/70 leading-relaxed max-w-md mb-6">
              Hand-pick 3 to 5 pieces from our collection and save 10%. 
              Create a personalized jewelry bundle that's uniquely yours.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-ivory/80">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Gift size={14} className="text-gold" />
                </div>
                <span className="font-body text-xs">10% Bundle Discount</span>
              </div>
              <div className="flex items-center gap-2 text-ivory/80">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Package size={14} className="text-gold" />
                </div>
                <span className="font-body text-xs">Free Dhaka Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/mystery-collection/build"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bark font-display text-sm rounded-[2px] hover:bg-gold-light transition-colors"
              >
                <Package size={16} />
                Start Building
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Box illustration */}
            <div className="relative mx-auto w-full max-w-[400px]">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gold/20 blur-[60px] rounded-full scale-75" />
              
              {/* Box visual */}
              <div className="relative bg-gradient-to-b from-bark-mid/50 to-bark rounded-2xl p-8 border border-gold/20">
                <div className="grid grid-cols-3 gap-3">
                  {/* Jewelry items preview */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i}
                      className={`aspect-square rounded-lg bg-ivory/10 border border-ivory/20 flex items-center justify-center ${
                        i === 5 ? 'col-span-1 opacity-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center">
                        <Sparkles size={14} className="text-gold" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Selection counter */}
                <div className="mt-4 flex items-center justify-between px-2">
                  <span className="font-body text-xs text-ivory/60">Pick 3–5 pieces</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="w-2 h-2 rounded-full bg-ivory/30" />
                    <span className="w-2 h-2 rounded-full bg-ivory/30" />
                  </div>
                </div>
              </div>

              {/* Floating discount badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gold flex flex-col items-center justify-center shadow-lg shadow-gold/30"
              >
                <span className="font-display text-lg text-bark font-bold">10%</span>
                <span className="font-body text-[10px] text-bark/80 uppercase">OFF</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BuildBoxPromo;
