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
      <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
        <LazyImage
          src={product.images[0]}
          alt={product.description || "Product"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900">
            <MdOutlineVisibility className="h-4 w-4" />
            View details
          </span>
        </div>

        {product.images.length > 1 && (
          <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
            {product.images.length} photos
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3.5">
        <p
          className="line-clamp-2 min-h-10 text-sm leading-relaxed font-medium text-gray-800"
          title={product.description}
        >
          {product.description?.trim() || "Untitled product"}
        </p>

        {/* VARIANTS */}
        <div className="mt-3 min-h-14 space-y-2">
          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Sizes
              </span>
              {product.sizes.slice(0, MAX_SIZE_CHIPS).map((s) => (
                <span
                  key={s}
                  className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700"
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
              <span className="mr-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Colours
              </span>
              {product.colors.slice(0, MAX_COLOR_CHIPS).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
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
            <p className="text-[11px] text-gray-400 italic">
              Sizes and colours on request
            </p>
          )}
        </div>

        {/* ACTION - mt-auto pins it to the bottom on every card */}
        <button
          onClick={open}
          className={`mt-auto flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
            orderable
              ? "bg-black text-white hover:bg-gray-800"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {orderable ? (
            <>
              <MdAddShoppingCart className="h-4 w-4" />
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
