import React from 'react';
import { Link } from 'react-router-dom';
import Agriculture from '@mui/icons-material/Agriculture';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowUp, FaEnvelope, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-transparent text-nature-950 overflow-hidden relative pt-12 pb-8">
      {/* Background Animated Elements - Moved to stay behind the card */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-nature-600/10 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-nature-400/10 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Floating Creative Card */}
        <div className="bg-nature-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Brand & Social - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-nature-600 p-2.5 rounded-xl shadow-lg">
                  <Agriculture className="text-white" style={{ fontSize: 24 }} />
                </div>
                <h1 className="text-2xl font-heading font-black tracking-tighter text-white">
                  <span className="text-nature-400">Agri</span>Opti
                </h1>
              </div>
              <p className="text-nature-400 text-sm font-medium leading-relaxed max-w-xs">
                Next-gen agricultural intelligence. Empowering sustainable growth through AI.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <FaFacebookF />, link: "#", color: "hover:bg-blue-600" },
                  { icon: <FaTwitter />, link: "#", color: "hover:bg-sky-400" },
                  { icon: <FaInstagram />, link: "#", color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600" },
                  { icon: <FaLinkedinIn />, link: "#", color: "hover:bg-blue-700" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm text-nature-400 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Section - 4 cols (Compact Grid) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600">Explore</h3>
                <ul className="space-y-2.5">
                  {['Home', 'Market', 'Forum', 'Weather'].map((item) => (
                    <li key={item}>
                      <a href={`/${item.toLowerCase()}`} className="text-nature-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-nature-600 scale-0 group-hover:scale-100 transition-transform"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600">Company</h3>
                <ul className="space-y-2.5">
                  {['About', 'Privacy', 'Terms'].map((item) => (
                    <li key={item}>
                      <a href={item === 'About' ? '/about' : `/${item.toLowerCase()}`} className="text-nature-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-nature-600 scale-0 group-hover:scale-100 transition-transform"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link to="/developers" className="text-nature-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-nature-600 scale-0 group-hover:scale-100 transition-transform"></span>
                      Developers
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:vigneswarreddy.2005@gmail.com?subject=AgriOpti%20Support%20Request"
                      className="text-nature-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-nature-600 scale-0 group-hover:scale-100 transition-transform"></span>
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter - 4 cols (Compact & Creative) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-nature-600/20 flex items-center justify-center text-nature-400">
                    <FaEnvelope size={14} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Connect With Us</h4>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-nature-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-nature-500 transition-all text-white placeholder:text-nature-700"
                  />
                  <button className="absolute right-1 w-8 h-8 bg-nature-600 hover:bg-nature-500 text-white rounded-lg flex items-center justify-center transition-all active:scale-90">
                    <FaPaperPlane size={12} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-nature-500 font-bold px-1">
                <FaInfoCircle size={10} />
                <span>Join 500+ farmers in our newsletter.</span>
              </div>
            </div>
          </div>

          {/* Footer Bottom (Inside Card) */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-nature-500 text-[10px] font-black uppercase tracking-widest">
              &copy; {currentYear} <span className="text-nature-300">AgriOpti</span> •
              Making Earth <span className="text-nature-600">Greener</span>
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-white/5 text-nature-400 hover:text-white hover:bg-nature-600 flex items-center justify-center transition-all active:scale-95 group"
              >
                <FaArrowUp size={14} className="group-hover:animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
