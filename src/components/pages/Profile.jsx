import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'react-toastify';
import useUserStore from '../../store/userStore';


function Profile({ color = "#fff" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // ✅ logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    toast.success('Logout Successful'); // fixed toast
    navigate("/login");
  };

  // ✅ renamed to avoid conflict
  const goToProfile = () => {
    navigate('/cart');
  };

  // ✅ dropdown
  const ProfileDropDown = ({ user = {}, color }) => (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md text-sm font-medium cursor-pointer focus:outline-none"
      >
        <Icon
          width={40}
          className={`text-[${color}] font-bold`}
          icon={"qlementine-icons:user-16"}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Profile
            </button>
            <button
              disabled
              className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
              role="menuitem"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: "center" }}>
      {user ? (
        <ProfileDropDown user={user} color={color} />
      ) : (
        <div
          onClick={() => navigate("/login")}
          className="cursor-pointer border hover:bg-black hover:text-white bg-white text-black   p-1 text-sm rounded-tr-xl flex items-center gap-2"
        >
          <div>Login</div>
        </div>
      )}
    </Box>
  );
}

export default Profile;
