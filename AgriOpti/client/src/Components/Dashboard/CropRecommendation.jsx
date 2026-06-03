import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSeedling, FaFlask, FaTint, FaCloudRain, FaCheckCircle,
    FaArrowRight, FaArrowLeft, FaVolumeUp, FaUndo, FaSpinner
} from 'react-icons/fa';
import { Sprout, Droplets, CloudRain, ThermometerSun, MapPin, History } from 'lucide-react';

// Soil images
import soilBlack from '../../assets/images/soils/black.png';
import soilRed from '../../assets/images/soils/red.png';
import soilSandy from '../../assets/images/soils/sandy.png';
import soilClay from '../../assets/images/soils/clay.png';
import soilAlluvial from '../../assets/images/soils/alluvial.png';

// Season images
import seasonKharif from '../../assets/images/inputs/seasons/kharif.png';
import seasonRabi from '../../assets/images/inputs/seasons/rabi.png';
import seasonSummer from '../../assets/images/inputs/seasons/summer.png';

// Irrigation images
import irrigRainfed from '../../assets/images/inputs/irrigation/rainfed.png';
import irrigWell from '../../assets/images/inputs/irrigation/well.png';
import irrigCanal from '../../assets/images/inputs/irrigation/canal.png';
import irrigDrip from '../../assets/images/inputs/irrigation/drip.png';

// Previous crop images
import cropLegumes from '../../assets/images/inputs/crops/legumes.png';
import cropCereals from '../../assets/images/inputs/crops/cereals.png';
import cropFiber from '../../assets/images/inputs/crops/fiber.png';
import cropSugarcane from '../../assets/images/inputs/crops/sugarcane.png';
import cropGroundnut from '../../assets/images/inputs/crops/groundnut.png';

// Output crop images
import outRice from '../../assets/images/outputs/crops/rice.png';
import outWheat from '../../assets/images/inputs/crops/cereals.png';
import outMaize from '../../assets/images/outputs/crops/maize.png';
import outChickpea from '../../assets/images/outputs/crops/chickpea.webp';
import outPomegranate from '../../assets/images/outputs/crops/Pomegranate.png';
import outBanana from '../../assets/images/outputs/crops/Banana.jpg';
import outMango from '../../assets/images/outputs/crops/Mango.jpg';
import outWatermelon from '../../assets/images/outputs/crops/watermelon.webp';
import outCotton from '../../assets/images/outputs/crops/Cotton.png';
import outCoffee from '../../assets/images/outputs/crops/Coffee.jpg';
import outCoconut from '../../assets/images/outputs/crops/Coconut.png';
import outGrapes from '../../assets/images/outputs/crops/Grapes.png';
import outJute from '../../assets/images/outputs/crops/Jute.jpg';
import outKidneyBeans from '../../assets/images/outputs/crops/KidneyBeans.webp';
import outLentil from '../../assets/images/outputs/crops/Lentil.png';
import outMothBeans from '../../assets/images/outputs/crops/MothBeans.webp';
import outMungBean from '../../assets/images/outputs/crops/MungBean.webp';
import outMuskmelon from '../../assets/images/outputs/crops/Muskmelon.webp';
import outOrange from '../../assets/images/outputs/crops/Orange.png';
import outPapaya from '../../assets/images/outputs/crops/Papaya.png';
import outPigeonPeas from '../../assets/images/outputs/crops/PigeonPeas.png';
import outApple from '../../assets/images/outputs/crops/apple.png';
import outBlackgram from '../../assets/images/outputs/crops/Blackgram.png';

import imageUnknown from '../../assets/images/idontknow2.jpg';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

// Step Configuration
const STEPS = [
    {
        id: 'soil_type',
        title: 'Choose Soil Type',
        subtitle: 'जिस मिट्टी में आप खेती करेंगे',
        icon: FaFlask,
        options: [
            { id: 'Black', label: 'Black Soil', sub: 'Kali Mitti', image: soilBlack },
            { id: 'Red', label: 'Red Soil', sub: 'Lal Mitti', image: soilRed },
            { id: 'Sandy', label: 'Sandy Soil', sub: 'Retili Mitti', image: soilSandy },
            { id: 'Clay', label: 'Clay Soil', sub: 'Chikni Mitti', image: soilClay },
            { id: 'Alluvial', label: 'Alluvial Soil', sub: 'Domat Mitti', image: soilAlluvial },
            { id: 'Unknown', label: "Don't Know", sub: 'Pata nahi', image: imageUnknown }
        ]
    },
    {
        id: 'season',
        title: 'Current Season',
        subtitle: 'अभी कौन सा मौसम है?',
        icon: FaCloudRain,
        options: [
            { id: 'Kharif', label: 'Kharif', sub: 'Monsoon (Rainy)', image: seasonKharif },
            { id: 'Rabi', label: 'Rabi', sub: 'Winter (Dry)', image: seasonRabi },
            { id: 'Summer', label: 'Summer', sub: 'Jayad (Hot)', image: seasonSummer }
        ]
    },
    {
        id: 'irrigation',
        title: 'Irrigation Type',
        subtitle: 'सिंचाई का साधन क्या है?',
        icon: FaTint,
        options: [
            { id: 'Drip', label: 'Drip', sub: 'Boond-boond sinchai', image: irrigDrip },
            { id: 'Rainfed', label: 'Rain-fed', sub: 'Barish par nirbhar', image: irrigRainfed },
            { id: 'Well', label: 'Well / Bore', sub: 'Kuan ya tube-well', image: irrigWell },
            { id: 'Canal', label: 'Canal', sub: 'Nehar se pani', image: irrigCanal }
        ]
    },
    {
        id: 'prev_crop_group',
        title: 'Previous Crop',
        subtitle: 'पिछली फसल कौन सी थी?',
        icon: FaSeedling,
        options: [
            { id: 'Legumes', label: 'Pulses/Peanuts', sub: 'Dal/Mungfali', image: cropLegumes },
            { id: 'Cereals', label: 'Grain/Wheat', sub: 'Anaj/Gehun', image: cropCereals },
            { id: 'Fiber', label: 'Cotton/Jute', sub: 'Kapas/Patas', image: cropFiber },
            { id: 'Sugar', label: 'Sugarcane', sub: 'Ganna', image: cropSugarcane },
            { id: 'Unknown', label: 'Something Else', sub: 'Kuch aur', image: imageUnknown }
        ]
    }
];

// Maps farmer qualitative inputs → numeric API payload for /predict-crop
const SOIL_NPK = {
    Black: { N: 85, P: 45, K: 40, ph: 7.2 },
    Red: { N: 55, P: 30, K: 35, ph: 6.0 },
    Sandy: { N: 40, P: 20, K: 25, ph: 6.5 },
    Clay: { N: 75, P: 40, K: 50, ph: 7.5 },
    Alluvial: { N: 90, P: 50, K: 45, ph: 7.0 },
    Unknown: { N: 70, P: 35, K: 38, ph: 6.8 },
};
const SEASON_WEATHER = {
    Kharif: { temperature: 28, humidity: 80, rainfall: 180 },
    Rabi: { temperature: 18, humidity: 55, rainfall: 50 },
    Summer: { temperature: 35, humidity: 35, rainfall: 20 },
};
const IRRIGATION_RAINFALL_BONUS = {
    Drip: 20,
    Rainfed: 0,
    Well: 40,
    Canal: 80,
};
const PREV_CROP_NPK_BONUS = {
    Legumes: { N: 20, P: 5, K: 0 },
    Cereals: { N: -5, P: 2, K: 5 },
    Fiber: { N: 0, P: 0, K: 0 },
    Sugar: { N: 10, P: 5, K: 10 },
    Unknown: { N: 0, P: 0, K: 0 },
};

function buildCropPayload(formData) {
    const soil = SOIL_NPK[formData.soil_type] || SOIL_NPK.Unknown;
    const season = SEASON_WEATHER[formData.season] || SEASON_WEATHER.Kharif;
    const bonus = PREV_CROP_NPK_BONUS[formData.prev_crop_group] || PREV_CROP_NPK_BONUS.Unknown;
    const rainfallBonus = IRRIGATION_RAINFALL_BONUS[formData.irrigation] ?? 0;
    return {
        N: Math.max(0, soil.N + bonus.N),
        P: Math.max(0, soil.P + bonus.P),
        K: Math.max(0, soil.K + bonus.K),
        temperature: season.temperature,
        humidity: season.humidity,
        ph: soil.ph,
        rainfall: season.rainfall + rainfallBonus,
    };
}

const cropImages = {
    rice: outRice,
    wheat: outWheat,
    maize: outMaize,
    chickpea: outChickpea,
    pomegranate: outPomegranate,
    banana: outBanana,
    mango: outMango,
    watermelon: outWatermelon,
    cotton: outCotton,
    coffee: outCoffee,
    coconut: outCoconut,
    grapes: outGrapes,
    jute: outJute,
    kidneybeans: outKidneyBeans,
    lentil: outLentil,
    mothbeans: outMothBeans,
    mungbean: outMungBean,
    muskmelon: outMuskmelon,
    orange: outOrange,
    papaya: outPapaya,
    pigeonpeas: outPigeonPeas,
    apple: outApple,
    blackgram: outBlackgram,
};

export default function CropRecommendation() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        soil_type: '',
        season: '',
        irrigation: '',
        prev_crop_group: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const step = STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const handleSelect = (optionId) => {
        const key = step.id;
        setFormData(prev => ({ ...prev, [key]: optionId }));

        // Auto-advance if not on last step
        if (!isLastStep) {
            setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 300);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) setCurrentStepIndex(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = buildCropPayload(formData);
            const res = await fetch(`${ML_API_URL}/predict-crop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.status >= 500) {
                throw new Error("Waking up machine learning server... Please wait up to 2 minutes and try again.");
            }
            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error(`Server error (${res.status}). Please try again.`);
            }
            if (!res.ok) throw new Error(data.error || 'Prediction failed');
            setResult({ crop: data.recommended_crop, npk: payload });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const playVoiceInstruction = (text) => {
        // Placeholder for real TTS - using browser API
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    };

    const resetWizard = () => {
        setFormData({ soil_type: '', season: '', irrigation: '', prev_crop_group: '' });
        setCurrentStepIndex(0);
        setResult(null);
        setError(null);
    };

    if (result) return <ResultScreen result={result} onReset={resetWizard} />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header & Progress */}
            <div className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-6">
                    {STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'w-12 bg-green-600' : 'w-4 bg-nature-200'
                                }`}
                        />
                    ))}
                </div>
                <h1 className="text-3xl font-black text-nature-950 uppercase tracking-tighter flex items-center justify-center gap-3">
                    <step.icon className="text-green-600" />
                    {step.title}
                </h1>
                <p className="text-nature-500 font-bold text-lg mt-1">{step.subtitle}</p>
                <button
                    onClick={() => playVoiceInstruction(step.title)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-black hover:bg-green-100 transition-colors"
                >
                    <FaVolumeUp /> सुनिए (Listen)
                </button>
            </div>

            {/* Selection Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {step.options.map((opt) => (
                        <VisualCard
                            key={opt.id}
                            option={opt}
                            isSelected={formData[step.id] === opt.id}
                            onSelect={() => handleSelect(opt.id)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-3xl border border-nature-100 shadow-xl shadow-nature-900/5">
                <button
                    onClick={handleBack}
                    disabled={isFirstStep}
                    className="flex items-center gap-2 px-6 py-3 font-black text-nature-600 uppercase tracking-widest text-xs disabled:opacity-20 translate-all"
                >
                    <FaArrowLeft /> Step Back
                </button>

                {isLastStep && formData.prev_crop_group && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary group flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-green-600 to-green-800 text-white font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        {loading ? <FaSpinner className="animate-spin text-xl" /> : <><FaCheckCircle /> Get Recommendation</>}
                    </motion.button>
                )}
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center font-bold">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}

function VisualCard({ option, isSelected, onSelect }) {
    const Icon = option.icon || FaSeedling;
    return (
        <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className={`
                group relative flex flex-col overflow-hidden rounded-[2rem] border-4 transition-all duration-300
                ${isSelected
                    ? 'border-green-500 shadow-2xl shadow-green-900/30'
                    : 'border-nature-100 hover:border-green-300 shadow-xl shadow-nature-900/5'}
            `}
            style={{ minHeight: '200px' }}
        >
            {/* Background image or color */}
            {option.image ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${option.image})` }}
                />
            ) : (
                <div className="absolute inset-0" style={{ backgroundColor: option.color || '#64748b', opacity: 0.85 }} />
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 transition-all duration-300 ${isSelected
                    ? 'bg-gradient-to-t from-green-900/90 via-green-800/50 to-transparent'
                    : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                }`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full p-5 pt-16 text-white">
                <h3 className="text-lg font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">{option.label}</h3>
                <span className={`text-[11px] font-bold drop-shadow ${isSelected ? 'text-green-200' : 'text-white/70'}`}>
                    {option.sub}
                </span>
            </div>

            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white text-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-green-500"
                >
                    <FaCheckCircle size={18} />
                </motion.div>
            )}
        </motion.button>
    );
}

function ResultScreen({ result, onReset }) {
    const cropKey = result.crop.toLowerCase().replace(/\s+/g, '');
    const cropImg = cropImages[cropKey] || cropImages[result.crop.toLowerCase()];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-nature-900/10 overflow-hidden border border-nature-100 mt-10"
        >
            <div className="relative text-center text-white overflow-hidden" style={{ minHeight: '280px' }}>
                {/* Crop background photo */}
                {cropImg && (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: `url(${cropImg})` }}
                    />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/70 to-green-900/40" />
                <div className="relative z-10 p-12 flex flex-col items-center justify-end h-full" style={{ minHeight: '280px' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 text-green-200 text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-sm border border-green-500/30">
                        ✅ Analysis Complete
                    </div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{result.crop}</h2>
                </div>
            </div>

            <div className="p-10 space-y-8">
                <div className="bg-nature-50 p-6 rounded-3xl border border-nature-100">
                    <h4 className="flex items-center gap-2 text-xs font-black text-nature-400 uppercase tracking-widest mb-4">
                        <FaFlask className="text-green-600" /> Ground Conditions
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                        {['N', 'P', 'K'].map(k => (
                            <div key={k} className="text-center">
                                <span className="block text-2xl font-black text-nature-950">{result.npk[k]}</span>
                                <span className="text-[10px] font-bold text-nature-400">{k === 'N' ? 'Nitrogen' : k === 'P' ? 'Phosphorus' : 'Potash'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* <button className="w-full py-5 rounded-2xl bg-nature-950 text-white font-black uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all">
                        Buy Recommended Seeds
                    </button> */}
                    <button
                        onClick={onReset}
                        className="w-full py-5 rounded-2xl bg-white border-2 border-nature-200 text-nature-600 font-black uppercase tracking-widest text-sm hover:bg-nature-50 transition-all flex items-center justify-center gap-2"
                    >
                        <FaUndo size={12} /> New Analysis
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
