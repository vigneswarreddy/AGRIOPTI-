import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    FaSatellite, FaTimes, FaCamera, FaUpload, FaSpinner,
    FaCheckCircle, FaExclamationCircle, FaLeaf, FaMapMarkerAlt,
    FaCloudSun, FaVideo, FaCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

export default function AerialLandAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl]     = useState(null);
    const [lat, setLat]                   = useState('28.6');
    const [lon, setLon]                   = useState('77.2');
    const [loading, setLoading]           = useState(false);
    const [result, setResult]             = useState(null);
    const [error, setError]               = useState(null);
    const [showModal, setShowModal]       = useState(false);

    // Camera states
    const [showCamera, setShowCamera]     = useState(false);
    const [cameraError, setCameraError]   = useState(null);
    const [cameraReady, setCameraReady]   = useState(false);

    const fileInputRef = useRef(null);
    const videoRef     = useRef(null);
    const canvasRef    = useRef(null);
    const streamRef    = useRef(null);

    // ── Camera helpers ─────────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCameraError(null);
        setCameraReady(false);
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => setCameraReady(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError(
                err.name === 'NotAllowedError'
                    ? 'Camera permission denied. Please allow camera access in your browser settings.'
                    : 'Could not access camera. Make sure no other app is using it.'
            );
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setCameraReady(false);
        setShowCamera(false);
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video  = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(blob => {
            if (!blob) return;
            const file = new File([blob], `aerial-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
        }, 'image/jpeg', 0.95);
    }, [previewUrl, stopCamera]);

    // Stop camera on unmount
    useEffect(() => () => stopCamera(), [stopCamera]);

    // ── File upload helpers ────────────────────────────────────────────────────
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

    // ── Submit ─────────────────────────────────────────────────────────────────
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

    const ndviColor = (v) => {
        if (v > 0.4) return 'text-green-500';
        if (v > 0.2) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <>
            {/* Hidden canvas for camera capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* ── Section Card ── */}
            <div className="space-y-6 mt-12">
                <h2 className="text-2xl font-heading font-black text-nature-950 uppercase tracking-tight flex items-center gap-3">
                    <span className="w-8 h-1 bg-sky-600 rounded-full" /> Aerial Land Analysis
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

                    {/* Form */}
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

                            {/* Upload zone or preview */}
                            {!selectedFile ? (
                                <div className="space-y-4">
                                    {/* Drop zone */}
                                    <div
                                        className="border-2 border-dashed border-nature-300 rounded-3xl p-10 text-center hover:border-sky-500 hover:bg-sky-50/30 cursor-pointer transition-all duration-300 group"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <div className="w-20 h-20 mx-auto bg-sky-100 rounded-full flex items-center justify-center text-sky-500 text-3xl mb-4 group-hover:scale-110 group-hover:bg-sky-200 transition-transform">
                                            <FaUpload />
                                        </div>
                                        <h4 className="text-lg font-bold text-nature-900 mb-2">Click or drag satellite image here</h4>
                                        <p className="text-sm text-nature-500 mb-4">Support for JPG, PNG (aerial / satellite imagery)</p>
                                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-100 text-sky-700 font-bold hover:bg-sky-200 transition-colors">
                                            <FaUpload /> Browse Files
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-px bg-nature-100" />
                                        <span className="text-[10px] font-black text-nature-400 uppercase tracking-widest">or</span>
                                        <div className="flex-1 h-px bg-nature-100" />
                                    </div>

                                    {/* Camera button */}
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={startCamera}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-sky-900/20 transition-all"
                                    >
                                        <FaVideo className="text-lg" />
                                        Take Photo with Camera
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="border border-nature-200 rounded-3xl p-6 bg-sky-50/30 space-y-4">
                                    <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-black/5 shadow-inner flex items-center justify-center">
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
                                        <div className="flex-1">
                                            <p className="font-bold text-nature-900 text-sm">{selectedFile.name}</p>
                                            <p className="text-xs text-nature-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sky-200 text-sky-600 font-black uppercase tracking-widest text-xs hover:bg-sky-50 transition-all"
                                        >
                                            <FaVideo /> Retake
                                        </button>
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

            {/* ── Camera Modal ── */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.75)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-nature-950 rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-2xl border border-white/10"
                        >
                            {/* Camera header */}
                            <div className="px-8 py-5 flex items-center justify-between border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center">
                                        <FaVideo className="text-white text-sm" />
                                    </div>
                                    <span className="text-white font-black uppercase tracking-widest text-sm">Live Camera</span>
                                    {cameraReady && (
                                        <span className="flex items-center gap-1.5 text-sky-400 text-[10px] font-black uppercase tracking-widest">
                                            <FaCircle className="text-[6px] animate-pulse" /> Live
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={stopCamera}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Video stream */}
                            <div className="relative bg-black aspect-video flex items-center justify-center">
                                {cameraError ? (
                                    <div className="text-center px-8 py-12">
                                        <FaExclamationCircle className="text-red-400 text-4xl mx-auto mb-4" />
                                        <p className="text-white font-bold text-sm">{cameraError}</p>
                                    </div>
                                ) : (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover"
                                        />
                                        {!cameraReady && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-nature-950">
                                                <FaSpinner className="text-sky-400 text-3xl animate-spin" />
                                            </div>
                                        )}
                                        {/* Viewfinder overlay */}
                                        {cameraReady && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-sky-400 rounded-tl-xl opacity-70" />
                                                <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-sky-400 rounded-tr-xl opacity-70" />
                                                <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-sky-400 rounded-bl-xl opacity-70" />
                                                <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-sky-400 rounded-br-xl opacity-70" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Capture button */}
                            {!cameraError && (
                                <div className="px-8 py-6 flex items-center justify-center gap-4">
                                    <button
                                        onClick={stopCamera}
                                        className="px-6 py-3 rounded-2xl border border-white/20 text-white/60 font-black uppercase tracking-widest text-xs hover:border-white/40 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={capturePhoto}
                                        disabled={!cameraReady}
                                        className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-sky-900/60 disabled:opacity-40 transition-all"
                                    >
                                        <div className="w-4 h-4 rounded-full bg-white" />
                                        Capture Photo
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Result / Error Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={closeModal}>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()} style={{ animation: 'fadeInUp 0.3s ease' }}>
                        {result ? (
                            <>
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

                                <div className="px-8 py-6 space-y-5">
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
