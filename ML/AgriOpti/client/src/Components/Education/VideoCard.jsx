import React from 'react';
import { FaPlay } from 'react-icons/fa';

function VideoCard({ video }) {
  return (
    <div className="glass rounded-[2.5rem] overflow-hidden border-white/60 shadow-xl group hover:shadow-2xl transition-all duration-500">
      <div className="relative aspect-video overflow-hidden">
        <iframe
          src={video.url}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
        <div className="absolute inset-0 bg-nature-950/0 group-hover:bg-nature-950/20 transition-colors pointer-events-none"></div>
      </div>

      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nature-950 text-nature-400 flex items-center justify-center text-sm shadow-lg">
              {video.icon}
            </div>
            <h3 className="text-xl font-heading font-black text-nature-950 tracking-tight">{video.title}</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-nature-50 border border-nature-100 flex items-center justify-center text-nature-600 shadow-sm">
            <FaPlay className="text-[10px] ml-0.5" />
          </div>
        </div>
        <p className="text-nature-500 text-xs font-black uppercase tracking-[0.2em]">Scientific Visual Guide</p>
      </div>
    </div>
  );
}

export default VideoCard;
