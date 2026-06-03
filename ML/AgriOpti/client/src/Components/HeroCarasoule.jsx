import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function HeroCarasoule() {
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow custom-next-arrow w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl border border-white flex items-center justify-center cursor-pointer text-nature-950 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 before:content-['']`}
        style={{ ...style, right: '20px', zIndex: 10 }}
        onClick={onClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow custom-prev-arrow w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl border border-white flex items-center justify-center cursor-pointer text-nature-950 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 before:content-['']`}
        style={{ ...style, left: '20px', zIndex: 10 }}
        onClick={onClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div style={{ bottom: "20px" }}>
        <ul className="flex justify-center gap-2 m-0 p-0"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-all cursor-pointer"></div>
    )
  };

  return (
    <div className="w-full relative group">
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-2 md:p-3 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <Slider {...settings} className="w-full rounded-[2.5rem] overflow-hidden relative">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="h-[300px] md:h-[450px] relative outline-none cursor-grab active:cursor-grabbing">
              <img loading="lazy" src={`/banners/banner${num}.png`} alt={`Agricultural Item ${num}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-nature-950/40 via-transparent to-transparent"></div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* CSS to hide default slick dots and arrows which we replaced */}
      <style>{`
        .slick-dots li { margin: 0; width: auto; height: auto; }
        .slick-dots li.slick-active div { background-color: white; width: 24px; border-radius: 9999px; }
      `}</style>
    </div>
  );
}

export default HeroCarasoule;
