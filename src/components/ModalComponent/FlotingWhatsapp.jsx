import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsapp = () => {
  return (
    <a
      href={`https://wa.me/${import.meta.env.VITE_WHATSAPPNO}`}   // <-- apna number yaha daalo
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-black hover:bg-white hover:text-black p-4 rounded-full shadow-2xl cursor-pointer 
                      hover:scale-110 transition-all duration-300 
                      flex items-center justify-center text-white border border-black">
        <FaWhatsapp className="text-2xl" />
      </div>
    </a>
  );
};

export default FloatingWhatsapp;
