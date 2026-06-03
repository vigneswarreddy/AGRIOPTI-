import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUserCircle, FaBars, FaTimes, FaSearch, FaLeaf, FaMicrochip, FaChartLine, FaStore, FaGraduationCap, FaSeedling, FaRobot, FaSatellite, FaFlask, FaDownload } from 'react-icons/fa'
import Agriculture from '@mui/icons-material/Agriculture';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)

  const user = JSON.parse(localStorage.getItem('user')) || { role: 'farmer' }
  const role = user.role || 'farmer'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    }
  };

  const navLinks = [
    { name: t('nav_home'), path: '/home' },
    { name: 'Market', path: '/market' },
    { name: t('nav_forum'), path: '/forum' },
    { name: t('nav_weather'), path: '/weather' },
    { name: t('nav_education'), path: '/education' },
    { name: t('nav_about'), path: '/about' },
    { name: 'Meet the Team', path: '/developers' },
  ]

  const allFeatureLinks = [
    { name: t('land_records'), path: '/land-records', desc: t('land_records_desc'), icon: <FaMicrochip className="text-nature-500" /> },
    ...(role !== 'retailer' ? [{ name: 'Crop Recommendation', path: '/crop-recommendation', desc: 'AI-powered crop advisor for your soil & climate', icon: <FaSeedling className="text-nature-500" /> }] : []),
    ...(role !== 'retailer' ? [{ name: 'Plant Disease Prediction', path: '/plant-disease', desc: 'AI-powered disease diagnosis from leaf images', icon: <FaLeaf className="text-nature-500" /> }] : []),
    ...(role !== 'retailer' ? [{ name: 'Crop Yield Prediction', path: '/crop-yield', desc: 'Forecast harvest volume based on conditions', icon: <FaChartLine className="text-nature-500" /> }] : []),
    ...(role !== 'retailer' ? [{ name: 'Aerial Land Analysis', path: '/land-analysis', desc: 'Satellite crop classification & vegetation health', icon: <FaSatellite className="text-nature-500" /> }] : []),
    ...(role !== 'retailer' ? [{ name: 'Fertilizer Advisor', path: '/Fertilizer', desc: 'AI-powered optimal fertilizer recommendation', icon: <FaFlask className="text-nature-500" /> }] : []),
    { name: 'AI Chatbot', path: '/ai-chatbot', desc: 'Multi-lingual farming assistant in EN/HI/KN/TE/TA', icon: <FaRobot className="text-nature-500" /> },
    { name: t('nearby_stores'), path: '/nearby', desc: t('nearby_stores_desc'), icon: <FaStore className="text-nature-500" /> },
  ]

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-2 px-4 md:px-8' : 'py-6 px-6 md:px-20'
      }`}>
      <div className={`max-w-[1400px] mx-auto glass rounded-[2rem] md:rounded-[2.5rem] flex justify-between items-center px-6 md:px-10 py-3 md:py-4 transition-all duration-500 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-nature-500/30 ${scrolled ? 'shadow-2xl translate-y-2' : ''
        }`}>

        {/* Logo Section */}
        <Link to="/home" className="flex items-center gap-3 group relative">
          <div className="bg-nature-600 p-2.5 rounded-2xl group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-500 shadow-lg shadow-nature-600/20">
            <Agriculture className="text-white" style={{ fontSize: 28 }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-heading font-black tracking-tighter text-nature-950 leading-none">
              <span className="text-nature-600">Agri</span>Opti
            </h1>
            <span className="text-[10px] font-bold text-nature-400 uppercase tracking-widest mt-1">Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold tracking-wide transition-all duration-300 hover:text-nature-600 relative py-2 px-1
                ${location.pathname === link.path ? 'text-nature-600' : 'text-nature-700'}
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-nature-500 
                after:rounded-full after:transform after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-100
                ${location.pathname === link.path ? 'after:scale-x-100' : ''}
              `}
            >
              {link.name}
            </Link>
          ))}

          {/* Intelligence Suite Mega-Menu */}
          <div className="relative group/features">
            <button
              className="text-sm font-bold tracking-wide text-nature-700 hover:text-nature-600 flex items-center gap-2 py-2 group-hover/features:text-nature-600 transition-colors"
            >
              {t('intelligence_suite')}
              <span className="text-[8px] transition-transform duration-300 group-hover/features:rotate-180">▼</span>
            </button>
            <div className="absolute right-0 mt-4 w-[750px] glass border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-8 invisible group-hover/features:visible opacity-0 group-hover/features:opacity-100 transition-all duration-500 translate-y-4 group-hover/features:translate-y-0 backdrop-blur-3xl overflow-hidden">
              {/* Decorative Background for Mega Menu */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-nature-600/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-nature-400/5 rounded-full blur-3xl -z-10"></div>

              <div className="grid grid-cols-3 gap-2">
                {allFeatureLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="p-3 rounded-2xl hover:bg-nature-50 transition-all duration-300 group/item flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-nature-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                      {link.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-bold text-nature-800 group-hover/item:text-nature-600">{link.name}</span>
                      <span className="text-[10px] text-nature-400 font-medium group-hover/item:text-nature-500">{link.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Search & Profile */}
        <div className="flex items-center gap-4">
          {showInstallBtn && (
            <button
              onClick={handleInstall}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-nature-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-nature-700 transition-all active:scale-95 shadow-lg shadow-nature-950/20"
            >
              <FaDownload className="text-nature-400" /> Install App
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-nature-100 transition-all duration-500 outline-none hover:scale-105 active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-nature-400 to-nature-600 flex items-center justify-center text-white border-2 border-white shadow-md overflow-hidden transition-all duration-300">
                <FaUserCircle className="text-3xl" />
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-5 w-64 glass border-white/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-20 overflow-hidden py-3 animate-in fade-in zoom-in duration-300 backdrop-blur-3xl">
                  <div className="px-6 py-4 border-b border-nature-100 mb-2">
                    <p className="text-[10px] font-black text-nature-400 uppercase tracking-[0.2em]">{t('personal_account')}</p>
                    <p className="text-sm font-bold text-nature-950 mt-1 truncate">
                      {JSON.parse(localStorage.getItem('user'))?.name || 'User'}
                    </p>
                  </div>
                  <div className="px-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t('dashboard_overview')}
                    </Link>
                    {role !== 'government' && (
                      <Link
                        to="/inventory"
                        className="flex items-center px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {t('manage_inventory')}
                      </Link>
                    )}
                    <Link
                      to="/ai-chatbot"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaRobot className="text-nature-500" /> AI Chatbot
                    </Link>
                    {role !== 'retailer' && (
                      <Link
                        to="/crop-recommendation"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaSeedling className="text-nature-500" /> Crop Recommendation
                      </Link>
                    )}
                    {role !== 'retailer' && (
                      <Link
                        to="/plant-disease"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaLeaf className="text-nature-500" /> Plant Disease Prediction
                      </Link>
                    )}
                    {role !== 'retailer' && (
                      <Link
                        to="/crop-yield"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaChartLine className="text-nature-500" /> Crop Yield Prediction
                      </Link>
                    )}
                    {role !== 'retailer' && (
                      <Link
                        to="/land-analysis"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaSatellite className="text-sky-500" /> Aerial Land Analysis
                      </Link>
                    )}
                    {role !== 'retailer' && (
                      <Link
                        to="/Fertilizer"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaFlask className="text-emerald-500" /> Fertilizer Advisor
                      </Link>
                    )}
                    {role !== 'government' && (
                      <Link
                        to="/order"
                        className="flex items-center px-4 py-3 text-sm font-bold text-nature-800 hover:bg-nature-50 hover:text-nature-600 rounded-xl transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {t('track_orders')}
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-nature-100 mt-2 p-2 pt-2">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50 rounded-xl transition-all uppercase tracking-tighter"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t('log_out')}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center text-nature-950 text-2xl hover:bg-nature-100 rounded-2xl transition-all"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] z-40 bg-nature-50/95 backdrop-blur-3xl animate-in slide-in-from-top duration-500 overflow-y-auto pb-20 custom-scrollbar">
          <div className="flex flex-col p-6 space-y-10">
            <div className="space-y-6">
              <p className="text-[11px] font-black text-nature-400 uppercase tracking-[0.4em]">{t('core_modules')}</p>
              <div className="grid grid-cols-2 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="p-5 rounded-3xl bg-white border border-nature-100 shadow-sm flex flex-col gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg font-black text-nature-950">{link.name}</span>
                    <span className="text-[10px] text-nature-400 uppercase tracking-widest">{t('explore')}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] font-black text-nature-400 uppercase tracking-[0.4em]">{t('intelligence_suite')}</p>
              <div className="grid grid-cols-1 gap-4">
                {showInstallBtn && (
                  <button
                    className="w-full p-6 rounded-[2.5rem] bg-nature-950 text-white shadow-xl flex justify-between items-center group animate-pulse"
                    onClick={() => {
                        handleInstall();
                        setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex flex-col text-left">
                      <p className="text-md font-black uppercase">Install AgriOpti App</p>
                      <p className="text-[10px] text-nature-400 font-bold uppercase tracking-[0.2em] mt-1">Faster access & Offline support</p>
                    </div>
                    <FaDownload />
                  </button>
                )}
                {allFeatureLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="p-6 rounded-[2.5rem] bg-white border border-nature-100 shadow-sm flex justify-between items-center group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex flex-col">
                      <p className="text-md font-black text-nature-950 uppercase">{link.name}</p>
                      <p className="text-[10px] text-nature-400 font-bold uppercase tracking-[0.2em] mt-1">{link.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-nature-50 flex items-center justify-center text-nature-500">→</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
