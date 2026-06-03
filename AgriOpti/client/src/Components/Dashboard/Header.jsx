import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 bg-gray-100">
      <input type="text" placeholder="Search..." className="p-2 rounded border"/>
      <div className="flex items-center space-x-4">
        <span className="font-semibold">Stats</span>
        <span className="font-semibold">5</span>
      </div>
    </div>
  );
};

export default Header;
