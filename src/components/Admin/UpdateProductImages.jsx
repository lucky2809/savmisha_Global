import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProductImages = () => {

  const { id } = useParams();

  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;
  const HOST = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // ================= FETCH PRODUCT =================

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API}/images/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const res = await response.json();
      const data = res.data;

      const formatted = [
        {
          url: HOST + data.mainImage,
          path: data.mainImage,
          file: null,
          isNew: false
        },
        ...data.otherImages.map((img) => ({
          url: HOST + img,
          path: img,
          file: null,
          isNew: false
        }))
      ];

      setImages(formatted);
      setMainIndex(0);
      setDescription(
        typeof data.description === "string" ? data.description : ""
      );

    } catch (err) {
      console.log(err);
      toast.error("Failed to load product images");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ================= ADD NEW IMAGES =================

  const handleImages = (e) => {

    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      path: null,
      isNew: true
    }));

    const combined = [...images, ...newImages];

    if (combined.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages(combined);
  };

  // ================= REMOVE IMAGE =================

  const removeImage = async (index) => {

    const img = images[index];

    try {

      if (!img.isNew) {
        const response = await fetch(`${API}/images/update-action/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteImage: img.path
          }),
        });

        if (!response.ok) {
          throw new Error("Delete failed");
        }
      }

      const updated = images.filter((_, i) => i !== index);

      setImages(updated);

      if (mainIndex === index) setMainIndex(0);
      else if (mainIndex > index) setMainIndex((prev) => prev - 1);

    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // ================= SET MAIN IMAGE =================

  const setMain = async (index) => {

    const img = images[index];

    try {

      if (!img.isNew) {
        const response = await fetch(`${API}/images/update-action/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            setMain: img.path
          }),
        });

        if (!response.ok) {
          throw new Error("Main update failed");
        }
      }

      setMainIndex(index);

    } catch (err) {
      console.log(err);
      toast.error("Main image update failed");
    }
  };

  // ================= UPDATE PRODUCT =================

  const handleUpdate = async () => {

    const formData = new FormData();

    formData.append("description", description);

    const mainImage = images[mainIndex];

    if (mainImage?.isNew) {
      formData.append("mainImage", mainImage.file);
    }

    images.forEach((img, i) => {
      if (i === mainIndex) return;

      if (img.isNew) {
        formData.append("otherImages", img.file);
      }
    });

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/images/update-images/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast.success("Product updated successfully");
      navigate('/products');
      setImages([]);
      setMainIndex(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchProduct();

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (

    <div className="bg-gray-100 flex justify-center items-center px-3 md:p-4 lg:p-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl px-3 p-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Product Images
        </h2>

        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col gap-2 text-center items-center mb-4">

          <p className="font-semibold">Add More Images</p>

          <div className="border w-fit p-2 border-orange-700">

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="lg:ml-25 w-full cursor-pointer text-orange-700"
            />

          </div>

          <p className="mt-2 text-sm">
            Total Images: {images.length}
          </p>

        </div>

        <p className="text-sm text-gray-600 mb-4">
          👉 Click any image to set as <b>Main Image</b>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">

          {images.map((img, index) => (

            <div key={index} className="relative group cursor-pointer">

              <img
                src={img.url}
                alt=""
                className={`h-32 w-full object-cover rounded-lg border-2 ${
                  mainIndex === index
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                onClick={() => setMain(index)}
              />

              {mainIndex === index && (
                <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  MAIN
                </span>
              )}

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

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Product Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={description ? "" : "Enter product description..."}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>

      </div>

    </div>

  );

};

export default UpdateProductImages;