import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFlask, FaTimes, FaThermometerHalf, FaTint, FaSeedling,
    FaCheckCircle, FaExclamationCircle, FaSpinner, FaUndo,
    FaChartLine, FaArrowLeft, FaArrowRight, FaVolumeUp, FaLeaf, FaCloudRain
} from 'react-icons/fa';
import { Sprout, Droplets, CloudRain, ThermometerSun, MapPin } from 'lucide-react';

// Soil images
import soilBlack from '../../assets/images/soils/black.png';
import soilRed from '../../assets/images/soils/red.png';
import soilSandy from '../../assets/images/soils/sandy.png';
import soilClay from '../../assets/images/soils/clay.png';
import soilAlluvial from '../../assets/images/soils/alluvial.png';

// Crop type images (from inputs/crops)
import cropCereals from '../../assets/images/inputs/crops/cereals.png';
import cropSugarcane from '../../assets/images/inputs/crops/sugarcane.png';
import cropFiber from '../../assets/images/inputs/crops/fiber.png';
import cropGroundnut from '../../assets/images/inputs/crops/groundnut.png';
import cropLegumes from '../../assets/images/inputs/crops/legumes.png';

// Season images
import seasonKharif from '../../assets/images/inputs/seasons/kharif.png';
import seasonRabi from '../../assets/images/inputs/seasons/rabi.png';
import seasonSummer from '../../assets/images/inputs/seasons/summer.png';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

const STEPS = [
    {
        id: 'soil_type',
        title: 'Choose Soil Type',
        subtitle: 'आपकी मिट्टी किस प्रकार की है?',
        icon: FaFlask,
        options: [
            { id: 'Black', label: 'Black Soil', sub: 'Kali Mitti', image: soilBlack },
            { id: 'Red', label: 'Red Soil', sub: 'Lal Mitti', image: soilRed },
            { id: 'Sandy', label: 'Sandy Soil', sub: 'Retili Mitti', image: soilSandy },
            { id: 'Clayey', label: 'Clay Soil', sub: 'Chikni Mitti', image: soilClay },
            { id: 'Loamy', label: 'Loamy Soil', sub: 'Domat Mitti', image: soilAlluvial }
        ]
    },
    {
        id: 'crop_type',
        title: 'Choose Crop',
        subtitle: 'आप कौन सी फसल उगा रहे हैं?',
        icon: FaSeedling,
        options: [
            { id: 'Maize', label: 'Maize', sub: 'Makka', image: cropCereals },
            { id: 'Sugarcane', label: 'Sugarcane', sub: 'Ganna', image: cropSugarcane },
            { id: 'Cotton', label: 'Cotton', sub: 'Kapas', image: cropFiber },
            { id: 'Paddy', label: 'Paddy', sub: 'Dhan', image: cropLegumes },
            { id: 'Wheat', label: 'Wheat', sub: 'Gehun', image: cropCereals },
            { id: 'Ground Nuts', label: 'Groundnut', sub: 'Mungfali', image: cropGroundnut }
        ]
    },
    {
        id: 'nutrient_status',
        title: 'Soil Health',
        subtitle: 'मिट्टी की उर्वरता कैसी है?',
        icon: FaLeaf,
        options: [
            { id: 'low', label: 'Poor / Low', sub: 'Kamzor (Kam)', color: '#ef4444' },
            { id: 'medium', label: 'Average', sub: 'Samanya (Madhyam)', color: '#f59e0b' },
            { id: 'high', label: 'Rich / High', sub: 'Upyogi (Adhik)', color: '#10b981' }
        ]
    },
    {
        id: 'season',
        title: 'Season & Land',
        subtitle: 'मौसम और जमीन की जानकारी',
        icon: FaCloudRain,
        isCustom: true // Special handling for land size input
    }
];

const fertilizerEmojis = {
    urea: '🧪', dap: '💎', mop: '🧂', '10-26-26': '📊', '14-35-14': '📊',
    '17-17-17': '📊', '20-20': '📊', '28-28': '📊', default: '🌿',
};

// Soil → base NPK levels
const FERT_SOIL_NPK = {
    Black: { nitrogen: 30, potassium: 20, phosphorous: 15 },
    Red: { nitrogen: 20, potassium: 15, phosphorous: 10 },
    Sandy: { nitrogen: 15, potassium: 10, phosphorous: 8 },
    Clayey: { nitrogen: 35, potassium: 25, phosphorous: 18 },
    Loamy: { nitrogen: 40, potassium: 22, phosphorous: 20 },
};
// Nutrient status multiplier
const FERT_NUTRIENT_MULT = { low: 0.4, medium: 0.7, high: 1.0 };
// Season → temperature/humidity/moisture
const FERT_SEASON = {
    Kharif: { temperature: 28, humidity: 78, moisture: 45 },
    Rabi: { temperature: 18, humidity: 52, moisture: 30 },
    Summer: { temperature: 36, humidity: 35, moisture: 20 },
};

function buildFertilizerPayload(formData) {
    const soil = FERT_SOIL_NPK[formData.soil_type] || FERT_SOIL_NPK.Loamy;
    const mult = FERT_NUTRIENT_MULT[formData.nutrient_status] ?? 0.7;
    const season = FERT_SEASON[formData.season] || FERT_SEASON.Kharif;
    return {
        temperature: season.temperature,
        humidity: season.humidity,
        moisture: season.moisture,
        soil_type: formData.soil_type || 'Loamy',
        crop_type: formData.crop_type || 'Wheat',
        nitrogen: Math.round(soil.nitrogen * mult),
        potassium: Math.round(soil.potassium * mult),
        phosphorous: Math.round(soil.phosphorous * mult),
    };
}



export default function FertilizerPrediction() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        soil_type: '',
        crop_type: '',
        nutrient_status: '',
        season: 'Kharif',
        land_size: '1'
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
        if (isNaN(parseFloat(formData.land_size)) || parseFloat(formData.land_size) <= 0) {
            setError("Please enter a valid land size.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = buildFertilizerPayload(formData);
            const res = await fetch(`${ML_API_URL}/predict-fertilizer`, {
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

            const acres = parseFloat(formData.land_size) || 1;

            setResult({
                ...data,
                land_size: acres,
                total_quantity: Math.round(acres * 50), // Estimate 50kg per acre
                advice: `Ensure even distribution of ${data.predicted_fertilizer}. Mix well with soil during application to maximize nutrient absorption and prevent runoff.`,
                schedule: [
                    "Apply 50% as basal dose before sowing.",
                    "Apply 25% after 30 days of sowing.",
                    "Apply remaining 25% near the mid-crop or flowering stage."
                ]
            });
        } catch (err) {
            setError(err.message || 'Could not connect to the ML service.');
        } finally {
            setLoading(false);
        }
    };

    const resetWizard = () => {
        setFormData({
            soil_type: '', crop_type: '', nutrient_status: '',
            season: 'Kharif', land_size: '1'
        });
        setCurrentStepIndex(0);
        setResult(null);
        setError(null);
    };

    if (result) return <ResultScreen result={result} onReset={resetWizard} />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Progress Bar */}
            <div className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-6">
                    {STEPS.map((_, idx) => (
                        <div key={idx} className={`h-2 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'w-12 bg-emerald-600' : 'w-4 bg-nature-200'}`} />
                    ))}
                </div>
                <h1 className="text-3xl font-black text-nature-950 uppercase tracking-tighter flex items-center justify-center gap-3">
                    <step.icon className="text-emerald-600" />
                    {step.title}
                </h1>
                <p className="text-nature-500 font-bold text-lg mt-1">{step.subtitle}</p>
            </div>

            {/* Selection Grid or Custom Input */}
            <AnimatePresence mode="wait">
                <motion.div key={currentStepIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[400px]">
                    {!step.isCustom ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {step.options.map((opt) => (
                                <VisualCard key={opt.id} option={opt} isSelected={formData[step.id] === opt.id} onSelect={() => handleSelect(opt.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-nature-100 shadow-xl space-y-10 max-w-2xl mx-auto">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[11px] font-black tracking-widest text-nature-600 uppercase">
                                    <CloudRain className="text-emerald-500" /> Choose Current Season
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'Kharif', label: 'Kharif', image: seasonKharif },
                                        { id: 'Rabi', label: 'Rabi', image: seasonRabi },
                                        { id: 'Summer', label: 'Summer', image: seasonSummer }
                                    ].map(s => (
                                        <button key={s.id} onClick={() => setFormData(p => ({ ...p, season: s.id }))}
                                            className={`relative h-24 rounded-2xl overflow-hidden border-4 transition-all ${formData.season === s.id ? 'border-emerald-500 shadow-xl' : 'border-nature-100 hover:border-emerald-300'} group`}
                                        >
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${s.image})` }} />
                                            <div className={`absolute inset-0 transition-all ${formData.season === s.id ? 'bg-emerald-900/60' : 'bg-black/40 group-hover:bg-black/20'}`} />
                                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-black uppercase tracking-widest text-xs drop-shadow-md">
                                                {s.label}
                                            </div>
                                            {formData.season === s.id && (
                                                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-white text-emerald-600 rounded-full shadow-md">
                                                    <FaCheckCircle size={10} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[11px] font-black tracking-widest text-nature-600 uppercase">
                                    <FaChartLine className="text-emerald-500" /> Land Size (Acres)
                                </label>
                                <div className="pt-6 pb-10 px-2">
                                    <div className="relative mb-2">
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="50"
                                            step="0.5"
                                            value={formData.land_size}
                                            onChange={(e) => setFormData(p => ({ ...p, land_size: e.target.value }))}
                                            className="w-full h-3 bg-nature-100 rounded-full appearance-none cursor-pointer accent-emerald-600 transition-all hover:bg-nature-200"
                                            style={{
                                                background: `linear-gradient(to right, #059669 0%, #059669 ${(formData.land_size / 50) * 100}%, #f3f4f6 ${(formData.land_size / 50) * 100}%, #f3f4f6 100%)`
                                            }}
                                        />
                                        {/* Tick Marks */}
                                        <div className="absolute -bottom-6 w-full flex justify-between px-1">
                                            {[0, 10, 20, 30, 40, 50].map(v => (
                                                <div key={v} className="flex flex-col items-center gap-1">
                                                    <div className="w-0.5 h-1.5 bg-nature-200 rounded-full" />
                                                    <span className="text-[8px] font-black text-nature-400">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    key={formData.land_size}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center justify-center py-8 bg-emerald-50 rounded-[2rem] border-2 border-white shadow-xl shadow-emerald-900/5"
                                >
                                    <div className="text-center">
                                        <p className="text-6xl font-black text-emerald-950 tracking-tighter leading-none mb-1">
                                            {formData.land_size}
                                        </p>
                                        <p className="text-xs font-black text-emerald-600/60 uppercase tracking-[0.2em]">Total Acres Selected</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-3xl border border-nature-100 shadow-xl">
                <button onClick={handleBack} disabled={isFirstStep} className="flex items-center gap-2 px-6 py-3 font-black text-nature-600 uppercase tracking-widest text-xs disabled:opacity-20">
                    <FaArrowLeft /> Step Back
                </button>

                {isLastStep && (
                    <button onClick={handleSubmit} disabled={loading} className="btn-primary group flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        {loading ? <FaSpinner className="animate-spin text-xl" /> : <><FaCheckCircle /> Get Recommendation</>}
                    </button>
                )}
            </div>

            {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center font-bold">⚠️ {error}</div>}
        </div>
    );
}

function VisualCard({ option, isSelected, onSelect }) {
    return (
        <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-4 transition-all duration-300 ${isSelected
                ? 'border-emerald-500 shadow-2xl shadow-emerald-900/30'
                : 'border-nature-100 hover:border-emerald-300 shadow-xl shadow-nature-900/5'
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
            <div className={`absolute inset-0 transition-all duration-300 ${isSelected
                ? 'bg-gradient-to-t from-emerald-900/90 via-emerald-800/50 to-transparent'
                : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                }`} />
            <div className="relative z-10 flex flex-col items-center justify-end h-full p-5 pt-16 text-white">
                <h3 className="text-lg font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">{option.label}</h3>
                <span className={`text-[11px] font-bold drop-shadow ${isSelected ? 'text-emerald-200' : 'text-white/70'}`}>{option.sub}</span>
            </div>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-500"
                >
                    <FaCheckCircle size={18} />
                </motion.div>
            )}
        </motion.button>
    );
}

function ResultScreen({ result, onReset }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-nature-100 mt-10">
            <div className="px-12 py-16 text-center bg-gradient-to-br from-emerald-900 to-nature-950 text-white relative">
                <div className="absolute inset-0 bg-mesh opacity-10" />
                <div className="relative z-10">
                    <div className="text-8xl mb-6 bg-white/10 p-8 rounded-full inline-block backdrop-blur-md">
                        {fertilizerEmojis[result.predicted_fertilizer.toLowerCase()] || '🧪'}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        Analysis Complete
                    </div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{result.predicted_fertilizer}</h2>
                </div>
            </div>

            <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-nature-50 border border-nature-100">
                            <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest mb-2">Total Quantity Required</p>
                            <p className="text-4xl font-black text-nature-950">{result.total_quantity} <span className="text-sm text-nature-500">kg</span></p>
                            <p className="text-[10px] text-nature-400 mt-1 font-bold">For {result.land_size} Acres</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2"><FaExclamationCircle /> Expert Advice</p>
                            <p className="text-xs font-bold text-amber-900 leading-relaxed">{result.advice}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest flex items-center gap-2"><FaSeedling className="text-emerald-500" /> Application Schedule</p>
                        <div className="space-y-3">
                            {result.schedule.map((step, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 shrink-0 mt-1">{idx + 1}</div>
                                    <p className="text-xs font-medium text-nature-700 leading-relaxed pt-1.5">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-nature-100">
                    <button onClick={onReset} className="w-full py-5 rounded-2xl bg-nature-950 text-white font-black uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                        <FaUndo size={12} /> New Analysis
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
