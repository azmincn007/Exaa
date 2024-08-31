import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { LuInstagram } from "react-icons/lu";
import { FaTwitter } from "react-icons/fa";
import { BsPlayCircle } from "react-icons/bs";

function Footer() {
  return (
    <footer className="bg-white py-12 font-Inter">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
         
            <ul className="space-y-2 list-none">
            <li><a href="#" className="text-black font-semibold hover:text-gray-900 text-12">EXXAA</a></li>
            <li className='footer-content'>Blog</li>
            <li className='footer-content'>Help</li>
            <li className='footer-content'>Sitemap</li>
            <li className='footer-content'>Legal & Privacy information</li>
            <li className='footer-content'>Vulnerability Disclosure Program</li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
            <ul className="space-y-2 list-none">
            <li><a href="#" className="text-black font-semibold hover:text-gray-900 text-12">POPULAR LOCATIONS</a></li>
            <li className='footer-content'>Trivandrum</li>
            <li className='footer-content'>Kochi</li>
            <li className='footer-content'>Thrissur</li>
            <li className='footer-content'>Calicut</li>

            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <ul className="space-y-2 list-none">
            <li><a href="#" className="text-black font-semibold hover:text-gray-900 text-12">ABOUT US</a></li>
            <li className='footer-content'>Contact Us</li>
            <li className='footer-content'>Tech@exxaa</li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <ul className="space-y-2 list-none">
            <li><a href="#" className="text-black font-semibold hover:text-gray-900 text-12">FOLLOW US</a></li>
            <li className=''><div className='flex gap-2'><FaFacebookF/> <LuInstagram/> <FaTwitter/> <BsPlayCircle/></div></li>
           
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer