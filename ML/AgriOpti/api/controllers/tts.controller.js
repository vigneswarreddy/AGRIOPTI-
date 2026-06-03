import * as googleTTS from 'google-tts-api';

export const getAudio = async (req, res, next) => {
    try {
        const { text, lang } = req.body;

        if (!text || !lang) {
            return res.status(400).json({ success: false, message: 'Text and language code are required.' });
        }

        // google-tts-api handles the text chunking natively up to an unlimited size if using getAllAudioBase64.
        const audioResults = await googleTTS.getAllAudioBase64(text, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            splitPunct: ',.?!', // Split into chunks automatically
        });

        // Map through all returned chunks and return an array of continuous base64 streams
        // The frontend will play them sequentially
        res.status(200).json({
            success: true,
            audioChunks: audioResults.map(chunk => chunk.base64)
        });

    } catch (error) {
        console.error('Error in TTS generation:', error);
        res.status(500).json({ success: false, message: 'Failed to generate audio', error: error.message });
    }
};
