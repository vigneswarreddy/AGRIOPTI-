import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaArrowRight } from 'react-icons/fa';
import ItemModal from './Market/ItemaModal';
import { useNavigate } from 'react-router-dom';

function Tools() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("productType", "==", "tools"));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id
        }));
        setProducts(fetchedProducts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching tools from Firebase:", error);
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
    <div className="w-full py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-nature-950 tracking-tight">
              Farm <span className="text-nature-600">Tools</span>
            </h2>
            <p className="text-nature-500 font-bold uppercase tracking-widest text-xs">Essential equipment</p>
          </div>
          <button
            onClick={() => navigate('/market/tools')}
            className="group flex items-center gap-3 text-sm font-bold text-nature-600 uppercase tracking-widest hover:text-nature-950 transition-colors"
          >
            View All
            <div className="w-10 h-10 rounded-full bg-nature-600 flex items-center justify-center text-white group-hover:bg-nature-950 group-hover:scale-110 transition-all">
              <FaArrowRight className="text-xs" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => handleOpen(product)}
              className="group bg-white rounded-[2rem] p-6 border border-nature-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer h-[380px] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="w-full aspect-square rounded-2xl bg-nature-50/50 flex items-center justify-center p-6 mb-6 overflow-hidden">
                <img loading="lazy" src={product.image}
                  alt={product.name}
                  onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=No+Image';
                      e.target.onerror = null;
                  }}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-heading font-black text-nature-900 group-hover:text-nature-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-nature-500 font-medium line-clamp-2">
                  {product.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-nature-50 w-full flex items-center justify-between">
                <p className="text-xl font-heading font-black text-nature-950 italic">
                  ₹{product.price}
                </p>
                <div className="w-8 h-8 rounded-lg bg-nature-50 flex items-center justify-center text-nature-600 group-hover:bg-nature-600 group-hover:text-white transition-all">
                  <FaArrowRight className="text-[10px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <ItemModal open={open} handleClose={handleClose} item={selectedItem} />
      )}
    </div>
  );
}

export default Tools;
