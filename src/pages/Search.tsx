import { useState } from 'react';
import { ArrowLeft, Search as SearchIcon, MapPin, List, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import StorageCard from '@/components/StorageCard';
import { cn } from '@/lib/utils';

const mockStorages = [
  { id: '1', name: 'Bengaluru Cold Storage', distance: '2.5 km', rating: 4.8, capacity: 5000, price: 12, grains: ['Wheat', 'Rice'] },
  { id: '2', name: 'AgriCool Warehouse', distance: '4.2 km', rating: 4.5, capacity: 8000, price: 10, grains: ['Maize', 'Pulses'] },
  { id: '3', name: 'FarmStore Hub', distance: '6.1 km', rating: 4.7, capacity: 3500, price: 15, grains: ['Wheat', 'Barley'] },
  { id: '4', name: 'KrishiCold Center', distance: '8.3 km', rating: 4.6, capacity: 6000, price: 11, grains: ['Rice', 'Millet'] },
  { id: '5', name: 'GreenGrain Storage', distance: '10.5 km', rating: 4.4, capacity: 4500, price: 13, grains: ['Wheat', 'Maize'] },
];

const Search = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredStorages = mockStorages.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('coldStorageNearMe')}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('searchLocation')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            viewMode === 'list'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            viewMode === 'map'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* Use Location Button */}
      <button className="w-full p-3 mb-4 bg-accent/10 text-accent rounded-xl flex items-center justify-center gap-2 font-medium">
        <MapPin className="w-4 h-4" />
        {t('chooseLocation')}
      </button>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-3 animate-fade-up">
          {filteredStorages.map((storage) => (
            <StorageCard key={storage.id} {...storage} />
          ))}
        </div>
      ) : (
        <div className="h-[50vh] bg-muted rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Map View</p>
            <p className="text-xs text-muted-foreground mt-1">Connect Mapbox for full functionality</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Search;
