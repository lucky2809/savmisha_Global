import React, { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import LazyImage from "../UI/LazyImage";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function AllImage({ pageNo, limit = 4 }) {

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [expandedItems, setExpandedItems] = useState({});
  const [expandedModal, setExpandedModal] = useState(false);

  const navigate = useNavigate();
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
        if (first.isIntersecting && !isFetching.current && pageNo == null) {
          isFetching.current = true;
          setPage((prev) => prev + 1);
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

    const response = await fetch(GET_API);

    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }

    const res = await response.json();

    const formattedData = res.data.map((item) => {
      const others = [...item.otherImages]
        .filter(Boolean)
        .map((img) => HOST + img);

      const otherThumb = [...item.otherThumbnails]
        .filter(Boolean)
        .map((img) => HOST + img);

      return {
        id: item._id,
        title: "Product",
        description: item.description || "",
        images: [HOST + item.mainImage, ...others],
        thumbnails: [HOST + item.mainThumbnail, ...otherThumb],
      };
    });

    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newItems = formattedData.filter(
        (item) => !existingIds.has(item.id)
      );
      return [...prev, ...newItems];
    });

    setHasMore(res.hasMore);
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
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/images/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    setProducts((prev) => prev.filter((item) => item.id !== id));
    setSelectedProduct(null);
    setMainImage("");
    toast.success("Deleted successfully");
    navigate("/products");
  } catch (err) {
    toast.error("Delete failed");
  }
};

  const handleUpdate = () => {
    if (!selectedProduct?.id) return;
    navigate(`/dashboard/updateproductimages/${selectedProduct.id}`);
  };

  const thumbnailToImage = (thumbPath) => {
    if (!thumbPath) return null;
    return thumbPath.replace(/_thumb\.webp$/i, ".webp");
  };

  const handleSetThumbnail = (thumb = "") => {
    setMainImage(thumbnailToImage(thumb));
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
  }, [selectedProduct]);

  return (
    <div className="w-full px-3 md:px-8 lg:px-12">

      {/* GRID */}
      <div
        ref={containerRef}
        className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-3 ${pageNo ? "" : "overflow-auto"
          }`}
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
                setExpandedModal(false);
              }}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden h-52 sm:h-56 md:h-64">
                <LazyImage
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* HOVER */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                  <span className="text-white text-base md:text-lg font-semibold">
                    View More
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 flex flex-col justify-between min-h-[110px]">

                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {expandedItems[item.id]
                    ? item.description
                    : item.description?.slice(0, 80)}
                </p>

                {item.description?.length > 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedItems(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }));
                    }}
                    className="text-blue-600 text-xs mt-2 hover:underline self-start"
                  >
                    {expandedItems[item.id] ? "Less" : "View More"}
                  </button>
                )}

              </div>
            </div>
          );
        })}

        {/* SKELETON */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
      </div>
      {!hasMore && !loading && products.length > 0 && (
        <div className="w-full flex justify-center py-8">
          <p className="text-gray-400 text-sm md:text-base tracking-wide">
            — No more products —
          </p>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] px-3 sm:px-5"
            onMouseDown={handleOutsideClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* CLOSE BUTTON (DESKTOP) */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="hidden md:flex absolute top-5 right-6 text-white text-3xl z-50"
            >
              ✕
            </button>

            <motion.div
              ref={modalRef}
              onMouseDown={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl w-full max-w-5xl p-3 sm:p-5 flex flex-col md:flex-row gap-4 relative"
            >

              {/* CLOSE BUTTON (MOBILE) */}
              <div className="flex md:hidden justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-black text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* IMAGE */}
              <div className="flex-1 flex flex-col items-center">
                <img
                  src={mainImage}
                  className="w-full max-h-[55vh] object-contain rounded-lg"
                />

                {/* DESCRIPTION */}
                <div className="mt-3 w-full bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-700 text-sm md:text-base text-center">
                    {expandedModal
                      ? selectedProduct.description
                      : selectedProduct.description?.slice(0, 150)}
                  </p>

                  {selectedProduct.description?.length > 150 && (
                    <button
                      onClick={() => setExpandedModal(!expandedModal)}
                      className="text-blue-600 text-sm mt-2 block mx-auto hover:underline"
                    >
                      {expandedModal ? "Less" : "View More"}
                    </button>
                  )}
                </div>
              </div>

              {/* THUMBNAILS */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-col gap-2 md:w-28">
                {selectedProduct.thumbnails.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => handleSetThumbnail(img)}
                    className={`border rounded-md p-1 cursor-pointer ${mainImage === img ? "border-blue-500" : ""
                      }`}
                  >
                    <img
                      src={img}
                      className="w-full h-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>

              {/* ADMIN */}
              {isAdmin && (
                <div className="flex md:flex-col gap-3 w-full md:w-fit">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteImage(selectedProduct.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW ALL PRODUCTS (FIXED) */}
      {pageNo && (
        <div className="w-full flex justify-center py-6">
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 border border-black rounded-full hover:bg-black hover:text-white transition text-sm sm:text-base"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}

export default AllImage;