import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import AboutSecurity from "../JsonDataFile/Security.json"


function SwiperSlider() {

  return (
    <div className='  '>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper "
      >
        <SwiperSlide>
          <div className='h-[500px]'>
            <img className=' h-full w-full object-cover' src='about.png' />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <img className='h-[500px] w-full object-cover' src='about.png' />
        </SwiperSlide>
        <SwiperSlide>
          <img className='h-[500px] w-full object-cover' src='about.png' />
        </SwiperSlide>


      </Swiper>
      {/* <div className='about-security  px-5 flex justify-around pb-1 bg-amber-50'>
        {
          AboutSecurity.aboutSecurity.map((data) =>{
            return (
              <span className='flex  items-center my-2 px-4 bg-white  rounded-md '>
              <div className='img '></div> <img className='h-14 object-cover' src={data.img} /> 

                <p className='font-semibold text-md flex gap-1 items-center'>
                  <span>{data.paragraph}</span>
                  <span className='text-[14px]'>{data.paragraph2}</span>

                </p>
      
              </span>
            )
          })
        }
       
      </div> */}
    </div>
  )
}

export default SwiperSlider;