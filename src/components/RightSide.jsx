import React from 'react'
import img from "@assets/Group 11.png"

export default function RightSide() {
  return (
    <div className='md:w-[50%] relative hidden md:flex'>
      {/* The image */}
      <img src={img} className='w-full h-full object-cover ' alt="Event" />
      {/* Text over image */}
      <div className='absolute bottom-10 left-6 text-white'>
      <h2 className='capitalize text-5xl font-bold  bg-gradient-to-r from-white to-[#2c2c2c] bg-clip-text text-transparent'>Your Event.</h2>
      <h2 className='capitalize text-5xl font-bold  bg-gradient-to-r from-white to-[#2c2c2c] bg-clip-text text-transparent'>Your Moment.</h2>
      <h2 className='capitalize text-5xl font-bold  bg-gradient-to-r from-white to-[#2c2c2c] bg-clip-text text-transparent'>Your Story.</h2>
      <p className=' text-[13.5px] font-light mt-7 w-96 bg-gradient-to-r from-white to-[#888888] bg-clip-text text-transparent'>From unforgettable moments to seamless planning — register now and let us help you bring your perfect event to life.</p>
      </div>
    </div>
  )
}


