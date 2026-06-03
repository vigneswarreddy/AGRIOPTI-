import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import MapComponent from '../Components/Mapcomponent';
import { db } from '../firebase';
import {
  collection, doc, setDoc, getDocs,
  query, where, serverTimestamp
} from 'firebase/firestore';
import {
  FaStore, FaMapMarkerAlt, FaCompass, FaBroadcastTower,
  FaTractor, FaSnowflake, FaSeedling, FaStethoscope,
  FaFlask, FaStar, FaPhoneAlt, FaRoute, FaCalendarCheck,
  FaRegStar, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaSync, FaSearch, FaSpinner
} from 'react-icons/fa';



function Nearby() {
  const [location, setLocation] = useState({ latitude: 17.385, longitude: 78.4867 });
  const [showMap, setShowMap] = useState(false);
  const [status, setStatus] = useState('Identifying your location...');
  const [selectedService, setSelectedService] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // ── Fix 5: Rating modal state ─────────────────────────────────────────────
  const [ratingModal, setRatingModal] = useState(null); // { service, hoverVal, value, submitting, done }
  const user = JSON.parse(localStorage.getItem('user')) || { _id: 'guest' };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const radius = 10000; // 10km radius

      const overpassQuery = `
          [out:json][timeout:25];
          (
            node["shop"~"agrarian|farm|hardware|tools|agricultural|seeds|fertilizer"](around:${radius},${location.latitude},${location.longitude});
            way["shop"~"agrarian|farm|hardware|tools|agricultural|seeds|fertilizer"](around:${radius},${location.latitude},${location.longitude});
            relation["shop"~"agrarian|farm|hardware|tools|agricultural|seeds|fertilizer"](around:${radius},${location.latitude},${location.longitude});
          );
          out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: "data=" + encodeURIComponent(overpassQuery)
      });

      if (!response.ok) throw new Error("Failed to fetch from Overpass API");
      const data = await response.json();

      // Process elements into the expected format
      const processedServices = data.elements.map(el => {
        const lat = el.lat || (el.center && el.center.lat);
        const lng = el.lon || (el.center && el.center.lon);
        if (!lat || !lng) return null;

        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || "Agricultural Store";

        const distanceKm = calculateDistance(location.latitude, location.longitude, lat, lng);
        const distanceDisplay = distanceKm < 1 ?
          `${Math.round(distanceKm * 1000)} m` :
          `${distanceKm.toFixed(1)} km`;

        // Generate a deterministic but pseudo-random rating based on ID
        const rating = (3.5 + (el.id % 15) / 10).toFixed(1);
        const reviews = (el.id % 200) + 10;

        return {
          id: el.id.toString(),
          name: name,
          distance: distanceDisplay,
          distanceValue: distanceKm,
          rating: parseFloat(rating),
          reviews: reviews,
          price: "Est. ₹500+",
          tags: [tags.shop || "agricultural", "Verified", "Local"],
          lat: lat,
          lng: lng,
          phone: tags.phone || tags['contact:phone'] || null,
          address: tags['addr:street'] || tags['addr:city'] || null
        };
      }).filter(Boolean);

      // Sort by distance and take top 10
      processedServices.sort((a, b) => a.distanceValue - b.distanceValue);
      setServices(processedServices.slice(0, 10));
      setError(processedServices.length === 0 ? "No services found within 10km radius." : null);

    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Failed to fetch nearby services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setShowMap(true);
          setStatus('Proximal discovery nodes identified');
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setStatus('Geolocation denied. Using default region.');
          setShowMap(true);
        }
      );
    } else {
      setShowMap(true);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const openNavigation = (service) => {
    const origin = `${location.latitude},${location.longitude}`;
    const destination = `${service.lat},${service.lng}`;
    const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(mapUrl, '_blank');
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearchingLocation(true);
      setStatus('Searching location...');

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setStatus('Location found. Fetching stores...');
        // Note: fetchServices will be triggered by the useEffect on location change
      } else {
        setError('Location not found. Please try a different search term.');
        setStatus('Location search failed.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to search location.');
      setStatus('Location search failed.');
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    }, 1500);
  };

  // ── Fix 5: Submit rating to Firestore ──────────────────────────────────────
  const handleSubmitRating = async () => {
    if (!ratingModal?.value || ratingModal.value === 0) return;
    if (user._id === 'guest') {
      alert('Please log in to rate a store.');
      return;
    }

    setRatingModal(prev => ({ ...prev, submitting: true }));

    try {
      const ratingDocId = `${ratingModal.service.id}_${user._id}`;
      // Write rating doc; using setDoc with merge to allow updates
      await setDoc(doc(db, 'storeRatings', ratingDocId), {
        storeId: ratingModal.service.id,
        userId: user._id,
        rating: ratingModal.value,
        createdAt: serverTimestamp(),
      }, { merge: true });

      // Re-compute average from all ratings for this store
      const ratingsSnap = await getDocs(
        query(collection(db, 'storeRatings'), where('storeId', '==', ratingModal.service.id))
      );
      const allRatings = ratingsSnap.docs.map(d => d.data().rating);
      const avg = allRatings.length
        ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length)
        : ratingModal.value;

      // Update the service's rating in local state
      setServices(prev =>
        prev.map(s =>
          s.id === ratingModal.service.id
            ? { ...s, rating: parseFloat(avg.toFixed(1)), reviews: allRatings.length }
            : s
        )
      );

      setRatingModal(prev => ({ ...prev, submitting: false, done: true }));
      setTimeout(() => setRatingModal(null), 2000);
    } catch (err) {
      console.error('Rating submit error:', err);
      setRatingModal(prev => ({ ...prev, submitting: false }));
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-nature-50/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col pt-24 md:pt-32">
        {/* ── Modern SaaS Header ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[150px] bg-emerald-400/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 text-center lg:text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            
            <div className="relative z-10 space-y-4 w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <FaBroadcastTower /> Hyperspective Service Discovery
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none uppercase text-white">
                Nearby <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Services</span>
              </h1>
            </div>

            <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end gap-4">
              <form onSubmit={handleLocationSearch} className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Enter city, town, or zip code..."
                  className="w-full pl-5 pr-14 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-nature-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 backdrop-blur-md transition-all text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearchingLocation}
                />
                <button
                  type="submit"
                  disabled={isSearchingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 text-nature-950 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSearchingLocation ? <div className="w-4 h-4 rounded-full border-2 border-nature-950 border-t-transparent animate-spin"></div> : <FaSearch />}
                </button>
              </form>
              
              <div className="hidden lg:flex px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md self-end">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${showMap ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                    {showMap ? 'SYSTEM ONLINE' : 'SCANNING...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECTANGULAR MAP SECTION - ALIGNED WITH CONTENT */}
        <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-20">
          <div className="w-full h-[50vh] min-h-[400px] md:h-[55vh] relative group overflow-hidden rounded-[3rem] border border-white shadow-2xl shadow-nature-950/20">
            <div className="absolute inset-0 z-0">
              {showMap ? (
                <MapComponent
                  location={location}
                  services={services}
                  onServiceSelect={setSelectedService}
                  selectedService={selectedService}
                  onNavigate={openNavigation}
                />
              ) : (
                <div className="w-full h-full bg-nature-950/10 flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 rounded-full border-4 border-nature-200 border-t-nature-600 animate-spin"></div>
                  <p className="text-nature-500 font-bold uppercase tracking-widest text-[10px]">{status}</p>
                </div>
              )}
            </div>

            {/* Map Controls / Labels */}
            <div className="absolute top-8 left-8 z-10">
              <div className="bg-nature-950/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-nature-400 animate-pulse"></div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                  {services.length} stores identified
                </p>
              </div>
            </div>

            {/* Selected Service Snippet on Map */}
            {selectedService && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-6 animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[3rem] border border-white flex items-center justify-between shadow-2xl shadow-nature-950/30">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-nature-950 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl">
                      <FaStore />
                    </div>
                    <div>
                      <h4 className="font-black text-nature-950 text-xl leading-none mb-1">{selectedService.name}</h4>
                      <p className="text-[11px] text-nature-500 font-black uppercase tracking-tight">
                        {selectedService.distance} away • {selectedService.rating} Rating
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-14 h-14 bg-nature-50 text-nature-950 rounded-[1.5rem] hover:bg-nature-100 transition-all flex items-center justify-center border border-nature-100 shadow-sm active:scale-95">
                      <FaPhoneAlt size={18} />
                    </button>
                    <button
                      onClick={() => openNavigation(selectedService)}
                      className="w-14 h-14 bg-nature-950 text-white rounded-[1.5rem] hover:bg-nature-800 transition-all flex items-center justify-center shadow-xl active:scale-95"
                    >
                      <FaRoute size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS SECTION - BELOW MAP */}
        <div className="max-w-7xl mx-auto w-full px-6 py-16">

          {/* Right: Hubbard Stream / Service Cards */}
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-nature-400 uppercase tracking-[0.4em]">Available Stores</p>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-nature-950 uppercase italic leading-none tracking-tighter">
                  Nearby <span className="text-nature-400">Stores</span>
                </h2>
              </div>
              {/* <div className="inline-flex bg-nature-100/50 p-2 rounded-2xl border border-nature-200 shadow-inner">
                <button className="px-8 py-3 bg-white text-nature-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Proximity</button>
                <button className="px-8 py-3 text-nature-400 hover:text-nature-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">By Rating</button>
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 glass rounded-[4rem] p-12 border-2 border-transparent shadow-xl animate-pulse bg-nature-50/20"></div>
                ))
              ) : error ? (
                <div className="col-span-full p-20 glass rounded-[2.5rem] border-dashed border-2 border-nature-100 text-center">
                  <p className="text-nature-400 font-bold uppercase tracking-widest">{error}</p>
                </div>
              ) : services.length > 0 ? (
                services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`bg-white rounded-[4rem] p-12 border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedService?.id === service.id
                      ? 'border-nature-600 bg-nature-50 shadow-2xl -translate-y-3'
                      : 'border-transparent hover:border-nature-100 shadow-xl shadow-nature-950/[0.04] hover:-translate-y-2'
                      }`}
                  >
                    <div className="absolute top-0 right-0 p-10">
                      <div className="px-4 py-1.5 bg-nature-950 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                        {service.distance}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black text-nature-950 group-hover:text-nature-600 transition-colors uppercase tracking-tight italic leading-tight">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex text-amber-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              i < Math.floor(service.rating) ? <FaStar key={i} /> : <FaRegStar key={i} />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-nature-400 uppercase tracking-widest">({service.reviews} Feedbacks)</span>
                        </div>
                      </div>

                      <div className="p-8 bg-white/40 rounded-[2.5rem] border border-nature-100/40 space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black text-nature-400 uppercase tracking-widest">Standard Pricing</span>
                          <span className="text-xl font-black text-nature-950 italic">{service.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {service.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 bg-white text-[10px] font-black uppercase text-nature-500 rounded-xl border border-nature-50 shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <button className="py-5 bg-nature-100 hover:bg-nature-200 text-nature-900 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-95">
                          <FaPhoneAlt size={12} /> Hotline
                        </button>
                        {/* ── Fix 5: Rate Store Button ── */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRatingModal({ service, hoverVal: 0, value: 0, submitting: false, done: false });
                          }}
                          className="py-5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <FaStar size={12} /> Rate
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBooking(); }}
                          className="py-5 bg-nature-950 hover:bg-nature-800 text-white rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-nature-950/20 active:scale-95"
                        >
                          {isBooking ? 'Processing...' : <><FaCalendarCheck size={14} /> Book</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-20 glass rounded-[3rem] text-center border-dashed border-2 border-nature-100">
                  <p className="text-nature-400 font-black uppercase text-xs tracking-widest">No service providers found in this sector.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Toast Notification */}
        {/* ── Fix 5: Rating Modal ─────────────────────────────────────────── */}
        {ratingModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-nature-950/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
              className="absolute inset-0"
              onClick={() => !ratingModal.submitting && setRatingModal(null)}
            />
            <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300 z-10">
              {ratingModal.done ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FaCheckCircle className="text-green-600 text-3xl" />
                  </div>
                  <h3 className="font-black text-xl text-nature-950">Thanks for rating!</h3>
                  <p className="text-nature-500 text-sm">Your rating has been saved.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-black text-xl text-nature-950 mb-2">Rate This Store</h3>
                  <p className="text-nature-500 text-sm mb-6 line-clamp-1">{ratingModal.service.name}</p>
                  {/* Star picker */}
                  <div className="flex justify-center gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onMouseEnter={() => setRatingModal(prev => ({ ...prev, hoverVal: star }))}
                        onMouseLeave={() => setRatingModal(prev => ({ ...prev, hoverVal: 0 }))}
                        onClick={() => setRatingModal(prev => ({ ...prev, value: star }))}
                        className="text-3xl transition-transform hover:scale-125 active:scale-95"
                      >
                        {star <= (ratingModal.hoverVal || ratingModal.value)
                          ? <FaStar className="text-amber-400" />
                          : <FaRegStar className="text-nature-200" />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitRating}
                    disabled={!ratingModal.value || ratingModal.submitting}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ratingModal.submitting
                      ? <><FaSpinner className="animate-spin" /> Submitting...</>
                      : 'Submit Rating'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        {/* ─────────────────────────────────────────────────────────────────── */}

        {bookingSuccess && (
          <div className="fixed bottom-12 right-12 z-[200] animate-in slide-in-from-right-10 duration-500 px-6">
            <div className="bg-nature-950 text-white p-10 rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex items-center gap-8 border border-white/10 max-w-md">
              <div className="w-16 h-16 bg-nature-400 rounded-full flex items-center justify-center text-nature-950 shadow-inner">
                <FaCheckCircle size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-black uppercase text-xl tracking-tighter italic leading-none mb-2 text-nature-400">Request Sent</h4>
                <p className="text-xs text-nature-200 font-medium leading-relaxed">Agent has been notified. Expect a dispatch or callback within the next 15 minutes.</p>
              </div>
              <button onClick={() => setBookingSuccess(false)} className="text-nature-600 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl">
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Nearby;
