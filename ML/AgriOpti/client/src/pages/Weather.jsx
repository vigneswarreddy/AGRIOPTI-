import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaSearch, FaMapMarkerAlt, FaLeaf, FaCloudSun, FaExclamationTriangle } from 'react-icons/fa'
import { useStateContext } from '../Context'
import { WeatherCard, MiniCard } from '../Components'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

function Weather() {
  const [input, setInput] = useState('')
  const { weather, thisLocation, values, setPlace, loading, error } = useStateContext()

  const submitCity = () => {
    if (input.trim()) {
      setPlace(input)
      setInput('')
    }
  }

  // State for AI insights
  const [aiInsights, setAiInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Fetch dynamic agricultural advice from AI based on current weather
  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!weather || Object.keys(weather).length === 0) return;

      setInsightsLoading(true);
      try {
        const prompt = `Provide 2 specific agricultural advisory points based on this weather: 
        Temp: ${weather.temp}°C, Humidity: ${weather.humidity}%, Conditions: ${weather.conditions}. 
        Format as a JSON array of objects with keys: title, desc, icon (use string 'cloud-sun', 'exclamation-triangle', or 'leaf' only).`;

        const response = await axios.post(`${import.meta.env.VITE_ML_API_URL}/chatbot/text/`, {
          message: prompt
        });

        // Basic parsing if needed, but for simplicity let's assume valid JSON or fallback
        let data = [];
        try {
          data = JSON.parse(response.data.response.match(/\[.*\]/s)[0]);
        } catch (e) {
          data = [
            { title: 'Weather Analysis', desc: response.data.response, icon: 'leaf' }
          ];
        }

        const insights = data.map(item => ({
          ...item,
          icon: item.icon === 'cloud-sun' ? <FaCloudSun className="text-blue-500" /> :
            item.icon === 'exclamation-triangle' ? <FaExclamationTriangle className="text-amber-500" /> :
              <FaLeaf className="text-nature-500" />
        }));

        setAiInsights(insights);
      } catch (err) {
        console.error("Failed to fetch AI insights:", err);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchAIInsights();
  }, [weather]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-nature-50">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
          <div className="absolute top-[10%] -left-[10%] w-[40rem] h-[40rem] bg-nature-400 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[35rem] h-[35rem] bg-earth-300 rounded-full blur-[120px]"></div>
        </div>

        {/* Hero Search Section */}
        <div className="relative pt-12 md:pt-20 pb-16 px-6 overflow-hidden z-10">
          <div className="max-w-7xl mx-auto space-y-12 flex flex-col items-center text-center">
            <div className="space-y-4 animate-in fade-in slide-in-from-top-10 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nature-100 text-nature-700 text-xs font-black uppercase tracking-[0.2em] mb-4">
                <FaCloudSun /> Climate Intelligence
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-nature-950">
                Precision <span className="text-nature-600 italic">Farmer's</span> Forecast
              </h1>
              <p className="text-nature-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                AI-powered climate data tailored for sustainable agriculture and maximum crop yield.
              </p>
            </div>

            <div className="w-full max-w-3xl relative animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
              <div className="p-2 backdrop-blur-xl bg-white/80 rounded-[3rem] flex items-center border border-nature-200 shadow-[0_32px_64px_-16px_rgba(20,40,20,0.15)] focus-within:ring-4 focus-within:ring-nature-500/10 transition-all">
                <div className="pl-6 text-nature-400">
                  <FaSearch size={22} />
                </div>
                <input
                  onKeyUp={(e) => e.key === 'Enter' && submitCity()}
                  type="text"
                  placeholder="Search location for climate analysis..."
                  className="bg-transparent border-none focus:outline-none w-full px-6 py-6 text-xl font-bold placeholder-nature-300 text-nature-950"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button
                  onClick={submitCity}
                  className="bg-nature-700 text-white py-5 px-12 rounded-[2.2rem] text-lg font-black uppercase tracking-widest shadow-xl shadow-nature-700/20 hover:bg-nature-950 hover:scale-105 active:scale-95 transition-all"
                >
                  Analyze
                </button>
              </div>
              {loading ? (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-nature-600 rounded-full animate-bounce delay-300"></div>
                  <span className="text-xs font-black text-nature-400 uppercase tracking-widest ml-1">Decoding Satellites</span>
                </div>
              ) : (
                <div className="mt-6 flex items-center justify-center gap-2 text-nature-400 text-sm font-bold uppercase tracking-widest">
                  <FaMapMarkerAlt className="text-nature-600" />
                  Selected Area: <span className="text-nature-950 ml-1">{thisLocation}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto px-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
              <FaExclamationTriangle className="text-xl shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && weather && (
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-20 z-10 relative">

            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Main Current Weather Card */}
              <div className="w-full lg:w-auto flex justify-center animate-in fade-in slide-in-from-left-10 duration-700 delay-300">
                <WeatherCard
                  place={thisLocation}
                  windspeed={weather.wspd}
                  humidity={weather.humidity}
                  temperature={weather.temp}
                  heatIndex={weather.heatindex}
                  iconString={weather.conditions}
                  conditions={weather.conditions}
                />
              </div>

              {/* Insights & Forecast Column */}
              <div className="flex-1 space-y-16 py-4">

                {/* Crop Wisdom Section */}
                <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 delay-400">
                  <div className="flex items-center gap-3 border-b border-nature-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center text-nature-700">
                      <FaLeaf />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-black text-nature-950 tracking-tight">Agricultural <span className="text-nature-600">Wisdom</span></h2>
                      <p className="text-xs font-bold text-nature-400 uppercase tracking-widest">Contextual Advice for your area</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insightsLoading ? (
                      <div className="col-span-full h-32 glass rounded-[2rem] border animate-pulse"></div>
                    ) : aiInsights.length > 0 ? (
                      aiInsights.map((insight, idx) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-white border border-nature-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                          <div className="text-2xl mt-1">{insight.icon}</div>
                          <div>
                            <h4 className="font-black text-nature-950 mb-1">{insight.title}</h4>
                            <p className="text-sm text-nature-600 leading-relaxed font-medium">{insight.desc}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-nature-400 text-xs font-bold uppercase tracking-widest pl-2">Syncing with climate satellites...</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
                  <div className="flex items-center justify-between border-b border-nature-100 pb-4">
                    <h2 className="text-2xl font-heading font-black text-nature-950 tracking-tight uppercase">
                      {values && values.length > 1 ? values.length - 1 : 0}-Day <span className="text-nature-600">Outlook</span>
                    </h2>
                    <span className="text-xs font-black text-nature-400 uppercase tracking-[0.2em]">Future Projections</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {values?.slice(1).map((curr, idx) => (
                      <MiniCard
                        key={curr.datetime}
                        time={curr.datetime}
                        temp={curr.temp}
                        minTemp={curr.min_temp}
                        maxTemp={curr.max_temp}
                        iconString={curr.conditions}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty/Initial State Placeholder */}
        {!loading && !error && (!weather || Object.keys(weather).length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-nature-100 rounded-full flex items-center justify-center text-5xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black text-nature-950 mb-2">No Satellite Data</h3>
            <p className="text-nature-600 font-medium max-w-sm px-6">Search for a location above to begin your micro-climate analysis.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Weather
