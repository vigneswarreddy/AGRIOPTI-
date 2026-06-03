import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSeedling, FaFlask, FaTint, FaCloudRain, FaCheckCircle,
    FaArrowRight, FaArrowLeft, FaVolumeUp, FaUndo, FaSpinner,
    FaChartLine, FaArrowUp, FaLeaf
} from 'react-icons/fa';
import { Sprout, Droplets, CloudRain, ThermometerSun, MapPin, Gauge } from 'lucide-react';

// Crop images for yield step
import outWheat from '../../assets/images/inputs/crops/cereals.png';
import outRice from '../../assets/images/outputs/crops/rice.png';
import outMaize from '../../assets/images/outputs/crops/maize.png';
import outSoyabean from '../../assets/images/inputs/crops/soyabean.png';
import outCotton from '../../assets/images/outputs/crops/Cotton.png';
import outSugarcane from '../../assets/images/inputs/crops/sugarcane.png';
import outGroundnut from '../../assets/images/inputs/crops/groundnut.png';
import outJute from '../../assets/images/outputs/crops/Jute.jpg';

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

import imageUnknown from '../../assets/images/idontknow2.jpg';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

// Step Configuration
const STEPS = [
    {
        id: 'crop_type',
        title: 'Select Your Crop',
        subtitle: 'आप कौन सी फसल उगाना चाहते हैं?',
        icon: FaSeedling,
        options: [
            { id: 'wheat',     label: 'Wheat',      sub: 'Gehun',       image: outWheat },
            { id: 'rice',      label: 'Rice',       sub: 'Chawal',      image: outRice },
            { id: 'maize',     label: 'Maize',      sub: 'Makka',       image: outMaize },
            { id: 'soyabean',  label: 'Soyabean',   sub: 'Soyabean',    image: outSoyabean },
            { id: 'cotton',    label: 'Cotton',     sub: 'Kapas',       image: outCotton },
            { id: 'sugarcane', label: 'Sugarcane',  sub: 'Ganna',       image: outSugarcane },
            { id: 'groundnut', label: 'Groundnut',  sub: 'Moongfali',   image: outGroundnut },
            { id: 'jute',      label: 'Jute',       sub: 'Pat',         image: outJute },
            { id: 'other',     label: 'Other Crop', sub: 'Koi aur fasal', image: imageUnknown }
        ]
    },
    {
        id: 'soil_type',
        title: 'Choose Soil Type',
        subtitle: 'आपकी मिट्टी कैसी है?',
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
        subtitle: 'मौसम चुनें',
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
        subtitle: 'सिंचाई का तरीका',
        icon: FaTint,
        options: [
            { id: 'drip', label: 'Drip', sub: 'Boond-boond sinchai', image: irrigDrip },
            { id: 'well', label: 'Well / Bore', sub: 'Kuan / Tube-well', image: irrigWell },
            { id: 'canal', label: 'Canal', sub: 'Nehar', image: irrigCanal },
            { id: 'rainfed', label: 'Rain-fed', sub: 'Barish par nirbhar', image: irrigRainfed }
        ]
    },
    {
        id: 'land_size',
        title: 'Land Size (Acres)',
        subtitle: 'आपके पास कितनी जमीन है?',
        icon: MapPin,
        isSlider: true
    }
];

// Yield Mappings
const YIELD_SEASON_WEATHER = {
    Kharif: { rainfall: 180, temperature: 28 },
    Rabi:   { rainfall: 50,  temperature: 18 },
    Summer: { rainfall: 20,  temperature: 35 },
};

const YIELD_SOIL_PH = {
    Black: 7.2, Red: 6.0, Sandy: 6.5, Clay: 7.5, Alluvial: 7.0, Unknown: 6.8
};

function buildYieldPayload(formData) {
    const weather = YIELD_SEASON_WEATHER[formData.season] || YIELD_SEASON_WEATHER.Kharif;
    const ph = YIELD_SOIL_PH[formData.soil_type] || 6.8;
    
    // Extrapolate fertilizer used based on land size and a baseline
    const baseFertilizerPerAcre = 50; 
    const fertUsed = formData.land_size * baseFertilizerPerAcre;

    // Irrigation mapping - ensure it matches API options if possible, fallback to 'drip'
    let irrType = 'drip';
    if(formData.irrigation === 'well' || formData.irrigation === 'canal') irrType = 'Sprinkler Irrigation';
    if(formData.irrigation === 'rainfed') irrType = 'flood water';

    // Map unsupported/other crops to the closest ML-supported crop type
    const CROP_BACKEND_MAP = {
        wheat: 'wheat',
        rice: 'rice',
        maize: 'maize',
        soyabean: 'soyabean',
        cotton: 'wheat',    // closest fallback for fiber crop
        sugarcane: 'maize', // similar tropical crop profile
        groundnut: 'soyabean', // similar oilseed profile
        jute: 'wheat',     // similar rabi crop profile
        other: 'wheat'     // safe generic fallback
    };
    const backendCrop = CROP_BACKEND_MAP[formData.crop_type] || 'wheat';

    return {
        rainfall: weather.rainfall,
        temperature: weather.temperature,
        soil_ph: ph,
        fertilizer_used: fertUsed,
        crop_type: backendCrop,
        irrigation_type: irrType
    };
}

export default function CropYield() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        crop_type: '',
        soil_type: '',
        season: '',
        irrigation: '',
        land_size: 5
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const step = STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const handleSelect = (optionId) => {
        setFormData(prev => ({ ...prev, [step.id]: optionId }));
        if (!isLastStep) {
            setTimeout(() => setCurrentStepIndex(prev => prev + 1), 300);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) setCurrentStepIndex(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = buildYieldPayload(formData);
            const res = await fetch(`${ML_API_URL}/predict-yield`, {
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
            
            // Calculate total yield in tons based on acres and quintals/ha
            // 1 acre = 0.404686 hectares. 1 quintal = 0.1 metric tons.
            const totalTons = (data.predicted_yield * formData.land_size * 0.404686 * 0.1).toFixed(2);

            // Re-inject estimated params for UI
            setResult({
                ...data, 
                total_expected_yield_tons: totalTons,
                estimated_params: {
                    irrigation_type: payload.irrigation_type
                }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const playVoiceInstruction = (text) => {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    };

    const resetWizard = () => {
        setFormData({ crop_type: '', soil_type: '', season: '', irrigation: '', land_size: 5 });
        setCurrentStepIndex(0);
        setResult(null);
        setError(null);
    };

    if (result) return <YieldResultScreen result={result} onReset={resetWizard} />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header & Progress */}
            <div className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-6">
                    {STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'w-12 bg-nature-600' : 'w-4 bg-nature-200'
                                }`}
                        />
                    ))}
                </div>
                <h1 className="text-3xl font-black text-nature-950 uppercase tracking-tighter flex items-center justify-center gap-3">
                    <step.icon className="text-nature-600" />
                    {step.title}
                </h1>
                <p className="text-nature-500 font-bold text-lg mt-1">{step.subtitle}</p>
                <button
                    onClick={() => playVoiceInstruction(step.title)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-nature-50 text-nature-700 rounded-full text-sm font-black hover:bg-nature-100 transition-colors"
                >
                    <FaVolumeUp /> सुनिए (Listen)
                </button>
            </div>

            {/* Selection Grid or Slider */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="min-h-[300px]"
                >
                    {step.isSlider ? (
                        <div className="flex flex-col items-center justify-center space-y-8 bg-white p-12 rounded-[3rem] border-4 border-nature-100 shadow-xl">
                            <div className="text-7xl font-black text-nature-950 flex items-baseline gap-2">
                                {formData.land_size}
                                <span className="text-2xl text-nature-400 uppercase tracking-widest">Acres</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={formData.land_size}
                                onChange={(e) => setFormData(prev => ({ ...prev, land_size: e.target.value }))}
                                className="w-full h-4 bg-nature-100 rounded-lg appearance-none cursor-pointer accent-nature-600"
                            />
                            <div className="flex justify-between w-full text-xs font-black text-nature-400">
                                <span>1 ACRE</span>
                                <span>50 ACRES</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {step.options.map((opt) => (
                                <VisualCard
                                    key={opt.id}
                                    option={opt}
                                    isSelected={formData[step.id] === opt.id}
                                    onSelect={() => handleSelect(opt.id)}
                                />
                            ))}
                        </div>
                    )}
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

                {isLastStep && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-nature-600 to-nature-800 text-white font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        {loading ? <FaSpinner className="animate-spin text-xl" /> : <><FaChartLine /> Predict Yield</>}
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
    return (
        <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-4 transition-all duration-300 ${
                isSelected
                    ? 'border-nature-500 shadow-2xl shadow-nature-900/30'
                    : 'border-nature-100 hover:border-nature-300 shadow-xl shadow-nature-900/5'
            }`}
            style={{ minHeight: '200px' }}
        >
            {option.image ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${option.image})` }}
                />
            ) : (
                <div className="absolute inset-0" style={{ backgroundColor: option.color || '#64748b', opacity: 0.85 }} />
            )}
            <div className={`absolute inset-0 transition-all duration-300 ${
                isSelected
                    ? 'bg-gradient-to-t from-nature-900/90 via-nature-800/50 to-transparent'
                    : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
            }`} />
            <div className="relative z-10 flex flex-col items-center justify-end h-full p-5 pt-16 text-white">
                <h3 className="text-lg font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">{option.label}</h3>
                <span className={`text-[11px] font-bold drop-shadow ${isSelected ? 'text-nature-200' : 'text-white/70'}`}>{option.sub}</span>
            </div>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white text-nature-600 rounded-full flex items-center justify-center shadow-lg border-4 border-nature-500"
                >
                    <FaCheckCircle size={18} />
                </motion.div>
            )}
        </motion.button>
    );
}

function YieldResultScreen({ result, onReset }) {
    const getConfidenceColor = (val) => {
        if (val > 15) return 'text-green-500';
        if (val > 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-nature-100 mt-10"
        >
            <div className="p-12 text-center bg-gradient-to-br from-nature-900 to-nature-950 text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.1),_transparent_60%)]" />
                <div className="relative z-10">
                    <div className="text-xs font-black uppercase tracking-[0.4em] text-nature-400 mb-6 flex items-center justify-center gap-2">
                        <FaCheckCircle className="text-nature-600" /> AI Forecast Complete
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-8xl font-black tracking-tighter leading-none mb-2">
                            {result.total_expected_yield_tons}
                        </span>
                        <span className="text-xl font-bold text-nature-400 uppercase tracking-widest">Total Tons Expected</span>
                    </div>
                </div>
            </div>

            <div className="p-12 space-y-10">
                {/* Insights Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-nature-50 p-6 rounded-[2rem] border border-nature-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Gauge size={20} className="text-nature-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-nature-400">Soil Condition</span>
                        </div>
                        <div className="text-2xl font-black text-nature-950">Excellent</div>
                        <p className="text-[10px] text-nature-500 mt-1 uppercase font-bold">Ideal for growth</p>
                    </div>
                    <div className="bg-nature-50 p-6 rounded-[2rem] border border-nature-100">
                        <div className="flex items-center gap-3 mb-4">
                            <CloudRain size={20} className="text-nature-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-nature-400">Weather Risk</span>
                        </div>
                        <div className="text-2xl font-black text-nature-950">Low</div>
                        <p className="text-[10px] text-nature-500 mt-1 uppercase font-bold">Optimal Rainfall</p>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-nature-950 p-8 rounded-[2.5rem] text-white">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nature-400 mb-6">
                        <FaArrowUp className="text-green-500" /> How to increase yield?
                    </h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <FaCheckCircle size={10} />
                            </div>
                            <p className="text-sm font-medium text-nature-100">Add 10% more potash during flowering stage.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <FaCheckCircle size={10} />
                            </div>
                            <p className="text-sm font-medium text-nature-100">Maintain consistent soil moisture using your {result.estimated_params.irrigation_type} system.</p>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onReset}
                        className="w-full py-5 rounded-2xl bg-white border-2 border-nature-200 text-nature-600 font-black uppercase tracking-widest text-sm hover:bg-nature-50 transition-all flex items-center justify-center gap-2"
                    >
                        <FaUndo size={12} /> Start New Prediction
                    </button>
                    <p className="text-center text-[10px] font-bold text-nature-400 uppercase tracking-widest">
                        Values estimated using district-level averages
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
