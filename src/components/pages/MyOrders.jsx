import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdInventory2, MdRefresh } from "react-icons/md";
import Navbar from "../navComp/Navbar";
import Footer from "../navComp/Footer";
import { authApi, assetUrl } from "../../lib/api";
import {
  ORDER_STATUSES,
  STATUS_META,
  formatDateTime,
  statusLabel,
} from "../../lib/catalog";

/** Horizontal progress rail. Cancelled orders skip it entirely. */
const TRACK = ORDER_STATUSES.filter((s) => s !== "cancelled");

function StatusTrack({ status }) {
  if (status === "cancelled") {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
        This order was cancelled.
      </p>
    );
  }

  const currentIndex = TRACK.indexOf(status);

  return (
    <ol className="flex flex-wrap gap-x-1 gap-y-2">
      {TRACK.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step} className="flex items-center gap-1">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                done ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {statusLabel(step)}
            </span>
            {i < TRACK.length - 1 && (
              <span
                className={`h-0.5 w-3 ${done && i < currentIndex ? "bg-black" : "bg-gray-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await authApi.get("/orders/mine");
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Could not load your orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pt-24 pb-14 lg:pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <button
              onClick={load}
              disabled={loading}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <MdRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
              <p className="font-semibold text-red-900">Could not load orders</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={load}
                className="mt-4 cursor-pointer rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
              <MdInventory2 className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-semibold text-gray-800">
                No orders yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Once you place an order it will appear here with live status
                updates.
              </p>
              <Link
                to="/products"
                className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                    <div>
                      <p className="font-bold text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Placed {formatDateTime(order.createdAt)} ·{" "}
                        {order.totalQuantity.toLocaleString()} pcs
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        STATUS_META[order.status]?.tone ??
                        "border-gray-200 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </header>

                  <div className="space-y-4 px-5 py-4">
                    <StatusTrack status={order.status} />

                    <ul className="divide-y divide-gray-100">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 py-3">
                          {item.image && (
                            <img
                              src={assetUrl(item.image)}
                              alt=""
                              loading="lazy"
                              className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-100 object-cover"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {item.serialNumber || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size {item.size} · {item.color}
                            </p>
                          </div>

                          <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                            {item.quantity.toLocaleString()} pcs
                          </span>
                        </li>
                      ))}
                    </ul>

                    {order.shippingAddress && (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          Delivery address
                        </p>
                        <p className="whitespace-pre-wrap text-gray-600">
                          {order.shippingAddress}
                        </p>
                      </div>
                    )}

                    <details className="text-sm">
                      <summary className="cursor-pointer font-semibold text-gray-700 select-none">
                        Status history
                      </summary>
                      <ol className="mt-2 space-y-1.5 border-l-2 border-gray-200 pl-4">
                        {order.statusHistory?.map((h, i) => (
                          <li key={i} className="text-xs">
                            <span className="font-semibold text-gray-800">
                              {statusLabel(h.status)}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              · {formatDateTime(h.at)}
                            </span>
                            {h.note && (
                              <p className="text-gray-600 italic">{h.note}</p>
                            )}
                          </li>
                        ))}
                      </ol>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
