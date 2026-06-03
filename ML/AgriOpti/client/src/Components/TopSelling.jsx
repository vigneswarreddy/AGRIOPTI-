import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ItemModal from './Market/ItemaModal';

function TopSelling() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const q = query(collection(db, "products"), where("isTopSelling", "==", true));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
        setProducts(fetched);
      } catch (err) {
        console.error("Error fetching top selling items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSelling();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="w-full py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-nature-950 tracking-tight">
              Top Selling <span className="text-nature-600">Items</span>
            </h2>
            <p className="text-nature-500 font-bold uppercase tracking-widest text-xs">Most loved by our community</p>
          </div>
          <div className="w-24 h-1 bg-nature-100 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-nature-600 w-1/3 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        <div className="mx-[-1rem]">
          {loading ? (
            <div className="flex gap-8 px-4 overflow-hidden">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="min-w-[250px] h-[350px] bg-nature-50 rounded-[2rem] animate-pulse"></div>
               ))}
            </div>
          ) : (
            <Slider {...settings} className="w-full">
              {products.length > 0 ? products.map((sale, index) => (
                <div key={index} className="px-4 py-6">
                  <div
                    onClick={() => handleOpen(sale)}
                    className="group bg-white rounded-[2rem] p-6 border border-nature-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer h-[380px] flex flex-col items-center text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nature-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-full aspect-square rounded-2xl bg-nature-50 flex items-center justify-center p-6 mb-6 overflow-hidden">
                      <img loading="lazy" src={sale.image}
                        alt={sale.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="space-y-2 flex-grow">
                      <h3 className="text-xl font-heading font-black text-nature-900 group-hover:text-nature-600 transition-colors line-clamp-1">
                        {sale.name}
                      </h3>
                      <p className="text-sm text-nature-500 font-medium line-clamp-2">
                        {sale.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-nature-50 w-full">
                      <p className="text-2xl font-heading font-black text-nature-950 italic">
                         ₹{sale.price}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-nature-400 font-bold uppercase tracking-widest">No featured items found</div>
              )}
            </Slider>
          )}
        </div>
      </div>
      {selectedItem && (
        <ItemModal open={open} handleClose={handleClose} item={selectedItem} />
      )}
    </div>
  );
}

export default TopSelling;
