import { useEffect, useState, useRef } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface ResultItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id,name,slug,price,images')
        .ilike('name', `%${query.trim()}%`)
        .limit(5);
      setResults((data as ResultItem[]) || []);
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bark/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 -translate-x-1/2 top-[10%] md:top-[15%] w-[92%] max-w-[560px] bg-white rounded-[4px] z-50 overflow-hidden shadow-card-hover"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <SearchIcon size={18} className="text-gold shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search rings, charms, bracelets…"
                className="flex-1 bg-transparent font-body text-sm text-bark placeholder:text-bark-muted outline-none"
              />
              <button onClick={onClose} className="text-bark-muted hover:text-gold transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {loading && (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-12 h-14 rounded-[2px]" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3 rounded-[2px]" />
                        <Skeleton className="h-3 w-1/4 rounded-[2px]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <p className="font-body text-sm text-bark-muted text-center py-8">
                  No matches for "{query}"
                </p>
              )}

              {!loading && results.length > 0 && (
                <ul>
                  {results.map(r => (
                    <li key={r.id}>
                      <button
                        onClick={() => handleSelect(r.slug)}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-ivory-warm transition-colors text-left"
                      >
                        <img
                          src={r.images?.[0] || '/placeholder.svg'}
                          alt={r.name}
                          className="w-12 h-14 object-cover rounded-[2px] border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-[1rem] text-bark line-clamp-1">{r.name}</p>
                          <p className="font-body text-sm text-gold font-semibold">৳{r.price}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!query && (
                <div className="p-5">
                  <p className="font-body text-[11px] uppercase tracking-[0.15em] text-bark-muted mb-3">Quick links</p>
                  <div className="flex flex-wrap gap-2">
                    {['Rings', 'Bracelets', 'Phone Charms', 'New Arrivals'].map(label => (
                      <button
                        key={label}
                        onClick={() => setQuery(label)}
                        className="font-body text-xs px-3 py-1.5 border border-border rounded-[2px] text-bark-mid hover:border-gold hover:text-gold transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
