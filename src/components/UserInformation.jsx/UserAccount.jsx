import React from 'react'

function UserAccount({ userAccount }) {
  return (
    <div className={` ${userAccount ? "visible" : "hidden"}  flex justify-end `}>
      <div className=' w-80 h-96 bg-cyan-50'>
        <div className='profile-section p-1'>
          <img src='' alt='' />
          
        </div>
      </div>

    </div>
  )
}

export default UserAccount