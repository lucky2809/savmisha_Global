
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BulkImageUpload = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_URL}/images/bulk-upload`;

    /* ========================
       Select Images
    ======================== */

    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        const combined = [...images, ...files];

        if (combined.length > 100) {
            toast.error("Maximum 100 images allowed");
            return;
        }

        setImages(combined);
    };

    /* ========================
       Remove Image
    ======================== */

    const removeImage = (index) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
    };

    /* ========================
       Upload Images
    ======================== */

    const handleSubmit = async () => {
        if (!images.length) {
            toast.error("Please select images");
            return;
        }

        const formData = new FormData();

        images.forEach((img) => {
            formData.append("mainImages", img);
        });

        try {
            setLoading(true);

            await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Bulk Images Uploaded Successfully");

            setImages([]);
        } catch (error) {
            console.error(error);
            toast.error("Upload Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center px-2 md:p-4 lg:p-4">
            <div className="bg-white w-full rounded-2xl shadow-xl px-3 p-6">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Bulk Image Upload
                </h2>

                {/* UPLOAD BOX */}

                <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 flex flex-col gap-2 text-center items-center mb-4">

                    <p className="font-semibold mb-2">
                        Upload Main Product Images
                    </p>

                    <p className="text-sm text-gray-500 mb-4">
                        Upload multiple images (Max 100)
                    </p>
                    <div className="border w-fit p-2 border-orange-700">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImages}
                            className=" lg:ml-25 w-full cursor-pointer text-orange-700"
                        />
                    </div>

                    <p className="mt-3 text-sm">
                        Selected: {images.length}
                    </p>

                </div>

                {/* PREVIEW GRID */}

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">

                    {images.map((img, index) => (

                        <div key={index} className="relative group">

                            <img
                                src={URL.createObjectURL(img)}
                                alt=""
                                className="h-28 w-full object-cover rounded-lg border"
                            />

                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                ✕
                            </button>

                        </div>

                    ))}

                </div>

                {/* UPLOAD BUTTON */}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Uploading..." : "Upload All Images"}
                </button>

            </div>
        </div>
    );
};

export default BulkImageUpload;

