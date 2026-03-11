import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function SwiperSlider() {
  return (
    <div className="p-20">
      <div className="relative w-full">

      {/* Left Button */}
      <div className="swiper-button-prev !w-10 !h-10  text-white rounded-full flex items-center justify-center hover:bg-black transition"></div>

      {/* Right Button */}
      <div className="swiper-button-next !w-10 !h-10 text-white rounded-full flex items-center justify-center hover:bg-black transition"></div>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="p-">
            <img className="h-full w-full object-cover" src="swipper1.png" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="p-">
            <img className="h-full w-full object-cover" src="swipper2.png" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="p-">
            <img className="h-full w-full object-cover" src="swipper1.png" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    </div>
  );
}

export default SwiperSlider;