import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotificationsNone, MdCheckCircleOutline } from "react-icons/md";
import { authApi } from "../../lib/api";
import useUserStore from "../../store/userStore";
import { formatDateTime } from "../../lib/catalog";

// Polled rather than pushed: there is no websocket layer, and a minute of
// latency is fine for order updates.
const POLL_MS = 60000;

export default function NotificationBell({ className = "" }) {
  const token = useUserStore((s) => s.token);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await authApi.get("/notifications?limit=15");
      setItems(Array.isArray(res?.data) ? res.data : []);
      setUnread(res?.unreadCount ?? 0);
    } catch {
      // A failing bell must never break the navbar; stay quiet and retry
      // on the next tick.
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setUnread(0);
      return undefined;
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [token, load]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return undefined;

    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!token) return null;

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      await authApi.patch("/notifications/read-all");
    } catch {
      load(); // put the real state back if it did not stick
    }
  };

  const openItem = async (n) => {
    setOpen(false);

    if (!n.read) {
      setItems((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
      );
      setUnread((c) => Math.max(0, c - 1));
      authApi.patch(`/notifications/${n._id}/read`).catch(() => load());
    }

    if (n.link) navigate(n.link);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="relative cursor-pointer rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
      >
        <MdNotificationsNone className="h-6 w-6" />

        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[10000] mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-gray-900">Notifications</p>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-900"
              >
                <MdCheckCircleOutline className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                Loading...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                Nothing here yet
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((n) => (
                  <li key={n._id}>
                    <button
                      onClick={() => openItem(n)}
                      className={`w-full cursor-pointer px-4 py-3 text-left transition hover:bg-gray-50 ${
                        n.read ? "" : "bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                        <div className={n.read ? "pl-4" : ""}>
                          <p className="text-sm font-semibold text-gray-900">
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="mt-0.5 text-xs text-gray-600">
                              {n.body}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-gray-400">
                            {formatDateTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
