import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import MapView from './MapView'
import Footer from '../navComp/Footer'
import Navbar from '../navComp/Navbar'

function Contact({margin = "mt-60"}) {
    return (
        <div>
            <div><Navbar /></div>
            <div className={`w-full bg-white pb-10 px-32 max-lg:px-15 max-sm:px-5 ${margin}`}>
                <div className='w-full flex justify-center p-5'>
                    <h1 className='font-bold text-4xl'>Contact Us</h1>
                </div>
                <div className='flex w-full max-sm:flex-col gap-8'>
                    {/* Left contact info */}
                    <div className='border-b-[3px] border-t-[3px] border-[#f59e7b] shadow-xl flex flex-col gap-2 w-[45%] max-sm:w-full p-5 max-lg:p-2'>
                        <div className='flex gap-4 items-center '>
                            <div className=' w-fit p-1 max-lg:p-1 h-fit flex justify-center items-center rounded-full border border-[#f59e7b]'>
                                <Icon width={20} className='text-[#f59e7b] hover:text-[#E7B09B]  font-bold' icon={"subway:location"} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-2xl max-lg:text-2xl font-semibold'>Location:</h1>
                                <p className='text-[#f59e7b] text-sm'>C-13 HARI ENCLAVE-1 KIRARI SULEMAN NAGAR DELHI</p>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <div className=' w-fit p-1 max-lg:p-1 h-fit flex justify-center items-center rounded-full border border-[#f59e7b]'>
                                <Icon width={20} className='text-[#f59e7b] font-bold' icon={"fontisto:email"} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-2xl max-lg:text-2xl font-semibold'>Email:</h1>
                                <a href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL}`} ><p className='text-[#f59e7b] text-sm'>savmishaglobaltrends@gmail.com</p></a>
                            </div>
                        </div>
                        <div className=' flex gap-4 items-center'>
                            <div className=' w-fit p-1 max-lg:p-1 h-fit flex justify-center items-center rounded-full border border-[#f59e7b]'>
                                <Icon width={20} className='text-[#f59e7b] font-bold' icon={"fluent:phone-20-regular"} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-2xl max-lg:text-2xl font-semibold'>Call:</h1>
                                <div className='flex max-lg:flex-col text-sm'>
                                    <a href={`tel:${import.meta.env.VITE_PHONE_NUMBER1}`}> <p className='text-[#f59e7b]'>+91 9560941936,</p></a>
                                    <a href={`tel:${import.meta.env.VITE_PHONE_NUMBER2}`}><p className='text-[#f59e7b]'>+91 9911664845</p></a>
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-68 overflow-hidden'>
                            <MapView />
                        </div>
                    </div>

                    {/* Right form */}
                    <form
                        //   onSubmit={handleSubmit}
                        className='border-b-[3px] border-t-[3px] border-[#f59e7b] shadow-2xl flex flex-col gap-4 w-[55%] max-sm:w-full p-5'
                    >
                        <div className='flex max-lg:flex-col w-full gap-8'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label className='text-xl text-gray-600'>Your Name</label>
                                <input
                                    className='border border-gray-200 rounded-sm text-xl p-1'
                                    type="text"
                                    name="name"
                                // value={formData.name}
                                // onChange={handleChange}
                                />
                                {/* {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} */}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label className='text-xl text-gray-600'>Your Email</label>
                                <input
                                    className='border border-gray-200 rounded-sm text-xl p-1'
                                    type="text"
                                    name="email"
                                // value={formData.email}
                                // onChange={handleChange}
                                />
                                {/* {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} */}
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='text-xl text-gray-600'>Subject</label>
                            <input
                                className='border border-gray-200 rounded-sm text-xl p-1'
                                type="text"
                                name="subject"
                            //   value={formData.subject}
                            //   onChange={handleChange}
                            />
                            {/* {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>} */}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='text-xl text-gray-600'>Message</label>
                            <textarea
                                className='border border-gray-200 rounded-sm text-xl h-52 p-2'
                                name="message"
                            //   value={formData.message}
                            //   onChange={handleChange}
                            ></textarea>
                            {/* {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>} */}
                        </div>
                        <div className='flex justify-center'>
                            <button
                                type="submit"
                                className='w-fit p-1 px-5 rounded-4xl text-xl font-semibold bg-[#f59e7b] hover:bg-white cursor-pointer hover:text-[#f59e7b] hover:border hover:border-[#f59e7b] text-white transition duration-400'
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div><Footer /></div>

        </div>
    )
}

export default Contact