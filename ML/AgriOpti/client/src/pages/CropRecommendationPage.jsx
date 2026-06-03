import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CropRecommendation from '../Components/Dashboard/CropRecommendation';

export default function CropRecommendationPage() {
    return (
        <div className="min-h-screen flex flex-col bg-nature-50/30">
            <Navbar />
            <div className="flex-1 pt-24 md:pt-32">
                {/* ── Modern SaaS Header ── */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[150px] bg-nature-400/20 blur-[100px] rounded-full -z-10"></div>
                    
                    <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
                        <div className="absolute inset-0 bg-gradient-to-br from-nature-500/10 to-transparent"></div>
                        
                        <div className="relative z-10 space-y-4 w-full text-center">
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-nature-600/20 border border-nature-600/30 text-nature-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm mx-auto">
                                🌱 AI Powered
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none uppercase text-white">
                                Crop <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 to-nature-600">Recommendation</span>
                            </h1>
                            <p className="text-nature-400 text-xs font-bold uppercase tracking-widest max-w-xl mx-auto">
                                Enter your soil & climate data to get the best crop suggestion
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-10">
                    <CropRecommendation />
                </div>
            </div>
            <Footer />
        </div>
    );
}
