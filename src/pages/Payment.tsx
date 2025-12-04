import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PaymentMethod = 'card' | 'upi' | 'netbanking';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const plan = location.state?.plan || { months: 1, price: 1999 };
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [upiId, setUpiId] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handlePayment = () => {
    // Mock payment
    toast.success('Processing payment...');
    setTimeout(() => {
      navigate('/payment-success', { state: { plan, transactionId: `GG${Date.now()}` } });
    }, 1500);
  };

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('addPaymentMethod')}</h1>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'card', icon: CreditCard, label: 'Card' },
          { id: 'upi', icon: Smartphone, label: t('upi') },
          { id: 'netbanking', icon: Building2, label: t('netBanking') },
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
            className={cn(
              'p-4 rounded-xl flex flex-col items-center gap-2 transition-all',
              paymentMethod === method.id
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-card border-2 border-border'
            )}
          >
            <method.icon className={cn(
              'w-6 h-6',
              paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'text-xs font-medium',
              paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'
            )}>
              {method.label}
            </span>
          </button>
        ))}
      </div>

      {/* Card Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4 animate-fade-up">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t('cardNumber')}</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              className="input-field"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t('expiryDate')}</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                className="input-field"
                maxLength={5}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t('cvv')}</label>
              <input
                type="password"
                placeholder="***"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                className="input-field"
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* UPI Form */}
      {paymentMethod === 'upi' && (
        <div className="animate-fade-up">
          <label className="text-sm text-muted-foreground mb-1 block">UPI ID</label>
          <input
            type="text"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="input-field"
          />
        </div>
      )}

      {/* Net Banking */}
      {paymentMethod === 'netbanking' && (
        <div className="card-elevated p-4 animate-fade-up">
          <p className="text-sm text-muted-foreground">
            You will be redirected to your bank's website to complete the payment.
          </p>
        </div>
      )}

      {/* Promo Code */}
      <div className="mt-6">
        <label className="text-sm text-muted-foreground mb-1 block">{t('promoCode')}</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="input-field flex-1"
          />
          <button className="px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium">
            {t('apply')}
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card-elevated p-4 mt-6">
        <h3 className="font-semibold text-foreground mb-3">{t('orderSummary')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{plan.months} Month Subscription</span>
            <span className="text-foreground">₹{plan.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="text-foreground">₹{Math.round(plan.price * 0.18).toLocaleString()}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{Math.round(plan.price * 1.18).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handlePayment}
        className="w-full mt-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        {t('confirmPayment')}
      </button>
    </div>
  );
};

export default Payment;
