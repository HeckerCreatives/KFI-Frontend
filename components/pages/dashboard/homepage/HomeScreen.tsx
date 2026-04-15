import React from 'react'
import Image from 'next/image'
import logo from '../../../assets/images/logo-nobg.png';


export default function HomeScreen() {
  return (
    <div className=' w-full h-full flex flex-col items-center justify-center bg-orange-50 p-16'>
        <div className="mb-3 w-fit p-2 rounded-lg bg-[FFF0E3] bg-orange-100">
                           <Image alt="logo" src={logo} className="h-20 w-auto mx-auto filter drop-shadow-[1px_1px_0px_white]" />
                         </div>
         <h6 className=" text-orange-600 text-[2.5rem] m-0 max-w-[400px] font-[600] text-center">Manage your loans with ease</h6>
        <h6 className=" text-zinc-500 text-[1rem] m-0 max-w-[25rem] text-center">Streamlined loan management system designed for efficiency and security.</h6>
        
    </div>
  )
}
