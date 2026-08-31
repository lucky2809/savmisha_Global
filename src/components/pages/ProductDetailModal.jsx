import { useEffect, useMemo, useState } from "react";
// Aliased to a capitalised name: this config has no eslint-plugin-react,
// so a lowercase identifier used only in JSX reads as unused.
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdClose, MdAddShoppingCart, MdCheck } from "react-icons/md";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/userStore";
import { MAX_ORDER_QTY, clampQty, formatDate } from "../../lib/catalog";

/**
 * Product detail. Sizes and colours come from the product; a customer picks
 * one of each plus a quantity, which becomes a single order line.
 */
export default function ProductDetailModal({
  product,
  onClose,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const [mainImage, setMainImage] = useState(product.images?.[0] || "");
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const [qtyText, setQtyText] = useState("1");
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const orderable = useMemo(
    () => Boolean(product.sizes?.length && product.colors?.length),
    [product.sizes, product.colors]
  );

  const commitQty = (raw) => {
    const next = clampQty(raw);
    setQty(next);
    setQtyText(String(next));
  };

  const handleAdd = () => {
    if (!token) {
      toast.info("Please sign in to place an order");
      navigate("/login");
      return;
    }

    if (!size || !color) {
      toast.error("Choose a size and a colour");
      return;
    }

    const { merged, capped } = addItem({
      productId: product.id,
      serialNumber: product.serialNumber,
      description: product.description,
      image: product.thumbnails?.[0] || product.images?.[0] || "",
      size,
      color,
      quantity: qty,
    });

    if (capped) {
      toast.warning(`That line is now capped at ${MAX_ORDER_QTY} pcs`);
    } else if (merged) {
      toast.success("Added to the existing cart line");
    } else {
      toast.success("Added to cart");
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const description = product.description?.trim() || "";
  const isLong = description.length > 220;

  return (
    <Motion.div
      onMouseDown={(e) => e.stopPropagation()}
      initial={{ scale: 0.96, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.96, y: 30, opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
            {product.serialNumber || "Product"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Added {formatDate(product.createdAt)}
            {product.updatedAt && product.updatedAt !== product.createdAt && (
              <> · Updated {formatDate(product.updatedAt)}</>
            )}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>

      {/* BODY */}
      <div className="grid flex-1 gap-6 overflow-y-auto p-4 sm:p-6 md:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            <img
              src={mainImage}
              alt={product.serialNumber || "Product"}
              className="h-full w-full object-contain"
            />
          </div>

          {product.thumbnails?.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                    mainImage === img
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={product.thumbnails[i] || img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS + ORDER */}
        <div className="flex flex-col gap-5">
          {description && (
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
                {expanded || !isLong
                  ? description
                  : `${description.slice(0, 220)}...`}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-1 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {!orderable ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                Not available to order yet
              </p>
              <p className="mt-1 text-sm text-gray-600">
                This product has no sizes or colours listed. Contact us and we
                will help with your requirement.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-12 cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        size === s
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Colour
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                        color === c
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Quantity{" "}
                  <span className="font-normal text-gray-500">
                    (max {MAX_ORDER_QTY.toLocaleString()} pcs)
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => commitQty(qty - 1)}
                    disabled={qty <= 1}
                    aria-label="Decrease"
                    className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 text-lg font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={MAX_ORDER_QTY}
                    value={qtyText}
                    // Kept as free text while typing so the field can be
                    // cleared; clamped on blur rather than on every keystroke.
                    onChange={(e) => setQtyText(e.target.value)}
                    onBlur={() => commitQty(qtyText)}
                    className="h-10 w-24 rounded-lg border border-gray-300 text-center text-sm font-semibold focus:border-black focus:outline-none"
                  />

                  <button
                    onClick={() => commitQty(qty + 1)}
                    disabled={qty >= MAX_ORDER_QTY}
                    aria-label="Increase"
                    className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 text-lg font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                  <span className="ml-1 text-sm text-gray-500">pcs</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition ${
                  added ? "bg-green-600" : "bg-black hover:bg-gray-800"
                }`}
              >
                {added ? (
                  <>
                    <MdCheck className="h-5 w-5" /> Added to cart
                  </>
                ) : (
                  <>
                    <MdAddShoppingCart className="h-5 w-5" /> Add to cart
                  </>
                )}
              </button>

              {!token && (
                <p className="-mt-2 text-center text-xs text-gray-500">
                  You will be asked to sign in first.
                </p>
              )}
            </>
          )}

          {/* SPEC TABLE */}
          <dl className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-gray-500">Serial number</dt>
              <dd className="font-medium text-gray-900">
                {product.serialNumber || "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-gray-500">Sizes</dt>
              <dd className="text-right font-medium text-gray-900">
                {product.sizes?.length ? product.sizes.join(", ") : "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-gray-500">Colours</dt>
              <dd className="text-right font-medium text-gray-900">
                {product.colors?.length ? product.colors.join(", ") : "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-gray-500">Listed</dt>
              <dd className="font-medium text-gray-900">
                {formatDate(product.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <dt className="text-gray-500">Last updated</dt>
              <dd className="font-medium text-gray-900">
                {formatDate(product.updatedAt)}
              </dd>
            </div>
          </dl>

          {isAdmin && (
            <div className="flex gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={onEdit}
                className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}

          {user?.role === "admin" && (
            <p className="text-center text-xs text-gray-400">
              Signed in as admin
            </p>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
