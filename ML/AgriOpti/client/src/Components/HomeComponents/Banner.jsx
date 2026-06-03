import React from 'react'
import analyze from "../../assets/home/analyze.png"

function Banner() {
  return (
    <div className='w-full px-5'>
        <div className='w-full h-[450px] flex rounded-3xl bg-[#fffacd] relative'>
            <div className="w-[50%] flex h-full pt-10">
                <img loading="lazy" src={analyze} className="w-[90%]"/>
            </div>
            <div className='w-[50%] flex py-10  items-center px-20 text-[#004225] flex-col z-20'>
                <h1 className="text-[40px] font-bold text-serif  ">The Right Place to Learn About Farming </h1>
                <p className="text-[20px] font-semibold text-serif  ">AgriOpti is the premier destination for modern agriculture solution. We providing a dynamic learning , selling , buying experience tailored to the needs of the new generation. We empower individuals to thrive in the ever-evolving field of farming</p>
                <div className='w-full flex'>
                <button className="px-4  mt-10 py-3 w-[50%] rounded-lg bg-[#00563f]  text-white font-bold text-[20px]">Get Started</button>
                </div>
            </div>

            

        </div>

    </div>
  )
}

export default Banner