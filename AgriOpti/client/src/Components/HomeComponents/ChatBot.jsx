import React, { useState, useEffect, useRef } from 'react';
import bot from '../../assets/chatbot.png';

const FAQ_POOL = {
    en: [
        { q: "How to improve soil fertility?", a: "• Use organic matter like compost\n• Rotate crops regularly\n• Apply fertilizers based on soil tests", tags: ["soil", "fertility", "improve", "compost", "health"] },
        { q: "Which crop is best for this season?", a: "• Kharif (Rice, Maize) for Monsoon\n• Rabi (Wheat, Mustard) for Winter\n• Jayad (Moong) for Summer", tags: ["crop", "season", "best", "kharif", "rabi", "summer"] },
        { q: "How to control pests in tomatoes?", a: "• Spray Neem oil every 7 days\n• Remove infected leaves immediately\n• Maintain proper spacing", tags: ["tomato", "pest", "insect", "control", "neem"] },
        { q: "Best time to apply urea?", a: "• 50% during sowing (Basal dose)\n• Rest in two top-dressings at 30 & 60 days", tags: ["urea", "fertilizer", "apply", "time", "dosage"] },
        { q: "Government schemes for farmers?", a: "• PM-KISAN (Income support)\n• PMFBY (Fasal Bima/Insurance)\n• Soil Health Card scheme", tags: ["government", "scheme", "help", "pm-kisan", "insurance"] }
    ],
    hi: [
        { q: "मिट्टी की उर्वरता कैसे सुधारें?", a: "• जैविक खाद (कंपोस्ट) का उपयोग करें\n• नियमित रूप से फसल चक्र अपनाएं\n• मिट्टी परीक्षण के आधार पर उर्वरक डालें", tags: ["मिट्टी", "उर्वरता", "सुधार", "खाद", "स्वास्थ्य"] },
        { q: "इस मौसम के लिए कौन सी फसल सबसे अच्छी है?", a: "• मानसून के लिए खरीफ (चावल, मक्का)\n• सर्दियों के लिए रबी (गेहूं, सरसों)\n• गर्मियों के लिए जायद (मूंग)", tags: ["फसल", "मौसम", "खरीफ", "रबी", "गर्मी"] },
        { q: "टमाटर में कीटों को कैसे नियंत्रित करें?", a: "• हर 7 दिन में नीम तेल का छिड़काव करें\n• संक्रमित पत्तियों को तुरंत हटाएं\n• पौधों के बीच उचित दूरी रखें", tags: ["टमाटर", "कीट", "रोक", "नीम", "नियंत्रण"] },
        { q: "यूरिया लगाने का सबसे अच्छा समय?", a: "• 50% बुवाई के दौरान (आधार खुराक)\n• बाकी दो टॉप-ड्रेसिंग 30 और 60 दिनों में", tags: ["यूरिया", "उर्वरक", "समय", "खुराक"] },
        { q: "किसानों के लिए सरकारी योजनाएं?", a: "• पीएम-किसान (आय सहायता)\n• पीएमएफबीवाई (फसल बीमा)\n• मृदा स्वास्थ्य कार्ड योजना", tags: ["सरकारी", "योजना", "मदद", "पीएम-किसान", "बीमा"] }
    ],
    te: [
        { q: "నేల సారాన్ని ఎలా పెంచాలి?", a: "• సేంద్రియ ఎరువులు (కంపోస్ట్) వాడండి\n• క్రమం తప్పకుండా పంట మార్పిడి చేయండి\n• నేల పరీక్షల ప్రకారం ఎరువులు వేయండి", tags: ["నేల", "సారం", "పెంచడం", "ఎరువులు", "ఆరోగ్యం"] },
        { q: "ఈ సీజన్‌కు ఏ పంట ఉత్తమం?", a: "• వర్షాకాలంలో ఖరీఫ్ (వరి, మొక్కజన్న)\n• శీతాకాలంలో రబీ (గోధుమ, ఆవాలు)\n• వేసవిలో జాయద్ (పెసర)", tags: ["పంట", "సీజన్", "ఖరీఫ్", "రబీ", "వేసవి"] },
        { q: "టమోటాలో చీడపీడలను ఎలా అరికట్టాలి?", a: "• ప్రతి 7 రోజులకు వేప నూనె వాడండి\n• సోకిన ఆకులను వెంటనే తొలగించండి\n• మొక్కల మధ్య తగినంత దూరం ఉంచండి", tags: ["టమోటా", "చీడపీడలు", "నివారణ", "వేప", "నియంత్రణ"] },
        { q: "యూరియా వేయడానికి సరైన సమయం ఏది?", a: "• 50% విత్తే సమయంలో (బేసల్ డోస్)\n• మిగిలినది 30 & 60 రోజులలో రెండు దఫాలుగా", tags: ["యూరియా", "ఎరువు", "సమయం", "మోతాదు"] },
        { q: "రైతులకు ఉన్న ప్రభుత్వ పథకాలు ఏమిటి?", a: "• పీఎం-కిసాన్ (ఆదాయ మద్దతు)\n• పీఎంఎఫ్‌బీవై (పంట భీమా)\n• సాయిల్ హెల్త్ కార్డ్ పథకం", tags: ["ప్రభుత్వ", "పథకాలు", "సహాయం", "పీఎం-కిసాన్", "భీమా"] }
    ],
    ta: [
        { q: "மண்ணின் வளத்தை மேம்படுத்துவது எப்படி?", a: "• மண்புழு உரம் போன்ற இயற்கை உரங்களைப் பயன்படுத்தவும்\n• பயிர் சுழற்சி முறையைப் பின்பற்றவும்\n• மண் பரிசோதனைப்படி உரமிடவும்", tags: ["மண்", "வளம்", "மேம்படுத்து", "உரம்", "ஆரோக்கியம்"] },
        { q: "இந்த பருவத்திற்கு எந்த பயிர் சிறந்தது?", a: "• காரிஃப் (நெல், சோளம்) - பருவமழை\n• ரபி (கோதுமை, கடுகு) - குளிர்\n• ஜயத் (பயறு) - கோடை", tags: ["பயிர்", "பருவம்", "காரிஃப்", "ரபி", "கோடை"] },
        { q: "தக்காளியில் பூச்சிகளைக் கட்டுப்படுத்துவது எப்படி?", a: "• 7 நாட்களுக்கு ஒருமுறை வேப்ப எண்ணெய் தெளிக்கவும்\n• பாதிக்கப்பட்ட இலைகளை உடனே அகற்றவும்\n• சரியான இடைவெளி விடவும்", tags: ["தக்காளி", "பூச்சி", "கட்டுப்பாடு", "வேம்பு", "நிவாரணம்"] },
        { q: "யுரியா போட சிறந்த நேரம் எது?", a: "• 50% விதைக்கும் போது (அடிப்படை அளவு)\n• மீதமுள்ளதை 30 மற்றும் 60 நாட்களில் இருமுறை", tags: ["யுரியா", "உரம்", "நேரம்", "அளவு"] },
        { q: "விவசாயிகளுக்கான அரசு திட்டங்கள் என்ன?", a: "• பி.எம்-கிசான் (வருமான உதவி)\n• பி.எம்.எப்.பி.ஒய் (காப்பீடு)\n• மண் வள அட்டை திட்டம்", tags: ["அரசு", "திட்டம்", "உதவி", "விவசாயி", "காப்பீடு"] }
    ],
    ml: [
        { q: "മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത എങ്ങനെ വർദ്ധിപ്പിക്കാം?", a: "• ജൈവവളങ്ങൾ (കമ്പോസ്റ്റ്) ഉപയോഗിക്കുക\n• വിള പരിക്രമണം നടത്തുക\n• മണ്ണ് പരിശോധന പ്രകാരം വളം നൽകുക", tags: ["മണ്ണ്", "ഗുണം", "വളരുക", "വളം", "ആരോഗ്യം"] },
        { q: "ഈ സീസണിൽ ഏത് വിളയാണ് നല്ലത്?", a: "• മഴക്കാലത്ത് ഖാരിഫ് (നെല്ല്, ചോളം)\n• ശൈത്യകാലത്ത് റാബി (ഗോതമ്പ്, കടുക്)\n• വേനൽക്കാലത്ത് സെയ്ദ് (പയർ വർഗ്ഗങ്ങൾ)", tags: ["വിള", "സീസൺ", "ഖാരിഫ്", "റാബി", "വേനൽ"] },
        { q: "തക്കാളിയിലെ കീടങ്ങളെ എങ്ങനെ നിയന്ത്രിക്കാം?", a: "• ഓരോ 7 ദിവസത്തിലും വേപ്പെണ്ണ പ്രയോഗിക്കുക\n• രോഗം ബാധിച്ച ഇലകൾ നീക്കം ചെയ്യുക\n• കൃത്യമായ അകലം പാലിക്കുക", tags: ["തക്കാളി", "കീടം", "നിയന്ത്രണം", "വേപ്പെണ്ണ", "പരിരക്ഷ"] },
        { q: "യൂറിയ പ്രയോഗിക്കാൻ ഏറ്റവും അനുയോജ്യമായ സമയം?", a: "• 50% വിതയ്ക്കുമ്പോൾ (ബേസൽ ഡോസ്)\n• ബാക്കി 30, 60 ദിവസങ്ങളിൽ രണ്ടു തവണയായി", tags: ["യൂറിയ", "വളം", "സമയം", "അളവ്"] },
        { q: "കർഷകർക്കുള്ള സർക്കാർ പദ്ധതികൾ ഏതൊക്കെ?", a: "• പിഎം-കിസാൻ (ധനസഹായം)\n• പിഎംഎഫ്ബിവൈ (ഇൻഷുറൻസ്)\n• സോയിൽ ഹെൽത്ത് കാർഡ് സ്കീം", tags: ["സർക്കാർ", "പദ്ധതി", "സഹായം", "പിഎം-കിസാൻ", "ഇൻഷുറൻസ്"] }
    ]
};

const FALLBACK_MSGS = {
    en: "Sorry, this information is not available. Please select from available topics.",
    hi: "क्षमा करें, यह जानकारी उपलब्ध नहीं है। कृपया उपलब्ध विषयों में से चुनें।",
    te: "క్షమించండి, ఈ సమాచారం అందుబాటులో లేదు. దయచేసి అందుబాటులో ఉన్న విషయాలలో ఒకటి ఎంచుకోండి.",
    ta: "மன்னிக்கவும், இந்த தகவல் கிடைக்கவில்லை. தயவுசெய்து கிடைக்கும் தலைப்புகளில் ஒன்றைத் தேர்வு செய்யவும்.",
    ml: "ക്ഷമിക്കണം, ഈ വിവരങ്ങൾ ലഭ്യമല്ല. ദയവായി ലഭ്യമായ विषयोंങ്ങളിൽ നിന്ന് തിരഞ്ഞെടുക്കുക."
};

const detectLanguage = (text) => {
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
    return 'en';
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [lang, setLang] = useState('en');
    const chatBoxRef = useRef(null);

    const appendMessage = (message, sender) => {
        setMessages(prev => [...prev, { text: message, sender }]);
    };

    const handleUserInput = (text) => {
        const message = (text || userInput).trim();
        if (!message) return;

        appendMessage(message, 'user');
        setUserInput('');

        const detectedLang = detectLanguage(message);
        setLang(detectedLang);

        const normalizedMsg = message.toLowerCase();
        let matchedFAQ = null;

        // Search primary (detected) language
        const searchPool = FAQ_POOL[detectedLang];
        matchedFAQ = searchPool.find(f =>
            normalizedMsg.includes(f.q.toLowerCase()) ||
            f.tags.some(tag => normalizedMsg.includes(tag.toLowerCase()))
        );

        // Cross-language fallback
        if (!matchedFAQ) {
            for (const l of Object.keys(FAQ_POOL)) {
                if (l === detectedLang) continue;
                const altMatch = FAQ_POOL[l].find(f =>
                    f.tags.some(tag => normalizedMsg.includes(tag.toLowerCase()))
                );
                if (altMatch) {
                    const idx = FAQ_POOL[l].indexOf(altMatch);
                    matchedFAQ = FAQ_POOL[detectedLang][idx];
                    break;
                }
            }
        }

        setTimeout(() => {
            if (matchedFAQ) {
                appendMessage(matchedFAQ.a, 'bot');
            } else {
                appendMessage(FALLBACK_MSGS[detectedLang], 'bot');
            }
        }, 600);
    };

    const handleFAQClick = (faq) => {
        appendMessage(faq.q, 'user');
        setTimeout(() => appendMessage(faq.a, 'bot'), 500);
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg = lang === 'en' ? "Welcome! How can I help you today?" : "आपका स्वागत है! मैं आपकी क्या मदद कर सकता हूँ?";
            appendMessage(welcomeMsg, 'bot');
        }
    }, [isOpen, lang]);

    return (
        <div className="fixed bottom-[20px] right-[20px] z-50">
            <button
                className="bg-center bg-contain bg-no-repeat bg-white/80 backdrop-blur-sm p-3 w-[70px] h-[70px] rounded-full shadow-2xl border-2 border-emerald-500 hover:scale-110 transition-transform focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                style={{ backgroundImage: `url(${bot})` }}
            >
            </button>

            {isOpen && (
                <div className="bg-white border border-nature-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2rem] mt-4 w-[350px] overflow-hidden animate-in slide-in-from-bottom duration-300">
                    <div className="bg-gradient-to-r from-emerald-600 to-nature-800 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img loading="lazy" src={bot} alt="bot" className="w-8 h-8 rounded-full bg-white p-1" />
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight">AgriBot FAQ</p>
                                <p className="text-[10px] text-emerald-100 font-bold opacity-80 uppercase">5 Languages Supported</p>
                            </div>
                        </div>
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="bg-white text-black border border-gray-300 rounded-lg text-[12px] p-1 outline-none font-semibold"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="te">తెలుగు</option>
                            <option value="ta">தமிழ்</option>
                            <option value="ml">മലയാളം</option>
                        </select>
                    </div>

                    <div ref={chatBoxRef} className="overflow-y-auto h-[400px] p-4 bg-nature-50/50 custom-scrollbar space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-medium shadow-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                                        ? 'bg-emerald-600 text-white rounded-tr-none font-bold'
                                        : 'bg-white text-nature-800 border border-nature-100 rounded-tl-none font-semibold'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-nature-100 space-y-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {FAQ_POOL[lang].map((faq, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleFAQClick(faq)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold hover:bg-emerald-100 transition-colors shrink-0"
                                >
                                    {faq.q}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-nature-50 border border-nature-200 p-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                placeholder={lang === 'hi' ? "प्रश्न लिखें..." : "Type a question..."}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                            />
                            <button
                                className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all font-black"
                                onClick={() => handleUserInput()}
                            >
                                ➔
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
