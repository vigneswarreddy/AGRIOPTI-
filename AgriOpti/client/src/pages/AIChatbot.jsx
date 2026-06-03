import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import {
    FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaVolumeUp, FaVolumeMute,
    FaRobot, FaUser, FaLeaf, FaGlobe, FaTimes, FaTrash
} from 'react-icons/fa';

import { speakText } from '../Utils/tts';

// ─── Gemini setup ─────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = [
    { code: 'en-IN', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'hi-IN', label: 'Hindi', short: 'हि', flag: '🇮🇳' },
    { code: 'kn-IN', label: 'Kannada', short: 'ಕ', flag: '🇮🇳' },
    { code: 'te-IN', label: 'Telugu', short: 'తె', flag: '🇮🇳' },
    { code: 'ta-IN', label: 'Tamil', short: 'த', flag: '🇮🇳' },
];

const LANG_NAMES = {
    'en-IN': 'English',
    'hi-IN': 'Hindi',
    'kn-IN': 'Kannada',
    'te-IN': 'Telugu',
    'ta-IN': 'Tamil',
};

const SYSTEM_PROMPT = (langName) => `You are AgriBot, an expert AI agricultural assistant for Indian farmers on the AgriOpti platform.
You MUST respond ONLY in ${langName}. This is mandatory — do not respond in any other language regardless of what language the user writes in.
You help farmers with crop selection, soil health, fertilizers, pest control, weather, market prices, land records and government schemes.
Be friendly, concise and practical. Use simple language suitable for farmers.
Hold responses clearly using bullet points and bold text when listing items.
If asked something unrelated to agriculture, politely redirect to farming topics in ${langName}.`;

// ─── Strip markdown for TTS ──────────────────────────────────────────────────
function stripMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold**
        .replace(/\*(.+?)\*/g, '$1')        // *italic*
        .replace(/#{1,6}\s*/g, '')           // # headings
        .replace(/`{1,3}[^`]*`{1,3}/g, '')  // `code`
        .replace(/^[\*\-•]\s+/gm, '')       // bullet points
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url)
        .replace(/\n{2,}/g, '\n')           // multiple newlines
        .trim();
}

// ─── Markdown renderer ───────────────────────────────────────────────────────
function MarkdownRenderer({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let numberedItems = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let lang = '';

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2">
                    {listItems.map((item, i) => <li key={i} className="text-sm leading-relaxed">{renderInline(item)}</li>)}
                </ul>
            );
            listItems = [];
        }
        if (numberedItems.length > 0) {
            elements.push(
                <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 pl-2">
                    {numberedItems.map((item, i) => <li key={i} className="text-sm leading-relaxed">{renderInline(item)}</li>)}
                </ol>
            );
            numberedItems = [];
        }
    };

    const renderInline = (str) => {
        const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
        return parts.map((part, i) => {
            if (/^\*\*(.+)\*\*$/.test(part)) return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            if (/^\*(.+)\*$/.test(part)) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
            if (/^`(.+)`$/.test(part)) return <code key={i} className="bg-nature-100 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
            return part;
        });
    };

    lines.forEach((line, idx) => {
        // Handle code blocks
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                flushList();
                inCodeBlock = true;
                lang = line.trim().slice(3);
            } else {
                elements.push(
                    <div key={`code-${elements.length}`} className="my-3 bg-nature-950 text-nature-50 rounded-xl overflow-hidden shadow-sm border border-nature-800">
                        {lang && <div className="bg-nature-900 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-nature-400 border-b border-nature-800">{lang}</div>}
                        <pre className="p-4 text-xs font-mono overflow-x-auto custom-scrollbar leading-relaxed">
                            <code>{codeBlockContent.join('\n')}</code>
                        </pre>
                    </div>
                );
                codeBlockContent = [];
                inCodeBlock = false;
                lang = '';
            }
            return;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            return;
        }

        const bullet = line.match(/^[\*\-•]\s+(.+)/);
        const numbered = line.match(/^\d+\.\s+(.+)/);
        const heading = line.match(/^#{1,4}\s+(.+)/);

        if (bullet) {
            flushList();
            listItems.push(bullet[1]);
        } else if (numbered) {
            flushList();
            numberedItems.push(numbered[1]);
        } else if (heading) {
            flushList();
            elements.push(<p key={`h-${idx}`} className="font-black text-nature-900 text-base mt-4 mb-2 tracking-tight">{heading[1]}</p>);
        } else if (line.trim() === '') {
            flushList();
            elements.push(<div key={`div-${idx}`} className="h-2" />);
        } else {
            flushList();
            elements.push(<p key={`p-${idx}`} className="text-sm leading-relaxed mb-2">{renderInline(line)}</p>);
        }
    });
    flushList();
    return <div className="space-y-0.5">{elements}</div>;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-nature-400"
                    style={{ animation: `bounce 1.2s infinite ${i * 0.2}s` }}
                />
            ))}
        </div>
    );
}

export default function AIChatbot() {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I\'m AgriBot 🌱 — your AI farming assistant. Ask me anything about crops, soil, fertilizers, or market prices. I can also understand Hindi, Kannada, Telugu, and Tamil!', ts: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState(LANGUAGES[0]);
    const [listening, setListening] = useState(false);
    const [speakingId, setSpeakingId] = useState(null);
    const [error, setError] = useState('');

    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const recognRef = useRef(null);
    const chatRef = useRef(null);  // Gemini chat session
    const voicesRef = useRef([]);  // Available TTS voices
    const audioRef = useRef(null); // Ref for audio fallback

    // Load TTS voices and setup sound cleanup
    useEffect(() => {
        const loadVoices = () => {
            voicesRef.current = window.speechSynthesis?.getVoices() || [];
        };
        loadVoices();
        window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);

        // Cleanup all sounds on unmount
        return () => {
            window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
            window.speechSynthesis?.cancel(); // Stop any local TTS
            if (audioRef.current) {
                audioRef.current.pause(); // Stop any cloud fallback audio
                audioRef.current = null;
            }
        };
    }, []);


    // Init / reinit Gemini chat session when language changes
    useEffect(() => {
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: SYSTEM_PROMPT(LANG_NAMES[lang.code]),
        });
        chatRef.current = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 2048 },
        });
    }, [lang]);

    // ─── Send message ───────────────────────────────────────────────────────────
    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        setInput('');
        setError('');
        const userMsg = { role: 'user', text: trimmed, ts: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            if (!chatRef.current) throw new Error('Chat session not initialized');
            const result = await chatRef.current.sendMessage(trimmed);
            const responseText = result.response.text();
            setMessages(prev => [...prev, { role: 'bot', text: responseText, ts: Date.now() }]);
        } catch (err) {
            let errMsg = `⚠️ Error: ${err.message}`;
            if (err.message?.includes('API_KEY') || err.message?.includes('API key')) {
                errMsg = '⚠️ Gemini API key is missing or invalid. Please add VITE_GEMINI_API_KEY to your client/.env file.';
            } else if (err.message?.includes('503') || err.message?.includes('high demand') || err.message?.includes('overloaded')) {
                errMsg = '⚠️ The AI servers are currently experiencing unusually high demand. This is temporary. Please try again in a minute!';
            }
            setError(errMsg);
            setMessages(prev => [...prev, { role: 'bot', text: errMsg, ts: Date.now(), isError: true }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    // ─── Voice input ────────────────────────────────────────────────────────────
    const toggleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('⚠️ Your browser does not support Speech Recognition. Please use latest Chrome/Edge.');
            return;
        }

        if (listening) {
            recognRef.current?.stop();
            setListening(false);
            return;
        }

        // Reset any previous state
        setError('');

        const recog = new SpeechRecognition();
        recog.lang = lang.code;
        recog.continuous = false;
        recog.interimResults = true;

        recog.onstart = () => {
            setListening(true);
        };

        recog.onend = () => {
            setListening(false);
        };

        recog.onerror = (e) => {
            console.error('STT Error:', e.error);
            setListening(false);
            if (e.error === 'not-allowed') {
                setError('⚠️ Microphone permission blocked. Please allow access in browser settings.');
            } else if (e.error === 'network') {
                setError('⚠️ Network error during speech recognition.');
            } else if (e.error === 'no-speech') {
                // Ignore silent timeouts
            } else {
                setError(`⚠️ Voice Error: ${e.error}`);
            }
        };

        recog.onresult = (e) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = e.resultIndex; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    finalTranscript += e.results[i][0].transcript;
                } else {
                    interimTranscript += e.results[i][0].transcript;
                }
            }

            // Update input in real-time
            const currentTranscript = finalTranscript || interimTranscript;
            if (currentTranscript) {
                setInput(currentTranscript);
            }

            // If we have a final result, send it
            if (finalTranscript) {
                console.log('STT Final:', finalTranscript);
                sendMessage(finalTranscript);
                recog.stop();
            }
        };

        recognRef.current = recog;
        try {
            recog.start();
        } catch (err) {
            console.error('Recognition start error:', err);
            setError('⚠️ Could not start voice listener.');
            setListening(false);
        }
    };

    // ─── Voice output ─────────────────────────────────────────────────────────
    const getBestVoice = (langCode) => {
        const voices = voicesRef.current;
        if (!voices.length) return null;
        const prefix = langCode.split('-')[0]; // e.g. 'hi' from 'hi-IN'
        // 1. Exact lang match
        let v = voices.find(v => v.lang === langCode);
        // 2. Same language prefix (hi-IN → hi-US etc.)
        if (!v) v = voices.find(v => v.lang.startsWith(prefix + '-'));
        // 3. Any voice with same script (loose prefix)
        if (!v) v = voices.find(v => v.lang.startsWith(prefix));
        return v || null;
    };

    const stopSpeaking = () => {
        window.speechSynthesis?.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setSpeakingId(null);
    };

    const playCloudTTS = async (text, langCode, msgId) => {
        const langShort = langCode.split('-')[0];

        try {
            // Fetch audio chunks from our backend proxy
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error('No TTS backend configured');
            const response = await fetch(`${apiUrl}/api/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, lang: langShort })
            });

            if (!response.ok) throw new Error('Backend TTS error');
            const data = await response.json();

            if (!data.success || !data.audioChunks?.length) {
                throw new Error(data.message || 'No audio returned');
            }

            let chunkIndex = 0;
            const chunks = data.audioChunks;

            const playNext = () => {
                // Check if user stopped it or we reached the end
                if (chunkIndex >= chunks.length || (speakingId !== msgId && speakingId !== null)) {
                    setSpeakingId(null);
                    return;
                }

                // Construct data URI from base64 string
                const audioUrl = `data:audio/mp3;base64,${chunks[chunkIndex]}`;
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    chunkIndex++;
                    playNext();
                };

                audio.onerror = (e) => {
                    console.error("Audio Playback Error", e);
                    setSpeakingId(null);
                    setError(`⚠️ Playback failed for ${langShort}.`);
                };

                audio.play().catch(err => {
                    console.error("Audio block", err);
                    setSpeakingId(null);
                });
            };

            playNext();
        } catch (err) {
            console.error("Backend TTS Fetch Error", err);
            setSpeakingId(null);
            setError(`⚠️ Cloud TTS fallback failed for ${langShort}.`);
        }
    };

    const speak = async (text, msgId) => {
        if (speakingId === msgId) {
            stopSpeaking();
            return;
        }

        stopSpeaking();
        setSpeakingId(msgId);
        const cleanText = stripMarkdown(text);

        console.log(`Speaking in ${lang.code}: ${cleanText.substring(0, 30)}...`);
        const success = await speakText(cleanText, lang.code);

        if (success) {
            setSpeakingId(null);
        } else {
            console.error('TTS failed after all fallbacks');
            setSpeakingId(null);
            setError(`⚠️ Voice synthesis failed for ${lang.label}. Please try another language.`);
        }
    };

    // ─── Clear chat ──────────────────────────────────────────────────────────────
    const clearChat = () => {
        stopSpeaking();
        setMessages([{ role: 'bot', text: 'Chat cleared! Start a new conversation 🌱', ts: Date.now() }]);
        // Reinit chat session
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: SYSTEM_PROMPT(LANG_NAMES[lang.code]),
        });
        chatRef.current = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 2048 },
        });
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-nature-50/30 overflow-x-hidden">
            <Navbar />

            <div className="flex-1 pt-24 md:pt-32 pb-16 flex flex-col items-center w-full">
                {/* ── Modern SaaS Header ── */}
                <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[150px] bg-nature-400/20 blur-[100px] rounded-full -z-10"></div>
                    
                    <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
                        <div className="absolute inset-0 bg-gradient-to-br from-nature-500/10 to-transparent"></div>
                        
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-1.5 rounded-full bg-nature-600/20 border border-nature-600/30 text-nature-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm w-max mx-auto md:mx-0">
                                <FaRobot className="text-nature-400" /> AI Powered
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none uppercase text-white">
                                Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 to-nature-600">Bot</span>
                            </h1>
                            <p className="text-nature-400 text-xs font-bold uppercase tracking-widest">
                                Your multi-lingual AI farming assistant
                            </p>
                        </div>

                        {/* Language Selector */}
                        <div className="relative z-10 flex items-center justify-center gap-2 flex-wrap bg-white/5 p-2 rounded-2xl border border-white/10">
                            <FaGlobe className="text-nature-400 text-sm hidden md:block ml-2" />
                            {LANGUAGES.map(l => (
                                <button
                                    key={l.code}
                                    onClick={() => setLang(l)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${lang.code === l.code
                                        ? 'bg-nature-600 text-white shadow-lg shadow-nature-600/30'
                                        : 'bg-transparent text-nature-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {l.flag} {l.short}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Chat Area ── */}
                <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-2 flex flex-col gap-4" style={{ minHeight: 0 }}>

                    {/* Messages window */}
                    <div className="flex-1 bg-white/90 backdrop-blur-3xl rounded-[3rem] border border-nature-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-y-auto p-6 md:p-10 flex flex-col gap-6" style={{ minHeight: '420px', maxHeight: '650px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-sm shadow-md ${msg.role === 'user' ? 'bg-nature-600' : 'bg-nature-950'
                                    }`}>
                                    {msg.role === 'user' ? <FaUser /> : <FaLeaf />}
                                </div>

                                {/* Bubble */}
                                <div className={`relative max-w-[75%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                    <div className={`px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-nature-600 text-white rounded-tr-sm whitespace-pre-wrap'
                                        : msg.isError
                                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                                            : 'bg-nature-50 text-nature-900 border border-nature-100 rounded-tl-sm'
                                        }`}>
                                        {msg.role === 'user' || msg.isError
                                            ? msg.text
                                            : <MarkdownRenderer text={msg.text} />
                                        }
                                    </div>

                                    {/* TTS button for bot messages — Fix 6: always visible */}
                                    {msg.role === 'bot' && !msg.isError && (
                                        <button
                                            onClick={() => speak(msg.text, idx)}
                                            className="transition-opacity self-start ml-1 text-nature-400 hover:text-nature-600 text-xs flex items-center gap-1"
                                            title="Listen"
                                        >
                                            {speakingId === idx ? <><FaVolumeMute /> Stop</> : <><FaVolumeUp /> Listen</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-nature-950 flex items-center justify-center text-white text-sm">
                                    <FaLeaf />
                                </div>
                                <div className="bg-nature-50 border border-nature-100 rounded-2xl rounded-tl-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                            <span className="flex-1">{error}</span>
                            <button onClick={() => setError('')}><FaTimes /></button>
                        </div>
                    )}

                    {/* ── Fix 6: Listening status indicator ── */}
                    {listening && (
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-50 border border-red-200 rounded-2xl animate-pulse">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
                                Listening… Speak now in {lang.label}
                            </span>
                        </div>
                    )}

                    {/* ── Input Bar ── */}
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-nature-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-4 flex items-end gap-3 transition-all">
                        {/* Mic button */}
                        <button
                            onClick={toggleVoice}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base flex-shrink-0 transition-all shadow-md ${listening
                                ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                                : 'bg-nature-100 text-nature-600 hover:bg-nature-200'
                                }`}
                            title={listening ? 'Stop listening' : `Speak in ${lang.label}`}
                        >
                            {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        </button>

                        {/* Text area */}
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder={`Ask AgriBot in ${lang.label}… (Enter to send)`}
                            rows={1}
                            className="flex-1 resize-none bg-transparent text-nature-900 text-sm font-medium placeholder-nature-300 outline-none leading-relaxed py-3 max-h-32 overflow-y-auto custom-scrollbar"
                            style={{ minHeight: '48px' }}
                            onInput={e => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                            }}
                        />

                        {/* Clear button */}
                        <button
                            onClick={clearChat}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-nature-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                            title="Clear chat"
                        >
                            <FaTrash className="text-sm" />
                        </button>

                        {/* Send button */}
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 rounded-2xl bg-nature-600 hover:bg-nature-700 text-white flex items-center justify-center text-base shadow-lg shadow-nature-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 flex-shrink-0"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="text-center text-[11px] text-nature-400 font-medium">
                        🎤 Click the mic to speak • 🔊 Hover over a response to listen • Switch language above
                    </p>
                </div>
            </div>

            <Footer />

            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
        </div>
    );
}
