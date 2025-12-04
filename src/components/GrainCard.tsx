import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GrainCardProps {
  name: string;
  icon: string;
  tempRange: string;
  isSelected: boolean;
  onClick: () => void;
}

const GrainCard = ({ name, icon, tempRange, isSelected, onClick }: GrainCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'grain-card relative flex flex-col items-center gap-3 p-4 min-h-[140px]',
        isSelected && 'ring-2 ring-primary bg-primary/5'
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <span className="text-4xl">{icon}</span>
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{tempRange}</span>
    </button>
  );
};

export default GrainCard;
