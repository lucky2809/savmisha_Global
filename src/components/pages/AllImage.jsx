import React, { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import LazyImage from "../UI/LazyImage";
import ProductDetailModal from "./ProductDetailModal";
import { toast } from "react-toastify";
// motion is aliased: without eslint-plugin-react a lowercase identifier
// used only inside JSX is reported as unused.
import { motion as Motion, AnimatePresence } from "framer-motion";

function AllImage({ pageNo, limit = 4 }) {

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [expandedItems, setExpandedItems] = useState({});

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
        serialNumber: item.serialNumber || "",
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        colors: Array.isArray(item.colors) ? item.colors : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
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
    toast.success("Deleted successfully");
    navigate("/products");
  } catch (err) {
    toast.error(err?.message || "Delete failed");
  }
};

  const handleUpdate = () => {
    if (!selectedProduct?.id) return;
    navigate(`/dashboard/updateproductimages/${selectedProduct.id}`);
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
              onClick={() => setSelectedProduct(item)}
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

                {/* Sizes and colours. Serial number is intentionally not shown
                    on the storefront - it is only on the detail view. */}
                {(item.sizes?.length > 0 || item.colors?.length > 0) && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {item.sizes?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          Sizes
                        </span>
                        {item.sizes.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.colors?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          Colours
                        </span>
                        {item.colors.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                          >
                            {c}
                          </span>
                        ))}
                        {item.colors.length > 3 && (
                          <span className="text-[10px] text-gray-400">
                            +{item.colors.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
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
          <Motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] px-3 sm:px-5"
            onMouseDown={handleOutsideClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div ref={modalRef} className="w-full max-w-5xl">
              <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                isAdmin={isAdmin}
                onEdit={handleUpdate}
                onDelete={deleteImage}
              />
            </div>
          </Motion.div>
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