import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MdEmail, MdExpandMore, MdWarningAmber } from "react-icons/md";
import { authApi, assetUrl } from "../../lib/api";
import {
  ORDER_STATUSES,
  STATUS_META,
  formatDateTime,
  statusLabel,
} from "../../lib/catalog";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from "./ui";

function StatusPill({ status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        meta?.tone ?? "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {meta?.label ?? status}
    </span>
  );
}

function OrderRow({ order, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const dirty = status !== order.status || note.trim().length > 0;

  const save = async () => {
    setSaving(true);

    try {
      const res = await authApi.patch(`/orders/${order._id}/status`, {
        status,
        note: note.trim(),
      });

      onUpdated(res.data);
      setNote("");

      // The email is the point of the status change, so a silent failure
      // would be the worst outcome - say so explicitly.
      if (res.emailSent) {
        toast.success(`Set to ${statusLabel(status)} · email sent to ${order.userEmail}`);
      } else {
        toast.warning(
          `Status saved, but the email failed: ${res.emailError || "unknown error"}`
        );
      }
    } catch (err) {
      toast.error(err.message || "Could not update the order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
        >
          <MdExpandMore
            className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-zinc-900">
              {order.orderNumber}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {order.userName || order.userEmail} · {order.totalQuantity} pcs ·{" "}
              {order.items.length} line{order.items.length === 1 ? "" : "s"} ·{" "}
              {formatDateTime(order.createdAt)}
            </span>
          </span>
        </button>

        <StatusPill status={order.status} />
      </div>

      {open && (
        <div className="mt-4 space-y-4 border-t border-zinc-100 pt-4 pl-8">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Items
            </p>
            <ul className="space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={assetUrl(item.image)}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded border border-zinc-200 object-cover"
                    />
                  )}
                  <span className="min-w-0 flex-1 text-sm text-zinc-700">
                    <span className="font-medium">
                      {item.serialNumber || "No serial"}
                    </span>
                    <span className="text-zinc-500">
                      {" "}
                      · Size {item.size} · {item.color}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {item.quantity} pcs
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                Customer
              </p>
              <p className="mt-1 text-zinc-700">{order.userName || "-"}</p>
              <p className="text-zinc-500">{order.userEmail}</p>
              {order.userPhone && <p className="text-zinc-500">{order.userPhone}</p>}
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                Delivery / notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-zinc-700">
                {order.shippingAddress || "-"}
              </p>
              {order.note && (
                <p className="mt-1 text-zinc-500 italic">"{order.note}"</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              History
            </p>
            <ol className="space-y-1">
              {order.statusHistory?.map((h, i) => (
                <li key={i} className="text-xs text-zinc-600">
                  <span className="font-medium">{statusLabel(h.status)}</span>
                  {" · "}
                  {formatDateTime(h.at)}
                  {h.note && <span className="text-zinc-500"> — {h.note}</span>}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
              <MdEmail className="h-4 w-4" />
              Update status
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>

              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={saving}
                placeholder="Optional note included in the email"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />

              <Button onClick={save} loading={saving} disabled={!dirty}>
                Save &amp; email
              </Button>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Saving emails {order.userEmail} and adds an in-app notification.
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await authApi.get(
        `/orders${filter ? `?status=${filter}` : ""}`
      );
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdated = (updated) =>
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));

  const openCount = useMemo(
    () =>
      orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    [orders]
  );

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={
          loading
            ? "Loading..."
            : `${orders.length} order${orders.length === 1 ? "" : "s"}${
                openCount ? ` · ${openCount} open` : ""
              }`
        }
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <Card className="p-5">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : orders.length === 0 ? (
        <EmptyState
          title={filter ? "No orders with that status" : "No orders yet"}
          subtitle={
            filter
              ? "Try a different filter."
              : "Customer orders will appear here as they come in."
          }
        />
      ) : (
        <Card>
          <ul className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <OrderRow key={order._id} order={order} onUpdated={handleUpdated} />
            ))}
          </ul>
        </Card>
      )}

      {!loading && !error && orders.length > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
          <MdWarningAmber className="h-4 w-4" />
          Changing a status emails the customer immediately. There is no undo.
        </p>
      )}
    </>
  );
}
