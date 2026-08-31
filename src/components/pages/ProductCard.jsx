import { MdAddShoppingCart, MdOutlineVisibility } from "react-icons/md";
import LazyImage from "../UI/LazyImage";

const MAX_SIZE_CHIPS = 4;
const MAX_COLOR_CHIPS = 3;

/**
 * Catalogue card. Every card is the same height regardless of how long the
 * description is, so the grid stays on a baseline: fixed image ratio, clamped
 * text, and the action pinned to the bottom with mt-auto.
 */
export default function ProductCard({ product, onOpen, innerRef }) {
  const orderable = Boolean(product.sizes?.length && product.colors?.length);

  const open = (e) => {
    e.stopPropagation();
    onOpen(product);
  };

  return (
    <article
      ref={innerRef}
      onClick={() => onOpen(product)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg"
    >
      {/* IMAGE - a fixed ratio keeps portrait and landscape uploads aligned */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-2">
        <LazyImage
          src={product.images[0]}
          alt={product.description || "Product"}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900">
            <MdOutlineVisibility className="h-3.5 w-3.5" />
            View details
          </span>
        </div>

        {product.images.length > 1 && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-black/55 px-1.5 py-px text-[10px] font-semibold text-white">
            {product.images.length}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-2.5">
        <p
          className="line-clamp-2 text-[13px] leading-snug font-semibold text-gray-800"
          title={product.description}
        >
          {product.description?.trim() || "Untitled product"}
        </p>

        {/* VARIANTS */}
        <div className="mt-2 space-y-1">
          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-0.5 text-[9px] font-semibold tracking-wide text-gray-400 uppercase">
                Sizes
              </span>
              {product.sizes.slice(0, MAX_SIZE_CHIPS).map((s) => (
                <span
                  key={s}
                  className="rounded border border-gray-300 px-1 py-px text-[10px] font-semibold text-gray-700"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > MAX_SIZE_CHIPS && (
                <span className="text-[10px] font-medium text-gray-400">
                  +{product.sizes.length - MAX_SIZE_CHIPS}
                </span>
              )}
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-0.5 text-[9px] font-semibold tracking-wide text-gray-400 uppercase">
                Colours
              </span>
              {product.colors.slice(0, MAX_COLOR_CHIPS).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-gray-100 px-1.5 py-px text-[10px] font-medium text-gray-700"
                >
                  {c}
                </span>
              ))}
              {product.colors.length > MAX_COLOR_CHIPS && (
                <span className="text-[10px] font-medium text-gray-400">
                  +{product.colors.length - MAX_COLOR_CHIPS}
                </span>
              )}
            </div>
          )}

          {/* Older products predate the size/colour fields. Say so plainly
              rather than leaving a silent gap in the card. */}
          {!orderable && (
            <p className="text-[10px] text-gray-400 italic">
              Sizes and colours on request
            </p>
          )}
        </div>

        {/* ACTION - pushed to the bottom so buttons line up across a row */}
        <div className="flex-1" />
        <button
          onClick={open}
          className={`mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
            orderable
              ? "bg-black text-white hover:bg-gray-800"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {orderable ? (
            <>
              <MdAddShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </>
          ) : (
            "View details"
          )}
        </button>
      </div>
    </article>
  );
}
