import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import GrainCard from '@/components/GrainCard';

const grainsData = [
  { id: 'wheat', icon: '🌾', tempRange: '12-15°C' },
  { id: 'rice', icon: '🍚', tempRange: '10-14°C' },
  { id: 'maize', icon: '🌽', tempRange: '10-13°C' },
  { id: 'pulses', icon: '🫘', tempRange: '8-12°C' },
  { id: 'barley', icon: '🌿', tempRange: '10-15°C' },
  { id: 'millet', icon: '🌱', tempRange: '12-16°C' },
];

const Grains = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedGrains, setSelectedGrains] = useState<string[]>([]);

  const toggleGrain = (grainId: string) => {
    setSelectedGrains((prev) =>
      prev.includes(grainId)
        ? prev.filter((id) => id !== grainId)
        : [...prev, grainId]
    );
  };

  const handleContinue = () => {
    if (selectedGrains.length > 0) {
      navigate('/temperature');
    }
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
        <h1 className="text-lg font-semibold text-foreground">{t('selectGrains')}</h1>
      </div>

      <p className="text-muted-foreground mb-6">
        Select the grains you want to store. You can select multiple grains.
      </p>

      {/* Grain Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-up">
        {grainsData.map((grain) => (
          <GrainCard
            key={grain.id}
            name={t(grain.id as any)}
            icon={grain.icon}
            tempRange={grain.tempRange}
            isSelected={selectedGrains.includes(grain.id)}
            onClick={() => toggleGrain(grain.id)}
          />
        ))}
      </div>

      {/* Selected Info */}
      {selectedGrains.length > 0 && (
        <div className="card-elevated p-4 mb-4 animate-scale-in">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedGrains.length} grain(s)</span>
          </p>
          {selectedGrains.length === 1 && (
            <p className="text-sm text-muted-foreground mt-1">
              {t('recommendedTemp')}
              <span className="text-primary font-medium">
                {grainsData.find((g) => g.id === selectedGrains[0])?.tempRange}
              </span>
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleContinue}
        disabled={selectedGrains.length === 0}
        className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('next')}
      </button>
    </div>
  );
};

export default Grains;
