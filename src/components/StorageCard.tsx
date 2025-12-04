import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import coldStorage from '@/assets/cold-storage-1.jpg';

interface StorageCardProps {
  id: string;
  name: string;
  distance: string;
  rating: number;
  capacity: number;
  price: number;
  grains: string[];
  lat?: number;
  lng?: number;
}

const StorageCard = ({ id, name, distance, rating, capacity, price, grains }: StorageCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div
      className="grain-card flex gap-4 cursor-pointer"
      onClick={() => navigate(`/storage/${id}`)}
    >
      <img
        src={coldStorage}
        alt={name}
        className="w-24 h-24 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{distance}</span>
          <span className="text-border">•</span>
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span>{rating}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('available')}: {capacity} {t('kg')}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-primary">₹{price}/kg/mo</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/storage/${id}`);
            }}
            className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('reserve')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageCard;
