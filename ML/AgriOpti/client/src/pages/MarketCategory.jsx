import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ItemModal from '../Components/Market/ItemaModal';
import { FaChevronLeft, FaStar, FaShoppingCart, FaFilter, FaSearch } from 'react-icons/fa';

const MarketCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("productType", "==", category)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          _id: doc.id
        }));
        setProducts(fetched);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'bestSeller') return (b.isTopSelling ? 1 : 0) - (a.isTopSelling ? 1 : 0);
      return 0;
    });

  const openItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-nature-50/30">
      <Navbar />
      
      <div className="flex-1 pt-24 md:pt-32">
        {/* Header */}
        <div className="bg-nature-950 text-white py-12 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-10"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <button 
              onClick={() => navigate('/market')}
              className="flex items-center gap-2 text-nature-400 hover:text-white transition-colors mb-6 text-sm font-black uppercase tracking-widest"
            >
              <FaChevronLeft /> Back to Marketplace
            </button>
            <h1 className="text-4xl md:text-5xl font-heading font-black capitalize tracking-tight">
              {category} <span className="text-nature-400">Market</span>
            </h1>
            <p className="text-nature-400 text-xs font-bold uppercase tracking-widest mt-2">
              Browse the best {category} for your farm
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-300" />
              <input 
                type="text" 
                placeholder={`Search in ${category}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-nature-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-nature-500 shadow-sm transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-400" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3 bg-white border border-nature-200 rounded-xl text-sm font-bold text-nature-700 hover:bg-nature-50 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-nature-500/20"
                >
                  <option value="featured">Featured First</option>
                  <option value="bestSeller">Best Sellers</option>
                  <option value="rating">Top Rated</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-[2rem] h-[400px] border border-nature-100 shadow-sm"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id}
                  onClick={() => openItem(product)}
                  className="group bg-white rounded-[2rem] border border-nature-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-nature-50 relative p-6 flex items-center justify-center">
                    <img 
                      loading="lazy" 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.isTopSelling && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        Best Seller
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-nature-400">{product.brand || 'Premium'}</span>
                      <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                        <FaStar /> {product.rating || 5.0}
                      </div>
                    </div>
                    <h3 className="text-xl font-heading font-black text-nature-950 mb-3 group-hover:text-nature-600 transition-colors line-clamp-1">{product.name}</h3>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-nature-50">
                      <div>
                        <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Price</p>
                        <p className="text-2xl font-heading font-black text-nature-950 italic">₹{product.price}</p>
                      </div>
                      <button className="w-10 h-10 bg-nature-950 text-white rounded-xl flex items-center justify-center group-hover:bg-nature-600 transition-colors shadow-lg">
                        <FaShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-nature-100">
              <div className="text-6xl mb-6 opacity-20">🛒</div>
              <h3 className="text-2xl font-black text-nature-950 mb-2">No products found</h3>
              <p className="text-nature-500 font-medium pb-8">There are no items currently available in this category.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-8 py-3 bg-nature-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-nature-700 transition-all"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {selectedItem && (
        <ItemModal 
          open={isModalOpen} 
          handleClose={() => setIsModalOpen(false)} 
          item={selectedItem} 
        />
      )}
    </div>
  );
};

export default MarketCategory;
