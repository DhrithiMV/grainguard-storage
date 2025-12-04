import { CheckCircle, Download, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { transactionId } = location.state || { transactionId: 'GG123456' };

  return (
    <div className="min-h-screen bg-background px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 animate-scale-in">
        <CheckCircle className="w-12 h-12 text-accent" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">Hurray!</h1>
      <p className="text-muted-foreground text-center mb-6">
        {t('paymentSuccess')}
      </p>

      <div className="card-elevated p-6 w-full max-w-sm mb-8 animate-fade-up">
        <p className="text-center text-sm text-muted-foreground mb-2">
          Your subscription has been activated
        </p>
        <div className="flex items-center justify-center gap-2 py-4">
          {transactionId.split('').map((char: string, i: number) => (
            <span
              key={i}
              className="w-8 h-10 bg-muted rounded-lg flex items-center justify-center font-mono font-bold text-foreground"
            >
              {char}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t('transactionId')}: {transactionId}
        </p>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
        Thank you for choosing GrainGuard! We'll send a confirmation email shortly.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => {/* Download receipt */}}
          className="w-full py-4 bg-card border border-border text-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-colors"
        >
          <Download className="w-5 h-5" />
          {t('downloadReceipt')}
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Home className="w-5 h-5" />
          {t('home')}
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Adhvare by us at
      </p>
      <div className="flex items-center justify-center gap-4 mt-2">
        <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </button>
        <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
