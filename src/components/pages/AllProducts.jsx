import React from 'react'
import Navbar from '../navComp/Navbar'
import Footer from '../navComp/Footer'
import AllImage from './AllImage'

function AllProducts() {
  return (
    <div>
        <div><Navbar/></div>
    <div className='pt-22 lg:pt-30'>
        <div className=" w-full text-center p-5 lg:p-15">
        <p className="text-2xl md:text-4xl lg:text-4xl font-semibold">All Products</p>
      </div>
        <div className='w-full h-full'><AllImage /></div>
    </div>

    <div><Footer /></div>
    </div>
  )
}

export default AllProducts