import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import Profile from '../pages/Profile'

function Navbar() {
  const [show, setShow] = useState(true)
  const [open, setOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()   // 🔥 current route

  // 🔥 Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false)
      } else {
        setShow(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // 🔥 Scroll Lock when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      document.body.style.height = "100vh"
    } else {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
  }, [open])

  // 🔥 Active link check function
  const isActive = (path) => location.pathname === path

  return (
    <div
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-500 ease-in-out bg-white shadow-sm shadow-amber-100
        ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <div className='flex pb-4  px-2 md:px-10 lg:px-20 gap-2 md:gap-5'>
        <div className='hidden lg:flex lg:flex-col justify-center gap-5 items-center lg:visible'>
          <div className='border border-white hover:border-black p-2 rounded-full cursor-pointer'><a
            href={`${import.meta.env.VITE_APP_INSTAGRAM_LINK}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          ><Icon className='text-black' icon="line-md:instagram" width="26" /></a></div>
          <div className='border border-white hover:border-black p-2 rounded-full cursor-pointer'><a
            href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL}`}
            className="hover:scale-110 transition-transform"
          ><Icon className='text-black' icon="fluent-mdl2:edit-mail" width="26" /></a></div>
        </div>
        <div className='w-full flex lg:flex-col flex-row items-center  justify-between gap-1'>
          {/* Logo */}
          <div className='lg:w-55 w-30'>
            <a href="/"><img className='w-full h-full object-contain' src="logo02.png" alt="logo" /></a>
          </div>

          {/* Desktop Menu */}
          <div className='hidden lg:flex lg:visible'>
            <ul className='lg:flex lg:flex-wrap justify-center text-center lg:gap-5 gap-7  text-md font-semibold'>

              <li className='cursor-pointer transition'>
                <Link
                  to="/"
                  className={`pb-1 transition hover:text-gray-500
                ${isActive('/') ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`}
                >
                  HOME
                </Link>
              </li>

              <li className='cursor-pointer transition'>
                <Link
                  to="/products"
                  className={`pb-1 transition hover:text-gray-500
                ${isActive('/products') ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`}
                >
                  PRODUCTS
                </Link>
              </li>

              <li className='cursor-pointer transition'>
                <Link
                  to="/contact"
                  className={`pb-1 transition hover:text-gray-500
                ${isActive('/contact') ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`}
                >
                  CONTACT US
                </Link>
              </li>

              <li className='cursor-pointer transition '>
                <Link
                  to="/about"
                  className={`pb-1 transition hover:text-gray-500
                ${isActive('/about') ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`}
                >
                  ABOUT US
                </Link>
              </li>

              <li className='cursor-pointer transition'>
                <Profile />
              </li>

            </ul>
          </div>
        </div>

        <div className='hidden lg:flex lg:flex-col justify-center gap-5 items-center lg:visible'>
          {/* <div>
                        <Profile />
                    </div> */}
          <div className='border border-white hover:border-black p-2 rounded-full cursor-pointer'>
            <a href={`tel:${import.meta.env.VITE_PHONE_NUMBER2}`}><Icon className='text-black' icon="ion:call-sharp" width="24" /></a>

          </div>
          <div>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPPNO}`}   // <-- apna number yaha daalo
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <div className="p-1 rounded-full shadow-2xl cursor-pointer flex items-center justify-center border border-white hover:border-black">
                <Icon className='text-black' icon="fa7-brands:whatsapp" width="32" />
              </div>
            </a>
          </div>
        </div>
        <div className='lg:hidden flex items-center'>
          <Profile />
        </div>
        {/* Hamburger / Cross Button */}
        <div className=" lg:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-8 h-8 flex items-center justify-center z-50"
          >
            <span
              className={`absolute h-0.5 w-6 bg-black transition-all duration-300 ${open ? "rotate-45" : "-translate-y-2"
                }`}
            ></span>

            <span
              className={`absolute h-0.5 w-6 bg-black transition-all duration-300 ${open ? "opacity-0" : "opacity-100"
                }`}
            ></span>

            <span
              className={`absolute h-0.5 w-6 bg-black transition-all duration-300 ${open ? "-rotate-45" : "translate-y-2"
                }`}
            ></span>
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed left-0 w-full bg-white
        transition-all duration-500 ease-in-out
        ${open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
        style={{
          top: "79px",
          height: "calc(120vh - 120px)"
        }}
      >
        <ul className="flex flex-col items-center justify-center h-full gap-8 text-lg font-semibold text-black">

          <li>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`${isActive('/') ? 'border-b-2 border-black' : ''}`}
            >
              HOME
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className={`${isActive('/products') ? 'border-b-2 border-black' : ''}`}
            >
              PRODUCTS
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`${isActive('/contact') ? 'border-b-2 border-black' : ''}`}
            >
              CONTACT US
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className={`${isActive('/about') ? 'border-b-2 border-black' : ''}`}
            >
              ABOUT US
            </Link>
          </li>
          <div className='w-full flex justify-center gap-8 items-center pt-10'>
            <div><a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            ><Icon className='text-black' icon="line-md:instagram" width="26" /></a></div>
            <div><a
              href="mailto:savmishaglobaltrends@gmail.com"
              className="hover:scale-110 transition-transform"
            ><Icon className='text-black' icon="fluent-mdl2:edit-mail" width="26" /></a></div>
            <div><a href={`tel:${import.meta.env.VITE_PHONE_NUMBER}`}><Icon className='text-black' icon="ion:call-sharp" width="26" /></a></div>
          </div>
        </ul>

      </div>

    </div>
  )
}

export default Navbar
