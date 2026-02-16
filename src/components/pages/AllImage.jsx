import React, { useState } from "react";
import imageData from "../Data/ImageData.json";

const products = imageData.imageData;

function AllImage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  return (
    <div className="w-full px-3 pt-30 md:px-10 lg:px-14 lg:pt-60">
      
      {/* Product Grid */}
      <div className="grid lg:grid-cols-3 gap-3 max-sm:gap-2 grid-cols-2">
  {products.map((item) => (
    <div
      key={item.id}
      onClick={() => {
        setSelectedProduct(item);
        setMainImage(item.images[0]); // first image main
      }}
      className="relative group cursor-zoom-in overflow-hidden rounded-xl"
    >
      {/* Image */}
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-40 bg-black rounded-xl 
                      flex items-center justify-center 
                      opacity-0 group-hover:opacity-70 
                      transition-opacity duration-500">
        <p className="text-white text-2xl font-serif italic font-semibold 
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500">
          view more
        </p>
      </div>
    </div>
  ))}
</div>


      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-5">
          
          {/* Close */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
          >
            ✕
          </button>

          <div className="bg-white rounded-xl p-5 max-w-4xl w-full flex flex-col md:flex-row gap-5 ">
            
            {/* Main Image */}
            <div className="flex-1 max-h-[70vh] w-full flex items-center justify-center">
              <img
                src={mainImage}
                className="w-full h-full object-contain rounded-xl transition-all duration-500"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 md:w-28 justify-center">
              {selectedProduct.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`border-2 rounded-lg p-1 cursor-pointer transition-all duration-300 w-25 h-25
                    ${
                      mainImage === img
                        ? "border-blue-500 scale-105"
                        : "border-gray-300 hover:border-blue-400"
                    }
                  `}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover rounded-md hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllImage;
