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
      <div className='mt-20 lg:mt-40'>
        <div><SwiperSlider /></div>

        <div className='flex flex-col gap-4 lg:gap-8 lg:px-20 px-5'>
          <p className='md:text-7xl lg:text-8xl text-2xl font-bold'><span className='text-5xl lg:text-9xl'>India’s </span> Trusted Clothing Manufacturing Partner</p>
          <p className='text-sm lg:text-xl text-gray-400 font-semibold lg:w-[90%]'>Located in Delhi, the hub of India’s garment industry, we produce high-quality apparel with advanced technology and expert craftsmanship, serving brands and businesses across the country.</p>
        </div>

        <div className='h-full w-full lg:p-7'>
          <div className=" w-full text-center p-4 lg:p-7">
            <p className="text-2xl lg:text-4xl font-bold">Our Products</p>
          </div>
          <div className='flex flex-col lg:flex-row gap-7 lg:gap-10 p-5 lg:p-15'>
            <div className=' grid grid-cols-2 w-full gap-7 lg:gap-10 h-full'>
              <div>
                <img className='w-full h-full object-cover' src="01.png" alt="" />
                <p>Men's Wear</p>
              </div>
              <div>
                <img className='w-full h-full object-cover' src="08.png" alt="" />
                <p>Women's Wear</p>
              </div>
              <div>
                <img className='w-full h-full object-cover' src="04.png" alt="" />
                <p>Women Dresses</p>
              </div>
              <div>
                <img className='w-full h-full object-cover' src="012.png" alt="" />
                <p>Wome's Top Wear</p>
              </div>
            </div>
            <div className=' w-full'>
              <img className='w-full h-full object-cover' src="011.png" alt="" srcset="" />
              <p>Unisex Wear</p>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <section className="py-16 bg-gradient-to-r from-black to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <h2 className="text-3xl font-bold mb-12">
              Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-10">

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Premium Quality
                </h3>
                <p className="text-gray-300">
                  We use high-quality fabrics and strict quality control.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Modern Designs
                </h3>
                <p className="text-gray-300">
                  Our designers follow global fashion trends.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Our Religion
                </h3>
                <p className="text-gray-300">
                  Crafting High-Quality Apparel for Brands Across India.
                </p>
              </div>

            </div>
          </div>
        </section>


        <div className=" w-full text-center p-5 lg:p-15">
          <p className=" text-2xl lg:text-4xl font-semibold">Latest Products</p>
        </div>
        <div className='w-full h-full'><AllImage pageNo={1} limit={4} /></div>


        {/* About Company */}
        <div className='lg:p-20 lg:py-10 p-5'>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            About Savmisha Global Trends
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Savmisha Global Trends is a trusted clothing manufacturer based in
            Delhi, India, dedicated to producing high-quality garments for both
            domestic and international markets. Our company focuses on
            delivering reliable textile and apparel manufacturing solutions
            while maintaining strict quality standards. With skilled
            professionals, modern production techniques, and a commitment to
            excellence, Savmisha Global Trends works closely with brands and
            businesses to provide durable, stylish, and well-crafted clothing
            products.
          </p>
        </div>


        {/* ABOUT SECTION */}
        <section className="lg:p-20 bg-white p-5">
          <div className="max-w-7xl lg:px-6 mx-auto grid md:grid-cols-2 gap-12 items-center">

            <img
              src="manufacture2.png"
              className="rounded-lg shadow-lg"
            />

            <div>
              <h2 className="text-4xl font-bold mb-6">
                About Our Manufacturing
              </h2>

              <p className="text-gray-600 mb-6">
                We are a trusted clothing manufacturer producing high-quality
                garments for global fashion brands. Our advanced production
                facilities and skilled designers ensure every piece meets
                international quality standards.
              </p>

              <button className="px-6 py-3 bg-black text-white rounded-lg">
                Learn More
              </button>
            </div>

          </div>
        </section>


        {/* COMPANY STATS */}
        <section className="lg:py-20 p-5 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Clients", value: "17+" },
              { label: "Products", value: "150+" },
              { label: "Countries Served", value: "7+" },
              { label: "Employees", value: "40+" },
              // { label: "Branches", value: "2" },
              // {
              //   label: "Factory Types",
              //   value: "Textile, Garments, Bedsheets, Bags",
              // }

            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FACTORY GALLERY */}
        <section className="p-5 lg:p-20 bg-gray-100">
          <div className="max-w-7xl mx-auto lg:px-6">

            <h2 className="text-3xl font-bold text-center mb-12">
              Our Factory
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <img
                src="factory1.png"
                className="rounded-lg"
              />

              <img
                src="factory2.png"
                className="rounded-lg"
              />

              <img
                src="factory3.png"
                className="rounded-lg"
              />

            </div>

          </div>
        </section>

        {/* SUSTAINABILITY */}
        <section className="p-5 lg:p-20 bg-green-50">
          <div className="max-w-7xl mx-auto lg:px-6 grid md:grid-cols-2 gap-12 items-center">

            <img
              src="manufacture.png"
              className="rounded-lg shadow-lg"
            />

            <div>
              <h2 className="text-3xl font-bold mb-6">
                Sustainable Manufacturing
              </h2>

              <p className="text-gray-600 mb-6">
                We follow eco-friendly manufacturing practices including sustainable
                fabrics, responsible production, and reduced environmental impact.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li><span className='pr-2'>●</span> Eco Friendly Fabrics</li>
                <li><span className='pr-2'>●</span> Ethical Manufacturing</li>
                <li><span className='pr-2'>●</span> Waste Reduction</li>
                <li><span className='pr-2'>●</span> Sustainable Packaging</li>
              </ul>
            </div>

          </div>
        </section>

        <div className=''><Contact margin={"mt-15"} active='hidden' /></div>
      </div>
    </div>
  )
}

export default Home