import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import useUserStore from '../../store/userStore';

function Profile({ color = "#fff" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  /* ================= HELPERS ================= */
  const getFirstLetter = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const toggleDropdown = () => setIsOpen(prev => !prev);

  /* ================= LOGOUT ================= */
const handleLogout = () => {
  logout(); // zustand logout
  toast.success("Logout Successful");
  navigate("/login");
  setIsOpen(false);
};

  const goToProfile = () => {
    navigate('/dashboard');
    setIsOpen(false);
  };

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: "center" }}>
      {user ? (
        <div ref={dropdownRef} className="relative inline-block text-left">

          {/* 🔘 Profile Button */}
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 cursor-pointer rounded-md text-md focus:outline-none"
          >
            {/* DESKTOP NAME */}
            <div className="font-bold text-[#f59e7b] hover:text-[#E7B09B] hidden lg:block">
              {user?.fullname || "Profile"}
            </div>

            {/* MOBILE LETTER AVATAR */}
            <div className="lg:hidden">
              <div className="w-8 h-8 rounded-full bg-[#f59e7b] flex items-center text-center justify-center text-white font-bold text-md uppercase shadow-md">
                {getFirstLetter(user?.fullname)}
              </div>
            </div>

          </button>

          {/* 🔽 Dropdown */}
          {isOpen && (
            <div className="absolute -right-4 z-20 mt-3 w-fit rounded-md bg-white shadow-xl border border-gray-200">

              {/* 🔺 Arrow Indicator */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

              <div className="py-2">

                {/* 👤 user info */}
                <div className="w-full px-4 py-2 text-center border-b text-xs text-gray-500 cursor-text">
                  Signed in as <br />
                  <span className="font-semibold text-gray-800 w-fit">
                    {user?.email}
                  </span>
                </div>

                {user?.role === "admin" && (
                  <button
                    onClick={goToProfile}
                    className="block w-full text-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div
          onClick={() => navigate("/login")}
          className="cursor-pointer border text-lg px-2 bg-black text-white md:border md:px-3 md:py-1 lg:bg-none lg:border-none lg:bg-white lg:text-black lg:p-0 "
        >
          LOGIN
        </div>
      )}
    </Box>
  );
}

export default Profile;