
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import useUserStore from '../../store/userStore'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const bgimgurl = import.meta.env.BASE_URL

const ErrorMessage = ({ error, field }) => {
  return error[field] && <p className='text-red-500 text-sm mt-1'>{error[field]}</p>
}

function Login() {

  const email = useRef("")
  const password = useRef("")
  const navigate = useNavigate()

  const [error, setError] = useState({})
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

//   const { setUser } = useUserStore()
  const { setAuth } = useUserStore.getState()

  const signInHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    const object = {
      email: email.current.value.toLowerCase(),
      password: password.current.value
    }

    if (!object.email) {
      setError(prev => ({ ...prev, email: "Email is required" }))
      toast.error("Email is required")
      return
    } else {
      setError(prev => ({ ...prev, email: "" }))
    }

    if (!object.password) {
      setError(prev => ({ ...prev, password: "Password is required" }))
      toast.error("Password is required")
      return
    } else {
      setError(prev => ({ ...prev, password: "" }))
    }

    try {

      setLoading(true)

      const url = `${import.meta.env.VITE_API_URL}/login/`

      const fetchData = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
      })

      const data = await fetchData.json()

      if (fetchData.ok) {
        console.log("SighnToken", data.token)
        localStorage.setItem("access_token", data.token, data.user_data)

        setAuth(data.user_data, data.token)

        toast.success("Login Successful 🎉")

        const fetchVerifyToken = async (token) => {
          try {

            const verify = await fetch(`${import.meta.env.VITE_API_URL}/verify-token/`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            const verifyData = await verify.json()

            const role = verifyData.user_data?.role

            setAuth(verifyData.user_data, data.token)

            // if (role === "admin") {
            //   navigate("/")
            // } else {
              navigate("/")
            // }

          } catch (err) {
            console.error("Token verification failed:", err)
            toast.error("Token verification failed")
          }
        }

        const token = localStorage.getItem("access_token")

        if (token) {
          fetchVerifyToken(token)
        }

      } else {

        if (data.error_type === "email") {
          setError(prev => ({ ...prev, email: data.message }))
        }

        if (data.error_type === "password") {
          setError(prev => ({ ...prev, password: data.message }))
        }

        toast.warning(data.message || "Login failed ❌")

      }

    } catch (err) {
      console.log(err)
      toast.error("Server error ❌")
    } finally {
      setLoading(false)
    }
  }
  console.log("token", )

  return (
    <div
      className='w-full min-h-screen flex items-center justify-center bg-cover'
      style={{ backgroundImage: `url(${bgimgurl}login.png)` }}
    >

      <ToastContainer position="top-right" autoClose={2500} />

      <div className='w-full max-w-4xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2'>

        {/* LEFT */}
        <div className='flex flex-col justify-center items-center p-8'>

          <div className='flex flex-col items-center'>
            <img className='w-20' src="logo02.png" alt="logo" />
            <p className='font-bold text-lg'>SAVMISHA GLOBAL</p>
          </div>

          <div className='py-4 text-center'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <p className='text-gray-600'>Welcome back 👋</p>
          </div>

          <div className='w-full flex flex-col gap-4'>

            {/* EMAIL */}
            <div>
              <label className='font-semibold'>Email*</label>
              <input
                ref={email}
                type="text"
                className='w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-300 outline-none'
                placeholder='Email address'
              />
              <ErrorMessage error={error} field={"email"} />
            </div>

            {/* PASSWORD */}
            <div>
              <label className='font-semibold'>Password*</label>

              <div className="relative">

                <input
                  type={show ? "text" : "password"}
                  ref={password}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                  placeholder="Password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {show ? <FaEye /> : <FaEyeSlash />}
                </button>

              </div>

              <ErrorMessage error={error} field={"password"} />
            </div>

            {/* OPTIONS */}
            <div className='flex justify-between items-center text-sm'>
              <div className='flex gap-2 items-center'>
                <input type="checkbox" />
                <span className='text-gray-600'>Keep me logged in</span>
              </div>

              <Link to={'/forgetpassword'} className='text-orange-600 hover:underline'>
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={signInHandler}
              disabled={loading}
              className={`bg-[#f59e7b] hover:bg-[#E7B09B] text-white py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >

              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}

            </button>

            {/* SIGNUP */}
            <Link to={"/signup"}>
              <button className='bg-black text-white py-2 rounded-xl w-full font-semibold cursor-pointer'>
                Create Account
              </button>
            </Link>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className='hidden lg:block'>
          <img className='w-full h-full object-cover' src="login.png" alt="login" />
        </div>

      </div>
    </div>
  )
}

export default Login;
