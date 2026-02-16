import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import Navbar from '../navComp/Navbar'

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
            email: email.current.value,
            password: password.current.value
        }

        const newErrors = validate(object)
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors)
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
            // alert(JSON.stringify(response))
            toast.success('Account Create Successfull')
        } catch (err) {
            console.log("Something Went Wrong ..! ", err)
        }
    }

    return (
        <div className='max-sm:px-5 max-sm:py-5 flex flex-col gap-6'>
            {/* <Navbar /> */}
            {/* <div className='w-full'> */}
                <div className='flex w-full font-DynaPuff'>
                    <div className='w-full max-sm:w-full h-screen flex flex-col justify-center gap-12 items-center max-lg:px-20 max-sm:px-5'>
                        {/* <div className='flex w-full max-sm:justify-center px-15 max-lg:px-2 p-2'>
                            <p className='text-lg font-semibold'>
                                If you have an account 
                                <span className='text-blue-600'> <Link to={"/login"}> Sign In</Link></span>
                            </p>
                        </div> */}
                        {/* <div className='w-full flex justify-center'>
                            <Icon width={60} className='text-black text-center border rounded-xl p-2 w-fit' icon={"lets-icons:user-add-alt-fill"} />
                        </div> */}
                        <div className='w-15 flex '>
                            <img src="faviconsdt1.png" alt="" srcset="" />
                        </div>

                        <div className='flex flex-col gap-7'>
                        <p className='text-xl w-full text-center justify-end'>Create new account</p>
                        <div className='flex flex-col justify-center gap-6 max-sm:gap-3 px-10 max-sm:px-3'>
                            <div className='flex max-sm:flex-col w-full gap-5 max-sm:gap-3'>
                                <div className='flex w-full flex-col'>
                                    <label className='text-lg'>Full Name</label>
                                    <input ref={fullname} className='border border-gray-400 rounded-lg p-2 w-full' type="text" placeholder='Enter Full name' />
                                    <ErrorMessage error={error} field="fullname" />
                                </div>
                                <div className='flex w-full flex-col'>
                                    <label className='text-lg'>Phone No</label>
                                    <input ref={phone} className='border border-gray-400 rounded-lg p-2 w-full' type="text" placeholder='Enter Phone Number' />
                                    <ErrorMessage error={error} field="phone" />
                                </div>
                            </div>
                            <div className='flex flex-col max-sm:flex-col w-full gap-5 max-sm:gap-3'>
                                <div className='flex w-full flex-col'>
                                    <label className='text-lg '>Email Address</label>
                                    <input ref={email} className='border border-gray-400 rounded-lg p-2 w-full' type="text" placeholder='Enter Email Address' />
                                    <ErrorMessage error={error} field="email" />
                                </div>
                                <div className='flex w-full flex-col'>
                                    <label className='text-lg'>Password</label>
                                    <input ref={password} className='border border-gray-400 rounded-lg p-2 w-full' type="password" placeholder='Enter Password' />
                                    <ErrorMessage error={error} field="password" />
                                </div>
                            </div>
                            <div className='flex gap-2 max-sm:gap-1 w-full'>
                                <input required className='w-4 mb-0.5' type="checkbox" /> 
                                <p>I accept the terms and conditions and I agree to the privacy policy.</p>
                            </div>
                            <div className='flex justify-center'>
                                <button onClick={SignUpSubmitHanlder} className='text-white bg-pink-600 px-7 text-lg rounded-md p-1'>
                                    Submit
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='max-lg:hidden w-[45%] flex'>
                        <img className='' src="login.jpg" alt="" srcset="" />
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default Signup
