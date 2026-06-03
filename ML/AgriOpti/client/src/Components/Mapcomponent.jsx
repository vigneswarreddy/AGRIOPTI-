import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaRoute, FaPhoneAlt, FaStar } from 'react-icons/fa';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom, selectedService }) {
  const map = useMap();
  useEffect(() => {
    if (selectedService && selectedService.lat && selectedService.lng) {
      map.setView([selectedService.lat, selectedService.lng], 15);
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, map, selectedService]);
  return null;
}

function MapComponent({ location, services = [], onServiceSelect, selectedService, onNavigate }) {

  useEffect(() => {
    console.log("MapComponent received services:", services);
  }, [services]);

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      zoomControl={false}
    >
      <ChangeView
        center={[location.latitude, location.longitude]}
        zoom={13}
        selectedService={selectedService}
      />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User Location Marker */}
      <Marker position={[location.latitude, location.longitude]} icon={redIcon}>
        <Popup className="custom-popup">
          <div className="p-2 text-center">
            <p className="font-black text-nature-950 uppercase text-[10px] tracking-widest leading-none">Your Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Service Markers */}
      {services && services.length > 0 && services.map((service) => (
        service.lat && service.lng && (
          <Marker
            key={service.id}
            position={[service.lat, service.lng]}
            icon={selectedService?.id === service.id ? highlightIcon : greenIcon}
            eventHandlers={{
              click: () => onServiceSelect(service),
            }}
          >
            <Popup className="rounded-3xl overflow-hidden">
              <div className="w-64 p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-nature-950 leading-tight uppercase italic">{service.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500 text-[10px]">
                      {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                    </div>
                    <span className="text-[9px] font-bold text-nature-400">({service.rating})</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase text-nature-500 border-t border-nature-100 pt-3">
                  <span>{service.distance}</span>
                  <span className="text-nature-950">{service.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="py-2.5 bg-nature-50 text-nature-950 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-nature-100">
                    <FaPhoneAlt size={10} /> Call
                  </button>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate(service);
                    }}
                    className="py-2.5 bg-nature-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-nature-950/20"
                  >
                    <FaRoute size={12} /> Directions
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default MapComponent;
