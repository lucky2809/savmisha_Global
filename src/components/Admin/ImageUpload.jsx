import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ImageUpload = () => {
  const [images, setImages] = useState([]); // all images
  const [mainIndex, setMainIndex] = useState(0); // main image index
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  // Backend API
  const API_URL = `${import.meta.env.VITE_API_URL}/images/upload`;

  // handle file select
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    // combine old + new images
    const combined = [...images, ...files];

    if (combined.length > 5) {
      alert("Maximum 5 images allowed ❌");
      return;
    }

    setImages(combined);

    // if first image, auto set main
    if (combined.length === files.length) {
      setMainIndex(0);
    }
  };

  // remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // fix main index
    if (mainIndex === index) {
      setMainIndex(0);
    } else if (mainIndex > index) {
      setMainIndex((prev) => prev - 1);
    }
  };

  // upload
  const handleSubmit = async () => {
    // if (images.length < 4) {
    //   alert("Minimum 4 images required");
    //   return;
    // }

    const formData = new FormData();

    // main image
    formData.append("mainImage", images[mainIndex]);

    // other images
    images.forEach((img, i) => {
      if (i !== mainIndex) {
        formData.append("otherImages", img);
      }
    });

    try {
      setLoading(true);

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product Uploaded Successfully");

      // reset
      setImages([]);
      setMainIndex(0);
    } catch (err) {
      console.error(err);
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center px-4 py-6">
    <div className="bg-white w-full rounded-2xl shadow-xl p-2 lg:p-6">
      <h2 className="text-xl lg:text-2xl font-bold mb-6 text-center">
        Product Image Upload
      </h2>

        {/* IMAGE UPLOAD */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col gap-2 text-center items-center mb-4">
          <p className="font-semibold">Upload Product Images</p>
          <p className="text-sm text-gray-500">Minimum 4 images required</p>
          <div className="border w-fit p-2 border-orange-700">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="lg:ml-25 w-full cursor-pointer text-orange-700"
            />
          </div>

          <p className="mt-2 text-sm">
            Selected: {images.length}/4{" "}
            {images.length >= 4 ? "✅" : "❌"}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          👉 Click any image to set as <b>Main Image</b>
        </p>

        {/* PREVIEW GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {images.map((img, index) => (
            <div key={index} className="relative group cursor-pointer">
              <img
                src={URL.createObjectURL(img)}
                alt=""
                className={`h-32 w-full object-cover rounded-lg border-2 ${mainIndex === index
                    ? "border-green-500"
                    : "border-gray-300"
                  }`}
                onClick={() => setMainIndex(index)}
              />

              {/* MAIN badge */}
              {mainIndex === index && (
                <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  MAIN
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;