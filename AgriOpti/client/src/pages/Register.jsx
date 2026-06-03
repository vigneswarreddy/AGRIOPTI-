import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import Agriculture from '@mui/icons-material/Agriculture';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    preferredLanguage: 'en',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (formData.name && formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      setErrors(newErrors);
      setIsFormValid(
        formData.name &&
        formData.email &&
        formData.password &&
        formData.role &&
        Object.keys(newErrors).length === 0
      );
    };
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preferredLanguage') {
      i18n.changeLanguage(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields before submit
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setStatus({ type: 'error', message: 'Please fill in all required fields, including your Role.' });
      return;
    }

    if (!isFormValid) return;

    setStatus({ type: 'loading', message: 'Creating your account...' });
    try {
      // Authenticate with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage || 'en',
        createdAt: serverTimestamp()
      });

      setStatus({ type: 'success', message: 'Registration Successful!' });
      setShowPopup(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      let errorMsg = 'Error registering user. Please try again.';
      // Map common Firebase auth errors to readable messages
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already in use by another account.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use a stronger password.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setStatus({ type: 'error', message: errorMsg });
      console.error('Firebase Registration Error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-nature-50/30 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nature-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nature-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 transition-all duration-500">
        <div className="flex justify-center mb-8">
          <div className="bg-nature-950 p-4 rounded-3xl shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer group border border-nature-800">
            <Agriculture className="text-nature-400 group-hover:scale-110 transition-transform" style={{ fontSize: 48 }} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-nature-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-heading font-black text-nature-950 mb-3 tracking-tight">
              {t('join_agriopti')}
            </h1>
            <p className="text-nature-600 font-medium">
              {t('start_journey')}
            </p>
          </div>

          {status.type === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-4 duration-300">
              <ErrorOutlineIcon fontSize="small" />
              <p className="text-sm font-bold">{status.message}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-500 ml-1">{t('full_name')}</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-2xl border-2 border-nature-100 bg-nature-50/50 px-5 py-4 text-nature-950 font-bold text-sm placeholder-nature-300 focus:outline-none focus:border-nature-600 focus:bg-white transition-all ${errors.name ? 'border-red-400' : ''}`}
                required
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-500 ml-1">{t('email_address')}</label>
              <input
                type="email"
                name="email"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-2xl border-2 border-nature-100 bg-nature-50/50 px-5 py-4 text-nature-950 font-bold text-sm placeholder-nature-300 focus:outline-none focus:border-nature-600 focus:bg-white transition-all ${errors.email ? 'border-red-400' : ''}`}
                required
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-500 ml-1">{t('password')}</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-2xl border-2 border-nature-100 bg-nature-50/50 px-5 py-4 text-nature-950 font-bold text-sm placeholder-nature-300 focus:outline-none focus:border-nature-600 focus:bg-white transition-all ${errors.password ? 'border-red-400' : ''}`}
                required
              />
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-500 ml-1">Your Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-nature-100 bg-nature-50/50 px-5 py-4 text-nature-950 font-bold text-sm appearance-none focus:outline-none focus:border-nature-600 focus:bg-white transition-all pr-10"
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="farmer">Farmer</option>
                  <option value="retailer">Retailer</option>
                  <option value="government">Government official</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-nature-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/*
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-nature-700 ml-1">{t('preferred_language')}</label>
              <div className="relative">
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="input-field appearance-none focus:ring-2 focus:ring-nature-500 outline-none transition-all pr-10"
                  required
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="ml">Malayalam (മലയാളம்)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-nature-400">
                  ▼
                </div>
              </div>
            </div>
            */}

            <button
              type="submit"
              disabled={status.type === 'loading'}
              className={`btn-primary w-full py-4 text-lg mt-4 shadow-xl shadow-nature-600/20 transform active:scale-95 transition-all ${status.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status.type === 'loading' ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-nature-100 pt-8">
            <p className="text-nature-600 font-medium">
              {t('already_have_account')}{' '}
              <Link to="/" className="text-nature-700 font-bold hover:text-nature-900 underline decoration-nature-300 underline-offset-4 transition-all">
                {t('sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-nature-950/10 animate-in fade-in duration-300">
          <div className="glass rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl border-white/50 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-nature-500 rounded-full flex items-center justify-center shadow-lg shadow-nature-500/30 animate-bounce">
                <CheckCircleOutlineIcon className="text-white" style={{ fontSize: 40 }} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-nature-950 mb-2">Registered Successfully!</h2>
            <p className="text-nature-600 font-medium mb-6">Welcome to the future of farming. Redirecting you to sign in...</p>
            <div className="w-full bg-nature-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-nature-500 h-full animate-progress-shrink origin-left"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

