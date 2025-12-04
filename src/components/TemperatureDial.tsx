import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TemperatureDialProps {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  recommendedMin: number;
  recommendedMax: number;
  onChange: (temp: number) => void;
  mode: 'manual' | 'auto';
}

const TemperatureDial = ({
  currentTemp,
  minTemp,
  maxTemp,
  recommendedMin,
  recommendedMax,
  onChange,
  mode,
}: TemperatureDialProps) => {
  const { t } = useLanguage();
  const isOutOfRange = currentTemp < recommendedMin || currentTemp > recommendedMax;
  
  const percentage = ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;
  const angle = (percentage / 100) * 270 - 135;

  const handleDecrease = () => {
    if (currentTemp > minTemp) {
      onChange(currentTemp - 1);
    }
  };

  const handleIncrease = () => {
    if (currentTemp < maxTemp) {
      onChange(currentTemp + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dial */}
      <div className="relative w-52 h-52">
        {/* Outer ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="424"
            strokeDashoffset="106"
          />
          {/* Active arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isOutOfRange ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="424"
            strokeDashoffset={424 - (percentage / 100) * 318}
            className="transition-all duration-300"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            'text-5xl font-bold transition-colors',
            isOutOfRange ? 'text-destructive' : 'text-foreground'
          )}>
            {currentTemp}°C
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {mode === 'auto' ? t('autoMode') : t('manualMode')}
          </span>
        </div>

        {/* Animated pulse ring */}
        <div className={cn(
          'absolute inset-4 rounded-full border-4 border-accent/30',
          mode === 'auto' && 'animate-dial-pulse'
        )} />
      </div>

      {/* Controls */}
      {mode === 'manual' && (
        <div className="flex items-center gap-6">
          <button
            onClick={handleDecrease}
            disabled={currentTemp <= minTemp}
            className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
          >
            <Minus className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleIncrease}
            disabled={currentTemp >= maxTemp}
            className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}

      {/* Warning */}
      {isOutOfRange && (
        <p className="text-sm text-destructive text-center px-4 animate-fade-up">
          {t('warning')}
        </p>
      )}

      {/* Recommended range */}
      <p className="text-sm text-muted-foreground">
        {t('recommendedTemp')} {recommendedMin}°C - {recommendedMax}°C
      </p>
    </div>
  );
};

export default TemperatureDial;
