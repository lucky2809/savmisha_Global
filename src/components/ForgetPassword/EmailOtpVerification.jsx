import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const bgimgurl = import.meta.env.BASE_URL


const EmailOtpVerification = ({ onVerified, prefilledEmail }) => {

  const [email, setEmail] = useState(prefilledEmail || '');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter email");

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password/send-otp`, { email });
      toast.success(res.data.message);
      setShowOtpInput(true); // Show OTP input now
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password/verify-otp`, { email, otp });
      toast.success("OTP verified!");
      onVerified && onVerified(email); // Notify parent
 
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='main-charecter flex flex-col justify-center items-center h-screen border-1 w-full gap-10 bg-gray-100'>
      <div className='w-40 p-2 shadow-xl'>
        <img className='h-full w-full' src="dostcabyello.svg" alt="" srcset="" />
      </div>
      <div className="p-4 max-w-md mx-auto rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        disabled={showOtpInput}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      {!showOtpInput && (
        <button
          onClick={handleSendOtp}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      )}

      {showOtpInput && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mt-4 mb-2 p-2 border rounded"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}
    </div>
    </div>
  );
};

export default EmailOtpVerification;
