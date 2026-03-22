import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const featured = mockProducts.filter(p => p.is_featured).slice(0, 8);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <h2 className="font-display font-medium text-center text-bark" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)' }}>
        Bestsellers
      </h2>
      <p className="font-body font-light text-bark-mid text-center mt-2 mb-10">
        Pieces our customers love most
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {featured.map((product, i) => (
          <ProductCard key={product.id} {...product} index={i} />
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturedProducts;
