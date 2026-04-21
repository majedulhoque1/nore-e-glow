import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftWrapColorSelector, type GiftWrapType } from './GiftWrapColorSelector';
import { GiftOptionToggle } from './GiftOptionToggle';

export interface GiftData {
  isGift: boolean;
  recipientName: string;
  message: string;
  wrapType: GiftWrapType;
  handwritten: boolean;
}

interface GiftCustomizationPanelProps {
  value: GiftData;
  onChange: (giftData: GiftData) => void;
}

export const GiftCustomizationPanel: React.FC<GiftCustomizationPanelProps> = ({ value, onChange }) => {
  const [recipientName, setRecipientName] = useState(value.recipientName);
  const [message, setMessage] = useState(value.message);

  const update = (partial: Partial<GiftData>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className="border-t border-border pt-4 mt-2 space-y-3">
      <GiftOptionToggle
        isGift={value.isGift}
        onToggle={(checked) => update({ isGift: checked })}
      />

      <AnimatePresence initial={false}>
        {value.isGift && (
          <motion.div
            key="gift-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              {/* Recipient name */}
              <div>
                <label className="font-body text-[11px] text-bark-muted uppercase tracking-[0.1em] block mb-1.5">
                  Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="Who is this for?"
                  value={recipientName}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, 40);
                    setRecipientName(v);
                    update({ recipientName: v });
                  }}
                  className="w-full h-10 border border-border rounded-[2px] px-3 text-bark font-body text-sm focus:border-gold focus:outline-none transition-colors bg-white"
                />
                <p className="font-body text-[10px] text-bark-muted mt-1">{recipientName.length}/40</p>
              </div>

              {/* Gift message */}
              <div>
                <label className="font-body text-[11px] text-bark-muted uppercase tracking-[0.1em] block mb-1.5">
                  Gift Message <span className="text-bark-muted/70 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Write something special..."
                  value={message}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, 100);
                    setMessage(v);
                    update({ message: v });
                  }}
                  rows={2}
                  className="w-full border border-border rounded-[2px] px-3 py-2 text-bark font-body text-sm focus:border-gold focus:outline-none resize-none transition-colors bg-white"
                />
                <p className="font-body text-[10px] text-bark-muted mt-1">{message.length}/100</p>
              </div>

              {/* Wrap color */}
              <GiftWrapColorSelector
                value={value.wrapType}
                onChange={(v) => update({ wrapType: v })}
              />

              {/* Handwritten / Printed */}
              <div>
                <label className="font-body text-[11px] text-bark-muted uppercase tracking-[0.1em] block mb-2">
                  Message Style
                </label>
                <div className="flex gap-2">
                  {[
                    { label: 'Handwritten', val: true },
                    { label: 'Printed Card', val: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => update({ handwritten: opt.val })}
                      className={`flex-1 px-3 py-2 border rounded-[2px] font-body text-xs font-medium transition-all duration-200 ${
                        value.handwritten === opt.val
                          ? 'border-gold bg-gold/10 text-bark'
                          : 'border-border text-bark-muted hover:border-gold'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="font-body text-[10px] text-bark-muted mt-1.5 italic">
                  Handwritten adds a personal touch.
                </p>
              </div>

              {/* Cost summary */}
              <div className="bg-ivory-warm border border-border rounded-[2px] p-3 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs text-bark-muted">Gift wrap</span>
                  <span className="font-body font-semibold text-sm text-gold">+৳50</span>
                </div>
                <p className="font-body text-[10px] text-bark-muted leading-relaxed">
                  Wrapped in {value.wrapType} paper · {value.handwritten ? 'handwritten' : 'printed'} message included.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
