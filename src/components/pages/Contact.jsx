import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import MapView from './MapView'
import Footer from '../navComp/Footer'
import Navbar from '../navComp/Navbar'
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";


function Contact({ margin = "mt-20", active = "visible" }) {
    return (
        <div>
            <div><Navbar /></div>

            {/* Hero Section */}
            <section className={`${active} bg-black text-white py-5 lg:py-16 gap-4 lg:gap-8 text-center lg:mt-40 ${margin}`}>
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    We would love to hear from you. If you are looking for high quality
                    garment manufacturing or want to discuss a business opportunity,
                    feel free to contact our team.
                </p>
            </section>

            {/* Contact Info */}
            <section
                className={`${active} w-full lg:py-16 p-6 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
            >

                {/* WhatsApp */}
                <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPPNO}`}
                    className="bg-white p-6 lg:p-8 rounded-xl shadow hover:shadow-lg text-center"
                >
                    <FaWhatsapp className="text-4xl text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                    <p>Chat with us directly for quick responses.</p>
                    <p className="text-green-400 font-semibold">
                        9911664845, 9560941936
                    </p>
                </a>

                {/* Instagram */}
                <a
                    href={`${import.meta.env.VITE_APP_INSTAGRAM_LINK}`}
                    className="bg-white p-6 lg:p-8 rounded-xl shadow hover:shadow-lg text-center"
                >
                    <FaInstagram className="text-4xl text-pink-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                    <p>Follow us to see our latest clothing collections.</p>
                    <p className="font-semibold text-pink-400">
                        savmisha_global_trends
                    </p>
                </a>

                {/* Email */}
                <a
                    href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL}`}
                    className="bg-white p-3 lg:p-8 rounded-xl shadow hover:shadow-lg text-center"
                >
                    <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p>Send us your inquiries and business proposals.</p>
                    <p className="font-semibold text-blue-400">
                        info@savmishaglobal.com
                    </p>
                    <p className="font-semibold text-blue-400">
                        savmishaglobaltrends@gmail.com
                    </p>
                </a>

            </section>

            <div className={`${active}`}>
                <section className="bg-gray-50 lg:py-16 p-6 md:px-20">
                    <div className="max-w-4xl mx-auto text-center">

                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Contact Us
                        </h2>

                        <p className="text-gray-600 leading-relaxed text-lg">
                            At <strong>Savmisha Global Trends</strong>, we are always happy to
                            connect with our customers and business partners. If you are looking
                            for a reliable clothing manufacturer in Delhi or want to discuss
                            bulk garment production, custom clothing, or partnership
                            opportunities, our team is here to assist you. Feel free to reach
                            out to us with your requirements, questions, or inquiries, and we
                            will respond as soon as possible.
                        </p>

                        <p className="text-gray-600 leading-relaxed text-lg mt-4">
                            You can contact us directly through email and our team will make
                            sure to provide you with the best support and information regarding
                            our manufacturing services. We look forward to building strong and
                            long-term business relationships with our clients.
                        </p>

                        <div className="mt-8">
                            <a
                                href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL}`}
                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                            >
                                Email Us
                            </a>
                        </div>

                    </div>
                </section>

                <section className="bg-green-50 lg:py-16 p-6 md:px-20">
                    <div className="max-w-4xl mx-auto text-center">

                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Contact Us on WhatsApp
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            At <strong>Savmisha Global Trends</strong>, we make communication easy
                            and convenient for our customers. If you have any questions about our
                            clothing manufacturing services, bulk garment orders, or custom
                            production requirements, feel free to reach out to us on WhatsApp.
                            Our team is always ready to assist you with quick responses and
                            professional support.
                        </p>

                        <p className="text-gray-600 text-lg leading-relaxed mt-4">
                            Whether you are a brand, retailer, or business looking for a reliable
                            clothing manufacturer in Delhi, you can connect with us directly on
                            WhatsApp to discuss your requirements. We look forward to helping you
                            bring your clothing ideas to life with quality manufacturing and
                            trusted service.
                        </p>

                        <div className="mt-8">
                            <a
                                href={`https://wa.me/${import.meta.env.VITE_WHATSAPPNO}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
                            >
                                Chat with Us on WhatsApp
                            </a>
                        </div>

                    </div>
                </section>

                <section className="bg-pink-50 lg:py-16 p-6 md:px-20">
                    <div className="max-w-4xl mx-auto text-center">

                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Follow Us on Instagram
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            Stay connected with <strong>Savmisha Global Trends</strong> by
                            following us on Instagram. We regularly share updates about our
                            latest clothing collections, manufacturing process, and behind-the-scenes
                            moments from our garment factory in Delhi. Our Instagram page is the
                            perfect place to explore our work, see new designs, and stay inspired
                            by modern fashion trends.
                        </p>

                        <p className="text-gray-600 text-lg leading-relaxed mt-4">
                            Join our growing community and discover how Savmisha Global Trends
                            delivers quality craftsmanship and stylish apparel for brands and
                            businesses. Follow us today to keep up with our latest updates,
                            product showcases, and exciting developments in the world of
                            clothing manufacturing.
                        </p>

                        <div className="mt-8">
                            <a
                                href={`${import.meta.env.VITE_APP_INSTAGRAM_LINK}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
                            >
                                Follow Us on Instagram
                            </a>
                        </div>

                    </div>
                </section>
            </div>

            <div className={`w-full bg-white p-10 px-32 max-lg:px-15 max-sm:p-5`}>
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