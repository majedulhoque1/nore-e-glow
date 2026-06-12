import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  productId: string; // can be temp id for new products
  images: string[];
  onChange: (urls: string[]) => void;
};

const BUCKET = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // keep in sync with bucket file_size_limit
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

const extractPath = (url: string): string | null => {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx >= 0 ? url.substring(idx + marker.length) : null;
};

const ImageUploader = ({ productId, images, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = ALLOWED_TYPES[file.type];
      if (!ext) {
        toast.error(`${file.name}: only JPEG, PNG, WebP, AVIF or GIF images are allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: file is larger than 5 MB`);
        continue;
      }
      const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    if (uploaded.length) {
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = async (idx: number) => {
    const url = images[idx];
    const path = extractPath(url);
    if (path) {
      // Best-effort delete from storage
      await supabase.storage.from(BUCKET).remove([path]);
    }
    onChange(images.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="font-body text-xs uppercase tracking-wider text-bark">
          Images <span className="text-muted-foreground normal-case tracking-normal">(first = primary)</span>
        </label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-bark/20 rounded p-8 text-center text-sm text-muted-foreground">
          No images yet. Upload at least one (4:5 portrait recommended).
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div key={url} className="relative group border border-bark/15 rounded overflow-hidden bg-muted">
              <img src={url} alt={`${idx + 1}`} className="w-full object-cover" style={{ aspectRatio: '4/5' }} />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-gold text-bark text-[10px] font-body px-1.5 py-0.5 rounded">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 bg-bark/80 text-ivory rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="bg-bark/80 text-ivory rounded p-1 disabled:opacity-30"
                  aria-label="Move left"
                ><ArrowLeft size={12} /></button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === images.length - 1}
                  className="bg-bark/80 text-ivory rounded p-1 disabled:opacity-30"
                  aria-label="Move right"
                ><ArrowRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
