// src/components/SchemeCard.js
import React from 'react';

function SchemeCard({ scheme, setModalData }) {
  return (
    <div className="border rounded-lg p-4 shadow-lg cursor-pointer" onClick={() => setModalData(scheme)}>
      <h3 className="text-xl font-semibold">{scheme.title}</h3>
      <p>{scheme.description}</p>
    </div>
  );
}

export default SchemeCard;
