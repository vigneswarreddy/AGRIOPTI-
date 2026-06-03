import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import {
    FaLandmark, FaMapMarkedAlt, FaExternalLinkAlt, FaInfoCircle,
    FaLanguage, FaArrowRight, FaShieldAlt, FaBriefcase, FaChevronRight
} from 'react-icons/fa';

// ── Fix 7: Bilingual translations (English ⇔ Hindi) ─────────────────────────────
// Text is stored per language; components read from TRANSLATIONS[language] at render time
const TRANSLATIONS = {
    English: {
        heroTag: 'Secure Land Governance',
        heroTitle: ['Digital', 'Records Portal'],
        heroSubtitle: 'Single-window access to authenticated government land records. Secure redirection, AI-assisted record analysis, and satellite-based boundary verification.',
        recordTypesBtn: 'Record Types Explained',
        translateBtn: 'Translate to Hindi',
        selectStateTitle: 'Select Your State',
        selectStateSubtitle: 'Official Government Integration',
        offlineTitle: 'Offline Guidance',
        offlineTips: [
            'Visit the local Tahsildar or Mandal Revenue Office (MRO) for physical verification.',
            'Provide original Identity Proof (Aadhaar/Voter ID) and registered Sale Deed.',
            'Estimated timeline for mutation: 15-30 working days.',
        ],
        authenticatedTag: 'Authenticated Access',
        visitPortal: 'Visit Official Portal',
        securityNote: 'You are about to be redirected to an official government portal. AgriOpti does not store your login credentials or personal land data.',
        glossaryTitle: 'Terminologies Explainer',
        mutationLabel: 'Mutation',
        mutationDesc: 'The process of changing the name of the owner in the land records after a sale or inheritance.',
        khataLabel: 'Khata Number',
        khataDesc: 'An account number allotted to a family that indicates the entire land holding of that family.',
        glossaryNote: 'Always verify with the local Tahsildar for legal disputes.',
    },
    Hindi: {
        heroTag: 'सुरक्षित भूमि प्रशासन',
        heroTitle: ['डिजिटल', 'रिकॉर्ड पोर्टल'],
        heroSubtitle: 'प्रमाणित सरकारी भूमि रिकॉर्ड तक एकल-खिड़की पहुंच। सुरक्षित पुनर्निर्देशन, AI-सहायता प्राप्त रिकॉर्ड विश्लेषण और उपग्रह-आधारित सीमा सत्यापन।',
        recordTypesBtn: 'रिकॉर्ड प्रकार समझाएं',
        translateBtn: 'अंग्रेजी में वापस जाएं',
        selectStateTitle: 'अपना राज्य चुनें',
        selectStateSubtitle: 'आधिकारिक सरकारी एकीकरण',
        offlineTitle: 'ऑफ़लाइन मार्गदर्शन',
        offlineTips: [
            'भौतिक सत्यापन के लिए स्थानीय तहसीलदार या मंडल राजस्व कार्यालय (MRO) जाएं।',
            'मूल पहचान प्रमाण (आधार/मतदाता पहचान पत्र) और पंजीकृत बिक्री विलेख प्रदान करें।',
            'म्यूटेशन की अनुमानित समयसीमा: 15-30 कार्य दिवस।',
        ],
        authenticatedTag: 'प्रमाणित पहुंच',
        visitPortal: 'आधिकारिक पोर्टल पर जाएं',
        securityNote: 'आपको एक आधिकारिक सरकारी पोर्टल पर पुनर्निर्देशित किया जाएगा। AgriOpti आपके लॉगिन क्रेडेंशियल या व्यक्तिगत भूमि डेटा संग्रहीत नहीं करता है।',
        glossaryTitle: 'शब्दावली व्याख्याकर्ता',
        mutationLabel: 'म्यूटेशन',
        mutationDesc: 'बिक्री या विरासत के बाद भूमि अभिलेखों में स्वामी का नाम बदलने की प्रक्रिया।',
        khataLabel: 'खाता संख्या',
        khataDesc: 'एक परिवार को आवंटित खाता संख्या जो उस परिवार की संपूर्ण भूमि जोत दर्शाती है।',
        glossaryNote: 'कानूनी विवादों के लिए हमेशा स्थानीय तहसीलदार से सत्यापित करें।',
    },
};

// Hindi record translations keyed by record name
const RECORD_TRANSLATIONS = {
    Hindi: {
        // Andhra Pradesh
        'Adangal (Pahani)': { name: 'अडंगल (पहानी)', description: 'गांव, भूमि और मालिक के बारे में विवरण।' },
        '1B Record': { name: '1बी रिकॉर्ड', description: 'एक विशिष्ट किसान के लिए अधिकार का रिकॉर्ड (RoR)।' },
        'FMB': { name: 'FMB', description: 'फील्ड माप पुस्तक जो भूमि सीमाएं दर्शाती है।' },
        'Village Map': { name: 'ग्राम मानचित्र', description: 'गांव का भौगोलिक विभाजन।' },
        // Telangana
        'Pattadar Passbook': { name: 'पट्टादार पासबुक', description: 'भूमि के लिए आधिकारिक स्वामित्व दस्तावेज।' },
        'Land Status': { name: 'भूमि स्थिति', description: 'मुकदमेबाजी या पंजीकरण स्थिति की जानकारी।' },
        'Mutation Status': { name: 'म्यूटेशन स्थिति', description: 'संपत्ति स्वामित्व हस्तांतरण की ट्रैकिंग।' },
        // Karnataka
        'RTC': { name: 'आरटीसी', description: 'अधिकार, किरायेदारी और फसल का रिकॉर्ड (पहानी)।' },
        'Mutation Report': { name: 'म्यूटेशन रिपोर्ट', description: 'हाल के भूमि स्वामित्व परिवर्तनों का विवरण।' },
        'Survey Map': { name: 'सर्वेक्षण मानचित्र', description: 'विशिष्ट सर्वेक्षण संख्याओं के लिए डिजिटल सर्वेक्षण रेखाचित्र।' },
        // Tamil Nadu
        'Patta / Chitta': { name: 'पट्टा / चिट्टा', description: 'कानूनी स्वामित्व और भूमि राजस्व रिकॉर्ड।' },
        'FMB Sketch': { name: 'FMB स्केच', description: 'भूमि क्षेत्र के लिए फील्ड माप रेखाचित्र।' },
        'TSLR Extract': { name: 'TSLR अर्क', description: 'शहरी क्षेत्रों के लिए टाउन सर्वे भूमि रिकॉर्ड।' },
        // Maharashtra
        '7/12 Extract': { name: '7/12 अर्क', description: 'भूमि विवरण वाला प्राथमिक कानूनी दस्तावेज।' },
        '8A Extract': { name: '8A अर्क', description: 'मालिक की कुल भूमि जोत का सारांश।' },
        'Property Card': { name: 'संपत्ति कार्ड', description: 'शहरी संपत्ति विवरण और स्वामित्व।' },
    }
};

const statesConfig = {
    'Andhra Pradesh': {
        portal: 'MeeBhoomi',
        url: 'https://meebhoomi.ap.gov.in/',
        records: [
            { name: 'Adangal (Pahani)', description: 'Details about the village, land, and owner.' },
            { name: '1B Record', description: 'Record of Rights (RoR) for a specific farmer.' },
            { name: 'FMB', description: 'Field Measurement Book showing land boundaries.' },
            { name: 'Village Map', description: 'Geographical breakdown of the village.' }
        ],
        extra: 'Direct redirection to MeeBhoomi portal with GPS pre-fill support.'
    },
    'Telangana': {
        portal: 'Dharani',
        url: 'https://dharani.telangana.gov.in/',
        records: [
            { name: 'Pattadar Passbook', description: 'Official ownership document for the land.' },
            { name: 'Land Status', description: 'Information on litigation or registration status.' },
            { name: 'Mutation Status', description: 'Tracking the transfer of property ownership.' }
        ],
        extra: 'Transaction tracking for Dharani services included.'
    },
    'Karnataka': {
        portal: 'Bhoomi',
        url: 'https://landrecords.karnataka.gov.in/',
        records: [
            { name: 'RTC', description: 'Record of Rights, Tenancy & Crops (Pahani).' },
            { name: 'Mutation Report', description: 'Details of recent land ownership changes.' },
            { name: 'Survey Map', description: 'Digital survey sketches for specific survey numbers.' }
        ],
        extra: 'Official repository for all Karnataka agricultural land records.'
    },
    'Tamil Nadu': {
        portal: 'TN Land Records',
        url: 'https://eservices.tn.gov.in/',
        records: [
            { name: 'Patta / Chitta', description: 'Legal ownership and land revenue records.' },
            { name: 'FMB Sketch', description: 'Field measurement sketches for land area.' },
            { name: 'TSLR Extract', description: 'Town Survey Land Record for urban areas.' }
        ],
        extra: 'Supports both urban and rural land classification.'
    },
    'Maharashtra': {
        portal: 'MahaBhulekh',
        url: 'https://bhulekh.mahabhumi.gov.in/',
        records: [
            { name: '7/12 Extract', description: 'Primary legal document containing land details.' },
            { name: '8A Extract', description: 'Summary of total land holdings of an owner.' },
            { name: 'Property Card', description: 'Urban property details and ownership.' }
        ],
        extra: 'Available in Marathi and English.'
    }
};

const LandRecords = () => {
    const [selectedState, setSelectedState] = useState('Andhra Pradesh');
    const [language, setLanguage] = useState('English');
    const [showGlossary, setShowGlossary] = useState(false);

    // Helper: get translated record for current language
    const tr = TRANSLATIONS[language];
    const getRecord = (rec) => {
        if (language === 'Hindi' && RECORD_TRANSLATIONS.Hindi[rec.name]) {
            return RECORD_TRANSLATIONS.Hindi[rec.name];
        }
        return { name: rec.name, description: rec.description };
    };

    // Auto-detect state (simplified mock for demo)
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                // In a real app, use reverse geocoding to find state
                console.log("GPS Location detected", position.coords);
            });
        }
    }, []);

    const redirectToPortal = () => {
        window.open(statesConfig[selectedState].url, '_blank');
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#F8FAF9]">
            <Navbar />

            <main className="flex-grow pt-[88px]">
                {/* Hero Section */}
                <div className="bg-nature-950 text-white relative py-24 px-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nature-500 to-transparent"></div>
                    </div>
                    <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-nature-300 text-[10px] font-black uppercase tracking-[0.4em]">
                            <FaShieldAlt className="text-nature-400" /> {tr.heroTag}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none uppercase">
                            Digital <span className="text-nature-400">{tr.heroTitle[1]}</span>
                        </h1>
                        <p className="text-nature-300 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
                            {tr.heroSubtitle}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <button
                                onClick={() => setShowGlossary(!showGlossary)}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all text-sm font-bold"
                            >
                                <FaInfoCircle /> {tr.recordTypesBtn}
                            </button>
                            <button
                                onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
                                className="px-6 py-3 bg-nature-600 text-white rounded-2xl flex items-center gap-3 hover:bg-nature-500 transition-all text-sm font-bold shadow-lg shadow-nature-900/40"
                            >
                                <FaLanguage size={18} /> {tr.translateBtn}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Left Column: State Selection */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-nature-100 shadow-xl shadow-nature-900/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-nature-100 rounded-2xl flex items-center justify-center text-nature-600">
                                        <FaMapMarkedAlt size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-black text-xl text-nature-950 uppercase tracking-tight">{tr.selectStateTitle}</h3>
                                        <p className="text-[10px] text-nature-500 font-bold uppercase tracking-widest">{tr.selectStateSubtitle}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {Object.keys(statesConfig).map(state => (
                                        <button
                                            key={state}
                                            onClick={() => setSelectedState(state)}
                                            className={`w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group ${selectedState === state
                                                ? 'border-nature-600 bg-nature-50 text-nature-900 shadow-md shadow-nature-900/5'
                                                : 'border-transparent bg-nature-50/30 text-nature-400 hover:bg-nature-50 hover:text-nature-600'
                                                }`}
                                        >
                                            <span className="font-bold text-sm tracking-tight">{state}</span>
                                            <FaChevronRight className={`transition-all duration-300 ${selectedState === state ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Offline Help */}
                            <div className="bg-[#FFF9F2] rounded-[2.5rem] p-8 border border-orange-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                        <FaBriefcase />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-tight text-orange-900">{tr.offlineTitle}</h3>
                                </div>
                                <ul className="space-y-4">
                                    {tr.offlineTips.map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-xs font-medium text-orange-800/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Portal Info & Access */}
                        <div className="lg:col-span-7 h-full">
                            <div className="bg-nature-950 rounded-[3.5rem] p-12 text-white h-full relative overflow-hidden flex flex-col justify-between border border-nature-600/20 shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/10 rounded-bl-[10rem] -mr-16 -mt-16"></div>

                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-nature-400/10 border border-nature-400/20 text-nature-400 text-[10px] font-black uppercase tracking-widest">
                                            <FaLandmark /> {tr.authenticatedTag}
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-heading font-black italic text-white leading-none">
                                            {statesConfig[selectedState].portal}
                                        </h2>
                                        <p className="text-nature-400 text-lg font-medium leading-relaxed max-w-xl">
                                            {statesConfig[selectedState].extra}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {statesConfig[selectedState].records.map((rec, idx) => {
                                            const translated = getRecord(rec);
                                            return (
                                                <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                                    <h4 className="font-black text-sm uppercase tracking-tight text-nature-300 group-hover:text-nature-400 transition-colors mb-2">{translated.name}</h4>
                                                    <p className="text-[11px] text-nature-500 font-medium leading-relaxed">{translated.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="relative z-10 mt-12 space-y-6">
                                    <div className="p-6 rounded-3xl bg-nature-400/10 border border-nature-400/20 flex items-start gap-4">
                                        <FaShieldAlt className="text-nature-400 mt-1" size={20} />
                                        <p className="text-xs text-nature-300 font-medium leading-relaxed">
                                            {tr.securityNote}
                                        </p>
                                    </div>
                                    <button
                                        onClick={redirectToPortal}
                                        className="w-full py-6 bg-nature-500 hover:bg-nature-400 transition-all rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-nature-950/20 active:scale-[0.98]"
                                    >
                                        {tr.visitPortal} <FaExternalLinkAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glossary Overlay */}
                {showGlossary && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <div className="absolute inset-0 bg-nature-950/80 backdrop-blur-xl" onClick={() => setShowGlossary(false)}></div>
                        <div className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                            <div className="p-10 border-b border-nature-100 flex items-center justify-between">
                                <h3 className="text-3xl font-heading font-black text-nature-950 uppercase italic">{tr.glossaryTitle}</h3>
                                <button onClick={() => setShowGlossary(false)} className="w-12 h-12 rounded-full bg-nature-50 flex items-center justify-center text-nature-600 hover:bg-nature-100 transition-colors">&times;</button>
                            </div>
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
                                {statesConfig[selectedState].records.map(rec => {
                                    const translated = getRecord(rec);
                                    return (
                                        <div key={rec.name} className="p-6 rounded-3xl bg-nature-50 border border-nature-100 space-y-2">
                                            <h4 className="font-black text-nature-950 uppercase text-sm tracking-tight">{translated.name}</h4>
                                            <p className="text-xs text-nature-600 font-medium leading-relaxed">{translated.description}</p>
                                        </div>
                                    );
                                })}
                                <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100 space-y-2">
                                    <h4 className="font-black text-orange-900 uppercase text-sm tracking-tight">{tr.mutationLabel}</h4>
                                    <p className="text-xs text-orange-800/80 font-medium leading-relaxed">{tr.mutationDesc}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100 space-y-2">
                                    <h4 className="font-black text-orange-900 uppercase text-sm tracking-tight">{tr.khataLabel}</h4>
                                    <p className="text-xs text-orange-800/80 font-medium leading-relaxed">{tr.khataDesc}</p>
                                </div>
                            </div>
                            <div className="p-10 bg-nature-50 text-center">
                                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest">{tr.glossaryNote}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default LandRecords;
