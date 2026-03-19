import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import Navbar from '../navComp/Navbar'
import { toast, ToastContainer } from 'react-toastify'   // ✅ added
import { FaEye, FaEyeSlash } from "react-icons/fa";


const ErrorMessage = ({ error, field }) => {
    return error[field] && <p className='text-red-500 text-sm'>{error[field]}</p>
}

function Signup() {

    const navigate = useNavigate()
    const fullname = useRef("")
    const phone = useRef("")
    const email = useRef("")
    const password = useRef("")
    const [error, setError] = useState({})
    const [show, setShow] = useState(false);

    const validate = (fields) => {
        let newErrors = {}

        if (!fields.fullname.trim()) {
            newErrors.fullname = "Full name is required"
        }
        if (!fields.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^\d{10,15}$/.test(fields.phone)) {
            newErrors.phone = "Phone must be 10-15 digits"
        }
        if (!fields.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            newErrors.email = "Invalid email format"
        }
        if (!fields.password.trim()) {
            newErrors.password = "Password is required"
        } else if (fields.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        return newErrors
    }

    const SignUpSubmitHanlder = async (e) => {
        e.preventDefault()
        const object = {
            fullname: fullname.current.value,
            phone: phone.current.value,
            email: email.current.value.toLowerCase(),   // 🔥 FIX
            password: password.current.value
        }

        const newErrors = validate(object)
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors)
            toast.error("Please fix the errors")   // ✅ toast added
            return
        }
        setError({})

        try {
            const url = `${import.meta.env.VITE_API_URL}/registration-api/`
            const fetchData = await fetch(url, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(object)
            })
            const response = await fetchData.json()
            navigate('/login')
            toast.success('Account Create Successfull')  // ✅ already present (now works)
        } catch (err) {
            console.log("Something Went Wrong ..! ", err)
            toast.error("Server error ❌")   // ✅ toast added
        }
    }

    return (
        <div className=' flex flex-col gap-2 lg:gap-6'>
            {/* <Navbar /> */}
            {/* <div className='w-full'> */}
            <div className='flex w-full font-sans font-semibold'>
                <div className='w-full flex flex-col justify-center lg:gap-12 items-center max-lg:px-20 max-sm:px-5 md:flex md:justify-center h-screen md:items-center'>
                    {/* <div className='flex w-full max-sm:justify-center px-15 max-lg:px-2 p-2'>
                            <p className='text-md lg:text-lg font-semibold'>
                                If you have an account 
                                <span className='text-blue-600'> <Link to={"/login"}> Sign In</Link></span>
                            </p>
                        </div> */}
                    {/* <div className='w-full flex justify-center'>
                            <Icon width={60} className='text-black text-center border rounded-xl p-2 w-fit' icon={"lets-icons:user-add-alt-fill"} />
                        </div> */}
                    <div className='w-full flex flex-col items-center gap-0 m-0 p-0'>
                        <img className='w-20' src="logo02.png" alt="" srcset="" />
                        <p className='p-0 m-0 font-sans font-semibold text-md lg:text-lg'>SAVMISHA GLOBAL</p>
                    </div>

                    <div className='flex flex-col gap-4 lg:gap-7'>
                        <p className='text-lg w-full text-center justify-end'>Create new account</p>
                        <div className='flex flex-col justify-center gap-6 max-sm:gap-3 px-10 max-sm:px-3'>
                            <div className='flex max-sm:flex-col w-full gap-5 max-sm:gap-3'>
                                <div className='flex w-full flex-col'>
                                    <label className='text-md lg:text-lg'>Full Name</label>
                                    <input ref={fullname} className='border border-gray-400 rounded-lg p-2 w-full' type="text" placeholder='Enter Full name' />
                                    <ErrorMessage error={error} field="fullname" />
                                </div>
                                <div className='flex w-full flex-col'>
                                    <label className='text-md lg:text-lg'>Phone No</label>
                                    <input ref={phone} className='border border-gray-400 rounded-lg p-2 w-full' type="number" placeholder='Enter Phone Number' />
                                    <ErrorMessage error={error} field="phone" />
                                </div>
                            </div>
                            <div className='flex flex-col max-sm:flex-col w-full gap-5 max-sm:gap-3'>
                                <div className='flex w-full flex-col'>
                                    <label className='text-md lg:text-lg '>Email Address</label>
                                    <input ref={email} className='border border-gray-400 rounded-lg p-2 w-full' type="email" placeholder='Enter Email Address' />
                                    <ErrorMessage error={error} field="email" />
                                </div>
                                <div className='relative'>
                                    <label className='text-md lg:text-lg'>Password</label>
                                    <input ref={password} className='border border-gray-400 rounded-lg p-2 w-full' type={show ? "text" : "password"} placeholder='Enter Password' />
                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3 top-12 -translate-y-1/2 text-gray-600"
                                    >
                                        {show ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                    <ErrorMessage error={error} field="password" />
                                </div>
                            </div>
                            <div className='flex gap-2 max-sm:gap-1 w-full'>
                                <input required className='w-4 mb-0.5' type="checkbox" />
                                <p>I accept the terms and conditions and I agree to the privacy policy.</p>
                            </div>
                            <div className='flex justify-center'>
                                <button onClick={SignUpSubmitHanlder} className='text-white bg-[#f59e7b] hover:bg-[#E7B09B] px-7 text-md lg:text-lg rounded-md p-1 cursor-pointer'>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='max-lg:hidden w-full flex'>
                    <img className='' src="signup.png" alt="" srcset="" />
                </div>
            </div>
        </div>
    )
}

export default Signup