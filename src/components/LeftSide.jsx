import React, { useState } from 'react'
import SignForm from '@components/SignForm';

export default function LeftSide() {

  const [dataForm, setDataForm] =useState({
    firstName:'',
    lastName:'',
    email:'',
    phoneNumber:'',
    typeEvent:'',
    gender:'',
    availableDate:'',
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null)
  

  const disabledBtn = dataForm.firstName == "" || dataForm.lastName == "" || dataForm.availableDate == "" || dataForm.email == "" || dataForm.gender == "" || dataForm.phoneNumber == "" || dataForm.typeEvent == ""  

  function subShow(eve){
    console.log(dataForm)
    eve.preventDefault();
    setErrorMsg(null)
    const { phoneNumber} = dataForm;
    if(phoneNumber.length < 7 || phoneNumber.length > 15){
      setErrorMsg ("phone Number is not correct")
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email)){
      setErrorMsg("Please enter a valid email address");
    }
    setShowModal(true)

  }

  function hideModalComp(){
    if(showModal){
      setShowModal(false)
    }

  }
  
  return (
    <div onClick={hideModalComp} className='w-full md:w-[50%] h-full px-6 py-12'>
      <form className='space-y-6 w-full' action="" onSubmit={subShow}>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex flex-col w-full'>
            <label className='mb-1'>First Name :</label>
            <input 
              value={dataForm.firstName}
              onChange={(eve)=>setDataForm({...dataForm,firstName:eve.target.value})}
              type="text" 
              placeholder='write your first name' 
              className='bg-transparent placeholder:text-[13px] border border-[#171717] rounded-md px-3 py-2 focus:outline-none focus:border-[#4B3EBE] transition' 
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className='mb-1'>Last Name :</label>
            <input 
            value={dataForm.lastName}
            onChange={(eve)=>setDataForm({...dataForm,lastName:eve.target.value})}
              type="text" 
              placeholder='write your last name' 
              className='placeholder:text-[13px]  bg-transparent border border-[#171717] rounded-md px-3 py-2 focus:outline-none focus:border-[#4B3EBE] transition' 
            />
          </div>
        </div>

        <div className='flex flex-col'>
          <label className='mb-1'>Email Address</label>
          <input 
            value={dataForm.email}
            onChange={(eve)=> setDataForm({...dataForm, email:eve.target.value})}
            type="email" 
            placeholder='write your email address' 
            className='placeholder:text-[13px]  bg-transparent border border-[#171717] rounded-md px-3 py-2 focus:outline-none focus:border-[#4B3EBE] transition'
          />
        </div>

        <div className='flex flex-col'>
          <label className='mb-1'>Phone Number</label>
          <input 
             value={dataForm.phoneNumber}
             onChange={(eve=> setDataForm({...dataForm,phoneNumber:eve.target.value}))}
            type="text" 
            placeholder='your phone number' 
            className='placeholder:text-[13px]  bg-transparent border border-[#171717] rounded-md px-3 py-2 focus:outline-none focus:border-[#4B3EBE] transition'
          />
        </div>

        <div className='flex flex-col'>
          <label className='mb-1'>Type Of Event</label>
          <select className='bg-transparent border border-[#171717] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#4B3EBE]' 
          value={dataForm.typeEvent}
          onChange={(eve)=> setDataForm({...dataForm, typeEvent:eve.target.value})}>
            <option className='bg-black text-[13px] ' value="" disabled >Select event type</option>
            <option className='bg-black text-[13px] ' value="AI&Machine-Learning">AI for Beginners Workshop</option>
            <option className='bg-black text-[13px] ' value="Developer&Programming-Events">Backend API Development Session</option>
          </select>
        </div>

        <div className='flex flex-col'>
          <label className='mb-2'>Gender :</label>
          <div className='flex items-center gap-6'>
            <label className='flex items-center gap-1'>
              <input type="radio" name="gender" value={"female"} checked={dataForm.gender === "female"} onChange={(eve)=>{setDataForm({...dataForm,gender:eve.target.value})}} className='accent-[#4B3EBE]' />
              Female
            </label>
            <label className='flex items-center gap-1'>
              <input value={"male"} checked={dataForm.gender === "male"} onChange={(eve)=>{setDataForm({...dataForm,gender:eve.target.value})}}  type="radio" name="gender" className='accent-[#4B3EBE]' />
              Male
            </label>
          </div>
        </div>

        <div className='flex flex-col'>
          <label className='mb-1'>Available Date :</label>
          <select value={dataForm.availableDate} onChange={(eve)=>{
            setDataForm({...dataForm, availableDate:eve.target.value})
          }} className='bg-transparent border border-[#171717] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#4B3EBE]'>
            <option className='bg-[#171717] text-[13px]' value="" disabled>Select available date</option>
            <option className='bg-[#171717] text-[13px]' value="25 Dec 2030 (10 AM , 5 PM)">25 Dec 2030 (10 AM , 5 PM)</option>
            <option className='bg-[#171717] text-[13px]' value="26 Dec 2030 (10:30 AM , 5:30 PM)">26 Dec 2030 (10:30 AM , 5:30 PM)</option>
            <option className='bg-[#171717] text-[13px]' value="27 Dec 2030 (11 AM , 6 PM)">27 Dec 2030 (11 AM , 6 PM)</option>
          </select>
        </div>

        <button 
          disabled={disabledBtn}
          type="submit" 
          className={`w-full cursor-pointer rounded-md py-2 mt-6 transition ${disabledBtn ? 'bg-[#2f2f2f]' :"bg-[#4B3EBE] hover:bg-[#4b3ebead]"}`}
          >
          Submit
        </button>
      </form>
      <SignForm error={errorMsg} isVisible={showModal}/>
    </div>
  )
}