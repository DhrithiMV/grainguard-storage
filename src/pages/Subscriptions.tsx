import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 1,
    months: 1,
    price: 1999,
    features: ['100 kg storage', 'Temperature control', '24/7 monitoring'],
    popular: false,
  },
  {
    id: 2,
    months: 3,
    price: 4999,
    features: ['300 kg storage', 'Temperature control', '24/7 monitoring', 'Pickup service'],
    popular: true,
  },
  {
    id: 3,
    months: 6,
    price: 8999,
    features: ['600 kg storage', 'Temperature control', '24/7 monitoring', 'Pickup & Drop', 'Priority support'],
    popular: false,
  },
  {
    id: 4,
    months: 12,
    price: 14999,
    features: ['1200 kg storage', 'Temperature control', '24/7 monitoring', 'Pickup & Drop', 'Priority support', 'Insurance'],
    popular: false,
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('subscriptionPlans')}</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Subscribe to the plan and acquire storage space in which you can store your grains.
      </p>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'card-elevated p-4 relative overflow-hidden transition-all',
              plan.popular && 'ring-2 ring-accent'
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {plan.months} {plan.months === 1 ? t('month') : t('months')} Subscription
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {plan.features[0]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('perMonth')}</p>
              </div>
            </div>

            <ul className="space-y-1.5 mb-4">
              {plan.features.slice(1).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/payment', { state: { plan } })}
              className={cn(
                'w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98]',
                plan.popular
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-primary text-primary hover:bg-primary/10'
              )}
            >
              {t('subscribeNow')}
            </button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Subscriptions;
