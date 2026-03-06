import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg 
                 bg-black text-white hover:bg-gray-800 transition cursor-pointer"
    >
      <FaArrowLeft />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;