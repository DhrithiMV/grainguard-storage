import { User, CreditCard, History, HelpCircle, Globe, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { icon: User, label: t('editProfile'), path: '/profile/edit' },
    { icon: CreditCard, label: t('paymentMethods'), path: '/profile/payments' },
    { icon: History, label: t('subscriptionHistory'), path: '/profile/history' },
    { icon: Settings, label: t('accountSettings'), path: '/profile/settings' },
    { icon: HelpCircle, label: t('support'), path: '/profile/support' },
  ];

  return (
    <div className="page-container bg-background">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-4 overflow-hidden border-4 border-card shadow-soft">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=grain"
            alt="Profile"
            className="w-full h-full"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">Hello, User!</h2>
        <p className="text-sm text-muted-foreground">user@example.com</p>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full grain-card flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
          className="w-full grain-card flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">{t('language')}</span>
          </div>
          <span className="text-sm text-accent font-medium">
            {language === 'en' ? 'English' : 'ಕನ್ನಡ'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className="w-full grain-card flex items-center justify-between text-destructive"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium">{t('logout')}</span>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
