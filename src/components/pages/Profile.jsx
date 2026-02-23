import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import useUserStore from '../../store/userStore';
import { Icon } from '@iconify/react';

function Profile({ color = "#fff" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);   // 👈 outside click ref
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  // ✅ logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    toast.success('Logout Successful');
    navigate("/login");
    setIsOpen(false);
  };

  const goToProfile = () => {
    navigate('/dashboard');
    setIsOpen(false);
  };

  // ✅ OUTSIDE CLICK CLOSE
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
            className="flex items-center gap-2 cursor-pointer rounded-md text-md font-medium focus:outline-none"
          >
            <div className="font-bold text-black hidden lg:block">
              {user?.fullname || "Profile"}
            </div>
            <div className='lg:hidden'>
              <Icon
                width={30}
                className={`text-[${color}] font-bold`}
                icon={"qlementine-icons:user-16"}
              />
            </div>

          </button>

          {/* 🔽 Dropdown */}
          {isOpen && (
            <div className="absolute -right-5 lg:right-0 z-20 mt-3 w-48 rounded-md bg-white shadow-xl border border-gray-200">

              {/* 🔺 Arrow Indicator */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

              <div className="py-2">

                {/* 👤 user info */}
                <div className="px-4 py-2 text-center border-b text-xs text-gray-500 cursor-text">
                  Signed in as <br />
                  <span className="font-semibold text-gray-800">
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
          className="cursor-pointer border px-1 bg-black text-white md:border md:px-2 md:py-1 lg:bg-none lg:border-none lg:bg-white lg:text-black lg:p-0 "
        >
          Login
        </div>
      )}
    </Box>
  );
}

export default Profile;