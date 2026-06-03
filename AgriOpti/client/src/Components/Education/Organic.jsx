import React from 'react';
import VideoCard from './VideoCard';
import { FaLeaf, FaSeedling, FaWater } from 'react-icons/fa';

const videos = [
  {
    id: 1,
    title: "Sustainable Farming Practices",
    url: "https://www.youtube.com/embed/Ix2DK9bAzVw",
    icon: <FaSeedling />
  },
  {
    id: 2,
    title: "Organic Farming Techniques",
    url: "https://www.youtube.com/embed/WhOrIUlrnPo",
    icon: <FaLeaf />
  },
  {
    id: 3,
    title: "Water Conservation Methods",
    url: "https://www.youtube.com/embed/QZJjoFIE2vw",
    icon: <FaWater />
  },
];

function Organic() {
  return (
    <div className="w-full space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-nature-950 uppercase tracking-tight">Advanced <span className="text-nature-600">Techniques</span></h2>
        <p className="text-nature-500 font-medium max-w-2xl mx-auto">
          Master the art of sustainable agriculture through curated visual knowledge from global agronomy experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Organic;