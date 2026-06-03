import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import {
  FaSeedling, FaShieldAlt, FaChartLine, FaGlobe, FaRobot, FaFlask,
  FaStore, FaCloudSunRain, FaComments, FaGraduationCap, FaLandmark,
  FaMapMarkerAlt, FaUsersCog, FaUserTie, FaBuilding, FaTractor,
  FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import Agriculture from '@mui/icons-material/Agriculture';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const intelligenceSuite = [
    {
      title: 'Crop Recommendation',
      icon: <FaSeedling />,
      desc: 'AI-powered engine that analyzes your soil nutrients, climate data, and regional conditions to recommend the most profitable crops for your land.',
      path: '/crop-recommendation'
    },
    {
      title: 'Plant Disease Detection',
      icon: <FaShieldAlt />,
      desc: 'Upload a photo of any crop leaf and our deep learning model instantly identifies diseases, providing diagnosis and treatment recommendations.',
      path: '/plant-disease'
    },
    {
      title: 'Crop Yield Prediction',
      icon: <FaChartLine />,
      desc: 'Forecast your harvest volume before the season ends — powered by historical data, weather patterns, and soil quality analysis.',
      path: '/crop-yield'
    },
    {
      title: 'Aerial Land Analysis',
      icon: <FaGlobe />,
      desc: 'Satellite imagery and NDVI vegetation index analysis to monitor crop health, soil moisture, and land classification from above.',
      path: '/land-analysis'
    },
    {
      title: 'Fertilizer Advisor',
      icon: <FaFlask />,
      desc: 'Get optimal fertilizer recommendations based on temperature, humidity, moisture, soil type, crop type, and nutrient levels.',
      path: '/Fertilizer'
    },
    {
      title: 'AI Chatbot',
      icon: <FaRobot />,
      desc: 'A 24/7 multilingual farming assistant fluent in English, Hindi, Kannada, Telugu, and Tamil — your personal agri-expert on demand.',
      path: '/ai-chatbot'
    },
  ];

  const platformFeatures = [
    {
      title: 'Marketplace',
      icon: <FaStore />,
      desc: 'Buy & sell crops, pesticides, and machinery. Manage inventory, track orders, and connect directly with buyers and sellers.',
      path: '/market'
    },
    {
      title: 'Live Weather',
      icon: <FaCloudSunRain />,
      desc: 'Hyperlocal weather forecasts, rain alerts, and seasonal predictions to plan your farming activities with precision.',
      path: '/weather'
    },
    {
      title: 'Community Forum',
      icon: <FaComments />,
      desc: 'Real-time discussions with fellow farmers, agronomists, and experts. Share experiences, ask questions, and learn from the community.',
      path: '/forum'
    },
    {
      title: 'Education Hub',
      icon: <FaGraduationCap />,
      desc: 'Curated learning resources, farming tutorials, government scheme information, and best practices for modern agriculture.',
      path: '/education'
    },
    {
      title: 'Land Records',
      icon: <FaLandmark />,
      desc: 'Access state-wise government land records portals, understand land record terminology, and manage your property documents.',
      path: '/land-records'
    },
    {
      title: 'Nearby Stores',
      icon: <FaMapMarkerAlt />,
      desc: 'Find agricultural supply stores, seed shops, and equipment dealers near your location with live maps and directions.',
      path: '/nearby'
    },
  ];

  const roles = [
    {
      title: 'Farmer',
      icon: <FaTractor className="text-3xl" />,
      color: 'from-green-500 to-emerald-600',
      features: ['All AI tools & predictions', 'Marketplace buy & sell', 'Inventory management', 'Fertilizer recommendations', 'Community forum access']
    },
    {
      title: 'Retailer',
      icon: <FaUserTie className="text-3xl" />,
      color: 'from-blue-500 to-indigo-600',
      features: ['Marketplace management', 'Inventory tracking', 'Order management', 'AI Chatbot support', 'Community forum access']
    },
    {
      title: 'Government',
      icon: <FaBuilding className="text-3xl" />,
      color: 'from-amber-500 to-orange-600',
      features: ['AI crop & yield analysis', 'Aerial land monitoring', 'Disease detection oversight', 'Data-driven policy insights', 'Community engagement']
    },
  ];

  const techStack = [
    { label: 'Frontend', items: 'React · Tailwind CSS · Vite' },
    { label: 'Backend', items: 'Node.js · Express · Firebase' },
    { label: 'ML / AI', items: 'Flask · scikit-learn · TensorFlow · Gemini AI' },
    { label: 'APIs', items: 'OpenWeather · Sentinel-2 · Google Maps · Gemini' },
  ];

  return (
    <div className="bg-nature-50 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* ─── Hero Section ─── */}
        <section className="max-w-7xl mx-auto px-6 relative mb-24">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-nature-600/10 rounded-full blur-[100px] -z-0"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-20 w-72 h-72 bg-nature-400/10 rounded-full blur-[80px] -z-0"></div>

          <div className="text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-nature-100 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-nature-600 animate-pulse"></span>
              <span className="text-xs font-black text-nature-950 uppercase tracking-[0.2em]">About AgriOpti</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-nature-950 leading-tight">
              One Platform for <br />
              <span className="text-nature-600">All Agriculture</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-nature-700 font-medium leading-relaxed">
              AgriOpti is a comprehensive agricultural intelligence platform that unifies AI-powered
              crop analytics, a digital marketplace, real-time weather, community forums, and
              government land records — all in one place, for every stakeholder in the farming ecosystem.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {['6+ AI Models', '3 User Roles', '5 Languages', 'Satellite Analytics'].map((stat) => (
                <div key={stat} className="px-5 py-2.5 rounded-2xl bg-white border border-nature-100 shadow-sm">
                  <span className="text-sm font-black text-nature-950">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Mission Section ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden group border-white/40 shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Agriculture style={{ fontSize: 200 }} />
            </div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl font-black text-nature-950 uppercase tracking-tighter">Our Mission</h2>
              <div className="h-1.5 w-24 bg-nature-600 rounded-full"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <p className="text-lg text-nature-800 font-medium leading-relaxed">
                  We're bridging the technology gap in Indian agriculture. Every farmer — whether
                  managing 2 acres or 200 — deserves access to the same AI-driven insights, market
                  intelligence, and satellite monitoring that industrial farms use.
                </p>
                <p className="text-lg text-nature-800 font-medium leading-relaxed">
                  By combining machine learning, satellite imagery, weather APIs, and local expertise
                  across 5 languages, AgriOpti empowers sustainable farming decisions that increase
                  yields, reduce costs, and protect the environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Intelligence Suite ─── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-nature-400">Intelligence Suite</h2>
            <h3 className="text-4xl font-black text-nature-950">AI-Powered Agricultural Tools</h3>
            <p className="text-nature-600 font-medium max-w-2xl mx-auto">
              Six machine learning models working together to give you actionable insights — from what to plant to how to protect it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelligenceSuite.map((feature, idx) => (
              <Link
                to={feature.path}
                key={idx}
                className="group p-8 bg-white border border-nature-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-nature-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-nature-50 flex items-center justify-center text-2xl text-nature-500 mb-6 group-hover:bg-nature-600 group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-black text-nature-950 mb-3">{feature.title}</h4>
                <p className="text-sm text-nature-600 font-medium leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-black text-nature-500 uppercase tracking-widest group-hover:text-nature-600 transition-colors">
                  Try it <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Platform Features ─── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-nature-400">Platform Features</h2>
            <h3 className="text-4xl font-black text-nature-950">Everything Else a Farmer Needs</h3>
            <p className="text-nature-600 font-medium max-w-2xl mx-auto">
              Beyond AI, AgriOpti delivers a complete digital farm ecosystem — market, weather, community, education, and government services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, idx) => (
              <Link
                to={feature.path}
                key={idx}
                className="group p-8 bg-white border border-nature-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-nature-500/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-nature-50 flex items-center justify-center text-2xl text-nature-500 mb-6 group-hover:bg-nature-600 group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-black text-nature-950 mb-3">{feature.title}</h4>
                <p className="text-sm text-nature-600 font-medium leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-black text-nature-500 uppercase tracking-widest group-hover:text-nature-600 transition-colors">
                  Explore <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Role-Based Access ─── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-nature-400">Role-Based Access</h2>
            <h3 className="text-4xl font-black text-nature-950">Built for Every Stakeholder</h3>
            <p className="text-nature-600 font-medium max-w-2xl mx-auto">
              Each user role gets a tailored experience — the right tools, the right data, and the right access level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div
                key={idx}
                className="relative group bg-white border border-nature-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${role.color}`}></div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {role.icon}
                </div>
                <h4 className="text-xl font-black text-nature-950 mb-5">{role.title}</h4>
                <ul className="space-y-3">
                  {role.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheckCircle className="text-nature-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-nature-700 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Tech Stack ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-nature-400">Under the Hood</h2>
            <h3 className="text-4xl font-black text-nature-950">Technology Stack</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {techStack.map((tech, idx) => (
              <div key={idx} className="glass rounded-[2rem] p-6 border-white/40 shadow-lg text-center space-y-3">
                <h4 className="text-xs font-black text-nature-400 uppercase tracking-[0.3em]">{tech.label}</h4>
                <p className="text-sm font-bold text-nature-900">{tech.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-nature-950 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-nature-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-0 left-0 w-80 h-80 bg-nature-400/10 rounded-full blur-[120px]"></div>

            <h2 className="text-4xl md:text-5xl font-black text-white relative z-10">
              Start Your Digital Farm Today
            </h2>
            <p className="text-nature-400 max-w-xl mx-auto font-medium relative z-10">
              Whether you're a farmer looking for smarter decisions, a retailer managing supply chains,
              or a government body seeking data-driven insights — AgriOpti has you covered.
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/home"
                className="bg-nature-600 hover:bg-nature-500 text-white font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl transition-all shadow-xl shadow-nature-600/30"
              >
                Explore Now
              </Link>

              <Link
                to="/developers"
                className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl transition-all border border-white/20"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
