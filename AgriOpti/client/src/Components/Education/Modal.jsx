// src/components/Modal.js
import React from 'react';

function Modal({ modalData, setModalData }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <button className="float-right text-red-500" onClick={() => setModalData(null)}>Close</button>
        <h2 className="text-2xl font-semibold">{modalData.title}</h2>
        <p>{modalData.details}</p>
      </div>
    </div>
  );
}

export default Modal;
