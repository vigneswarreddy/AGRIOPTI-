import React, { useState, useRef } from 'react';
import {
    FaSatellite, FaTimes, FaCamera, FaUpload, FaSpinner,
    FaCheckCircle, FaExclamationCircle, FaLeaf, FaMapMarkerAlt,
    FaCloudSun, FaChartArea
} from 'react-icons/fa';
import imageValidator from '../../Utils/imageValidator';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

export default function AerialLandAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [lat, setLat] = useState('28.6');
    const [lon, setLon] = useState('77.2');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file (JPG, PNG).');
            setShowModal(true);
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG).');
                setShowModal(true);
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please upload a satellite or aerial image first.');
            setShowModal(true);
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const validation = await imageValidator.validateImage(selectedFile);
            if (!validation.isValid) {
                setError(validation.reason);
                setLoading(false);
                setShowModal(true);
                return;
            }

            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('lat', lat);
            formData.append('lon', lon);

            const res = await fetch(`${ML_API_URL}/predict-land`, {
                method: 'POST',
                body: formData,
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
            if (!res.ok) throw new Error(data.error || 'Analysis failed');
            setResult(data);
        } catch (err) {
            setError(err.message || 'Could not connect to the ML service.');
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setResult(null);
        setError(null);
    };

    /* NDVI colour helper */
    const ndviColor = (v) => {
        if (v > 0.4) return 'text-green-500';
        if (v > 0.2) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <>
            {/* ── Section Card ── */}
            <div className="space-y-6 mt-12">
                <h2 className="text-2xl font-heading font-black text-nature-950 uppercase tracking-tight flex items-center gap-3">
                    <span className="w-8 h-1 bg-sky-600 rounded-full"></span> Aerial Land Analysis
                </h2>

                <div className="bg-white rounded-[2rem] border border-nature-200 shadow-xl shadow-nature-900/5 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-nature-950 px-8 py-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-600/30">
                            <FaSatellite />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-heading font-black">🛰️ Sentinel-2 Crop Classification</h3>
                            <p className="text-nature-400 text-xs font-medium tracking-wide">
                                Upload a satellite/aerial image to classify crop type, NDVI & NDRE health indices, and get an AI farming strategy.
                            </p>
                        </div>
                    </div>

                    {/* Image Upload + Lat/Lon */}
                    <form onSubmit={handleSubmit} className="px-8 py-10">
                        <div className="max-w-3xl mx-auto space-y-8">
                            {/* Lat / Lon */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-nature-500 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-sky-500" /> Latitude
                                    </label>
                                    <input
                                        type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
                                        className="w-full rounded-xl border-2 border-nature-200 bg-nature-50/50 px-4 py-3 text-nature-950 font-semibold text-sm placeholder-nature-300 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                                        placeholder="e.g. 28.6"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-nature-500 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-sky-500" /> Longitude
                                    </label>
                                    <input
                                        type="number" step="any" value={lon} onChange={e => setLon(e.target.value)}
                                        className="w-full rounded-xl border-2 border-nature-200 bg-nature-50/50 px-4 py-3 text-nature-950 font-semibold text-sm placeholder-nature-300 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                                        placeholder="e.g. 77.2"
                                    />
                                </div>
                            </div>

                            {/* Upload zone */}
                            {!selectedFile ? (
                                <div
                                    className="border-2 border-dashed border-nature-300 rounded-3xl p-12 text-center hover:border-sky-500 hover:bg-sky-50/30 cursor-pointer transition-all duration-300 group"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className="w-20 h-20 mx-auto bg-sky-100 rounded-full flex items-center justify-center text-sky-500 text-3xl mb-4 group-hover:scale-110 group-hover:bg-sky-200 transition-transform">
                                        <FaCamera />
                                    </div>
                                    <h4 className="text-lg font-bold text-nature-900 mb-2">Click or drag satellite image here</h4>
                                    <p className="text-sm text-nature-500 mb-6">Support for JPG, PNG (aerial / satellite imagery)</p>
                                    <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-100 text-sky-700 font-bold hover:bg-sky-200 transition-colors">
                                        <FaUpload /> Browse Files
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-nature-200 rounded-3xl p-6 bg-sky-50/30">
                                    <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-black/5 shadow-inner mb-6 flex items-center justify-center">
                                        <img loading="lazy" src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <button type="button" onClick={clearSelection}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                            title="Remove image">
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                            <FaSatellite />
                                        </div>
                                        <div>
                                            <p className="font-bold text-nature-900 text-sm">{selectedFile.name}</p>
                                            <p className="text-xs text-nature-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                            <div className="flex justify-end">
                                <button type="submit" disabled={!selectedFile || loading}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-sky-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                                    {loading ? (<><FaSpinner className="animate-spin" /> Analysing…</>) : (<><FaSatellite /> Analyse Land</>)}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── Result / Error Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={closeModal}>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()} style={{ animation: 'fadeInUp 0.3s ease' }}>
                        {result ? (
                            <>
                                {/* Success header */}
                                <div className="px-8 py-8 text-center relative overflow-hidden bg-gradient-to-br from-sky-900 to-nature-950">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.15),_transparent_60%)]" />
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-3 p-4 bg-white/10 rounded-full inline-flex items-center justify-center shadow-lg border border-white/20">
                                            <FaSatellite className="text-sky-400" />
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-black uppercase tracking-[0.3em] mb-3 mx-auto block w-fit">
                                            <FaCheckCircle /> Sentinel-2 Analysis
                                        </div>
                                        <h4 className="text-3xl font-heading font-black text-white capitalize">{result.predicted_crop}</h4>
                                        <p className="text-sky-300 text-sm font-bold mt-1">{result.confidence}% Confidence</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-8 py-6 space-y-5">
                                    {/* NDVI / NDRE cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-nature-50 rounded-2xl p-4 text-center border border-nature-200">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-nature-500 mb-1">NDVI</p>
                                            <p className={`text-3xl font-heading font-black ${ndviColor(result.ndvi)}`}>{result.ndvi}</p>
                                            <p className="text-[10px] text-nature-400 mt-1">Vegetation Index</p>
                                        </div>
                                        <div className="bg-nature-50 rounded-2xl p-4 text-center border border-nature-200">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-nature-500 mb-1">NDRE</p>
                                            <p className={`text-3xl font-heading font-black ${ndviColor(result.ndre)}`}>{result.ndre}</p>
                                            <p className="text-[10px] text-nature-400 mt-1">Red Edge Index</p>
                                        </div>
                                    </div>

                                    {/* Weather */}
                                    {(result.temperature || result.humidity) && (
                                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-center gap-4">
                                            <FaCloudSun className="text-2xl text-sky-500 flex-shrink-0" />
                                            <div className="text-sm">
                                                <span className="font-bold text-nature-900">{result.temperature}°C</span>
                                                <span className="mx-2 text-nature-300">|</span>
                                                <span className="font-bold text-nature-900">{result.humidity}%</span> humidity
                                            </div>
                                        </div>
                                    )}

                                    {/* Farming strategy */}
                                    {result.farming_strategy && (
                                        <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaLeaf className="text-green-600" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-green-700">AI Farming Strategy</p>
                                            </div>
                                            <p className="text-sm text-nature-700 leading-relaxed whitespace-pre-line">{result.farming_strategy}</p>
                                        </div>
                                    )}

                                    <button onClick={closeModal}
                                        className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-sky-600/30 transition-all">
                                        Close Report
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-red-950 px-8 py-8 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.15),_transparent_60%)]" />
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4 text-red-500"><FaExclamationCircle className="mx-auto" /></div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Error</div>
                                        <h4 className="text-2xl font-heading font-black text-white">Oops!</h4>
                                    </div>
                                </div>
                                <div className="px-8 py-6 text-center">
                                    <p className="text-red-600 text-sm font-medium mb-6">{error}</p>
                                    <button onClick={closeModal} className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm transition-all">Dismiss</button>
                                </div>
                            </>
                        )}
                        <button onClick={closeModal} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"><FaTimes /></button>
                    </div>
                </div>
            )}
        </>
    );
}
