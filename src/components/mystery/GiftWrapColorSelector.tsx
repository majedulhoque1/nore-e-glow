import React from 'react';

export type GiftWrapType = 'kraft' | 'gold' | 'burgundy';

interface GiftWrapColorSelectorProps {
  value: GiftWrapType;
  onChange: (value: GiftWrapType) => void;
}

export const GiftWrapColorSelector: React.FC<GiftWrapColorSelectorProps> = ({ value, onChange }) => {
  const colors: { label: string; value: GiftWrapType; dot: string }[] = [
    { label: 'Kraft', value: 'kraft', dot: 'bg-[hsl(35,40%,55%)]' },
    { label: 'Gold', value: 'gold', dot: 'bg-gold' },
    { label: 'Burgundy', value: 'burgundy', dot: 'bg-crimson' },
  ];

  return (
    <div className="space-y-2">
      <label className="font-body text-[11px] text-bark-muted uppercase tracking-[0.1em] block">
        Wrapping Paper
      </label>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(color => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`px-2.5 py-2.5 border rounded-[2px] font-body text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              value === color.value
                ? 'border-gold bg-gold/10 text-bark'
                : 'border-border text-bark-muted hover:border-gold'
            }`}
          >
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${color.dot}`} />
            {color.label}
          </button>
        ))}
      </div>
    </div>
  );
};
