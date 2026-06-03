import React from 'react';
import Navbar from '../Components/Navbar';
import Chat from '../Components/Chat';
import Footer from '../Components/Footer';
import { FaUsers, FaComments, FaHandshake } from 'react-icons/fa';

function Forum() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Agriculturalist' };

  return (
    <div className="min-h-screen w-full flex flex-col bg-nature-50/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32 pb-16">
        
        {/* Modern SaaS Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 relative">
          {/* Decorative Mesh */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[200px] bg-nature-400/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-16 px-8 md:px-16 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-nature-500/10 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-600/20 border border-nature-600/30 text-nature-300 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                <FaUsers className="text-nature-400" /> Community Intelligence
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-[1.1]">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 to-nature-600">Kisan</span> Hub
              </h1>
              
              <p className="text-nature-300 text-lg font-medium max-w-2xl leading-relaxed">
                Connect with thousands of fellow progressive farmers, KVK experts, and industry consultants. Share knowledge, resolve doubts, and grow together.
              </p>
            </div>
          </div>
        </div>

        {/* Community Stats (Bento Grid Style) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-nature-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-nature-50 flex items-center justify-center text-nature-600 group-hover:bg-nature-600 group-hover:text-white transition-colors">
                <FaComments className="text-2xl" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Active Discussions</h4>
                <p className="text-3xl font-heading font-black text-nature-950 mt-1">1.2K</p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-nature-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Verified Experts</h4>
                <p className="text-3xl font-heading font-black text-nature-950 mt-1">150+</p>
              </div>
            </div>
            
            <div className="bg-nature-950 rounded-[2.5rem] p-8 border border-nature-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-6 group relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-nature-600/30 blur-2xl rounded-full"></div>
              <div className="w-14 h-14 rounded-2xl bg-nature-800 flex items-center justify-center text-nature-400 z-10">
                <FaHandshake className="text-2xl" />
              </div>
              <div className="z-10">
                <h4 className="text-[10px] font-black text-nature-500 uppercase tracking-widest">Solutions Shared</h4>
                <p className="text-3xl font-heading font-black text-white mt-1">5.8K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Component Integration */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] border border-nature-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
            <Chat loggedInUser={user} />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Forum;