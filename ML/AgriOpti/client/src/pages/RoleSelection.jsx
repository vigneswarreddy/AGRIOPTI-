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
        <div className="min-h-screen w-full flex items-center justify-center bg-mesh p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nature-200/20 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nature-300/20 blur-[120px] rounded-full animate-pulse-slow"></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/50 backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="inline-block bg-nature-600 p-3 rounded-2xl shadow-lg mb-6 rotate-2">
                            <Agriculture className="text-white" style={{ fontSize: 32 }} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-black text-nature-950 mb-3 tracking-tight">
                            Complete Your Profile
                        </h1>
                        <p className="text-nature-600 font-medium">
                            Welcome {pendingUser.displayName || 'to AgriOpti'}! Please select your role to personalize your experience.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => {
                                    setSelectedRole(role.id);
                                    setError('');
                                }}
                                className={`relative group p-6 rounded-[2rem] border-2 transition-all duration-500 text-left flex flex-col items-center text-center ${
                                    selectedRole === role.id
                                        ? 'border-nature-600 bg-nature-50 shadow-xl shadow-nature-600/10 scale-105'
                                        : 'border-white/50 bg-white/30 hover:border-nature-200 hover:bg-white/50'
                                }`}
                            >
                                <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${
                                    selectedRole === role.id ? 'bg-nature-600 text-white' : 'bg-nature-100 text-nature-600'
                                }`}>
                                    {role.icon}
                                </div>
                                <h3 className={`text-lg font-black mb-2 ${selectedRole === role.id ? 'text-nature-950' : 'text-nature-800'}`}>
                                    {role.title} {role.emoji}
                                </h3>
                                <p className="text-xs text-nature-600 font-medium leading-relaxed">
                                    {role.description}
                                </p>
                                
                                {selectedRole === role.id && (
                                    <div className="absolute -top-2 -right-2 bg-nature-600 text-white p-1 rounded-full shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCompleteProfile}
                        disabled={loading || !selectedRole}
                        className={`btn-primary w-full py-4 flex items-center justify-center gap-3 transform active:scale-95 transition-all ${
                            loading || !selectedRole ? 'opacity-50 cursor-not-allowed shadow-none' : ''
                        }`}
                    >
                        {loading ? 'Saving Profile...' : 'Get Started'}
                        {!loading && <ArrowForward className="text-xl" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
