import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaServer, FaBrain, FaDatabase, FaArrowLeft } from 'react-icons/fa';

const Developers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const developers = [
    {
      name: 'Adhi Neeraja',
      role: 'Frontend & UI/UX Engineer',
      image: '', // Replace with actual image path e.g. '/images/dev1.jpg'
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/',
      email: 'dev1@example.com',
      icon: <FaCode />,
      gradient: 'from-emerald-400 to-green-600',
      contributions: [
        'Designed and built the complete React frontend with Vite & Tailwind CSS',
        'Created the responsive Navbar, Dashboard, and all page layouts',
        'Implemented role-based UI rendering for Farmer, Retailer & Government',
        'Developed the Education Hub and Community Forum interfaces',
        'Crafted the glassmorphism design system and micro-animations',
      ]
    },
    {
      name: 'CH Mounika Begum',
      role: 'Backend & API Engineer',
      image: '', // Replace with actual image path
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/',
      email: 'dev2@example.com',
      icon: <FaBrain />,
      gradient: 'from-violet-400 to-purple-600',
      contributions: [
        'Architected the Node.js & Express REST API backend',
        'Set up Firebase authentication and database integration',
        'Built the Flask ML API server for model serving & predictions',
        'Implemented the Marketplace backend with inventory & order management',
        'Developed role-based access control (RBAC) and protected routes',
      ]
    },
    {
      name: 'K Vigneswara Reddy',
      role: 'ML & AI Engineer',
      image: '', // Replace with actual image path
      github: 'https://github.com/vigneswarreddy',
      linkedin: 'https://www.linkedin.com/in/k-vigneswara-reddy/',
      email: 'vigneswarreddy.2005@gmail.com',
      icon: <FaServer />,
      gradient: 'from-blue-400 to-indigo-600',
      contributions: [
        'Built the Crop Recommendation model using soil & climate data analysis',
        'Developed the Plant Disease Detection system with deep learning (CNN)',
        'Created the Crop Yield Prediction model for harvest forecasting',
        'Engineered the Fertilizer Advisor with RandomForest classification',
        'Integrated Gemini AI for the multilingual AI Chatbot (EN/HI/KN/TE/TA)',
      ]
    },
    {
      name: 'R Henry Koushal',
      role: 'Data & Integration Engineer',
      image: '', // Replace with actual image path
      github: 'https://github.com/HenryKoushal',
      linkedin: 'https://www.linkedin.com/in/henry-koushal/',
      email: 'henrykoushal@gmail.com',
      icon: <FaDatabase />,
      gradient: 'from-amber-400 to-orange-600',
      contributions: [
        'Integrated Sentinel-2 satellite imagery for Aerial Land Analysis & NDVI',
        'Built the Live Weather module with OpenWeather API integration',
        'Developed the Land Records portal with state-wise government links',
        'Implemented the Nearby Stores feature with Google Maps integration',
        'Set up multi-language support (i18n) across the entire platform',
      ]
    },
  ];

  return (
    <div className="bg-nature-50 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 relative mb-20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-nature-600/10 rounded-full blur-[100px] -z-0"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-20 w-72 h-72 bg-violet-400/10 rounded-full blur-[80px] -z-0"></div>

          <div className="text-center space-y-6 relative z-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs font-black text-nature-500 uppercase tracking-widest hover:text-nature-600 transition-colors mb-4"
            >
              <FaArrowLeft /> Back to About
            </Link>

            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-nature-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-nature-600 animate-pulse"></span>
              <span className="text-xs font-black text-nature-950 uppercase tracking-[0.2em]">Meet the Team</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-nature-950 leading-tight">
              Built with <span className="text-nature-600">Passion</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-nature-700 font-medium leading-relaxed">
              AgriOpti was crafted by a team of four developers who share a common vision —
              leveraging technology to empower agriculture. Every line of code is a collaborative effort.
            </p>
          </div>
        </section>

        {/* Developer Cards */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developers.map((dev, idx) => (
              <div
                key={idx}
                className="group relative bg-white border border-nature-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${dev.gradient}`}></div>

                <div className="p-8 md:p-10">
                  {/* Profile Row */}
                  <div className="flex items-start gap-6 mb-8">
                    {/* Avatar */}
                    <div className={`w-24 h-24 rounded-[1.5rem] bg-gradient-to-br ${dev.gradient} flex items-center justify-center text-white text-4xl shrink-0 shadow-lg overflow-hidden`}>
                      {dev.image ? (
                        <img loading="lazy" src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                      ) : (
                        dev.icon
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-nature-950 mb-1">{dev.name}</h3>
                      <p className="text-sm font-bold text-nature-500 uppercase tracking-widest mb-4">{dev.role}</p>

                      {/* Social Links */}
                      <div className="flex items-center gap-3">
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-nature-50 flex items-center justify-center text-nature-600 hover:bg-nature-600 hover:text-white transition-all duration-300"
                        >
                          <FaGithub />
                        </a>
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-nature-50 flex items-center justify-center text-nature-600 hover:bg-nature-600 hover:text-white transition-all duration-300"
                        >
                          <FaLinkedin />
                        </a>
                        <a
                          href={`mailto:${dev.email}`}
                          className="w-9 h-9 rounded-xl bg-nature-50 flex items-center justify-center text-nature-600 hover:bg-nature-600 hover:text-white transition-all duration-300"
                        >
                          <FaEnvelope />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contributions */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-nature-400 uppercase tracking-[0.3em]">Contributions</h4>
                    <ul className="space-y-2.5">
                      {dev.contributions.map((contribution, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${dev.gradient} mt-2 shrink-0`}></span>
                          <span className="text-sm text-nature-700 font-medium leading-relaxed">{contribution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Philosophy */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="bg-nature-950 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-nature-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-0 left-0 w-60 h-60 bg-violet-500/10 rounded-full blur-[80px]"></div>

            <h2 className="text-3xl md:text-4xl font-black text-white relative z-10">
              Equal Effort, Shared Vision
            </h2>
            <p className="text-nature-400 max-w-2xl mx-auto font-medium relative z-10 leading-relaxed">
              Every feature in AgriOpti is the result of collaborative teamwork. From brainstorming sessions
              to late-night debugging, each team member contributed equally to bring this platform to life.
              We believe that the best technology is built together.
            </p>
            <div className="relative z-10 pt-2">
              <Link
                to="/about"
                className="bg-nature-600 hover:bg-nature-500 text-white font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl transition-all shadow-xl shadow-nature-600/30 inline-block"
              >
                About AgriOpti
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Developers;
