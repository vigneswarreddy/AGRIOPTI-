import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center mb-16 space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                    Platform Features
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-nature-950 uppercase tracking-tight">
                    Intelligence{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">Suite</span>
                </h2>
                <p className="text-nature-600 text-lg font-medium max-w-2xl">
                    Empowering your farm with state-of-the-art AI technology. Everything you need from crop advisory to market access.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[260px]">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                        className={`${feature.bentoClass || 'md:col-span-1 md:row-span-1'}`}
                    >
                        <Link
                            to={feature.link}
                            className="group relative overflow-hidden rounded-[2.5rem] h-full w-full flex flex-col justify-end shadow-xl hover:shadow-2xl hover:shadow-nature-900/25 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* ── Layer 1: Full-bleed background image ── */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <img
                                    loading="lazy"
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out
                                               group-hover:scale-110 brightness-[0.88] contrast-[1.05] saturate-[1.1]
                                               group-hover:brightness-[0.95] group-hover:saturate-[1.2]"
                                />
                            </div>

                            {/* ── Layer 2: Dark gradient overlay (bottom-heavy for text) ── */}
                            <div
                                className="absolute inset-0 z-10"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 45%, rgba(0,0,0,0.08) 100%)'
                                }}
                            />

                            {/* ── Layer 3: Subtle green tint bloom on hover ── */}
                            <div className="absolute inset-0 z-10 bg-nature-600/0 group-hover:bg-nature-500/12 transition-colors duration-500" />

                            {/* ── Layer 4: Glow ring on hover ── */}
                            <div className="absolute inset-0 rounded-[2.5rem] ring-0 group-hover:ring-2 group-hover:ring-nature-400/50 transition-all duration-500 z-30 pointer-events-none" />

                            {/* ── Layer 5: Content ── */}
                            <div className="relative z-20 p-6 md:p-7">
                                {/* Top row: icon + arrow */}
                                <div className="mb-3.5 flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-lg
                                        bg-black/30 backdrop-blur-md border border-white/20 text-white
                                        group-hover:bg-nature-600/50 group-hover:border-nature-400/50
                                        transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                                        bg-black/25 backdrop-blur-sm border border-white/20 text-white/70
                                        group-hover:bg-nature-500 group-hover:border-nature-300 group-hover:text-white
                                        group-hover:translate-x-0.5 transition-all duration-300">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight leading-tight text-white mb-1.5"
                                    style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
                                >
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p
                                    className="text-[13px] font-medium text-white/75 line-clamp-2 leading-snug"
                                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                                >
                                    {feature.desc}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeatureGrid;
