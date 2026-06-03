import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PlantDisease from '../Components/Dashboard/PlantDisease';

import { motion } from 'framer-motion';

function PlantDiseasePage() {
  return (
    <div className='flex flex-col relative min-h-screen bg-nature-50/30 overflow-x-hidden'>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 md:pt-32 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pb-20"
      >
        <PlantDisease />
      </motion.div>
      <Footer />
    </div>
  );
}

export default PlantDiseasePage;
