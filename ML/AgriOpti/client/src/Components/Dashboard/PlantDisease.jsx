import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLeaf, FaTimes, FaCamera, FaUpload,
    FaCheckCircle, FaExclamationCircle, FaSpinner,
    FaInfoCircle, FaUndo, FaSearch
} from 'react-icons/fa';
import Modal from '../Shared/Modal';
import imageValidator from '../../Utils/imageValidator';

const ML_API_URL = 'https://wedsiteprofile-agriopti-ml.hf.space';

export default function PlantDisease() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Initialising AI engine...');

    const fileInputRef = useRef(null);

    // Dynamic status messages for better UX during waiting
    useEffect(() => {
        if (!loading) return;

        const messages = [
            "Analysing leaf patterns...",
            "Checking for fungal markers...",
            "Waking up the neural engine (this may take a minute)...",
            "Comparing with global data...",
            "Finalising diagnosis..."
        ];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % messages.length;
            setStatusMessage(messages[idx]);
        }, 5000);
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file (JPG, PNG).');
            setShowModal(true);
            return;
        }

        setSelectedFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
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
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        setError(null);
        setResult(null);
        setStatusMessage('Validating image content...');

        try {
            // Step 1: Validate image content
            const validation = await imageValidator.validateImage(selectedFile);
            if (!validation.isValid) {
                setError(validation.reason);
                setLoading(false);
                setShowModal(true);
                return;
            }

            // Step 2: Send to AI server
            setStatusMessage('Sending image to AI server...');
            const formData = new FormData();
            formData.append('image', selectedFile);

            const res = await fetch(`${ML_API_URL}/predict-disease`, {
                method: 'POST',
                body: formData,
            });

            if (res.status >= 500) {
                // Hugging Face specific: If the space is asleep, it returns 5xx while waking up
                throw new Error("The AI server is currently waking up. This usually takes 1-2 minutes. Please try again in a moment.");
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Diagnosis failed');

            setResult({
                disease: data.disease,
                treatment: data.treatment || "Consult with a local agronomist for specific fungicide and pesticide recommendations based on your local climate.",
                confidence: data.confidence || "High Intent"
            });
        } catch (err) {
            console.error("DIAGNOSIS_ERROR:", err);
            setError(err.message || 'Could not connect to the diagnosis service. Ensure you have an active internet connection or the AI space might be waking up.');
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            {/* ── Header Piece ── */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-green-500/20">
                    <FaLeaf /> AI Diagnostic Tool
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-nature-950 uppercase tracking-tighter leading-none mb-3">
                    Plant <span className="text-green-600">Disease</span> Analyzer
                </h1>
                <p className="text-nature-500 font-bold text-lg max-w-xl mx-auto">
                    Diagnose sick crops instantly with high-precision computer vision.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── Left Column: Instructions & Tips ── */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-nature-200 p-8 shadow-xl shadow-nature-900/5">
                        <h3 className="text-lg font-black text-nature-950 uppercase tracking-tight mb-6 flex items-center gap-3">
                            <FaInfoCircle className="text-green-600" /> How it works
                        </h3>
                        <ul className="space-y-6">
                            {[
                                { step: "1", text: "Capture a clear photo of the infected leaf." },
                                { step: "2", text: "Ensure good lighting and focus on the disease spots." },
                                { step: "3", text: "AI engine identifies pathogens and provides advice." }
                            ].map((s, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-xs font-black text-green-700 shrink-0">
                                        {s.step}
                                    </div>
                                    <p className="text-sm font-medium text-nature-600 pt-1.5">{s.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-green-950 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-60">Accuracy Tip</h4>
                        <p className="text-xs font-medium leading-relaxed">
                            For best results, photograph a single leaf against a neutral background. Multiple leaves or busy backgrounds may reduce precision.
                        </p>
                    </div>
                </div>

                {/* ── Right Column: Upload Area ── */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] border border-nature-200 shadow-2xl overflow-hidden">
                        <div className="bg-nature-950 px-10 py-8 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-2xl shadow-lg shadow-green-600/30">
                                    <FaCamera />
                                </div>
                                <div>
                                    <h3 className="text-xl font-heading font-black">Visual Diagnostic</h3>
                                    <p className="text-nature-400 text-[10px] font-black uppercase tracking-widest">Neural Network Ready</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10">
                            {!selectedFile ? (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="border-4 border-dashed border-nature-100 rounded-[2rem] p-16 text-center hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all duration-300 group relative"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className="w-24 h-24 mx-auto bg-nature-50 rounded-full flex items-center justify-center text-nature-300 text-4xl mb-6 group-hover:bg-green-100 group-hover:text-green-500 transition-all duration-500">
                                        <FaUpload />
                                    </div>
                                    <h4 className="text-2xl font-black text-nature-950 mb-2">Drop leaf image here</h4>
                                    <p className="text-nature-500 font-bold">Or click to browse your files</p>
                                    <div className="mt-8 flex items-center justify-center gap-3">
                                        <span className="px-3 py-1 bg-nature-50 text-[10px] font-black text-nature-400 uppercase rounded-lg">High Res</span>
                                        <span className="px-3 py-1 bg-nature-50 text-[10px] font-black text-nature-400 uppercase rounded-lg">JPG/PNG</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-nature-900 shadow-2xl border-4 border-white">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <button
                                            onClick={clearSelection}
                                            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center shadow-2xl transition-all scale-90 hover:scale-100"
                                        >
                                            <FaTimes size={18} />
                                        </button>
                                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white text-[10px] font-black tracking-widest uppercase">
                                            {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="group relative inline-flex items-center gap-4 px-12 py-5 rounded-2xl bg-green-600 text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-green-900/40 hover:bg-green-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                            {loading ? (
                                                <>
                                                    <FaSpinner className="animate-spin text-xl" />
                                                    <span>{statusMessage}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaSearch />
                                                    <span>Start Diagnosis</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Diagnosis Modal ── */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={result ? "AI Intelligence Scan" : "System Notification"}
                maxWidth="max-w-xl"
            >
                {result ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center text-5xl text-green-600 mb-6 border-4 border-green-100 shadow-inner"
                        >
                            {result.disease.toLowerCase().includes('healthy') ? <FaCheckCircle /> : <FaExclamationCircle className="text-amber-500" />}
                        </motion.div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-nature-50 text-nature-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Machine Confidence: {result.confidence}
                        </div>

                        <h4 className="text-4xl font-heading font-black text-nature-950 leading-tight mb-2 capitalize">
                            {result.disease}
                        </h4>

                        <div className="bg-nature-50 p-8 rounded-[2rem] border border-nature-100 text-left my-8 shadow-inner">
                            <h5 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FaLeaf /> AI Recommendation
                            </h5>
                            <p className="text-nature-700 font-medium leading-relaxed italic">
                                "{result.treatment}"
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={closeModal}
                                className="w-full py-5 rounded-2xl bg-nature-950 text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-nature-800 transition-all"
                            >
                                Close Report
                            </button>
                            <button
                                onClick={() => { closeModal(); clearSelection(); }}
                                className="w-full py-5 rounded-2xl bg-white border-2 border-nature-100 text-nature-400 font-black uppercase tracking-widest text-xs hover:border-nature-300 hover:text-nature-600 transition-all flex items-center justify-center gap-2"
                            >
                                <FaUndo size={10} /> New Analysis
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center text-3xl text-red-500 mb-6">
                            <FaExclamationCircle />
                        </div>
                        <h4 className="text-2xl font-heading font-black text-nature-950 mb-4 tracking-tight">Diagnosis Interrupted</h4>
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium mb-8">
                            {error}
                        </div>
                        <button
                            onClick={closeModal}
                            className="w-full py-5 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:bg-red-700 transition-all"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
