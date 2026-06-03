import React, { useState } from 'react';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Modal from '../Shared/Modal';

function ItemModal({ open, handleClose, item, refresh }) {
  const [newStock, setNewStock] = useState(item ? item.stock : '');
  const [status, setStatus] = useState({ type: '', message: '' });



  const handleStockUpdate = async () => {
    if (!newStock) return;
    setStatus({ type: 'loading', message: 'Updating stock...' });
    try {
      const productRef = doc(db, "products", item._id);
      await updateDoc(productRef, {
        stock: Number(newStock)
      });
      
      setStatus({ type: 'success', message: 'Stock updated successfully!' });
      if (refresh) refresh();
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
      console.error('Firestore Update Error:', error);
      setStatus({ type: 'error', message: 'Failed to update stock in Firestore' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setStatus({ type: 'loading', message: 'Deleting product...' });
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, "products", item._id));
      
      setStatus({ type: 'success', message: 'Product deleted successfully!' });
      if (refresh) refresh();
      setTimeout(() => {
        setStatus({ type: '', message: '' });
        handleClose();
      }, 1500);
    } catch (error) {
      setStatus({ type: 'error', message: 'Error deleting product' });
      console.error('Delete error:', error);
    }
  };

  if (!open || !item) return null;

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Inventory Management"
      maxWidth="max-w-xl"
    >
      <div className="-m-8">
        {/* Header/Image Section */}
        <div className="bg-nature-50 p-8 flex flex-col items-center border-b border-nature-100">
          <div className="w-40 h-40 bg-white rounded-3xl shadow-sm border border-nature-100 flex items-center justify-center p-4 mb-6">
            <img loading="lazy" src={item.image} 
              alt={item.name} 
              onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=No+Image';
                  e.target.onerror = null;
              }}
              className="max-w-full max-h-full object-contain" 
            />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-400 mb-1 block">{item.productType}</span>
            <h2 className="text-2xl font-black text-nature-950 tracking-tight">{item.name}</h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <p className="text-xl font-black text-nature-600">₹{item.price}</p>
              <div className="h-4 w-[1px] bg-nature-200"></div>
              <p className="text-sm font-bold text-nature-500">{item.stock} in stock</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8 bg-white">
          {status.type && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
              status.type === 'success' ? 'bg-nature-50 text-nature-600 border border-nature-100' :
                'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
              {status.type === 'error' ? (
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">✕</div>
              ) : status.type === 'success' ? (
                <div className="w-4 h-4 rounded-full bg-nature-600 flex items-center justify-center text-white text-[10px]">✓</div>
              ) : (
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              )}
              <p className="text-sm font-bold">{status.message}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-nature-700 ml-1">Update Stock Levels</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="flex-1 bg-nature-50 border border-nature-200 rounded-2xl py-3 px-5 text-nature-950 font-bold outline-none focus:border-nature-500 transition-all"
                placeholder="New Quantity"
              />
              <button
                onClick={handleStockUpdate}
                disabled={status.type === 'loading'}
                className="bg-nature-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-nature-950 transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-xs border border-red-100 hover:bg-red-600 hover:text-white transition-all group shadow-sm hover:shadow-xl hover:shadow-red-600/20 active:scale-95"
            >
              Delete Product Permanently
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ItemModal;
