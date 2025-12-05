import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success('Welcome back!');
        navigate('/home');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex flex-col items-center mt-8">
        <img src={logo} alt="GrainGuard" className="w-20 h-20" />
        <h1 className="text-2xl font-bold text-foreground mt-4">GRAIN GUARD</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <input
            type="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field pr-12"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : t('signIn')}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {t('dontHaveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-primary font-medium"
          >
            {t('signUp')}
          </button>
        </p>

        <button
          type="button"
          className="w-full text-center text-sm text-primary"
        >
          {t('forgotPassword')}
        </button>
      </form>

      <div className="mt-8">
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">{t('orContinueWith')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-soft border border-border hover:shadow-md transition-shadow">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Having any issues?{' '}
        <button className="text-primary">Click Here</button>
      </p>
    </div>
  );
};

export default Login;
