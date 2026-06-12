import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Banknote } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { SEOHead } from '@/components/SEOHead';

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <label className="block font-body font-medium text-sm text-bark-mid mb-1.5">{label}</label>
    {children}
    {error && <p className="font-body text-xs text-crimson mt-1">{error}</p>}
  </div>
);

const DISTRICTS = [
  'Bagerhat','Bandarban','Barguna','Barisal','Bhola','Bogura','Brahmanbaria',
  'Chandpur','Chapainawabganj','Chattogram','Chuadanga',"Cox's Bazar",'Cumilla',
  'Dhaka','Dinajpur','Faridpur','Feni','Gaibandha','Gazipur','Gopalganj',
  'Habiganj','Jamalpur','Jessore','Jhalakathi','Jhenaidah','Joypurhat',
  'Khagrachhari','Khulna','Kishoreganj','Kurigram','Kushtia','Lakshmipur',
  'Lalmonirhat','Madaripur','Magura','Manikganj','Meherpur','Moulvibazar',
  'Munshiganj','Mymensingh','Naogaon','Narail','Narayanganj','Narsingdi',
  'Natore','Nawabganj','Netrokona','Nilphamari','Noakhali','Pabna','Panchagarh',
  'Patuakhali','Pirojpur','Rajbari','Rajshahi','Rangamati','Rangpur','Satkhira',
  'Shariatpur','Sherpur','Sirajganj','Sunamganj','Sylhet','Tangail','Thakurgaon',
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, totalItems } = useCart();

  // Redirect if cart empty
  useEffect(() => {
    if (totalItems === 0) navigate('/', { replace: true });
  }, [totalItems, navigate]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (field: string) => setTouched(p => ({ ...p, [field]: true }));

  // Validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/^01[3-9]\d{8}$/.test(phone)) e.phone = 'Enter a valid Bangladeshi number';
    if (address.trim().length < 10) e.address = 'Address must be at least 10 characters';
    if (!district) e.district = 'Please select a district';
    if (!upazila.trim()) e.upazila = 'Upazila is required';
    return e;
  }, [name, phone, address, district, upazila]);

  const hasErrors = Object.keys(errors).length > 0;
  const deliveryCharge = district ? (district === 'Dhaka' ? 60 : 120) : 0;

  const mysteryItem = items.find(i => i.isMystery);
  const giftCost = mysteryItem?.isGift ? (mysteryItem.giftCost ?? 50) : 0;
  const total = subtotal + giftCost + deliveryCharge;

  const handleSubmit = async () => {
    // Touch all to show errors
    setTouched({ name: true, phone: true, address: true, district: true, upazila: true });
    if (hasErrors || submitting) return;

    setSubmitting(true);
    setSubmitError('');

    // Prices, discounts, delivery and totals are computed server-side from
    // the products/campaigns tables; only ids and quantities are sent.
    let result;
    if (mysteryItem) {
      const extraItems = items
        .filter(i => !i.isMystery)
        .map(i => ({ id: i.id, quantity: i.quantity }));
      result = await supabase.rpc('place_mystery_order', {
        p_campaign_id: mysteryItem.isCustomBox ? null : (mysteryItem.campaignId ?? null),
        p_custom_box_item_ids: mysteryItem.isCustomBox && mysteryItem.customBoxItems
          ? mysteryItem.customBoxItems.map(c => c.id)
          : null,
        p_box_quantity: mysteryItem.quantity,
        p_is_gift: !!mysteryItem.isGift,
        p_gift_recipient_name: mysteryItem.isGift ? (mysteryItem.giftRecipientName ?? null) : null,
        p_gift_message: mysteryItem.isGift ? (mysteryItem.giftMessage ?? null) : null,
        p_gift_wrap_type: mysteryItem.giftWrapType ?? 'kraft',
        p_gift_handwritten: mysteryItem.giftHandwritten ?? true,
        p_extra_items: extraItems.length > 0 ? extraItems : null,
        p_customer_name: name.trim(),
        p_customer_phone: phone.trim(),
        p_address: address.trim(),
        p_district: district,
        p_upazila: upazila.trim(),
      });
    } else {
      result = await supabase.rpc('place_order', {
        p_items: items.map(i => ({ id: i.id, quantity: i.quantity })),
        p_customer_name: name.trim(),
        p_customer_phone: phone.trim(),
        p_address: address.trim(),
        p_district: district,
        p_upazila: upazila.trim(),
        p_note: note.trim() || null,
      });
    }

    if (result.error || !result.data) {
      const msg = result.error?.message ?? '';
      setSubmitError(
        msg.includes('rate_limited')
          ? 'Too many orders placed recently. Please wait a bit and try again.'
          : msg.includes('campaign_inactive')
            ? 'This mystery box drop has ended. Please refresh and try again.'
            : 'Something went wrong. Please try again.'
      );
      setSubmitting(false);
      return;
    }

    const orderNumber = (result.data as { order_number: string }).order_number;
    clearCart();
    navigate('/order-success', { state: { orderNumber } });
  };

  if (totalItems === 0) return null;

  const inputClass = (field: string) =>
    `w-full h-[48px] border rounded-[2px] px-4 font-body text-sm text-bark bg-transparent transition-colors focus:outline-none focus:border-gold ${
      touched[field] && errors[field] ? 'border-crimson' : 'border-border'
    }`;

  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title="Checkout"
        description="Complete your Nore'e Jewellery order. Cash on delivery across Bangladesh."
        url="/checkout"
      />
      <NavigationBar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-[58fr_42fr] gap-8 md:gap-12">
          {/* LEFT — Form */}
          <div>
            <h1 className="font-display font-medium text-2xl text-bark mb-8">Delivery Details</h1>

            <Field label="Full Name" error={touched.name ? errors.name : undefined}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => touch('name')}
                className={inputClass('name')}
                placeholder="Your full name"
              />
            </Field>

            <Field label="Phone Number" error={touched.phone ? errors.phone : undefined}>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => touch('phone')}
                className={inputClass('phone')}
                placeholder="01XXXXXXXXX"
              />
            </Field>

            <Field label="Delivery Address" error={touched.address ? errors.address : undefined}>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                onBlur={() => touch('address')}
                rows={3}
                placeholder="House/Road No., Area"
                className={`w-full border rounded-[2px] px-4 py-3 font-body text-sm text-bark bg-transparent resize-none transition-colors focus:outline-none focus:border-gold ${
                  touched.address && errors.address ? 'border-crimson' : 'border-border'
                }`}
              />
            </Field>

            <Field label="District" error={touched.district ? errors.district : undefined}>
              <Select value={district} onValueChange={v => { setDistrict(v); touch('district'); }}>
                <SelectTrigger className={`w-full h-[48px] rounded-[2px] px-4 font-body text-sm ${
                  touched.district && errors.district ? 'border-crimson' : 'border-border'
                } focus:ring-0 focus:ring-offset-0 focus:border-gold`}>
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px] bg-white">
                  {DISTRICTS.map(d => (
                    <SelectItem key={d} value={d} className="font-body text-sm">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Upazila" error={touched.upazila ? errors.upazila : undefined}>
              <input
                type="text"
                value={upazila}
                onChange={e => setUpazila(e.target.value)}
                onBlur={() => touch('upazila')}
                className={inputClass('upazila')}
                placeholder="Enter your upazila"
              />
            </Field>

            <Field label="Order Note (optional)">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Any special instructions? (optional)"
                className="w-full border border-border rounded-[2px] px-4 py-3 font-body text-sm text-bark bg-transparent resize-none transition-colors focus:outline-none focus:border-gold"
              />
            </Field>

            {submitError && (
              <p className="font-body text-sm text-crimson mb-4">{submitError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-[52px] bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold-dark transition-colors duration-200 mt-4 flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-70"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : 'Place Order (Cash on Delivery)'}
            </button>
          </div>

          {/* RIGHT — Summary */}
          <div className="md:sticky md:top-8 self-start">
            <div className="bg-white border border-border p-6 rounded-[2px]">
              <h2 className="font-display font-medium text-xl text-bark mb-5">Order Summary</h2>

              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[56px] h-[70px] object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-sm text-bark line-clamp-1">{item.name}</p>
                      <p className="font-body text-xs text-bark-muted mt-0.5">Qty: {item.quantity}</p>
                      <p className="font-body font-medium text-sm text-bark mt-0.5">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border my-4" />

              <div className="flex justify-between font-body text-sm text-bark-mid mb-2">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              {giftCost > 0 && (
                <div className="flex justify-between font-body text-sm text-bark-mid mb-2">
                  <div>
                    <span>Gift wrap</span>
                    <p className="font-body text-[10px] text-bark-muted mt-0.5">
                      {mysteryItem?.giftWrapType ?? 'kraft'} paper · {mysteryItem?.giftHandwritten ? 'handwritten' : 'printed'} message
                    </p>
                  </div>
                  <span className="text-gold font-medium">+৳{giftCost}</span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm text-bark-mid">
                <span>Delivery</span>
                <span>{district ? `৳${deliveryCharge}` : 'Select district'}</span>
              </div>

              <div className="border-t border-border my-3" />

              <div className="flex justify-between items-baseline">
                <span className="font-display font-medium text-lg text-bark">Total</span>
                <span className="font-display font-semibold text-xl text-gold">৳{district ? total : subtotal + giftCost}</span>
              </div>

              <div className="mt-4 bg-ivory-warm border border-border p-3 rounded-sm flex items-center gap-2">
                <Banknote size={16} className="text-gold shrink-0" />
                <span className="font-body text-xs text-bark-mid">Payment: Cash on Delivery only</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
