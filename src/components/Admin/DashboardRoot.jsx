import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineCloudUpload,
  MdOutlinePhotoLibrary,
  MdOutlinePeopleAlt,
  MdOutlineReceiptLong,
  MdMenu,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
  MdOpenInNew,
} from "react-icons/md";
import useUserStore from "../../store/userStore";

const NAV_ITEMS = [
  { label: "Overview", to: "/dashboard", icon: MdOutlineDashboard, end: true },
  { label: "Upload Product", to: "/dashboard/upload", icon: MdOutlineCloudUpload },
  { label: "Bulk Upload", to: "/dashboard/bulkImagepload", icon: MdOutlinePhotoLibrary },
  { label: "Orders", to: "/dashboard/orders", icon: MdOutlineReceiptLong },
  { label: "Users", to: "/dashboard/users", icon: MdOutlinePeopleAlt },
];

const COLLAPSE_KEY = "dashboard:sidebar-collapsed";

function NavItems({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
               ${collapsed ? "justify-center" : ""}
               ${
                 isActive
                   ? "bg-white/10 text-white"
                   : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
               }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}

function SidebarBody({ collapsed, setCollapsed, showCollapseToggle, onNavigate }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div
        className={`flex h-16 items-center gap-2 border-b border-white/10 px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer truncate text-base font-semibold tracking-tight text-white"
          >
            Savmisha<span className="text-amber-500">Global</span>
          </button>
        )}

        {showCollapseToggle && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            {collapsed ? (
              <MdChevronRight className="h-5 w-5" />
            ) : (
              <MdChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavItems collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => navigate("/")}
          title={collapsed ? "View store" : undefined}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <MdOpenInNew className="h-5 w-5 shrink-0" />
          {!collapsed && <span>View store</span>}
        </button>
      </div>
    </div>
  );
}

export default function DashboardRoot() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      // private mode / storage disabled - collapsing just won't persist
    }
  }, [collapsed]);

  const currentTitle =
    NAV_ITEMS.find((i) =>
      i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)
    )?.label ?? "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-300 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarBody
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          showCollapseToggle
        />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-zinc-900/60 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 shadow-xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 -right-11 cursor-pointer rounded-md bg-zinc-900/80 p-2 text-white"
          >
            <MdClose className="h-5 w-5" />
          </button>
          <SidebarBody
            collapsed={false}
            setCollapsed={() => {}}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      {/* Content column */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="cursor-pointer rounded-md p-2 text-zinc-600 transition hover:bg-zinc-100 lg:hidden"
          >
            <MdMenu className="h-5 w-5" />
          </button>

          <h1 className="truncate text-base font-semibold text-zinc-900">
            {currentTitle}
          </h1>

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm leading-tight font-medium text-zinc-900">
                  {user.fullname || user.email}
                </p>
                {user.role && (
                  <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <MdLogout className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
