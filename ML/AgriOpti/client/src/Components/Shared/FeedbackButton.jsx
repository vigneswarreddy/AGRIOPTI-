import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentAlt, FaTimes, FaExternalLinkAlt, FaRocket } from 'react-icons/fa';
import Modal from './Modal';

const FEEDBACK_FORM_URL = "https://forms.office.com/r/9WcMTqsxWg";

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [openTime, setOpenTime] = useState(0);

    // Heuristic to detect if the user likely submitted the form
    // Since we can't listen to events inside a cross-domain iframe, 
    // we check if they clicked inside the iframe and spent enough time.
    useEffect(() => {
        if (isOpen) {
            setOpenTime(Date.now());
            setHasInteracted(false);

            const handleBlur = () => {
                // If the user clicks into the iframe, the window loses focus
                setHasInteracted(true);
            };
            window.addEventListener('blur', handleBlur);
            return () => window.removeEventListener('blur', handleBlur);
        }
    }, [isOpen]);

    const handleOpen = () => {
        console.log("Feedback button clicked");
        setIsOpen(true);
        setIframeError(false);
        setIframeLoaded(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        const duration = Date.now() - openTime;

        // Only show toast if they interacted with the form AND stayed for > 10 seconds
        if (hasInteracted && duration > 10000) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    };

    const openInNewTab = () => {
        window.open(FEEDBACK_FORM_URL, '_blank');
        handleClose();
    };

    return (
        <>
            {/* Floating Button - Positioned above the ChatBot (which is at bottom-5) */}
            <div className="fixed bottom-[110px] right-6 z-[999] flex flex-col items-end gap-3 pointer-events-none">
                {/* Tooltip */}
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-nature-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl pointer-events-auto border border-white/10 hidden md:block"
                    >
                        Help us improve <FaRocket className="inline ml-1 text-green-400" />
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleOpen}
                    className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-2xl shadow-green-900/40 hover:bg-green-700 transition-colors pointer-events-auto group relative overflow-hidden"
                    title="Give Feedback"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <FaCommentAlt className="relative z-10" />
                </motion.button>
            </div>

            {/* Feedback Modal */}
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="AgriOpti Feedback"
                maxWidth="max-w-4xl"
            >
                <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-nature-50 border border-nature-100 flex flex-col">
                    {!iframeError ? (
                        <>
                            {!iframeLoaded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white z-10">
                                    <div className="w-12 h-12 border-4 border-nature-100 border-t-green-600 rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-nature-400">Loading Form...</p>
                                </div>
                            )}
                            <iframe
                                src={FEEDBACK_FORM_URL}
                                className="w-full h-full border-none"
                                onLoad={() => setIframeLoaded(true)}
                                onError={() => setIframeError(true)}
                                title="Microsoft Feedback Form"
                                allowFullScreen
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl">
                                <FaTimes />
                            </div>
                            <div>
                                <h4 className="text-xl font-heading font-black text-nature-950 uppercase mb-2">Iframe loading failed</h4>
                                <p className="text-sm text-nature-500 font-medium">Microsoft Forms might be blocked by your browser or network settings.</p>
                            </div>
                            <button
                                onClick={openInNewTab}
                                className="px-8 py-4 bg-nature-950 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-nature-800 transition-all"
                            >
                                <FaExternalLinkAlt /> Open in New Tab
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-nature-300">
                    <span>Powered by Microsoft Forms</span>
                    <button
                        onClick={openInNewTab}
                        className="flex items-center gap-2 hover:text-green-600 transition-colors"
                    >
                        Popout <FaExternalLinkAlt />
                    </button>
                </div>
            </Modal>

            {/* Thank You Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-40 right-6 z-[1000] bg-nature-950 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                            <FaRocket />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">Thank you!</p>
                            <p className="text-[10px] text-nature-400 font-medium tracking-tight">Your feedback helps us grow.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="text-nature-500 hover:text-white pl-4 border-l border-white/10">
                            <FaTimes size={10} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FeedbackButton;
