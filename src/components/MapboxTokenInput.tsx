import { useState } from 'react';
import { Key, ExternalLink, Check } from 'lucide-react';
import { useMapbox } from '@/contexts/MapboxContext';
import { toast } from 'sonner';

const MapboxTokenInput = () => {
  const { mapboxToken, setMapboxToken, isTokenValid } = useMapbox();
  const [inputValue, setInputValue] = useState(mapboxToken);
  const [isEditing, setIsEditing] = useState(!isTokenValid);

  const handleSave = () => {
    if (inputValue.startsWith('pk.')) {
      setMapboxToken(inputValue);
      setIsEditing(false);
      toast.success('Mapbox token saved!');
    } else {
      toast.error('Invalid token format. Token should start with "pk."');
    }
  };

  if (isTokenValid && !isEditing) {
    return (
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Mapbox Connected</p>
              <p className="text-xs text-muted-foreground">Token: {mapboxToken.slice(0, 15)}...</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary font-medium"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-4 mb-4 animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">Mapbox Token Required</p>
          <p className="text-xs text-muted-foreground">Enter your public access token</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="pk.eyJ1IjoieW91..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="input-field mb-3 text-sm font-mono"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!inputValue}
          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm disabled:opacity-50"
        >
          Save Token
        </button>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-muted text-muted-foreground rounded-xl font-medium text-sm flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          Get Token
        </a>
      </div>

      {isEditing && isTokenValid && (
        <button
          onClick={() => setIsEditing(false)}
          className="w-full mt-2 py-2 text-sm text-muted-foreground"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default MapboxTokenInput;
