import React from 'react'
import img from "../../../assets/contact.png"
import logo from "../../../assets/logo-contact.png"
import call from "../../../assets/call-icon.png";
import email from "../../../assets/email-us.png";
import fax from "../../../assets/fax-icon.png";

export default function LeftSection() {
  return (
    <div className="px-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-700">Contact Us</h1>
      
      <div className="space-y-2">
       <img src={logo} alt="" />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Corporate Office</h3>
          <p className="text-gray-600">
            7/28, Vardaan House, Mahavir Street<br />
            Ansari Road, Darya Ganj, New Delhi-110002 (INDIA).
          </p>
        </div>

       <div className='flex  justify-between '>
       <div className="space-y-2">
          <div className=" items-center gap-2">
           <div className='flex gap-3'>
           <img src={call} alt="" />
            <span className="font-semibold">Call Us</span>
          
           </div>
             <p className="text-gray-600 text-[15px]">+ 91-11-49404040 - 100 lines</p>
          </div>

          <div className=" items-center gap-2">
           <div className='flex gap-3 '>
           <img src={fax} alt="" />
           <span className="font-semibold">Fax</span>
           </div>
            <p className="text-gray-600 text-[15px]">+ 91-11-49404050 / 23280932</p>
          </div>
        </div>

        <div className="space-y-2">
           
          <div>
            <div className='flex gap-3'>
            <img src={email} alt="" />           
            <h2 className='text-lg font-semibold '>Email Us</h2>
            </div>
            <h4 className="font-bold text-blue-800">Domestic</h4>
             <a href="mailto:sales@cdhfinechemical.com" className="text-gray-800 block hover:underline">
              sales@cdhfinechemical.com
            </a>
            <a href="mailto:mumbai@cdhfinechemical.com" className="text-gray-800 block hover:underline">
              mumbai@cdhfinechemical.com
            </a>
          </div>

          <div>
            <h4 className="font-bold text-blue-800">International</h4>
            <a href="mailto:export@cdhfinechemical.com" className="text-gray-800 block hover:underline">
              export@cdhfinechemical.com
            </a>
            <a href="mailto:overseas@cdhfinechemical.com" className="text-gray-800 block hover:underline">
              overseas@cdhfinechemical.com
            </a>
          </div>
        </div>
       </div>
      </div>

      <div className="relative mt-8">
        <img 
          src={img}
          alt="Corporate Office Building"
          className="rounded-lg"
        />
        <div className="absolute bottom-0 left-0 bg-blue-800 text-white py-2 px-4 rounded-br-lg">
          <span className="text-cyan-400">SINCE</span> 1731
        </div>
      </div>
    </div>
  )
}
