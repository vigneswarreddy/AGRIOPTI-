import React from 'react';
import { FaExternalLinkAlt, FaLandmark, FaShieldAlt, FaLeaf, FaHandsHelping } from 'react-icons/fa';
import innovation1 from '../../assets/home/innovation1.jpg';
import innovation3 from '../../assets/home/innovation3.png';

const schemes = [
  {
    title: "PM-KISAN",
    subtitle: "Pradhan Mantri Kisan Samman Nidhi",
    desc: "Launched to support landholding farmers' financial needs through direct income support.",
    img: "https://static.vecteezy.com/system/resources/previews/004/901/410/non_2x/a-farmer-walking-towards-the-field-free-vector.jpg",
    link: "https://timesofindia.indiatimes.com/india/empowering-indias-farmers-list-of-schemes-for-welfare-of-farmers-in-india/articleshow/107854121.cms",
    icon: <FaLandmark />
  },
  {
    title: "PM-KMY",
    subtitle: "Pradhan Mantri Kisan MaanDhan Yojana",
    desc: "A pension scheme to provide social security to small and marginal farmers in their old age.",
    img: innovation1,
    link: "https://timesofindia.indiatimes.com/india/empowering-indias-farmers-list-of-schemes-for-welfare-of-farmers-in-india/articleshow/107854121.cms",
    icon: <FaShieldAlt />
  },
  {
    title: "PMFBY",
    subtitle: "Pradhan Mantri Fasal Bima Yojana",
    desc: "Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.",
    img: innovation3,
    link: "https://timesofindia.indiatimes.com/india/empowering-indias-farmers-list-of-schemes-for-welfare-of-farmers-in-india/articleshow/107854121.cms",
    icon: <FaLeaf />
  },
  {
    title: "Agri Infra Fund",
    subtitle: "Agriculture Infrastructure Fund (AIF)",
    desc: "Financing facility for investment in viable projects for post-harvest management infrastructure.",
    img: "https://www.pngmart.com/files/Agriculture-PNG-Image.png",
    link: "https://timesofindia.indiatimes.com/india/empowering-indias-farmers-list-of-schemes-for-welfare-of-farmers-in-india/articleshow/107854121.cms",
    icon: <FaHandsHelping />
  }
];

function GovernmentSchemes() {
  return (
    <div className="w-full space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-nature-950 uppercase tracking-tight">Government <span className="text-nature-600">Schemes</span></h2>
        <p className="text-nature-500 font-medium max-w-2xl mx-auto">
          Discover and leverage strategic agricultural policies designed to empower and protect the modern farmer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {schemes.map((scheme, idx) => (
          <a
            key={idx}
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="glass rounded-[2.5rem] p-8 md:p-10 border-white/60 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02] flex flex-col md:flex-row gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nature-400/5 rounded-bl-[100px] pointer-events-none group-hover:bg-nature-400/10 transition-colors"></div>

              <div className="w-full md:w-40 h-40 rounded-3xl bg-white p-4 shadow-inner shrink-0 relative overflow-hidden">
                <img loading="lazy" src={scheme.img}
                  alt={scheme.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="flex-grow space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-nature-950 text-nature-400 text-lg">
                    {scheme.icon}
                  </div>
                  <FaExternalLinkAlt className="text-nature-300 group-hover:text-nature-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-heading font-black text-nature-950 tracking-tight">{scheme.title}</h3>
                  <p className="text-[10px] font-black text-nature-500 uppercase tracking-widest leading-none">{scheme.subtitle}</p>
                </div>
                <p className="text-nature-600 text-sm leading-relaxed font-medium line-clamp-2">
                  {scheme.desc}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default GovernmentSchemes;