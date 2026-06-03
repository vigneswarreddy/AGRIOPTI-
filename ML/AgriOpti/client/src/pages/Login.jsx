import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import Agriculture from '@mui/icons-material/Agriculture';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    preferredLanguage: 'en'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      setErrors(newErrors);
      setIsFormValid(
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
      [name]: value
    });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields before submit
    if (!formData.email || !formData.password || !formData.role) {
      setStatus({ type: 'error', message: 'Please fill in all required fields, including your Role.' });
      return;
    }

    if (!isFormValid) return;

    setStatus({ type: 'loading', message: 'Signing in...' });
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Fetch user profile from Firestore to validate role
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData = {
        _id: user.uid,
        email: user.email,
        role: formData.role // fallback if no Firestore record exists
      };

      if (userDoc.exists()) {
        const storedData = userDoc.data();

        // ── Fix 1: Strict role-based authentication ──────────────────────────
        // If the user's stored role doesn't match the selected role, deny login
        if (storedData.role && storedData.role !== formData.role) {
          // Sign the user back out so the auth session is not left open
          await auth.signOut();
          setStatus({
            type: 'error',
            message: 'Invalid role selected for this account. Please select the correct role.'
          });
          return;
        }
        // ─────────────────────────────────────────────────────────────────────

        userData = { ...userData, ...storedData, _id: user.uid };
      }

      localStorage.setItem('user', JSON.stringify(userData));

      if (formData.preferredLanguage) {
        i18n.changeLanguage(formData.preferredLanguage);
      }
      navigate('/home');
    } catch (error) {
      let errorMsg = 'Error logging in. Please check your credentials.';
      // Map common Firebase auth errors to readable messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please try again later.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setStatus({ type: 'error', message: errorMsg });
      console.error('Firebase Login Error:', error);
    }
  };
    
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setStatus({ type: 'loading', message: 'Connecting to Google...' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = { ...userDoc.data(), _id: user.uid };
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/home');
      } else {
        // New user - redirect to role selection
        navigate('/select-role', { state: { user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }}});
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      let errorMsg = 'Google Login failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Login cancelled.';
      }
      setStatus({ type: 'error', message: errorMsg });
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      _id: 'demo_123',
      username: 'Demo Farmer',
      email: 'demo@agriopti.com',
      role: 'farmer',
      preferredLanguage: formData.preferredLanguage
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/home');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nature-200/20 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nature-300/20 blur-[120px] rounded-full animate-pulse-slow"></div>

      <div className="w-full max-w-md relative z-10 transition-all duration-500">
        <div className="flex justify-center mb-8">
          <div className="bg-nature-600 p-4 rounded-3xl shadow-lg rotate-3 hover:rotate-6 transition-all duration-500 group cursor-pointer">
            <Agriculture className="text-white group-hover:scale-110 transition-transform" style={{ fontSize: 48 }} />
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-6 md:p-12 shadow-2xl border-white/50 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-heading font-black text-nature-950 mb-3 tracking-tight">
              {t('welcome')}
            </h1>
            <p className="text-nature-600 font-medium">
              {t('sustainable_farming')}
            </p>
          </div>

          {status.type === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-4 duration-300">
              <ErrorOutlineIcon fontSize="small" />
              <p className="text-sm font-bold">{status.message}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-nature-700 ml-1">{t('email_address')}</label>
              <input
                type="email"
                name="email"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`input-field focus:ring-2 focus:ring-nature-500 outline-none transition-all ${errors.email ? 'border-red-400' : ''}`}
                required
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-nature-700 ml-1">{t('password')}</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`input-field focus:ring-2 focus:ring-nature-500 outline-none transition-all ${errors.password ? 'border-red-400' : ''}`}
                required
              />
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-nature-700 ml-1">{t('role')}</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field appearance-none focus:ring-2 focus:ring-nature-500 outline-none transition-all pr-10"
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="farmer">Farmer</option>
                  <option value="retailer">Retailer</option>
                  <option value="government">Government official</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-nature-400">
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

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className={`btn-primary w-full py-4 text-lg shadow-xl shadow-nature-600/20 transform active:scale-95 transition-all ${status.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {status.type === 'loading' ? t('signing_in') : t('sign_in')}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-nature-100"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-nature-400">{t('or')}</span>
                <div className="flex-grow border-t border-nature-100"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={status.type === 'loading'}
                className="w-full py-4 rounded-2xl border-2 border-nature-100 bg-white text-nature-700 font-bold flex items-center justify-center gap-3 hover:bg-nature-50 hover:border-nature-600 transition-all duration-300 transform active:scale-95 shadow-sm"
              >
                <GoogleIcon className="text-red-500" />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 rounded-xl border border-dashed border-nature-200 text-nature-400 font-black uppercase tracking-widest text-[10px] hover:text-nature-600 hover:border-nature-600 transition-all duration-300"
              >
                {t('demo_account')}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center border-t border-nature-100 pt-8">
            <p className="text-nature-600 font-medium">
              {t('new_to_agriopti')}{' '}
              <Link to="/register" className="text-nature-700 font-bold hover:text-nature-900 underline decoration-nature-300 underline-offset-4 transition-all">
                {t('create_account')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
