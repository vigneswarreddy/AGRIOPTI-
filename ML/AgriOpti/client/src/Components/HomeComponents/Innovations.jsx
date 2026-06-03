import React from 'react';
import innovation1 from '../../assets/home/innovation1.jpg'
import innovation2 from '../../assets/home/innovation2.png'
import innovation3 from '../../assets/home/innovation3.png'

const Innovations = () => {
  const items = [
    {
      img: innovation2,
      title: "Expert Instruction",
      desc: "Access real-world expertise for valuable guidance and mentorship in our virtual classrooms.",
      color: "from-nature-500/10 to-transparent",
      borderColor: "group-hover:border-nature-500/50"
    },
    {
      img: innovation1,
      title: "Flexible Learning",
      desc: "Access online learning tailored to your schedule, available anywhere with an internet connection.",
      color: "from-earth-500/10 to-transparent",
      borderColor: "group-hover:border-earth-500/50"
    },
    {
      img: innovation3,
      title: "Practical Skills",
      desc: "Acquire hands-on practical skills designed for real-world agricultural success and sustainability.",
      color: "from-nature-600/10 to-transparent",
      borderColor: "group-hover:border-nature-600/50"
    }
  ];

  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 bg-nature-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-nature-600 font-bold uppercase tracking-widest text-sm">Innovating Agriculture</div>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-nature-950 tracking-tight leading-tight">
            Our Core Innovations
          </h2>
          <p className="text-lg text-nature-600 font-medium">
            Discover the unique benefits you will enjoy when you join our online platform for intelligent farming optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {items.map((item, idx) => (
            <div key={idx} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-b ${item.color} rounded-[2.5rem] transform translate-y-4 group-hover:translate-y-6 transition-transform duration-500 -z-10`}></div>
              <div className="bg-white rounded-[2.5rem] p-8 h-full shadow-xl border border-nature-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="mb-8 overflow-hidden rounded-2xl aspect-[4/3] bg-nature-50 flex items-center justify-center">
                  <img loading="lazy" src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-2xl font-heading font-black text-nature-900 mb-4 group-hover:text-nature-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-nature-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Innovations;
