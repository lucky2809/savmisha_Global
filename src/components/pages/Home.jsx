import React from 'react'
import Navbar from '../navComp/Navbar'
import AllImage from './AllImage'
import ImageUpload from '../Admin/ImageUpload'
import Contact from './Contact'
import Footer from '../navComp/Footer'
import SwiperSlider from '../SwiperComp/SwiperSlider'

function Home() {
  return (
    <div>
      <div><Navbar /></div>
      <div className='pt-23 lg:pt-62'>
        <div><SwiperSlider /></div>

        <div className='pt-5 lg:pt-15 h-full w-full'>
          <div className=" w-full text-center p-5 lg:p-15">
            <p className="text-lg lg:text-4xl font-semibold">Our Products</p>
          </div>
          <div className='flex flex-col lg:flex-row gap-5 lg:gap-10 p-5 lg:p-15'>
          <div className=' grid grid-cols-2 w-full gap-5 lg:gap-10 overflow-hidden'>
            <img className='w-full h-full object-cover' src="01.png" alt="" />
            <img className='w-full h-full object-cover' src="08.png" alt="" />
            <img className='w-full h-full object-cover' src="04.png" alt="" />
            <img className='w-full h-full object-cover' src="012.png" alt="" />
          </div>
          <div className=' w-full overflow-hidden'>
            <img className='w-full h-full object-cover' src="011.png" alt="" srcset="" />
          </div>
        </div>
        </div>

        <div className='w-full h-full'><AllImage /></div>
        <div className=''><Contact margin={"mt-10"} /></div>
      </div>
    </div>
  )
}

export default Home