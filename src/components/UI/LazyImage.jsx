import { useInView } from "react-intersection-observer";
import { useState } from "react";

export default function LazyImage({
  src,
  alt = "",
  height = "",
  className = "",
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "100px",
  });

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative w-full h-full overflow-hidden rounded-lg ${height}`}
    >
      {/* Skeleton */}
      {(!loaded || !inView) && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image */}
      {inView && !error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Image not available
        </div>
      )}
    </div>
  );
}