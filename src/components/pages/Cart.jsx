import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdDelete,
  MdShoppingCartCheckout,
  MdOutlineRemoveShoppingCart,
} from "react-icons/md";
import Navbar from "../navComp/Navbar";
import NavSpacer from "../navComp/NavSpacer";
import Footer from "../navComp/Footer";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/userStore";
import { authApi } from "../../lib/api";
import { MAX_ORDER_QTY, clampQty } from "../../lib/catalog";

function QuantityBox({ value, onChange, disabled }) {
  const [text, setText] = useState(String(value));

  // Typed text is held loosely so the field can be emptied mid-edit, then
  // clamped to 1..MAX on blur.
  const commit = (raw) => {
    const next = clampQty(raw);
    setText(String(next));
    onChange(next);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => commit(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease"
        className="h-9 w-9 cursor-pointer rounded-lg border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        -
      </button>

      <input
        type="number"
        min={1}
        max={MAX_ORDER_QTY}
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => commit(text)}
        className="h-9 w-20 rounded-lg border border-gray-300 text-center text-sm font-semibold focus:border-black focus:outline-none"
      />

      <button
        onClick={() => commit(value + 1)}
        disabled={disabled || value >= MAX_ORDER_QTY}
        aria-label="Increase"
        className="h-9 w-9 cursor-pointer rounded-lg border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = async () => {
    if (!token) {
      toast.info("Please sign in to place an order");
      navigate("/login");
      return;
    }

    if (!items.length) return;

    setPlacing(true);

    try {
      const res = await authApi.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: address.trim(),
        note: note.trim(),
      });

      clear();
      toast.success(`Order ${res.data.orderNumber} placed`);
      navigate("/orders");
    } catch (err) {
      // The server validates every line again, so its message is the useful one.
      toast.error(err.message || "Could not place the order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <NavSpacer />

      <main className="flex-1 px-4 pt-6 pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Your Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {items.length
                  ? `${items.length} line${items.length === 1 ? "" : "s"} · ${totalUnits.toLocaleString()} pcs total`
                  : "Nothing here yet"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clear}
                className="cursor-pointer text-sm font-medium text-gray-500 transition hover:text-red-600"
              >
                Clear cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
              <MdOutlineRemoveShoppingCart className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Your cart is empty
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Browse the catalogue and add the products you would like
                manufactured.
              </p>
              <Link
                to="/products"
                className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* LINES */}
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-24 w-24 shrink-0 self-start rounded-lg border border-gray-200 bg-gray-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.serialNumber || "Product"}
                      </p>

                      {item.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-700">
                          Size {item.size}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <QuantityBox
                        value={item.quantity}
                        onChange={(q) => setQuantity(item.key, q)}
                        disabled={placing}
                      />

                      <button
                        onClick={() => removeItem(item.key)}
                        disabled={placing}
                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-red-600 disabled:opacity-50"
                      >
                        <MdDelete className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="lg:sticky lg:top-28 lg:h-fit">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900">
                    Order summary
                  </h2>

                  <dl className="mt-4 space-y-2 border-b border-gray-100 pb-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Lines</dt>
                      <dd className="font-semibold text-gray-900">
                        {items.length}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Total quantity</dt>
                      <dd className="font-semibold text-gray-900">
                        {totalUnits.toLocaleString()} pcs
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    This is a manufacturing enquiry. No payment is taken here —
                    our team will confirm the details with you.
                  </p>

                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-sm font-semibold text-gray-800">
                      Delivery address
                    </span>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      disabled={placing}
                      placeholder="Where should this be delivered?"
                      className="w-full resize-none rounded-lg border border-gray-300 p-2.5 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none disabled:bg-gray-50"
                    />
                  </label>

                  <label className="mt-3 block">
                    <span className="mb-1.5 block text-sm font-semibold text-gray-800">
                      Notes <span className="font-normal text-gray-400">(optional)</span>
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      disabled={placing}
                      placeholder="Fabric, deadline, anything else"
                      className="w-full resize-none rounded-lg border border-gray-300 p-2.5 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none disabled:bg-gray-50"
                    />
                  </label>

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdShoppingCartCheckout className="h-5 w-5" />
                    {placing ? "Placing order..." : "Place order"}
                  </button>

                  <p className="mt-2 text-center text-xs text-gray-500">
                    {token
                      ? `Confirmation will be emailed to ${user?.email ?? "you"}`
                      : "You will be asked to sign in first"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
