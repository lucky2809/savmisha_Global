import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const bgimgurl = import.meta.env.BASE_URL


const ResetPassword = ({ email }) => {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill all fields');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setIsSubmitting(true);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password/reset`, {
        email,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message || 'Password reset successful!');
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='main-charecter flex flex-col max-lg:px-5 justify-center h-screen items-center'

    >
      <div className='w-40 p-2 shadow-xl'>
        <img className='h-full w-full' src="dostcabyello.svg" alt="" srcset="" />
      </div>
      <div className="p-4 max-w-md mx-auto rounded-xl bg-white">
        <h2 className="text-xl font-bold mb-4">Set New Password</h2>

        <label className="block mb-1 text-sm font-medium">Verified Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full mb-4 p-2 border rounded bg-gray-100 text-gray-600"
        />

        <label className="block mb-1 text-sm font-medium">New Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />

        <button
          onClick={handleReset}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
