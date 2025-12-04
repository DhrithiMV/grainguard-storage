import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import TemperatureDial from '@/components/TemperatureDial';
import { cn } from '@/lib/utils';

const Temperature = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [temperature, setTemperature] = useState(15);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('temperatureRegulator')}</h1>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setMode('manual')}
          className={cn(
            'px-6 py-2.5 rounded-xl font-medium text-sm transition-all',
            mode === 'manual'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          {t('manualMode')}
        </button>
        <button
          onClick={() => setMode('auto')}
          className={cn(
            'px-6 py-2.5 rounded-xl font-medium text-sm transition-all',
            mode === 'auto'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          {t('autoMode')}
        </button>
      </div>

      {/* Temperature Dial */}
      <div className="flex justify-center mb-8">
        <TemperatureDial
          currentTemp={temperature}
          minTemp={5}
          maxTemp={30}
          recommendedMin={12}
          recommendedMax={15}
          onChange={setTemperature}
          mode={mode}
        />
      </div>

      {/* Info Card */}
      <div className="card-elevated p-4 mb-8">
        <h3 className="font-medium text-foreground mb-2">Temperature Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Wheat: 12-15°C for optimal storage
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Rice: 10-14°C with low humidity
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Pulses: 8-12°C to prevent pests
          </li>
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/subscriptions')}
        className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        {t('next')}
      </button>
    </div>
  );
};

export default Temperature;
