import React, { useState } from 'react';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import imageCompression from 'browser-image-compression';
import { storage, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function CreateModal({ setOpen, refresh }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setStatus({ type: 'error', message: 'Please select an image' });
            return;
        }

        setStatus({ type: 'loading', message: 'Compressing and uploading image...' });

        try {
            // Compress the image before uploading
            const options = {
                maxSizeMB: 0.3, // Compress down to 300KB
                maxWidthOrHeight: 1200, // Standardize dimensions
                useWebWorker: true,
                fileType: 'image/jpeg'
            };

            console.log('1. Compressing image...');
            const compressedFile = await imageCompression(image, options);
            console.log('   Compression done:', compressedFile.size, 'bytes');

            // Bypass Firebase Storage completely using Base64 Data URL
            console.log('2. Converting image to Base64 to bypass Storage limits...');
            const fileUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(compressedFile);
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            console.log('3. Image converted to base64 successfully.');
            const rating = Math.floor(Math.random() * 5) + 1;

            // 2. Product Creation in Firestore
            // ── ownerRole tracks whether this is a Farmer or Retailer listing ──
            const productData = {
                image: fileUrl,
                name: title,
                desc: description,
                price: Number(price),
                stock: Number(stock),
                productType: type,
                rating: rating,
                createdBy: user._id,
                ownerRole: user.role || 'retailer',   // support farmer-as-seller
                createdAt: serverTimestamp()
            };

            console.log('4. Saving product data to Firestore...', productData);
            const docRef = await addDoc(collection(db, "products"), productData);
            console.log('5. Firestore document created with ID:', docRef.id);

            setStatus({ type: 'success', message: 'Product created successfully!' });

            // Refresh parent list
            if (refresh) {
                refresh({ ...productData, _id: docRef.id }); // Map Firestore id to _id for consistency
            }

            // Auto close after 2 seconds
            setTimeout(() => {
                setOpen(false);
            }, 2000);

        } catch (error) {
            console.error('Error in product creation flow:', error);
            let errorMsg = 'Error creating product. Please try again.';

            if (error.code?.startsWith('storage/') || error.code?.startsWith('firestore/')) {
                errorMsg = `${error.code.split('/')[0]} Error: ${error.message}`;
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }

            setStatus({ type: 'error', message: errorMsg });
        }
    };

    const handleClose = () => {
        if (status.type !== 'loading') {
            setOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-nature-950/20 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-nature-100 flex flex-col md:flex-row animate-in zoom-in-95 duration-300 relative">

                {/* Close Button */}
                <button onClick={handleClose} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-nature-50 text-nature-600 hover:bg-nature-100 transition-colors">
                    ✕
                </button>

                {/* Left: Image Selection */}
                <div className="w-full md:w-5/12 bg-nature-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-nature-100">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-nature-400 mb-6">Product Image</h3>
                    <div className="w-full aspect-square bg-white rounded-3xl shadow-inner border-2 border-dashed border-nature-200 overflow-hidden flex items-center justify-center relative group">
                        {image ? (
                            <img loading="lazy" src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="text-center p-6">
                                <span className="text-4xl mb-4 block">📸</span>
                                <p className="text-xs font-bold text-nature-400 uppercase tracking-widest">Select Photo</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="mt-4 text-[10px] items-center text-center text-nature-400 font-bold uppercase tracking-widest">
                        Click image to {image ? 'change' : 'upload'}
                    </p>
                </div>

                {/* Right: Form Details */}
                <div className="w-full md:w-7/12 p-5 md:p-12">
                    <h2 className="text-3xl font-black text-nature-950 mb-8 tracking-tight">Add New Product</h2>

                    {status.type === 'error' && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-4 duration-300">
                            <ErrorOutlineIcon fontSize="small" />
                            <p className="text-sm font-bold">{status.message}</p>
                        </div>
                    )}

                    {status.type === 'success' && (
                        <div className="mb-6 p-4 bg-nature-50 border border-nature-100 rounded-2xl flex items-center gap-3 text-nature-600 animate-in fade-in slide-in-from-top-4 duration-300">
                            <CheckCircleOutlineIcon fontSize="small" />
                            <p className="text-sm font-bold">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-nature-700 ml-1">Product Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Organic Urea"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field py-3 px-5"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-nature-700 ml-1">Description</label>
                            <textarea
                                placeholder="What makes this product special?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field py-3 px-5 h-24 resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-nature-700 ml-1">Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="input-field py-3 px-5"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-nature-700 ml-1">Stock</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="input-field py-3 px-5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-nature-700 ml-1">Category</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="input-field py-3 px-5 appearance-none"
                                required
                            >
                                <option value="" disabled>Select category</option>
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
                        </div>

                        <button
                            type="submit"
                            disabled={status.type === 'loading' || status.type === 'success'}
                            className={`btn-primary w-full py-4 mt-6 transform active:scale-95 transition-all flex items-center justify-center gap-3 ${status.type === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {status.type === 'loading' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {status.type === 'loading' ? 'Creating...' : status.type === 'success' ? 'Created!' : 'List Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateModal;
