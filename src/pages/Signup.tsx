import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to Terms & Conditions');
      return;
    }
    toast.success('Account created successfully!');
    navigate('/language');
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex flex-col items-center mt-6">
        <img src={logo} alt="GrainGuard" className="w-16 h-16" />
        <h1 className="text-xl font-bold text-foreground mt-3">GRAIN GUARD</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder={t('fullName')}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="input-field"
          required
        />

        <input
          type="email"
          placeholder={t('email')}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
          required
        />

        <input
          type="tel"
          placeholder={`${t('mobileNumber')} (Optional)`}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input-field"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmPassword')}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="input-field pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            {t('termsAgree')}{' '}
            <button type="button" className="text-primary">
              Read here
            </button>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {t('signUp')}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-primary font-medium"
          >
            {t('signIn')}
          </button>
        </p>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Having any issues?{' '}
        <button className="text-primary">Click Here</button>
      </p>
    </div>
  );
};

export default Signup;
