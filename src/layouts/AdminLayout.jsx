import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  HeartPulse,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  Calendar,
  Trophy
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Registrations", path: "/admin/registrations", icon: ClipboardList },
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Results", path: "/admin/results", icon: Trophy },
  { name: "Content", path: "/admin/content", icon: FileText },
  { name: "System Health", path: "/admin/health", icon: HeartPulse },
];

const superAdminItems = [{ name: "Users", path: "/admin/users", icon: Users }];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-primary/10 text-primary border-l-4 border-primary"
      : "text-gray-600 hover:bg-gray-100";

  const allItems = [...navItems, ...(isSuperAdmin ? superAdminItems : [])];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="font-bold text-lg text-primary"
          >
            <Shield className="inline mr-2" size={20} />
            Admin Panel
          </Link>
          <button
            className="lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {allItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || user?.username}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 lg:hidden">
          <button
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-lg">Admin Panel</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
