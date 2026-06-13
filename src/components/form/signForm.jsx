import React from 'react'
import correct from "src/assets/solid_correct.png";

export default function SignForm({isVisible, error = null}) {
    if (isVisible){
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#000000a2] transition-opacity duration-300'>
    <div className='bg-[#04040C] rounded-md w-[400px] p-4 border border-[#0d0d26] text-center'>
      {error ? (<div className='text-red-400 text-xl'>{error}</div>):(
          <div className='content flex flex-col items-center pt-4 justify-center text-white'>
            <h2 className='text-4xl font-semibold'>Submission successful!</h2>
            <p className='text-[13px] py-6 font-extralight'>We've saved your information.</p>
            <img src={correct} alt="" className='w-16 h-16'/>
          </div>
        )}
    </div>        
    </div>

  )

    }else{
      return <></>
    }

}