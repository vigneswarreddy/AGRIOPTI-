import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ItemModal from './ItemaModal';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Crops() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Show all products in the marketplace (approval logic removed)
        const q = query(
          collection(db, "products"),
          where("productType", "==", "crops")
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          _id: doc.id
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching crops from Firebase:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-nature-50/50 border-b border-nature-100 py-12 md:py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto space-y-6">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center gap-2 text-sm font-bold text-nature-600 uppercase tracking-widest hover:text-nature-950 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Market
            </button>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-heading font-black text-nature-950 tracking-tight leading-none">
                Seeds & <span className="text-nature-600 italic">Crops</span>
              </h1>
              <p className="text-nature-500 font-medium text-lg max-w-2xl">
                Premium quality seeds for a prosperous harvest. High germination rates and optimized genetics for sustainable farming.
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {Products.map((sale, index) => (
              <div
                key={index}
                onClick={() => handleOpen(sale)}
                className="group bg-white rounded-[2.5rem] p-8 border border-nature-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="w-full aspect-square rounded-3xl bg-nature-50/50 flex items-center justify-center mb-8 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-nature-600 uppercase tracking-widest leading-none border border-nature-100">
                    Stock: {sale.stock || 0}
                  </div>
                  <img loading="lazy" src={sale.image}
                    alt={sale.name}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=No+Image';
                      e.target.onerror = null;
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="space-y-3 flex-grow">
                  <h3 className="text-2xl font-heading font-black text-nature-950 group-hover:text-nature-600 transition-colors leading-tight">
                    {sale.name}
                  </h3>
                  <p className="text-sm text-nature-500 font-medium line-clamp-2 leading-relaxed">
                    {sale.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-nature-50 w-full">
                  <p className="text-3xl font-heading font-black text-nature-950 italic">
                    ₹{sale.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedItem && (
        <ItemModal open={open} handleClose={handleClose} item={selectedItem} />
      )}
      <Footer />
    </div>
  );
}

export default Crops;
