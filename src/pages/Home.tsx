import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Lightbulb, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import StorageCard from '@/components/StorageCard';
import coldStorage from '@/assets/cold-storage-1.jpg';

const mockStorages = [
  { id: '1', name: 'Bengaluru Cold Storage', distance: '2.5 km', rating: 4.8, capacity: 5000, price: 12, grains: ['Wheat', 'Rice'] },
  { id: '2', name: 'AgriCool Warehouse', distance: '4.2 km', rating: 4.5, capacity: 8000, price: 10, grains: ['Maize', 'Pulses'] },
  { id: '3', name: 'FarmStore Hub', distance: '6.1 km', rating: 4.7, capacity: 3500, price: 15, grains: ['Wheat', 'Barley'] },
];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    { icon: MapPin, label: t('findColdStorage'), path: '/search', color: 'bg-primary' },
    { icon: CreditCard, label: t('mySubscriptions'), path: '/subscriptions', color: 'bg-accent' },
    { icon: Lightbulb, label: t('grainTips'), path: '/grains', color: 'bg-secondary' },
  ];

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="font-medium text-foreground">Bengaluru</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-card border border-border overflow-hidden"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=grain"
            alt="Profile"
            className="w-full h-full"
          />
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="card-elevated p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-lg font-semibold text-foreground">{t('welcome')}, User! 👋</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Advancing Technologies in Agriculture
        </p>
        <img
          src={coldStorage}
          alt="Agriculture"
          className="w-full h-32 object-cover rounded-xl mt-4"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="grain-card flex flex-col items-center gap-2 py-4"
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Nearby Storage */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t('nearbyStorage')}</h3>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1 text-sm text-primary font-medium"
          >
            {t('viewAll')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {mockStorages.map((storage) => (
            <StorageCard key={storage.id} {...storage} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
