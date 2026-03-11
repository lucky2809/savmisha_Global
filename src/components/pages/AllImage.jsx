import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import LazyImage from "../UI/LazyImage";
import { toast } from "react-toastify";

function AllImage({ pageNo, limit = 4 }) {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const navigate = useNavigate()

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  const HOST = `${import.meta.env.VITE_API_URL}`;

  const GET_API = `${import.meta.env.VITE_API_URL}/images/all?page=${pageNo ? pageNo : page}&limit=${limit}`;

  const observer = useRef(null);
  const containerRef = useRef(null);
  const isFetching = useRef(false);

  const lastProductRef = useCallback((node) => {
    if (!node || loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetching.current && pageNo == null  ) {
          isFetching.current = true;
          setPage((prev) =>  prev + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.current.observe(node);

  }, [loading, hasMore]);


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
            HOST + item.mainImage,
            ...others,
          ],
          thumbnails: [
            HOST + item.mainThumbnail,
            ...otherThumb
          ]
        };
      });

      setProducts((prev) => {

        const existingIds = new Set(prev.map(p => p.id));

        const newItems = formattedData.filter(
          item => !existingIds.has(item.id)
        );

        return [...prev, ...newItems];

      });

      setHasMore(res.data.hasMore);

    } catch (error) {
      console.error("GET IMAGES ERROR:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);


  const deleteImage = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/images/delete/${id}`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setSelectedProduct(null);
      setMainImage("");
      toast.success("Deleted successfully");
      navigate("/");

    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };


  // ✅ UPDATE NAVIGATION
  const handleUpdate = () => {
    if (!selectedProduct?.id) return;
    navigate(`/dashboard/updateproductimages/${selectedProduct.id}`);
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
      {/* Product Grid */}

      <div
        ref={containerRef}
        className={`grid lg:grid-cols-4 gap-5 p-2 lg:p-5 max-sm:gap-2 grid-cols-2 h-full ${pageNo ? " " :"overflow-auto"}`}
      >

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
              className="relative group cursor-zoom-in rounded-xl w-full border border-gray-300 lg:h-[300px] overflow-hidden"
            >

              <LazyImage
                src={item.images[0]}
                alt={item.title}
                className="transition-transform duration-500 group-hover:scale-110"
              />

              <div
                className="absolute inset-0 z-40 bg-black rounded-xl
                flex items-center justify-center
                opacity-0 group-hover:opacity-70
                transition-opacity duration-500"
              >
                <p className="text-white text-2xl font-serif italic font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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

          <button
            onClick={() => setSelectedProduct(null)}
            className="hidden md:block absolute top-5 right-5 text-black md:text-white text-3xl cursor-pointer"
          >
            ✕
          </button>


          <div
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-gray-200 rounded-xl p-2 lg:p-5 max-w-4xl w-full flex flex-col md:flex-row gap-2 lg:gap-5 relative"
          >

            <button
              onClick={() => setSelectedProduct(null)}
              className="md:hidden lg-hidden w-full flex justify-end text-black text-3xl cursor-pointer"
            >
              ✕
            </button>


            {/* Main Image */}

            <div className="flex-1 max-h-[70vh] w-full flex items-center justify-center overflow-hidden">

              <img
                src={mainImage}
                className="w-full h-full object-contain rounded-xl transition-all duration-500 overflow-hidden shadow-2xl"
              />

            </div>


            {/* Thumbnails */}

            <div className="grid grid-cols-2 md:flex md:flex-col gap-3 md:w-28">

              {selectedProduct.thumbnails.map((img, i) => (

                <div
                  key={i}
                  onClick={() => handleSetThumbnail(img)}
                  className={`border rounded-lg p-1 cursor-pointer transition-all duration-300 w-25 h-25
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


            {/* ADMIN BUTTONS */}

            {isAdmin && (

              <div className="flex lg:flex-col lg:justify-end gap-4 w-full lg:w-fit">

                <button
                  onClick={() => handleUpdate()}
                  className="bg-blue-600 w-full text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteImage(selectedProduct.id)}
                  className="bg-red-600 w-full text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-900 transition"
                >
                  Delete
                </button>

              </div>

            )}

          </div>

        </div>

      )}
      {pageNo ?  <div className="w-full flex justify-center p-4">
          <button onClick={() => navigate("/products")} className="p-2 px-4 cursor-pointer border hover:text-white hover:bg-black">View All Products</button>
          </div> :" "}

    </div>
  );
}

export default AllImage;