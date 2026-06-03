import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Card from "../Components/Dashboard/Card";
import CustomPieChart from '../Components/Dashboard/CustomPieChart';
import CustomPieChart2 from '../Components/Dashboard/CustomPieChart2';
import CustomBarChart2 from '../Components/Dashboard/CustomBarChart2';
import CustomAreaChart from '../Components/Dashboard/CustomAreaChart';
import Footer from '../Components/Footer';
import {
  FaLeaf, FaRobot, FaWind, FaGem, FaWallet, FaChevronRight,
  FaStore, FaChartBar, FaClipboardList, FaLandmark, FaUsers, FaExclamationTriangle, FaChartLine,
  FaSatellite, FaFlask
} from 'react-icons/fa';
import { ROLE_CONFIG } from '../utils/roleAccess';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDenied, setShowDenied] = useState(!!location.state?.accessDenied);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    popularProducts: [],
    topQueries: []
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || { _id: 'guest', role: 'farmer', username: 'Guest Farmer' };
  const role = user.role || 'farmer';
  const roleConf = ROLE_CONFIG[role] || ROLE_CONFIG.farmer;
  const [products, setProducts] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingAnalytics(true);
      try {
        const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');
        const { db } = await import('../firebase');

        // 1. Fetch User's Products (Inventory)
        const productsQ = query(collection(db, "products"), where("createdBy", "==", user._id));
        const productsSnap = await getDocs(productsQ);
        const fetchedProducts = productsSnap.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
        setProducts(fetchedProducts);

        // 2. Fetch Commercial Intelligence (Orders)
        // Note: For retailers, we show orders placed to them. For farmers, we show their total farm commercial activity.
        const ordersQ = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const ordersSnap = await getDocs(ordersQ);
        const allOrders = ordersSnap.docs.map(doc => doc.data());

        const userOrders = allOrders.filter(o => o.sellerId === user._id || o.buyerId === user._id);
        const revenue = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // popular products by occurrence in orders
        const productCounts = {};
        userOrders.forEach(o => {
          productCounts[o.productName] = (productCounts[o.productName] || 0) + 1;
        });
        const popular = Object.entries(productCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // 3. Fetch AI Intelligence (Queries)
        const queriesQ = query(collection(db, "queries"), orderBy("createdAt", "desc"), limit(100));
        let topQueries = [];
        try {
          const queriesSnap = await getDocs(queriesQ);
          const allQueries = queriesSnap.docs.map(doc => doc.data());
          // Basic keyword extraction for "Top Searched"
          const words = allQueries.flatMap(q => q.queryText?.toLowerCase().split(/\s+/) || []);
          const stopwords = ['i', 'me', 'my', 'the', 'a', 'is', 'how', 'to', 'for', 'in', 'of', 'and', 'on', 'with', 'about'];
          const wordCounts = {};
          words.filter(w => w.length > 3 && !stopwords.includes(w)).forEach(w => {
            wordCounts[w] = (wordCounts[w] || 0) + 1;
          });
          topQueries = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));
        } catch (e) { console.warn("Queries collection might not exist yet", e); }

        setAnalytics({
          totalOrders: userOrders.length,
          totalRevenue: revenue,
          popularProducts: popular,
          topQueries: topQueries
        });

        // Legacy compat for UI cards
        setTotalSale(userOrders.length);
        setTotalEarnings(revenue);

      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchDashboardData();
  }, [user._id]);

  const totalRevenue = totalEarnings / 3;

  // ── Role-specific Quick Action grids ──────────────────────────────────────
  const farmerActions = [
    { icon: <FaLeaf />, color: 'bg-nature-600', label: 'Manage Inventory', desc: 'Track your farm stock for the season.', path: '/inventory', cta: 'View Inventory' },
    { icon: <FaWind />, color: 'bg-nature-400 text-nature-950', label: 'Weather Forecast', desc: 'Plan activities with accurate weather.', path: '/weather', cta: 'Check Weather' },
    { icon: <FaClipboardList />, color: 'bg-nature-700 text-white', label: 'Purchases', desc: 'Track your bought supplies.', path: '/order', cta: 'Purchases' }
  ];

  const retailerActions = [
    { icon: <FaStore />, color: 'bg-blue-600', label: 'My Store Inventory', desc: 'Manage and update your store stock.', path: '/inventory', cta: 'Manage Store' },
    { icon: <FaClipboardList />, color: 'bg-blue-700', label: 'Purchases', desc: 'Track agricultural supplies bought.', path: '/order', cta: 'View Purchases' }
  ];

  const governmentActions = [
    { icon: <FaLandmark />, color: 'bg-amber-800', label: 'Land Records', desc: 'Full administrative access to land data.', path: '/land-records', cta: 'Open Records' },
    { icon: <FaUsers />, color: 'bg-amber-400 text-amber-950', label: 'Community Forum', desc: 'Monitor farmer discussions and issues.', path: '/forum', cta: 'View Forum' },
  ];

  const actions = role === 'retailer' ? retailerActions : role === 'government' ? governmentActions : farmerActions;

  const roleHeaderInfo = {
    farmer: { tag: '🌾 Smart Farming Hub', subtitle: 'What would you like to achieve today?' },
    retailer: { tag: '🏪 Retailer Control Panel', subtitle: 'Manage your store, orders, and pricing.' },
    government: { tag: '🏛️ Government Analytics Hub', subtitle: 'Monitor agriculture across your region.' },
  };
  const hdr = roleHeaderInfo[role] || roleHeaderInfo.farmer;

  return (
    <div className="min-h-screen flex flex-col bg-nature-50/30">
      <Navbar />

      <div className="flex-1 pt-24 md:pt-32">
        <main className="flex-1 overflow-y-auto">

          {/* Access Denied Notice */}
          {showDenied && (
            <div className="max-w-4xl mx-auto mt-6 px-6">
              <div className="flex items-center gap-4 px-6 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-800">
                <FaExclamationTriangle className="text-xl flex-shrink-0" />
                <p className="text-sm font-bold flex-1">You don't have permission to access that page with your current role ({roleConf.label}).</p>
                <button onClick={() => setShowDenied(false)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
              </div>
            </div>
          )}

          {/* Dashboard Header */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 relative z-10 mt-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[150px] bg-emerald-400/20 blur-[100px] rounded-full -z-10"></div>
            
            <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                  <FaLeaf /> {hdr.tag}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-none uppercase break-words w-full text-white">
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{user.username}</span>
                </h1>
                <p className="text-nature-300 text-xs font-bold uppercase tracking-widest ml-1">{hdr.subtitle}</p>
              </div>
              {/* Role Badge */}
              <div className={`relative z-10 px-5 py-2 rounded-2xl text-white text-sm font-black uppercase tracking-widest ${roleConf.badge}`}>
                {roleConf.label}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 md:space-y-16">

            {/* Quick Actions — role-specific */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-black text-nature-950 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-1 bg-nature-600 rounded-full"></span> Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="group relative bg-white rounded-[2rem] p-6 md:p-8 text-left border border-nature-200 shadow-xl shadow-nature-900/5 hover:-translate-y-2 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-nature-100 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ${action.color}`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-heading font-black text-nature-950 mb-2">{action.label}</h3>
                        <p className="text-nature-600 text-sm font-medium">{action.desc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 border-t border-nature-100 pt-4">
                        <span className="text-xs font-black uppercase tracking-widest text-nature-400 group-hover:text-nature-600 transition-colors">{action.cta}</span>
                        <FaChevronRight className="text-nature-400 group-hover:text-nature-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>



            {/* AI Chatbot shortcut for all roles */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-black text-nature-950 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-1 bg-nature-600 rounded-full"></span> Intelligence Suite
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/ai-chatbot')}
                  className="w-full group relative bg-nature-950 rounded-[2rem] p-8 text-left text-white border border-nature-800 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-nature-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex justify-between items-start gap-4 flex-col xl:flex-row w-full">
                      <div className="w-16 h-16 rounded-2xl bg-nature-600 flex items-center justify-center text-3xl shadow-lg shadow-nature-600/30 flex-shrink-0">
                        <FaRobot />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-black mb-1">AgriBot — AI Assistant</h3>
                        <p className="text-nature-400 text-sm font-medium">Ask in English, Hindi, Kannada, Telugu, or Tamil. Voice supported.</p>
                      </div>
                      <FaChevronRight className="text-nature-400 group-hover:text-nature-300 group-hover:translate-x-2 transition-all text-xl self-center hidden xl:block" />
                    </div>
                  </div>
                </button>

                {(role === 'farmer' || role === 'government') && (
                  <button
                    onClick={() => navigate('/plant-disease')}
                    className="w-full group relative bg-green-950 rounded-[2rem] p-8 text-left text-white border border-green-800 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex justify-between items-start gap-4 flex-col xl:flex-row w-full">
                        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-3xl shadow-lg shadow-green-600/30 flex-shrink-0">
                          <FaLeaf />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-heading font-black mb-1">Plant Disease Analyzer</h3>
                          <p className="text-green-400 text-sm font-medium">Upload a photo of a crop leaf to instantly diagnose diseases using AI.</p>
                        </div>
                        <FaChevronRight className="text-green-400 group-hover:text-green-300 group-hover:translate-x-2 transition-all text-xl self-center hidden xl:block" />
                      </div>
                    </div>
                  </button>
                )}

                {(role === 'farmer' || role === 'government') && (
                  <button
                    onClick={() => navigate('/crop-yield')}
                    className="w-full group relative bg-amber-950 rounded-[2rem] p-8 text-left text-white border border-amber-800 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex justify-between items-start gap-4 flex-col w-full">
                        <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-600/30 flex-shrink-0">
                          <FaChartLine />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-black mb-1">Crop Yield Estimator</h3>
                          <p className="text-amber-400 text-xs font-medium uppercase tracking-tight">Forecast harvest using environmental data.</p>
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {(role === 'farmer' || role === 'government') && (
                  <button
                    onClick={() => navigate('/land-analysis')}
                    className="w-full group relative bg-sky-950 rounded-[2rem] p-8 text-left text-white border border-sky-800 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-sky-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex justify-between items-start gap-4 flex-col xl:flex-row w-full">
                        <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center text-3xl shadow-lg shadow-sky-600/30 flex-shrink-0">
                          <FaSatellite />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-heading font-black mb-1">Aerial Land Analyser</h3>
                          <p className="text-sky-400 text-sm font-medium">Upload satellite imagery to classify crops and assess vegetation health.</p>
                        </div>
                        <FaChevronRight className="text-sky-400 group-hover:text-sky-300 group-hover:translate-x-2 transition-all text-xl self-center hidden xl:block" />
                      </div>
                    </div>
                  </button>
                )}

                {role === 'farmer' && (
                  <button
                    onClick={() => navigate('/Fertilizer')}
                    className="w-full group relative bg-emerald-950 rounded-[2rem] p-8 text-left text-white border border-emerald-800 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex justify-between items-start gap-4 flex-col xl:flex-row w-full">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-600/30 flex-shrink-0">
                          <FaFlask />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-heading font-black mb-1">Fertilizer Advisor</h3>
                          <p className="text-emerald-400 text-sm font-medium">Get AI-powered fertilizer recommendations based on your soil & crop data.</p>
                        </div>
                        <FaChevronRight className="text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-2 transition-all text-xl self-center hidden xl:block" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Commercial Analytics — Farmer & Retailer only */}
            {(role === 'farmer' || role === 'retailer') && (
              <div className="space-y-10 pt-10 border-t-2 border-dashed border-nature-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-heading font-black text-nature-950 uppercase tracking-tight">
                      {role === 'retailer' ? 'Store Performance' : 'Commercial Intelligence'}
                    </h2>
                    <p className="text-nature-500 text-sm font-medium">Real-time market insights and revenue tracking.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-nature-100 text-nature-700 rounded-full text-[10px] font-black uppercase tracking-wider">Live Sync</span>
                    <div className="w-2 h-2 bg-nature-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card title="Total Orders" value={loadingAnalytics ? "..." : analytics.totalOrders} variant="nature">
                    <div className="flex items-center gap-3 text-nature-500">
                      <FaClipboardList /> <span className="text-[10px] font-black uppercase tracking-widest">Live Volume</span>
                    </div>
                  </Card>
                  <Card title="Total Revenue" value={loadingAnalytics ? "..." : `₹${analytics.totalRevenue.toLocaleString()}`} variant="primary">
                    <div className="flex items-center gap-3 text-blue-500">
                      <FaWallet /> <span className="text-[10px] font-black uppercase tracking-widest">Gross Earnings</span>
                    </div>
                  </Card>
                  <Card title="Popular Items" value={loadingAnalytics ? "..." : analytics.popularProducts[0]?.name || "None"} variant="success">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <FaChartLine /> <span className="text-[10px] font-black uppercase tracking-widest">Top Performer</span>
                    </div>
                  </Card>
                  <Card title="Top Query" value={loadingAnalytics ? "..." : analytics.topQueries[0]?.word || "None"} variant="warning">
                    <div className="flex items-center gap-3 text-amber-500">
                      <FaRobot /> <span className="text-[10px] font-black uppercase tracking-widest">AI Trend</span>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Main Trend Chart */}
                  <div className="xl:col-span-2">
                    <Card title="Revenue Growth Velocity">
                      <div className="w-full h-full pt-4">
                        <CustomAreaChart data={[
                          { name: 'Mon', value: totalEarnings * 0.1 },
                          { name: 'Tue', value: totalEarnings * 0.15 },
                          { name: 'Wed', value: totalEarnings * 0.12 },
                          { name: 'Thu', value: totalEarnings * 0.25 },
                          { name: 'Fri', value: totalEarnings * 0.22 },
                          { name: 'Sat', value: totalEarnings * 0.35 },
                          { name: 'Sun', value: totalEarnings * 0.32 },
                        ]} />
                      </div>
                    </Card>
                  </div>

                  {/* Secondary Chart */}
                  <div className="xl:col-span-1">
                    <Card title="Inventory Distribution">
                      <div className="w-full h-full"><CustomPieChart products={products} /></div>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card title="Popular Products (by Orders)">
                    <div className="w-full h-full pt-4">
                       <CustomBarChart2 products={analytics.popularProducts.map(p => ({ name: p.name, sale: p.count }))} />
                    </div>
                  </Card>

                  <Card title="Top Searched Queries">
                    <div className="w-full space-y-4">
                      {analytics.topQueries.map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-nature-50/50 border border-nature-100">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-nature-600">
                              <FaRobot />
                            </div>
                            <div>
                              <p className="text-sm font-black text-nature-950 capitalize">{q.word}</p>
                              <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Search Frequency</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-nature-950">{q.count}</p>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">High Intent</p>
                          </div>
                        </div>
                      ))}
                      {!loadingAnalytics && analytics.topQueries.length === 0 && <p className="text-center py-8 text-nature-400 text-xs font-bold uppercase tracking-widest">No search data yet</p>}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Government-only: Regional overview panel */}
            {role === 'government' && (
              <div className="space-y-6 pt-10 border-t-2 border-dashed border-amber-200">
                <h2 className="text-xl font-heading font-black text-amber-600 uppercase tracking-widest">Regional Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Active Farmers', value: '12,400+', icon: <FaUsers />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { label: 'Land Records Accessed', value: '3,280', icon: <FaLandmark />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { label: 'Crop Queries (30d)', value: '8,950', icon: <FaLeaf />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border ${stat.color} flex items-center gap-6`}>
                      <div className="text-3xl">{stat.icon}</div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                        <p className="text-3xl font-heading font-black">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
