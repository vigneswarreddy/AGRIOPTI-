import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../Components/Navbar';

const SAMPLE_PRODUCTS = [
  // ── SEEDS ─────────────────────────────────────────────────────────────
  {
    name: "Golden Hybrid Wheat Seeds", productType: "seeds", brand: "AgriSeeds", price: 1200, sale: 450, stock: 100, isTopSelling: true, createdBy: 'admin',
    desc: "High-yield hybrid wheat seeds resistant to rust and drought. Pack of 10kg.",
    image: "/products/seed_wheat.png"
  },
  {
    name: "Organic Basmati Paddy Seeds", productType: "seeds", brand: "NatureGold", price: 2500, sale: 300, stock: 50, isTopSelling: false, createdBy: 'admin',
    desc: "Traditional aromatic Basmati paddy seeds. 100% organic and non-GMO.",
    image: "/products/seed_paddy.png"
  },
  {
    name: "Hybrid Sunflower Seeds", productType: "seeds", brand: "SunBloom", price: 1800, sale: 150, stock: 80, isTopSelling: true, createdBy: 'admin',
    desc: "Large black and striped sunflower seeds with high oil content. 5kg pack.",
    image: "/products/seed_sunflower.png"
  },
  {
    name: "Golden Corn Seeds", productType: "seeds", brand: "MaizeMagic", price: 900, sale: 200, stock: 120, isTopSelling: true, createdBy: 'admin',
    desc: "Extra sweet hybrid corn seeds. High germination rate.",
    image: "/products/seed_maize.png"
  },
  {
    name: "Black Beauty Cotton Seeds", productType: "seeds", brand: "CottonKing", price: 3500, sale: 10, stock: 25, isTopSelling: false, createdBy: 'admin',
    desc: "Premium quality cotton seeds for high-fiber yield.",
    image: "/products/seed_cotton.png"
  },
  {
    name: "Red Cluster Tomato Seeds", productType: "seeds", brand: "VeggieGrow", price: 600, sale: 500, stock: 120, isTopSelling: true, createdBy: 'admin',
    desc: "High-yielding cherry tomato seeds for greenhouse and open fields.",
    image: "/products/hybrid-tomato-seeds.jpg"
  },

  // ── CROPS ─────────────────────────────────────────────────────────────
  {
    name: "Organic Basmati Rice", productType: "crops", brand: "Heritage", price: 4500, sale: 120, stock: 200, isTopSelling: true, createdBy: 'admin',
    desc: "Premium long-grain Basmati rice. Aged for 2 years for superior aroma. 50kg.",
    image: "/products/crop_rice.png"
  },
  {
    name: "Yellow Dried Corn", productType: "crops", brand: "AgriGrain", price: 1800, sale: 500, stock: 5000, isTopSelling: false, createdBy: 'admin',
    desc: "Freshly dried yellow corn suitable for animal feed or industrial use. Per ton.",
    image: "/products/crop_corn.png"
  },
  {
    name: "Red Chilli Dry (Guntur)", productType: "crops", brand: "SpiceRoute", price: 250, sale: 1000, stock: 500, isTopSelling: true, createdBy: 'admin',
    desc: "World-famous Guntur red chillies. Dry, spicy, and perfectly cured. Per kg.",
    image: "/products/crop_chili.png"
  },
  {
    name: "Fresh Turmeric Bulbs", productType: "crops", brand: "EarthRoot", price: 150, sale: 800, stock: 300, isTopSelling: false, createdBy: 'admin',
    desc: "Raw turmeric bulbs with high curcumin content. Harvested daily. Per kg.",
    image: "/products/crop_watermelon.png"
  },
  {
    name: "Organic Pearl Millet", productType: "crops", brand: "HealthFirst", price: 65, sale: 2000, stock: 1000, isTopSelling: true, createdBy: 'admin',
    desc: "Nutritious organic Bajra. Directly sourced from Rajasthani farms. Per kg.",
    image: "/products/crop_spinach.png"
  },

  // ── PESTICIDES ─────────────────────────────────────────────────────────────
  {
    name: "Neem Power Organic Pesticide", productType: "pesticides", brand: "EcoGuard", price: 850, sale: 1200, stock: 50, isTopSelling: true, createdBy: 'admin',
    desc: "100% organic neem-based pesticide for all crops. Natural and safe.",
    image: "/products/pest_bio_guard.png"
  },
  {
    name: "Broad Spectrum Fungicide", productType: "pesticides", brand: "PureCrop", price: 550, sale: 600, stock: 100, isTopSelling: false, createdBy: 'admin',
    desc: "Controls early and late blight on potatoes, tomatoes, and grapes.",
    image: "/products/crop-defender-liquid.jpg"
  },
  {
    name: "Herbal Multi-Action Insecticide", productType: "pesticides", brand: "GreenHeal", price: 1200, sale: 400, stock: 30, isTopSelling: true, createdBy: 'admin',
    desc: "Plant-based concentrate to control aphids, thrips, and mites.",
    image: "/products/pest_insecticide.png"
  },
  {
    name: "Snail & Slug Repellent", productType: "pesticides", brand: "SafeGarden", price: 400, sale: 200, stock: 15, isTopSelling: false, createdBy: 'admin',
    desc: "Eco-friendly granules to protect seedlings from garden gastropods.",
    image: "/products/pest_insecticide.png"
  },
  {
    name: "Eco-Friendly Rodent Control", productType: "pesticides", brand: "AgriShield", price: 300, sale: 1500, stock: 200, isTopSelling: true, createdBy: 'admin',
    desc: "Humane and safe rodent control solutions for warehouses and farms.",
    image: "/products/pest_bio_guard.png"
  },

  // ── FERTILIZERS ─────────────────────────────────────────────────────────────
  {
    name: "NutriGrow NPK 19:19:19", productType: "fertilizers", brand: "NutriSoil", price: 1500, sale: 300, stock: 75, isTopSelling: true, createdBy: 'admin',
    desc: "Water soluble fertilizer for balanced nutrition during growth stages.",
    image: "/products/crop-guard-concentrate.jpg"
  },
  {
    name: "Organic Vermicompost", productType: "fertilizers", brand: "EarthWorm", price: 450, sale: 5000, stock: 1000, isTopSelling: true, createdBy: 'admin',
    desc: "Nutrient-rich organic compost produced by earthworms. 25kg bag.",
    image: "/products/bio-pest-control.jpg"
  },
  {
    name: "Liquid Seaweed Extract", productType: "fertilizers", brand: "OceanBio", price: 800, sale: 200, stock: 40, isTopSelling: false, createdBy: 'admin',
    desc: "Natural growth booster enriched with micronutrients from marine algae.",
    image: "/products/leaf-armor-spray.jpg"
  },
  {
    name: "Micronutrient Mixture", productType: "fertilizers", brand: "AgriMinerals", price: 650, sale: 150, stock: 60, isTopSelling: false, createdBy: 'admin',
    desc: "Zinc, Boron, and Iron mixture to correct chronic soil deficiencies.",
    image: "/products/plant-protect-plus.jpg"
  },
  {
    name: "Water-Soluble Boron 20%", productType: "fertilizers", brand: "CrystalGrow", price: 350, sale: 400, stock: 80, isTopSelling: true, createdBy: 'admin',
    desc: "Essential for flower and fruit development. Fast absorption.",
    image: "/products/fungus-shield.jpg"
  },

  // ── TOOLS ─────────────────────────────────────────────────────────────
  {
    name: "Stainless Steel Spade", productType: "tools", brand: "IronStrength", price: 450, sale: 500, stock: 150, isTopSelling: false, createdBy: 'admin',
    desc: "Heavy-duty ergonomic garden spade for digging and soil preparation.",
    image: "/products/steel-hand-hoe.jpg"
  },
  {
    name: "Professional Pruning Shears", productType: "tools", brand: "SharpCut", price: 850, sale: 300, stock: 40, isTopSelling: true, createdBy: 'admin',
    desc: "Carbon steel blades for precise and easy pruning of trees and shrubs.",
    image: "/products/pruning-shears.jpg"
  },
  {
    name: "Ergonomic Hand Trowel", productType: "tools", brand: "GardenSoft", price: 250, sale: 1000, stock: 200, isTopSelling: true, createdBy: 'admin',
    desc: "Lightweight rust-resistant trowel with comfort grip.",
    image: "/products/hand-trowel.jpg"
  },
  {
    name: "Heavy-Duty Digging Fork", productType: "tools", brand: "RootForce", price: 1200, sale: 150, stock: 30, isTopSelling: false, createdBy: 'admin',
    desc: "Four-tine forged steel fork for breaking up compacted soil.",
    image: "/products/garden-fork.jpg"
  },
  {
    name: "Folding Saw (Curved Blade)", productType: "tools", brand: "ForestEdge", price: 650, sale: 450, stock: 50, isTopSelling: true, createdBy: 'admin',
    desc: "Efficient pull-action saw for thick branches and camp work.",
    image: "/products/garden-knife.jpg"
  },

  // ── MACHINERY ─────────────────────────────────────────────────────────────
  {
    name: "Digital Soil Moisture Meter", productType: "machinery", brand: "SmartFarm", price: 4500, sale: 85, stock: 20, isTopSelling: true, createdBy: 'admin',
    desc: "Instant soil moisture, PH, and light levels. Battery operated with digital display.",
    image: "/products/soil-cultivator.jpg"
  },
  {
    name: "Battery Powered Knapsack Sprayer", productType: "machinery", brand: "AgriPower", price: 3200, sale: 500, stock: 45, isTopSelling: true, createdBy: 'admin',
    desc: "16-liter electric sprayer with 8 hours battery life. Multiple nozzles.",
    image: "/products/weedicide.png"
  },
  {
    name: "Portable Rice Huller", productType: "machinery", brand: "VillageMachinery", price: 25000, sale: 10, stock: 2, isTopSelling: false, createdBy: 'admin',
    desc: "Compact 2HP machine to remove husks from paddy. High efficiency.",
    image: "/products/rotavator.png"
  },
  {
    name: "Solar-Powered Water Pump", productType: "machinery", brand: "HelioPump", price: 45000, sale: 25, stock: 5, isTopSelling: true, createdBy: 'admin',
    desc: "Energy-efficient 1HP submersible pump with solar panel kit.",
    image: "/products/insecticide.png"
  },
  {
    name: "Brush Cutter (Petrol)", productType: "machinery", brand: "PowerBlade", price: 12500, sale: 60, stock: 12, isTopSelling: false, createdBy: 'admin',
    desc: "Powerful 52cc engine for heavy grass and brush clearing.",
    image: "/products/weeding-tool.jpg"
  },

  // ── IRRIGATION ─────────────────────────────────────────────────────────────
  {
    name: "Drip Irrigation Kit (1 Acre)", productType: "irrigation", brand: "WaterSmart", price: 18000, sale: 40, stock: 10, isTopSelling: true, createdBy: 'admin',
    desc: "Complete kit including laterals, drippers, and filtration unit.",
    image: "/products/pumpkin-seeds.jpg"
  },
  {
    name: "Automatic Sprinkler Head", productType: "irrigation", brand: "RainMaker", price: 450, sale: 2000, stock: 500, isTopSelling: true, createdBy: 'admin',
    desc: "360-degree rotating sprinkler with adjustable radius. High durability.",
    image: "/products/spinach-seeds.jpg"
  },
  {
    name: "Venturi Fertilizer Injector", productType: "irrigation", brand: "FertFlow", price: 2200, sale: 100, stock: 25, isTopSelling: false, createdBy: 'admin',
    desc: "Easily inject liquid fertilizers directly into your irrigation stream.",
    image: "/products/cucumber-seeds.jpg"
  },
  {
    name: "Rain Gun Sprinkler", productType: "irrigation", brand: "MegaWater", price: 8500, sale: 15, stock: 8, isTopSelling: false, createdBy: 'admin',
    desc: "Long-throw sprinkler for large-scale field irrigation. Stainless steel.",
    image: "/products/carrot-seeds.jpg"
  },
  {
    name: "Smart Irrigation Controller", productType: "irrigation", brand: "AgriTech", price: 12000, sale: 30, stock: 15, isTopSelling: true, createdBy: 'admin',
    desc: "Wi-Fi enabled timer. Syncs with weather data to optimize watering.",
    image: "/products/chili-seeds.jpg"
  },

  // ── GREENHOUSES ─────────────────────────────────────────────────────────────
  {
    name: "Walk-in Tunnel Greenhouse", productType: "greenhouses", brand: "EcoGrow", price: 12000, sale: 20, stock: 5, isTopSelling: true, createdBy: 'admin',
    desc: "UV-resistant polyethylene cover with galvanized steel frame. 10x20ft.",
    image: "/products/planting-dibber.jpg"
  },
  {
    name: "Mini Tabletop Greenhouse", productType: "greenhouses", brand: "UrbanFarm", price: 1500, sale: 100, stock: 50, isTopSelling: false, createdBy: 'admin',
    desc: "Perfect for starting seeds on your patio or indoors. Compact design.",
    image: "/products/garden-rake.jpg"
  },
  {
    name: "Automatic Ventilation Kit", productType: "greenhouses", brand: "BreezeTech", price: 3500, sale: 45, stock: 20, isTopSelling: true, createdBy: 'admin',
    desc: "Solar-powered fan and vent opener to maintain optimal temperature.",
    image: "/products/eco-pest-solution.jpg"
  },
  {
    name: "Hydroponic Tower System", productType: "greenhouses", brand: "AquaFlow", price: 8500, sale: 30, stock: 12, isTopSelling: false, createdBy: 'admin',
    desc: "Vertical growing system for 20 plants. Ideal for greenhouse use.",
    image: "/products/insect-guard-spray.jpg"
  },
  {
    name: "Greenhouse Mist Cooling", productType: "greenhouses", brand: "CoolMist", price: 2200, sale: 80, stock: 30, isTopSelling: true, createdBy: 'admin',
    desc: "Low-pressure misting system to lower temperature by 10-15 degrees.",
    image: "/products/plant-protect-plus.jpg"
  },

  // ── HARVESTING ─────────────────────────────────────────────────────────────
  {
    name: "Fruit Picker with Extension", productType: "harvesting", brand: "ReachHigh", price: 750, sale: 150, stock: 60, isTopSelling: true, createdBy: 'admin',
    desc: "Lightweight aluminum pole with cushioned basket for bruise-free picking.",
    image: "/products/garden-fork.jpg"
  },
  {
    name: "Industrial Potato Harvester", productType: "harvesting", brand: "RootMaster", price: 85000, sale: 5, stock: 2, isTopSelling: false, createdBy: 'admin',
    desc: "Tractor-mounted harvester with gentle shaking action for root crops.",
    image: "/products/rotavator.png"
  },
  {
    name: "Cotton Picking Bag (Extra Large)", productType: "harvesting", brand: "FiberField", price: 350, sale: 500, stock: 200, isTopSelling: true, createdBy: 'admin',
    desc: "Durable canvas bag with comfortable shoulder straps. 50kg capacity.",
    image: "/products/eco-pest-solution.jpg"
  },
  {
    name: "Mechanized Corn Picker", productType: "harvesting", brand: "CobKing", price: 120000, sale: 3, stock: 1, isTopSelling: false, createdBy: 'admin',
    desc: "Self-propelled harvester for small to medium corn fields.",
    image: "/products/cotton_seeds.png"
  },
  {
    name: "Pruning and Harvesting Knife", productType: "harvesting", brand: "SharpEdge", price: 180, sale: 1000, stock: 500, isTopSelling: true, createdBy: 'admin',
    desc: "Stainless steel curved blade for quick harvesting of leafy greens.",
    image: "/products/garden-knife.jpg"
  },

  // ── TRANSPORT ─────────────────────────────────────────────────────────────
  {
    name: "Heavy-Duty Farm Trailer", productType: "transport", brand: "LoadMaster", price: 150000, sale: 10, stock: 3, isTopSelling: true, createdBy: 'admin',
    desc: "4-ton capacity hydraulic tipping trailer for tractors.",
    image: "/products/rotavator.png"
  },
  {
    name: "Vegetable Crates (Set of 10)", productType: "transport", brand: "PackSafe", price: 1500, sale: 500, stock: 100, isTopSelling: true, createdBy: 'admin',
    desc: "Stackable food-grade plastic crates for fresh produce transport.",
    image: "/products/soil-cultivator.jpg"
  },
  {
    name: "Cold Storage Transport Van", productType: "transport", brand: "FreshLogistics", price: 1800000, sale: 2, stock: 1, isTopSelling: false, createdBy: 'admin',
    desc: "Refrigerated van for preserving quality during long-distance delivery.",
    image: "/products/weedicide.png"
  },
  {
    name: "Grain Loading Conveyor", productType: "transport", brand: "BeltLink", price: 45000, sale: 8, stock: 4, isTopSelling: true, createdBy: 'admin',
    desc: "15ft mobile belt conveyor for efficient grain loading into trucks.",
    image: "/products/insecticide.png"
  },
  {
    name: "Electric Utility Cart", productType: "transport", brand: "EcoCart", price: 85000, sale: 12, stock: 6, isTopSelling: false, createdBy: 'admin',
    desc: "Silent electric cart for moving supplies around the farm. 500kg limit.",
    image: "/products/weeding-tool.jpg"
  }
];

const Seeder = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    setStatus('Seeding data...');
    try {
      const colRef = collection(db, 'products');
      
      // Fetch existing admin products to check for duplicates by name
      setStatus('Deduplicating...');
      const q = query(colRef, where("createdBy", "==", "admin"));
      const snap = await getDocs(q);
      const existingNames = new Set(snap.docs.map(doc => doc.data().name));

      const newProducts = SAMPLE_PRODUCTS.filter(p => !existingNames.has(p.name));

      if (newProducts.length === 0) {
          setStatus('All products already exist. No new data added.');
          setLoading(false);
          return;
      }

      setStatus(`Writing ${newProducts.length} new products...`);
      const uploadPromises = newProducts.map(p => addDoc(colRef, { ...p, createdAt: serverTimestamp() }));
      await Promise.all(uploadPromises);
      
      setStatus(`Success! Added ${newProducts.length} new products.`);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
      if(!window.confirm("Delete ALL admin products?")) return;
      setLoading(true);
      try {
          const q = query(collection(db, 'products'), where("createdBy", "==", "admin"));
          const snap = await getDocs(q);
          await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
          setStatus('Database cleared of admin data.');
      } catch (e) {
          setStatus('Error clearing: ' + e.message);
      }
      setLoading(false);
  }

  return (
    <div className="min-h-screen bg-nature-50 flex flex-col items-center justify-center p-10 pt-40">
      <Navbar />
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg w-full text-center border border-nature-100">
        <div className="w-24 h-24 bg-nature-950 rounded-3xl flex items-center justify-center text-4xl mb-8 mx-auto shadow-xl shadow-nature-950/20">🚀</div>
        <h1 className="text-4xl font-heading font-black text-nature-950 mb-4 tracking-tight">System Seeder</h1>
        <p className="text-nature-600 mb- aggregation-8 font-medium px-4 leading-relaxed">Populate your Firestore with 35+ high-quality agricultural products across 7 categories.</p>
        
        <div className="bg-nature-50/50 p-6 rounded-3xl border border-nature-100 mb-10 flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-400 mb-2">Live Status</p>
            <p className="text-sm font-bold text-nature-950">{status || 'System Standby'}</p>
        </div>

        <div className="flex flex-col gap-4">
            <button 
                onClick={seedData}
                disabled={loading}
                className="w-full py-5 bg-nature-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-nature-700 transition-all shadow-xl shadow-nature-950/30 disabled:opacity-50 active:scale-95"
            >
            {loading ? 'Executing...' : 'Seed 35+ Sample Products'}
            </button>
            <button 
                onClick={handleClear}
                disabled={loading}
                className="w-full py-4 text-red-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all active:scale-95 border border-red-100"
            >
            Clear Admin Products
            </button>
        </div>
        
        <p className="mt-8 text-[10px] text-nature-300 font-bold uppercase tracking-widest">AgriOpti Data Utility v2.0</p>
      </div>
    </div>
  );
};

export default Seeder;
