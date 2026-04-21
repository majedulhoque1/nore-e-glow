import React from 'react';
import { ChevronDown, Gift } from 'lucide-react';

interface GiftOptionToggleProps {
  isGift: boolean;
  onToggle: (checked: boolean) => void;
}

export const GiftOptionToggle: React.FC<GiftOptionToggleProps> = ({ isGift, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isGift)}
      className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-[2px] bg-white hover:bg-ivory-warm transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 transition-colors ${
            isGift ? 'bg-gold border-gold' : 'border-bark-muted bg-transparent'
          }`}
          aria-hidden
        >
          {isGift && (
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-bark">
              <path d="M1.5 5.5L4 8L8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="font-body font-medium text-sm text-bark flex items-center gap-1.5">
          Gift wrap for someone special
          <Gift size={14} className="text-gold" />
        </span>
      </div>
      <ChevronDown
        size={16}
        className={`text-bark-muted transition-transform duration-200 ${isGift ? 'rotate-180' : ''}`}
      />
    </button>
  );
};
