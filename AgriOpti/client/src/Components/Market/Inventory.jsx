import Navbar from '../Navbar'
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryModal from './InventoryModal';
import Footer from '../Footer';
import CreateModal from './CreateModal';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';

function Inventory() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openCreate, setCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Keep essentially a dummy refresh since onSnapshot handles data changes automatically
    const fetchProducts = useCallback(() => {}, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?._id) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            let q = query(
                collection(db, "products"),
                where("createdBy", "==", user._id)
            );

            if (selectedCategory) {
                q = query(q, where("productType", "==", selectedCategory));
            }

            q = query(q, orderBy("createdAt", "desc"));

            // Real-time listener
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedProducts = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    _id: doc.id
                }));
                setProducts(fetchedProducts);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching products from Firestore:', error);
                
                // Fallback: if index is missing, try without orderBy
                if (error.code === 'failed-precondition') {
                    console.warn('Composite index missing. Fetching without ordering...');
                    let qBasic = query(
                        collection(db, "products"),
                        where("createdBy", "==", user._id)
                    );
                    if (selectedCategory) {
                        qBasic = query(qBasic, where("productType", "==", selectedCategory));
                    }
                    
                    onSnapshot(qBasic, (snap) => {
                        setProducts(snap.docs.map(d => ({ ...d.data(), _id: d.id })));
                        setLoading(false);
                    }, (innerError) => {
                        console.error('Final fetch error:', innerError);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });

            // Cleanup subscription on unmount or category change
            return () => unsubscribe();
        } catch (error) {
            console.error("Setup error:", error);
            setLoading(false);
        }
    }, [selectedCategory]);

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-nature-50">
            <Navbar />
            <div className="flex-grow flex flex-col gap-10 px-6 md:px-20 pt-32 md:pt-44 pb-12">
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <div>
                        <h1 className="text-4xl font-black text-nature-950 font-heading tracking-tight">Your Inventory</h1>
                        <p className="text-nature-600 font-medium mt-1">Manage and track your agricultural products</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        {/* Category Filter */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none bg-white border border-nature-200 text-nature-950 px-6 py-3.5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-nature-500/20 transition-all cursor-pointer pr-12 shadow-sm"
                            >
                                <option value="">All Categories</option>
                                <option value="seeds">Seeds</option>
                                <option value="crops">Crops</option>
                                <option value="pesticides">Pesticides</option>
                                <option value="fertilizers">Fertilizers</option>
                                <option value="tools">Tools</option>
                                <option value="machinery">Machinery</option>
                                <option value="irrigation">Irrigation</option>
                                <option value="greenhouses">Greenhouses</option>
                                <option value="harvesting">Harvesting</option>
                                <option value="transport">Transport</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-nature-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C2.13 5.298 2.387 4.75 2.873 4.75h9.454a.5.5 0 0 1 .37.824L7.913 11.146a.5.5 0 0 1-.666 0z"/>
                                </svg>
                            </div>
                        </div>

                        <button
                            className='px-8 py-3.5 text-white font-black uppercase tracking-widest text-sm bg-nature-700 hover:bg-nature-950 rounded-2xl transition-all shadow-xl shadow-nature-700/20 active:scale-95'
                            onClick={() => setCreate(true)}
                        >
                            + Add Product
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-16 h-16 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-nature-600 font-bold uppercase tracking-widest text-xs">Loading Inventory...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={product._id || index}
                                onClick={() => handleOpen(product)}
                                className="group flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-nature-100 hover:shadow-2xl hover:border-nature-300 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
                            >
                                <div className="h-48 w-full flex items-center justify-center mb-4 bg-nature-50 rounded-2xl overflow-hidden group-hover:bg-white transition-colors">
                                    <img loading="lazy" src={product.image} 
                                        alt={product.name} 
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/600x400?text=No+Image';
                                            e.target.onerror = null;
                                        }}
                                        className="max-h-full max-w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-400 mb-1">{product.productType}</span>
                                    <h2 className="text-xl font-bold text-nature-950 mb-2 line-clamp-1">{product.name}</h2>
                                    <p className="text-sm text-nature-600 mb-4 line-clamp-2">{product.desc}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <p className="text-2xl font-black text-nature-950">₹{product.price}</p>
                                        <div className="flex items-center gap-1 bg-nature-100 px-3 py-1 rounded-full">
                                            <span className="text-nature-700 font-bold text-xs">{product.stock} in stock</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-nature-200">
                        <div className="w-20 h-20 bg-nature-50 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-2xl font-black text-nature-950 mb-2">Inventory is Empty</h3>
                        <p className="text-nature-600 font-medium mb-8 text-center max-w-sm px-6">
                            You haven't added any products yet. Start by creating your first listing!
                        </p>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setCreate(true)}
                                className="btn-primary"
                            >
                                Create Your First Item
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {selectedItem && (
                <InventoryModal open={open} handleClose={handleClose} item={selectedItem} refresh={fetchProducts} />
            )}
            {openCreate && <CreateModal setOpen={setCreate} refresh={fetchProducts} />}
            <Footer />
        </div>
    )
}

export default Inventory;