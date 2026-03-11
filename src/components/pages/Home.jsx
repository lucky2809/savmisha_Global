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
      <div className='pt-22 lg:pt'>
        <div><SwiperSlider /></div>

        <div className='flex flex-col max-lg:text-center gap-8 px-20'>
          <p className='md:text-7xl lg:text-8xl max-sm:text-4xl font-bold'><span className='text-9xl'>India’s </span> Trusted Clothing Manufacturing Partner</p>
          <p className='text-xl text-gray-400 font-semibold w-[90%]'>Located in Delhi, the hub of India’s garment industry, we produce high-quality apparel with advanced technology and expert craftsmanship, serving brands and businesses across the country.</p>
        </div>

        <div className='h-full w-full p-5'>
          <div className=" w-full text-center p-7">
            <p className="text-lg lg:text-4xl font-bold">Our Products</p>
          </div>
          <div className='flex flex-col lg:flex-row gap-5 lg:gap-10 p-5 lg:p-15'>
            <div className=' grid grid-cols-2 w-full gap-5 lg:gap-10 h-full'>
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
          <p className=" text-lg lg:text-4xl font-semibold">Latest Products</p>
        </div>
        <div className='w-full h-full'><AllImage pageNo={1} limit={4} /></div>

        {/* ABOUT SECTION */}
        <section className="p-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

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
        <section className="py-20 bg-gray-50 px-6">
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
        <section className="p-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-center mb-12">
              Our Factory
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <img
                src="https://images.unsplash.com/photo-1503342452485-86cfd1c7a5df"
                className="rounded-lg"
              />

              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                className="rounded-lg"
              />

              <img
                src="https://images.unsplash.com/photo-1520975682031-a1cfe0c3a83d"
                className="rounded-lg"
              />

            </div>

          </div>
        </section>

        {/* SUSTAINABILITY */}
        <section className="p-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

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

        <div className=''><Contact margin={"mt-10"} /></div>
      </div>
    </div>
  )
}

export default Home