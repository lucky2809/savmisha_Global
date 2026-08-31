import React, { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import ProductDetailModal from "./ProductDetailModal";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";
// motion is aliased: without eslint-plugin-react a lowercase identifier
// used only inside JSX is reported as unused.
import { motion as Motion, AnimatePresence } from "framer-motion";

function AllImage({ pageNo, limit = 4 }) {

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


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
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-3 items-stretch ${pageNo ? "" : "overflow-auto"
          }`}
      >

        {products.map((item, index) => (
          <ProductCard
            key={item.id}
            product={item}
            innerRef={index === products.length - 1 ? lastProductRef : null}
            onOpen={setSelectedProduct}
          />
        ))}

        {/* SKELETON */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="aspect-4/5 bg-gray-200" />
              <div className="space-y-2 p-3.5">
                <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="mt-3 h-9 w-full rounded-lg bg-gray-200" />
              </div>
            </div>
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