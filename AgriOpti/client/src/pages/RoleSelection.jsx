import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import Agriculture from '@mui/icons-material/Agriculture';
import Storefront from '@mui/icons-material/Storefront';
import AccountBalance from '@mui/icons-material/AccountBalance';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const RoleSelection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');

    // The user details passed from Google Login in Login.jsx
    const pendingUser = location.state?.user || auth.currentUser;

    useEffect(() => {
        if (!pendingUser) {
            navigate('/login');
        }
    }, [pendingUser, navigate]);

    const roles = [
        {
            id: 'farmer',
            title: 'Farmer',
            icon: <Agriculture className="text-4xl" />,
            description: 'Buy seeds, get AI crop advice, and monitor land records.',
            emoji: '🌱'
        },
        {
            id: 'retailer',
            title: 'Retailer',
            icon: <Storefront className="text-4xl" />,
            description: 'Manage inventory, sell agricultural products, and handle orders.',
            emoji: '🛒'
        },
        {
            id: 'government',
            title: 'Government Official',
            icon: <AccountBalance className="text-4xl" />,
            description: 'Monitor market trends, view regional reports, and manage policies.',
            emoji: '🏛️'
        }
    ];

    const handleCompleteProfile = async () => {
        if (!selectedRole) {
            setError('Please select a role to continue.');
            return;
        }

        setLoading(true);
        try {
            const userData = {
                uid: pendingUser.uid,
                name: pendingUser.displayName || pendingUser.email.split('@')[0],
                email: pendingUser.email,
                role: selectedRole,
                createdAt: serverTimestamp(),
                photoURL: pendingUser.photoURL || null
            };

            // Save to Firestore
            await setDoc(doc(db, 'users', pendingUser.uid), userData);

            // Update localStorage for immediate app use
            localStorage.setItem('user', JSON.stringify({
                ...userData,
                _id: pendingUser.uid,
                createdAt: new Date().toISOString() // for local cache
            }));

            navigate('/home');
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!pendingUser) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-nature-50/30 p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nature-400/20 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nature-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>

            <div className="w-full max-w-4xl relative z-10">
                <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-nature-100">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-nature-950 p-4 rounded-3xl shadow-2xl border border-nature-800 mb-6 rotate-2 hover:-rotate-2 transition-transform">
                            <Agriculture className="text-nature-400" style={{ fontSize: 36 }} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-nature-950 mb-3 tracking-tight">
                            Complete Your Profile
                        </h1>
                        <p className="text-nature-500 font-bold text-lg max-w-xl mx-auto">
                            Welcome {pendingUser.displayName || 'to AgriOpti'}! Please select your role to personalize your experience.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => {
                                    setSelectedRole(role.id);
                                    setError('');
                                }}
                                className={`relative group p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left flex flex-col items-center text-center ${
                                    selectedRole === role.id
                                        ? 'border-nature-600 bg-nature-50 shadow-2xl shadow-nature-600/10 scale-105'
                                        : 'border-nature-100 bg-white hover:border-nature-300 hover:shadow-xl hover:-translate-y-1'
                                }`}
                            >
                                <div className={`p-5 rounded-[1.5rem] mb-6 transition-all duration-500 ${
                                    selectedRole === role.id ? 'bg-nature-950 text-nature-400 shadow-xl' : 'bg-nature-50 text-nature-600'
                                }`}>
                                    {role.icon}
                                </div>
                                <h3 className={`text-2xl font-black mb-3 ${selectedRole === role.id ? 'text-nature-950' : 'text-nature-800'}`}>
                                    {role.title} {role.emoji}
                                </h3>
                                <p className="text-sm text-nature-500 font-medium leading-relaxed">
                                    {role.description}
                                </p>
                                
                                {selectedRole === role.id && (
                                    <div className="absolute -top-3 -right-3 bg-nature-600 text-white p-2 rounded-full shadow-lg border-4 border-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleCompleteProfile}
                            disabled={loading || !selectedRole}
                            className={`w-full py-5 rounded-2xl bg-nature-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-nature-600/30 flex items-center justify-center gap-3 transform active:scale-95 transition-all ${
                                loading || !selectedRole ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-nature-700 hover:-translate-y-1'
                            }`}
                        >
                            {loading ? 'Saving Profile...' : 'Get Started'}
                            {!loading && <ArrowForward className="text-xl" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
