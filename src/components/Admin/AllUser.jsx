import { useCallback, useEffect, useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";
import { api } from "../../lib/api";
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from "./ui";

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/all-users");
      // Previously this assigned res.users straight into state; when the request
      // failed the value was undefined and the render crashed on .map().
      setUsers(Array.isArray(res?.users) ? res.users : []);
    } catch (err) {
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) =>
      [u.fullname, u.email, u.phone, u.role]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [users, query]);

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={
          loading
            ? "Loading accounts..."
            : `${users.length} account${users.length === 1 ? "" : "s"}${
                adminCount ? ` · ${adminCount} admin` : ""
              }`
        }
        action={
          <div className="relative">
            <MdSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone"
              className="w-full rounded-lg border border-zinc-300 py-2 pr-3 pl-9 text-sm transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none sm:w-72"
            />
          </div>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <Card className="p-5">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        </Card>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users yet"
          subtitle="Accounts will appear here once people sign up."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches"
          subtitle={`Nothing matched "${query}".`}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-left">
                <tr className="border-b border-zinc-200">
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    #
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Name
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Email
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Phone
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Role
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {filtered.map((user, index) => (
                  <tr key={user._id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-3.5 text-zinc-400 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-zinc-900">
                      {user.fullname || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">{user.email || "-"}</td>
                    <td className="px-5 py-3.5 text-zinc-600 tabular-nums">
                      {user.phone || "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={user.role === "admin" ? "info" : "neutral"}>
                        {user.role || "user"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
