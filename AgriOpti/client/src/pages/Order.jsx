import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { db } from '../firebase';
import {
    collection, query, where, onSnapshot,
    doc, updateDoc, serverTimestamp, orderBy, getDoc, increment
} from 'firebase/firestore';
import {
    FaBox, FaShoppingBag, FaArrowLeft, FaTag, FaInfoCircle,
    FaCheckCircle, FaTimesCircle, FaSpinner, FaTruck, FaClock, FaStore
} from 'react-icons/fa';



// ─── Farmer Order Card ────────────────────────────────────────────────────────
const FarmerOrderCard = ({ order, onDetails }) => (
    <div className="glass rounded-[2.5rem] p-8 border-white/60 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nature-400/5 rounded-bl-[100px] -z-10 group-hover:bg-nature-400/10 transition-colors" />

        <div className="flex-grow space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-nature-500">
                    <FaTag size={10} />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                        Order #{order.id?.slice(-6).toUpperCase()}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-100 text-blue-700 border-blue-200">
                    <FaCheckCircle /> Purcased
                </span>
            </div>

            {/* Items list */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Item details</p>
                <div className="flex justify-between text-sm font-medium text-nature-800">
                    <span>{order.productName || 'Product'} × {order.quantity || 1}</span>
                    <span className="text-nature-600 font-bold">₹{(order.price || 0).toLocaleString()} / unit</span>
                </div>
            </div>

            {/* Total */}
            <div className="border-t border-nature-100/50 pt-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest leading-none">Total</p>
                    <p className="text-2xl font-heading font-black text-nature-950 tracking-tighter">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={() => onDetails(order)}
                    className="px-5 py-2 rounded-full bg-nature-50 border border-nature-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nature-700 shadow-sm hover:bg-nature-100 transition-all active:scale-95"
                >
                    <FaInfoCircle className="text-nature-400" /> Details
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Order Page ──────────────────────────────────────────────────────────
function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { _id: 'guest', role: '' };

    useEffect(() => {
        if (!user._id || user._id === 'guest') {
            setLoading(false);
            return;
        }

        setLoading(true);

        const q = query(
            collection(db, 'orders'),
            where('buyerId', '==', user._id),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setOrders(fetched);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching orders:', err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user._id]);
    const pageSubtitle = 'Manage and track the agricultural supplies you have purchased.';

    return (
        <div className="min-h-screen flex flex-col bg-nature-50/30 relative">
            <Navbar />

            <main className="flex-grow pt-[88px]">
                {/* Header Section */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 relative z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[150px] bg-emerald-400/20 blur-[100px] rounded-full -z-10"></div>
                    
                    <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col items-center text-center space-y-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                        
                        <div className="relative z-10 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            <FaShoppingBag /> Orders Management
                        </div>
                        <div className="relative z-10 space-y-2">
                            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-tight uppercase text-white">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Purchases</span>
                            </h1>
                            <p className="text-nature-300 text-sm md:text-base font-medium max-w-2xl mx-auto">
                                {pageSubtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-nature-600 font-bold uppercase tracking-widest text-xs mb-10 hover:text-nature-950 transition-colors group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>


                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <FaSpinner className="animate-spin text-nature-400 text-4xl mb-4" />
                            <p className="text-nature-500 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="glass rounded-[3rem] p-20 text-center space-y-6 border-white/60">
                            <div className="w-24 h-24 rounded-full bg-nature-100 flex items-center justify-center text-nature-400 mx-auto">
                                <FaBox size={40} />
                            </div>
                            <h2 className="text-3xl font-heading font-black text-nature-950 tracking-tight">
                                No purchases found
                            </h2>
                            <p className="text-nature-500 font-medium">
                                Start exploring our market to find the best agricultural tools and supplies.
                            </p>
                            <Link to="/market" className="btn-primary inline-flex py-4 px-10">Visit Market</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {orders.map(order => (
                                <FarmerOrderCard
                                    key={order.id}
                                    order={order}
                                    onDetails={setSelectedOrder}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Order Details Modal (Farmer) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-nature-950/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="glass w-full max-w-lg rounded-[3rem] overflow-hidden relative z-10 animate-in zoom-in fade-in duration-300 border-white/40 p-10 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Order Details</p>
                                <h2 className="text-2xl font-heading font-black text-nature-950 mt-1">
                                    #{selectedOrder.id?.slice(-6).toUpperCase()}
                                </h2>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-100 text-blue-700 border-blue-200">
                                <FaCheckCircle /> Purcased
                            </span>
                        </div>

                        <div className="space-y-3 border-t border-nature-100 pt-6">
                            <div className="flex justify-between text-sm font-medium text-nature-800 bg-nature-50 rounded-2xl px-4 py-3">
                                <span>{selectedOrder.productName || 'Product'} × {selectedOrder.quantity || 1}</span>
                                <span className="font-bold">₹{(selectedOrder.price * selectedOrder.quantity || selectedOrder.totalAmount || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-nature-100 pt-4 flex justify-between items-center">
                            <span className="font-black text-nature-500 text-xs uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-black text-nature-950">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-4 btn-primary py-4 w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Order;
