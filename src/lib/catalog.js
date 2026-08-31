// Shared product vocabulary. Mirrors SIZE_OPTIONS in the backend model; if one
// changes the other must too, so they are both kept short and explicit.
export const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "Free Size",
];

/**
 * "Free Size" means one-size-fits-all, so it is contradictory alongside a
 * graded run. Bulk "select all" covers the graded sizes only; Free Size is
 * always a deliberate tick.
 */
export const FREE_SIZE = "Free Size";

export const STANDARD_SIZES = SIZE_OPTIONS.filter((s) => s !== FREE_SIZE);

export const MAX_ORDER_QTY = 2000;

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "in_production",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled",
];

export const STATUS_META = {
  placed: { label: "Placed", tone: "bg-gray-100 text-gray-700 border-gray-200" },
  confirmed: { label: "Confirmed", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  in_production: {
    label: "In production",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  ready_to_ship: {
    label: "Ready to ship",
    tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipped: { label: "Shipped", tone: "bg-sky-50 text-sky-700 border-sky-200" },
  delivered: {
    label: "Delivered",
    tone: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: { label: "Cancelled", tone: "bg-red-50 text-red-700 border-red-200" },
};

export const statusLabel = (status) => STATUS_META[status]?.label ?? status;

/** Clamps a typed quantity to a whole number within 1..MAX_ORDER_QTY. */
export const clampQty = (value) => {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_ORDER_QTY, Math.max(1, n));
};

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, { hour12: true }) : "-";
