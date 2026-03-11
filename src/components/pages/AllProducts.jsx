import React from 'react'
import Navbar from '../navComp/Navbar'
import AllImage from './AllImage'

function AllProducts() {
  return (
    <div>
        <div><Navbar/></div>
    <div className='pt-22 lg:pt-52'>
        <div className=" w-full text-center p-5 lg:p-15">
        <p className=" text-lg lg:text-4xl font-semibold">All Products</p>
      </div>
        <div className='w-full h-full'><AllImage /></div>
    </div>
    </div>
  )
}

export default AllProducts