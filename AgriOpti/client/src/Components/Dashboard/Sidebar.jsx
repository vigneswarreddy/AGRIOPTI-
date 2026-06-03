import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaPoll,
  FaSeedling,
  FaStethoscope,
  FaFlask,
  FaRobot,
  FaSatellite,
  FaComments,
  FaBook,
  FaStore,
  FaSignOutAlt,
  FaUserCircle,
  FaTint,
  FaExclamationTriangle,
  FaCoins,
  FaLandmark
} from 'react-icons/fa';

const categories = [
  { title: 'Dashboard', icon: <FaChartLine />, link: '/dashboard', roles: ['farmer', 'retailer', 'government'], statistical: true },
  { title: 'Land Analysis', icon: <FaSatellite />, link: '/land-analysis', roles: ['farmer', 'government'], statistical: true },
  { title: 'Market Intelligence', icon: <FaChartLine />, link: '/market-prices', roles: ['farmer'], statistical: true },
  { title: 'Profit Forecasting', icon: <FaCoins />, link: '/profit-estimation', roles: ['farmer'], statistical: true },
  { title: 'Digital Land Records', icon: <FaLandmark />, link: '/land-records', roles: ['farmer', 'government'], statistical: true },
  { title: 'Survey Data', icon: <FaPoll />, link: '/survey', roles: ['farmer'], statistical: true },
  { title: 'Crop Analysis', icon: <FaSeedling />, link: '/Recommend', roles: ['farmer'] },
  { title: 'Disease Diagnosis', icon: <FaStethoscope />, link: '/Disease', roles: ['farmer'] },
  { title: 'Fertilizer Advisor', icon: <FaFlask />, link: '/Fertilizer', roles: ['farmer'] },
  { title: 'Smart Irrigation', icon: <FaTint />, link: '/irrigation', roles: ['farmer'] },
  { title: 'Early Warning', icon: <FaExclamationTriangle />, link: '/early-warning', roles: ['farmer'] },
];

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest', role: 'visitor' };
  const location = useLocation();
  const navigate = useNavigate();

  const filteredCategories = categories.filter(category =>
    category.roles.includes(user.role)
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-80 min-h-screen bg-nature-950 text-white flex flex-col relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-mesh opacity-10"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-8 border-b border-white/10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-nature-600/20 border-2 border-nature-600/30 flex items-center justify-center text-4xl text-nature-400 shadow-2xl shadow-nature-950/50 overflow-hidden">
            <FaUserCircle />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-heading font-black tracking-tight">{user.username}</h3>
            <p className="text-nature-500 text-[10px] font-black uppercase tracking-[0.2em]">{user.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-nature-600 uppercase tracking-[0.3em] mb-6">Management Suite</p>
          <div className="space-y-2">
            {filteredCategories.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 group ${isActive
                    ? 'bg-nature-600 text-white shadow-lg shadow-nature-600/20'
                    : 'text-nature-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Action Section */}
        <div className="p-8 border-t border-white/10 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all duration-300 group"
          >
            <FaSignOutAlt className="text-xl group-hover:translate-x-1 transition-transform" />
            Logout Session
          </button>

          <div className="p-4 rounded-2xl bg-nature-900/50 border border-white/5 text-center">
            <p className="text-[8px] font-black text-nature-700 uppercase tracking-[0.5em] leading-relaxed italic">AgriOpti Hub v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
