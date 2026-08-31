import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdOutlineCloudUpload,
  MdOutlinePhotoLibrary,
  MdCheckCircle,
  MdCancel,
  MdRemoveCircleOutline,
  MdSync,
} from "react-icons/md";
import { api, assetUrl } from "../../lib/api";
import { PLATFORMS } from "../../lib/socialSync";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
  Spinner,
  StatCard,
} from "./ui";

/** Platforms on a product that have not been posted yet. */
const pendingPlatforms = (product) =>
  PLATFORMS.filter((p) => product.socialStatus?.[p.key]?.status !== "posted").map(
    (p) => p.key
  );

const RECENT_LIMIT = 8;

/** socialStatus.<platform> is { status, postId, error } once the backend has tried to post. */
function SocialBadge({ label, entry }) {
  if (entry?.status === "posted") {
    return (
      <Badge tone="success" title="Posted">
        <MdCheckCircle className="h-3.5 w-3.5" />
        {label}
      </Badge>
    );
  }

  if (entry?.status === "failed") {
    return (
      <Badge tone="danger" title={entry.error || "Failed"}>
        <MdCancel className="h-3.5 w-3.5 shrink-0" />
        {label}
      </Badge>
    );
  }

  // "skipped" (deliberately turned off) and never-attempted both read as
  // "not posted" here - the difference only matters in the tooltip.
  return (
    <Badge
      tone="neutral"
      title={entry?.status === "skipped" ? "Sync was turned off" : "Not posted yet"}
    >
      <MdRemoveCircleOutline className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export default function DashboardHome() {
  const [products, setProducts] = useState([]);
  const [productTotal, setProductTotal] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Users can legitimately fail (route may be restricted) without taking
      // the whole page down, so it is settled separately from the products.
      const [productRes, userRes] = await Promise.allSettled([
        api.get(`/images/all?page=1&limit=${RECENT_LIMIT}`),
        api.get("/all-users"),
      ]);

      if (productRes.status === "rejected") {
        throw productRes.reason;
      }

      const items = Array.isArray(productRes.value?.data) ? productRes.value.data : [];
      setProducts(items);
      // `total` was added to the list endpoint; fall back to what we can see.
      setProductTotal(
        typeof productRes.value?.total === "number" ? productRes.value.total : null
      );

      setUserCount(
        userRes.status === "fulfilled" && Array.isArray(userRes.value?.users)
          ? userRes.value.users.length
          : null
      );
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Re-posts one product. The backend refuses platforms already marked
   * "posted", so this cannot duplicate a live post however often it is clicked.
   */
  const handleSync = useCallback(async (product) => {
    const platforms = pendingPlatforms(product);
    if (!platforms.length) return;

    setSyncingId(product._id);

    try {
      const res = await api.post(`/images/sync/${product._id}`, { platforms });

      // Patch just this row rather than refetching the whole page.
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, socialStatus: res.socialStatus ?? p.socialStatus }
            : p
        )
      );

      const synced = res.synced ?? [];
      const failed = res.failed ?? [];

      if (synced.length && !failed.length) {
        toast.success(`Posted to ${synced.join(" and ")}`);
      } else if (synced.length) {
        toast.warning(`Posted to ${synced.join(", ")}; ${failed.join(", ")} failed`);
      } else {
        const reason = failed
          .map((k) => res.socialStatus?.[k]?.error)
          .find(Boolean);
        toast.error(reason || "Sync failed");
      }
    } catch (err) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncingId(null);
    }
  }, []);

  /** Retries every product with an outstanding platform, one at a time. */
  const syncAllPending = useCallback(async () => {
    const queue = products.filter((p) => pendingPlatforms(p).length > 0);
    for (const product of queue) {
      await handleSync(product);
    }
  }, [products, handleSync]);

  const postedCount = products.filter(
    (p) =>
      p.socialStatus?.facebook?.status === "posted" ||
      p.socialStatus?.instagram?.status === "posted"
  ).length;

  const failedCount = products.filter(
    (p) =>
      p.socialStatus?.facebook?.status === "failed" ||
      p.socialStatus?.instagram?.status === "failed"
  ).length;

  if (error) {
    return (
      <>
        <PageHeader title="Overview" />
        <ErrorState message={error} onRetry={load} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Products, users, and how the last uploads landed on social."
        action={
          <div className="flex gap-2">
            <Link to="/dashboard/upload">
              <Button>
                <MdOutlineCloudUpload className="h-4 w-4" />
                Upload product
              </Button>
            </Link>
            <Link to="/dashboard/bulkImagepload">
              <Button variant="secondary">
                <MdOutlinePhotoLibrary className="h-4 w-4" />
                Bulk
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Products"
          value={productTotal ?? products.length}
          hint={productTotal === null ? "visible on this page" : "total in catalogue"}
          loading={loading}
        />
        <StatCard
          label="Users"
          value={userCount ?? "-"}
          hint={userCount === null ? "unavailable" : "registered accounts"}
          loading={loading}
        />
        <StatCard
          label="Posted to social"
          value={postedCount}
          hint={`of last ${products.length || RECENT_LIMIT} uploads`}
          loading={loading}
          tone="success"
        />
        <StatCard
          label="Social failures"
          value={failedCount}
          hint={failedCount ? "check the list below" : "none recently"}
          loading={loading}
          tone={failedCount ? "danger" : "neutral"}
        />
      </div>

      <Card>
        <CardHeader
          title="Recent uploads"
          subtitle="Newest first, with the Facebook and Instagram result for each."
          action={
            <Link
              to="/products"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View store
            </Link>
          }
        />

        {loading ? (
          <div className="divide-y divide-zinc-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No products yet"
              subtitle="Upload your first product to see it here."
              action={
                <Link to="/dashboard/upload">
                  <Button>Upload product</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-50"
              >
                <img
                  src={assetUrl(product.mainThumbnail || product.mainImage)}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {product.description?.trim() || "Untitled product"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleString()
                      : "-"}
                    {" · "}
                    {(product.otherImages?.length ?? 0) + 1} image
                    {(product.otherImages?.length ?? 0) + 1 === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <SocialBadge label="FB" entry={product.socialStatus?.facebook} />
                  <SocialBadge label="IG" entry={product.socialStatus?.instagram} />
                </div>

                {pendingPlatforms(product).length > 0 ? (
                  <button
                    onClick={() => handleSync(product)}
                    disabled={syncingId !== null}
                    title={`Post to ${pendingPlatforms(product).join(" and ")}`}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {syncingId === product._id ? (
                      <>
                        <Spinner className="h-3.5 w-3.5" />
                        Syncing
                      </>
                    ) : (
                      <>
                        <MdSync className="h-3.5 w-3.5" />
                        Sync
                      </>
                    )}
                  </button>
                ) : (
                  <span className="hidden shrink-0 text-xs text-zinc-400 md:inline">
                    Synced
                  </span>
                )}

                <Link
                  to={`/dashboard/updateproductimages/${product._id}`}
                  className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-white"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {failedCount > 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm font-semibold text-amber-900">
                Some posts did not reach social
              </p>

              <Button
                variant="secondary"
                onClick={syncAllPending}
                loading={syncingId !== null}
                disabled={syncingId !== null}
                className="px-3 py-1.5 text-xs"
              >
                <MdSync className="h-3.5 w-3.5" />
                Retry all
              </Button>
            </div>

            <ul className="mt-2 space-y-1.5">
              {products.flatMap((p) =>
                PLATFORMS.filter(
                  (pl) => p.socialStatus?.[pl.key]?.status === "failed"
                ).map((pl) => (
                  <li key={`${p._id}-${pl.key}`} className="text-xs text-amber-800">
                    <span className="font-medium">{pl.label}</span>
                    {" - "}
                    {p.socialStatus[pl.key].error || "no reason recorded"}
                  </li>
                ))
              )}
            </ul>
          </div>
        </Card>
      )}
    </>
  );
}
