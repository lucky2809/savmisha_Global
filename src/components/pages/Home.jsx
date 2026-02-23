import React from 'react'
import Navbar from '../navComp/Navbar'
import AllImage from './AllImage'
import ImageUpload from '../Admin/ImageUpload'

function Home() {
  return (
    <div>
    <div><Navbar/></div>
    <div><AllImage /></div>
    {/* <div><ImageUpload /></div> */}
    </div>
  )
}

export default Home