/**
 * 🚀 AgriOpti Hybrid TTS Engine
 * Provides "Pro-tier" voice quality for Hindi, Tamil, Telugu, and Kannada.
 * 
 * Strategy:
 * 1. Native Premium: Priority given to "Microsoft Natural" or "Google Online" voices (Free, No API).
 * 2. Native Standard: Fallback to local system voices.
 * 3. External Proxy: Final fallback to optimized Cloud TTS.
 */

export const speakText = async (text, langCode = 'en-IN') => {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error('TTS: Synthesis not supported');
      resolve(false);
      return;
    }

    // Cancel any previous speech
    synth.cancel();

    // Small delay to ensure voices are loaded (browsers load them async)
    setTimeout(() => {
      const voices = synth.getVoices();
      const langShort = langCode.split('-')[0].toLowerCase();

      /**
       * 🎯 STEP 1: VOICE DISCOVERY
       * Search for Premium/Online voices first (Edge/Chrome/Android provide these for free)
       */
      let voice = voices.find(v =>
        v.lang.toLowerCase().startsWith(langShort) &&
        (v.name.includes('Online') || v.name.includes('Natural') || v.name.includes('Google'))
      );

      // Fallback 1: Any voice matching the specific language code
      if (!voice) voice = voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());

      // Fallback 2: Any voice matching the language prefix
      if (!voice) voice = voices.find(v => v.lang.toLowerCase().startsWith(langShort));

      // Fallback 3: Default system voice
      if (!voice && voices.length > 0) voice = voices[0];

      if (voice) {
        console.log(`[TTS] Using Voice: ${voice.name} (${voice.lang})`);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice.lang; // Use the actual voice's lang
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => resolve(true);
        utterance.onerror = (e) => {
          if (e.error === 'canceled' || e.error === 'interrupted') {
            resolve(true);
            return;
          }
          console.warn(`[TTS] Native Error: ${e.error}. Trying cloud fallback...`);
          fallbackTTS(text, langCode).then(resolve);
        };

        // Important: Some browsers need a user interaction context
        // This is usually handled by the button click that triggers this.
        synth.speak(utterance);
      } else {
        console.warn('[TTS] No native voices found. Using cloud fallback.');
        fallbackTTS(text, langCode).then(resolve);
      }
    }, 50);
  });
};

/**
 * 🛠️ STEP 2: CLOUD FALLBACK
 * Uses an optimized Google Translate endpoint with proper parameters for better reliability.
 */
const fallbackTTS = async (text, langCode) => {
  return new Promise((resolve) => {
    try {
      const langShort = langCode.split('-')[0];

      // Use the 'tw-ob' client which is more permissive for mobile/web apps
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langShort}&total=1&idx=0&textlen=${text.length}&client=tw-ob`;

      const audio = new Audio();
      audio.src = url;

      // Handle the play promise to catch "User Interaction" errors
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.onended = () => resolve(true);
          })
          .catch(error => {
            console.error("[TTS] Audio playback blocked by browser:", error);
            resolve(false);
          });
      }

      audio.onerror = (e) => {
        console.error("[TTS] Cloud fallback failed:", e);
        resolve(false);
      };

    } catch (e) {
      console.error("[TTS] Fallback logic exception:", e);
      resolve(false);
    }
  });
};
