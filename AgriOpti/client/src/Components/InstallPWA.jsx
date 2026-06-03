import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-nature-100 p-6 max-w-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-nature-600"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-nature-50 flex items-center justify-center text-nature-600 shrink-0">
            <FaDownload size={24} />
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-black text-nature-950 uppercase tracking-tight">Install AgriOpti</h4>
            <p className="text-[10px] font-bold text-nature-400 uppercase tracking-widest mt-1">Get the app for a better experience</p>
            <button 
              onClick={handleInstallClick}
              className="mt-3 px-4 py-2 bg-nature-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-nature-700 transition-all active:scale-95"
            >
              Install Now
            </button>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-nature-300 hover:text-nature-600 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPWA;
