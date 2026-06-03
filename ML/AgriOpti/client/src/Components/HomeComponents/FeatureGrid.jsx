import React from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaLandmark, FaStore, FaRobot, FaLeaf, FaChartLine, FaSatellite, FaFlask } from 'react-icons/fa';

import recommendImg from '../../assets/intelligence/crop_recommend_ai.png';
import diseaseImg from '../../assets/intelligence/plant_disease_ai.png';
import yieldImg from '../../assets/intelligence/crop_yield_ai.png';
import registryImg from '../../assets/intelligence/land_registry_ai.png';
import storesImg from '../../assets/intelligence/nearby_stores_ai.png';
import chatbotImg from '../../assets/intelligence/ai_chatbot_ai.png';
import aerialLandImg from '../../assets/intelligence/aerial_land_ai.png';
import fertilizerImg from '../../assets/intelligence/fertilizer_advisor_ai.png';

const allFeatures = [
    {
        title: 'Crop Recommendation',
        icon: <FaSeedling />,
        link: '/crop-recommendation',
        image: recommendImg,
        desc: 'AI-driven crop selection based on your soil & climate data.',
        roles: ['farmer', 'government'],
        bentoClass: 'md:col-span-2 md:row-span-2',
    },
    {
        title: 'AI Chatbot',
        icon: <FaRobot />,
        link: '/ai-chatbot',
        image: chatbotImg,
        desc: 'Multi-lingual AI farming assistant — English, Hindi, Kannada, Telugu & Tamil.',
        roles: ['farmer', 'retailer', 'government'],
        bentoClass: 'md:col-span-2 md:row-span-1 bg-nature-950 text-white',
        imgClass: 'opacity-50 mix-blend-overlay',
    },
    {
        title: 'Plant Disease Predictor',
        icon: <FaLeaf />,
        link: '/plant-disease',
        image: diseaseImg,
        desc: 'Upload a leaf image to instantly diagnose plant diseases using AI.',
        roles: ['farmer', 'government'],
        bentoClass: 'md:col-span-1 md:row-span-1',
    },
    {
        title: 'Crop Yield Estimator',
        icon: <FaChartLine />,
        link: '/crop-yield',
        image: yieldImg,
        desc: 'Forecast harvest volume using environmental and farming data.',
        roles: ['farmer', 'government'],
        bentoClass: 'md:col-span-1 md:row-span-1',
    },
    {
        title: 'Aerial Land Analysis',
        icon: <FaSatellite />,
        link: '/land-analysis',
        image: aerialLandImg,
        desc: 'Satellite crop classification with NDVI health indices & AI strategy.',
        roles: ['farmer', 'government'],
        bentoClass: 'md:col-span-2 md:row-span-1',
    },
    {
        title: 'Fertilizer Advisor',
        icon: <FaFlask />,
        link: '/Fertilizer',
        image: fertilizerImg,
        desc: 'Get AI-powered fertilizer recommendations based on soil nutrients.',
        roles: ['farmer'],
        bentoClass: 'md:col-span-1 md:row-span-1',
    },
    {
        title: 'Land Registry',
        icon: <FaLandmark />,
        link: '/land-records',
        image: registryImg,
        desc: 'Digital state land records & survey search portal.',
        roles: ['farmer', 'retailer', 'government'],
        bentoClass: 'md:col-span-1 md:row-span-1',
    },
    {
        title: 'Nearby Stores',
        icon: <FaStore />,
        link: '/nearby',
        image: storesImg,
        desc: 'Locate certified fertilizers and seed stores near you.',
        roles: ['farmer', 'retailer', 'government'],
        bentoClass: 'md:col-span-1 md:row-span-1',
    },
];

const FeatureGrid = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'farmer' };
    const role = user.role || 'farmer';

    const features = allFeatures.filter((f) => f.roles.includes(role));

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                    Platform Features
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-nature-950 uppercase tracking-tight">
                    Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">Suite</span>
                </h2>
                <p className="text-nature-600 text-lg font-medium max-w-2xl">
                    Empowering your farm with state-of-the-art AI technology. Everything you need from crop advisory to market access.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
                {features.map((feature, index) => {
                    const isDark = feature.bentoClass?.includes('bg-nature-950');
                    return (
                        <Link
                            key={index}
                            to={feature.link}
                            className={`group relative overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border flex flex-col justify-end p-8 ${feature.bentoClass || 'md:col-span-1 md:row-span-1'} ${isDark ? 'border-nature-800' : 'bg-white border-nature-100'}`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img 
                                    loading="lazy" 
                                    src={feature.image}
                                    alt={feature.title}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${feature.imgClass || ''} ${isDark ? '' : 'opacity-10 group-hover:opacity-20'}`}
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-nature-950 via-nature-950/80 to-transparent' : 'from-white via-white/80 to-transparent'}`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-110 ${isDark ? 'bg-nature-800 text-nature-400 group-hover:bg-nature-700' : 'bg-nature-50 text-nature-600 group-hover:bg-nature-100'}`}>
                                        {feature.icon}
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${isDark ? 'bg-nature-800 text-nature-400' : 'bg-nature-100 text-nature-600'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className={`text-2xl font-heading font-black uppercase tracking-tight leading-none mb-2 ${isDark ? 'text-white' : 'text-nature-950'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm font-medium line-clamp-2 ${isDark ? 'text-nature-400' : 'text-nature-600'}`}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default FeatureGrid;


