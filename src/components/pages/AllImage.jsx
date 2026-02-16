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
        {products.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedProduct(item);
              setMainImage(item.images[0]); // first image main
            }}
            className="cursor-pointer overflow-hidden rounded-xl"
          >
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full object-cover hover:scale-110 transition duration-500"
            />
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

          <div className="bg-white rounded-xl p-5 max-w-4xl w-full flex flex-col md:flex-row gap-5">
            
            {/* Main Image */}
            <div className="flex-1 wfull h-full flex items-center justify-center">
              <img
                src={mainImage}
                className="w-full h-fit object-contain rounded-xl transition-all duration-500"
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
