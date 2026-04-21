import { MessageCircle } from 'lucide-react';

const WhatsAppFAB = () => {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '8801700000000';
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full bg-gold text-bark flex items-center justify-center shadow-card-hover hover:bg-gold-dark transition-all duration-200 active:scale-[0.95] group"
    >
      <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping opacity-60 group-hover:opacity-0" />
      <MessageCircle size={24} className="relative" />
    </a>
  );
};

export default WhatsAppFAB;
