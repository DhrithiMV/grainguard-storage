import { ArrowLeft, MapPin, Star, Phone, Navigation, Thermometer } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import coldStorage from '@/assets/cold-storage-1.jpg';

const StorageDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();

  const facility = {
    name: 'Bengaluru Cold Storage',
    address: '123 Agricultural Zone, Whitefield, Bengaluru 560066',
    distance: '2.5 km',
    rating: 4.8,
    reviews: 124,
    capacity: 5000,
    tempRange: '10°C - 25°C',
    grains: ['Wheat', 'Rice', 'Maize', 'Pulses'],
    price: 12,
    images: [coldStorage, coldStorage, coldStorage],
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="relative h-64">
        <img
          src={coldStorage}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="px-4 -mt-8 relative">
        {/* Main Info Card */}
        <div className="card-elevated p-5 mb-4">
          <h1 className="text-xl font-bold text-foreground">{facility.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{facility.distance}</span>
            <span className="text-border">•</span>
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span>{facility.rating} ({facility.reviews} {t('reviews')})</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{facility.address}</p>
          
          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              {t('directions')}
            </button>
            <button className="flex-1 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {t('contact')}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-3">{t('gallery')}</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {facility.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="card-elevated p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('availability')}</span>
            <span className="font-medium text-foreground">{facility.capacity} {t('kg')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('temperatureRange')}</span>
            <span className="font-medium text-foreground flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-accent" />
              {facility.tempRange}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('grainsAccepted')}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {facility.grains.map((grain) => (
                <span
                  key={grain}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                >
                  {grain}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/grains')}
          className="w-full mt-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {t('reserve')} • ₹{facility.price}/{t('kg')}/mo
        </button>
      </div>
    </div>
  );
};

export default StorageDetails;
