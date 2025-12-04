import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Language = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/home')}
          className="text-primary font-medium"
        >
          {t('skip')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === 0 ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <h1 className="text-xl font-semibold text-foreground text-center mb-2">
          {t('languageQuestion')}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Select the language that you prefer to use throughout the app
        </p>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all',
              language === 'en'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🇬🇧</span>
              <span className="font-medium text-foreground">{t('english')}</span>
            </div>
            {language === 'en' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>

          <button
            onClick={() => setLanguage('kn')}
            className={cn(
              'w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all',
              language === 'kn'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🇮🇳</span>
              <span className="font-medium text-foreground">{t('kannada')}</span>
            </div>
            {language === 'kn' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        {t('getStarted')}
      </button>
    </div>
  );
};

export default Language;
