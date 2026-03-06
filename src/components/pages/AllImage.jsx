import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import LazyImage from "../UI/LazyImage";

function AllImage() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([]);   // API data
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [newFiles, setNewFiles] = useState([]);   // 🔴 for update
  const navigate = useNavigate()

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // 🔹 zustand user
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  const HOST = `${import.meta.env.VITE_API_URL}`;

  // 🔹 APIs
  const GET_API = `${import.meta.env.VITE_API_URL}/images/all?page=${page}&limit=${4}`;
  // const DELETE_API = `${import.meta.env.VITE_API_URL}/images`;
  // const UPDATE_API = `${import.meta.env.VITE_API_URL}/images`;


  const observer = useRef(null);
  const containerRef = useRef(null);
  const isFetching = useRef(false); // 🔒 request lock

  const lastProductRef = useCallback((node) => {
    if (!node || loading || !hasMore) return;

    // prevent multiple observers
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetching.current) {
          isFetching.current = true;
          setPage((prev) => prev + 1);
        }
      },
      {
        root: containerRef.current, // 👈 important
        rootMargin: "200px",
        threshold: 0.1,
      }
    );
    observer.current.observe(node);
  }, [loading, hasMore]);


  // 🔹 fetch images
  const fetchImages = async () => {
    try {
      if (!hasMore) return;

      setLoading(true);
      const res = await axios.get(GET_API);

      const formattedData = res.data.data.map((item) => {
        const others = [...item.otherImages]
          .filter(Boolean)
          .map((img) => HOST + img);

        const otherThumb = [...item.otherThumbnails]
          .filter(Boolean)
          .map((img) => HOST + img);

        return {
          id: item._id,
          title: "Product",
          images: [
            HOST + item.mainImage,   // ✅ direct use
            ...others,               // ✅ direct use
          ],
          thumbnails: [
            HOST + item.mainThumbnail,
            ...otherThumb
          ]
        };
      });

      // ✅ append instead of replace
      // setProducts((prev) => products.length ? formattedData :  [...prev, ...formattedData]);
      setProducts((prev) => {
        const existingIds = new Set(prev.map(p => p.id));  // prevent duplicates

        const newItems = formattedData.filter(
          item => !existingIds.has(item.id)
        );

        return [...prev, ...newItems];
      });

      // backend should return hasMore
      setHasMore(res.data.hasMore);

    } catch (error) {
      console.error("GET IMAGES ERROR:", error);
    } finally {
      setLoading(false);
      isFetching.current = false; // unlock
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  // const fetchImages = async () => {
  //   try {
  //     const res = await axios.get(GET_API);

  //     const formattedData = res.data.data.map((item) => {
  //       const others = [...item.otherImages].filter(Boolean).map(img => HOST + img)
  //       const otherThumb = [...item.otherThumbnails].filter(Boolean).map(img => HOST + img)
  //       return {
  //         id: item._id,
  //         title: "Product",
  //         images: [
  //           HOST + item.mainImage,        // ✅ direct use
  //           ...others,   // ✅ direct use
  //         ],
  //         thumbnails: [
  //           HOST + item.mainThumbnail,
  //           ...otherThumb
  //         ]
  //       }
  //     });

  //     setProducts(formattedData);
  //   } catch (error) {
  //     console.error("GET IMAGES ERROR:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchImages();
  // }, []);

  // 🔴 DELETE

  const deleteImage = async (id) => {
    try {
      // API call
      await axios.delete(`${import.meta.env.VITE_API_URL}/images/delete/${id}`);

      // ✅ UI update (remove deleted product)
      setProducts((prev) => prev.filter((item) => item.id !== id));

      // ✅ Modal close
      setSelectedProduct(null);

      // ✅ Main image reset
      setMainImage("");

      // ✅ Success message
      toast.success("Deleted successfully");

      // ✅ Go to home page
      navigate("/");   // or "/home" if your route is /home

    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  // 🟡 UPDATE
  const handleUpdate = async () => {
    if (!newFiles.length) {
      alert("Select images to update");
      return;
    }

    const formData = new FormData();

    // first file = mainImage
    formData.append("mainImage", newFiles[0]);

    // rest = otherImages
    newFiles.slice(1).forEach((f) => {
      formData.append("otherImages", f);
    });

    try {
      await axios.put(`${UPDATE_API}/${selectedProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Updated ✅");
      setNewFiles([]);
      setSelectedProduct(null);
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  const thumbnailToImage = (thumbPath) => {
    if (!thumbPath) return null;

    return thumbPath.replace(/_thumb\.webp$/i, ".webp");
  };

  const handleSetThumbnail = (thumb = "") => {
    setMainImage(thumbnailToImage(thumb))
  }

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [selectedProduct]);

  return (
    <div className="w-full px-3 md:px-10 lg:px-14">
      <div className=" w-full text-center p-5 lg:p-15">
        <p className=" text-lg lg:text-4xl font-semibold">All Products</p>
      </div>
      {/* Product Grid */}
      <div ref={containerRef} className="grid lg:grid-cols-4 gap-5 p-2 lg:p-5 max-sm:gap-2 grid-cols-2 max-h-[475px] lg:max-h-[660px] bg-gray-300  overflow-auto">
        {products.map((item, index) => {
          const isLast = index === products.length - 1;

          return (
            <div
              key={item.id}
              ref={isLast ? lastProductRef : null}
              onClick={() => {
                setSelectedProduct(item);
                setMainImage(item.images[0]);
              }}
              className="relative group cursor-zoom-in rounded-xl w-full lg:h-[300px] overflow-hidden"
            >
              <LazyImage
                src={item.images[0]}
                alt={item.title}
                className="transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 z-40 bg-black rounded-xl
    flex items-center justify-center
    opacity-0 group-hover:opacity-70
    transition-opacity duration-500"
              >
                <p
                  className="text-white text-2xl font-serif italic font-semibold
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500"
                >
                  view more
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="col-span-full text-center py-4 text-gray-500">
            Loading more products...
          </div>
        )}

        {!hasMore && (
          <div className="col-span-full text-center py-4 text-gray-400">
            No more products....
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] px-5"
          onMouseDown={handleOutsideClick}
        >

          {/* Close */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="hidden md:block absolute top-5 right-5 text-black md:text-white text-3xl cursor-pointer"
          >
            ✕
          </button>

          <div
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-2 lg:p-5 max-w-4xl w-full flex flex-col md:flex-row gap-2 lg:gap-5 relative"
          >

            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="md:hidden lg-hidden w-full flex justify-end text-black md:text-white text-3xl cursor-pointer"
            >
              ✕
            </button>

            {/* Main Image */}
            <div className="flex-1 max-h-[70vh] w-full flex items-center justify-center overflow-hidden">
              <img
                src={mainImage}
                className="w-full h-full object-contain rounded-xl transition-all duration-500 overflow-hidden"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 md:flex md:flex-col gap-3 md:w-28 justify-center">
              {selectedProduct.thumbnails.map((img, i) => (
                <div
                  key={i}
                  onClick={() => handleSetThumbnail(img)}
                  className={`border-2 rounded-lg p-1 cursor-pointer transition-all duration-300 w-25 h-25
              ${mainImage === thumbnailToImage(img)
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

            <div className="flex justify-end">
              {isAdmin && (
                <div className="flex gap-4 w-full lg:w-fit">

                  <button
                    onClick={() => deleteImage(selectedProduct.id)}
                    className="bg-red-600 w-full text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-900 transition self-end"
                  >
                    Delete
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AllImage;