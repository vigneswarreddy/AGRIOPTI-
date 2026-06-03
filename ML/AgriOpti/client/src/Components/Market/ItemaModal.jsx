import React, { useState } from 'react';
import { FaTimes, FaStar, FaLeaf, FaRecycle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import Modal from '../Shared/Modal';

function ItemModal({ open, handleClose, item }) {
  if (!open || !item) return null;
  const user = JSON.parse(localStorage.getItem('user'));
  const [orderStatus, setOrderStatus] = useState('idle'); // idle | loading | success | error
  const [quantity, setQuantity] = useState(1);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={`text-sm ${i < rating ? 'text-earth-400' : 'text-nature-100'}`} />
        ))}
      </div>
    );
  };

  const handleBuyNow = async () => {
    if (!user || !user._id) {
      alert('Please log in to place an order.');
      return;
    }

    if (item.createdBy === user._id) {
      alert("You cannot buy your own product.");
      return;
    }

    if (quantity > item.stock) {
      alert("Not enough stock available.");
      return;
    }

    setOrderStatus('loading');
    try {
      const parsedPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

      // ─── Instant Stock Decrement & Order Logging ──────────────
      // Deduct stock from the product
      const productRef = doc(db, 'products', item._id);
      await updateDoc(productRef, {
        stock: increment(-quantity)
      });

      // Build the order document following the new schema
      const orderData = {
        buyerId: user._id,
        buyerName: user.name || user.email || 'Buyer',
        sellerId: item.createdBy || 'Unknown',
        sellerName: 'Seller',
        productId: item._id || '',
        productName: item.name,
        quantity: quantity,
        price: parsedPrice,
        totalAmount: parsedPrice * quantity,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setOrderStatus('success');

      // Auto-close after showing success
      setTimeout(() => {
        setOrderStatus('idle');
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('error');
      setTimeout(() => setOrderStatus('idle'), 3000);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={item.name}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col md:flex-row h-full -m-8">
        {/* Product Image Section */}
        <div className="w-full md:w-2/5 bg-nature-50 p-8 flex items-center justify-center relative border-r border-nature-100">
          <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-nature-600 text-[10px] font-black text-white uppercase tracking-widest leading-none shadow-lg shadow-nature-600/20">
            Verified
          </div>
          <img loading="lazy" src={item.image}
            alt={item.name}
            className="w-full h-auto max-w-[220px] drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-3/5 p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {renderStars(item.rating || 5)}
                <span className="text-xs font-bold text-nature-400">({item.sale || 0} Sold)</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-400 mb-1 block">{item.productType}</span>
            </div>

            <p className="text-nature-600 font-medium leading-relaxed">
              {item.desc}
            </p>

            <div className="flex flex-wrap gap-4 py-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nature-50 border border-nature-100 text-nature-600">
                <FaLeaf className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider">Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nature-50 border border-nature-100 text-nature-600">
                <FaRecycle className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider">Zero Waste</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-end justify-between border-t border-nature-100 pt-6">
              <div>
                <p className="text-xs font-bold text-nature-400 uppercase tracking-widest mb-1">Price / Unit</p>
                <p className="text-4xl font-heading font-black text-nature-950 tracking-tighter italic">
                  ₹{item.price}
                </p>
              </div>
              {item.stock > 0 && user?._id !== item.createdBy && (
                <div className="flex flex-col items-center">
                  <p className="text-xs font-bold text-nature-400 uppercase tracking-widest mb-1">Quantity</p>
                  <div className="flex items-center gap-4 bg-nature-50 border border-nature-200 rounded-xl px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm border border-nature-100 text-nature-900 font-bold hover:bg-nature-100 transition"
                    >-</button>
                    <span className="font-bold text-nature-900 w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm border border-nature-100 text-nature-900 font-bold hover:bg-nature-100 transition"
                    >+</button>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs font-bold text-nature-400 uppercase tracking-widest mb-1">Availability</p>
                <p className={`text-sm font-bold ${item.stock > 10 ? 'text-nature-600' : 'text-red-500'}`}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {user?._id !== item.createdBy && item.stock > 0 && (
                <p className="text-sm text-nature-600 font-medium text-right w-full">Total: <span className="font-bold text-nature-900">₹{(item.price * quantity).toLocaleString()}</span></p>
              )}
              <button
                onClick={handleBuyNow}
                disabled={item.stock <= 0 || item.createdBy === user._id || orderStatus === 'loading' || orderStatus === 'success'}
                className={`btn-primary w-full py-5 text-xl tracking-tight shadow-xl shadow-nature-600/20 flex items-center justify-center gap-3 ${orderStatus === 'success' ? 'bg-green-600' :
                  orderStatus === 'error' ? 'bg-red-600' : ''
                  } ${item.createdBy === user._id ? 'opacity-50 cursor-not-allowed bg-nature-300' : ''}`}
              >
                {orderStatus === 'loading' && <FaSpinner className="animate-spin" />}
                {orderStatus === 'success' && <FaCheckCircle />}
                {orderStatus === 'loading' ? 'Placing Order...' :
                  orderStatus === 'success' ? 'Order Placed! ✓' :
                    orderStatus === 'error' ? 'Failed — Try Again' :
                      item.createdBy === user._id ? 'Your Product' :
                        item.stock > 0 ? 'Purchase Now' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ItemModal;
