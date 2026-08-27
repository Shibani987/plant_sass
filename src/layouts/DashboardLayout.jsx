import { BarChart3, Home, LogOut, Package, ShoppingBag, Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const roleLinks = {
  vendor: [
    { to: "/vendor", label: "Dashboard", icon: BarChart3 },
    { to: "/products", label: "Storefront", icon: Store },
  ],
  super_admin: [
    { to: "/admin", label: "Platform", icon: BarChart3 },
    { to: "/products", label: "Marketplace", icon: Package },
  ],
  customer: [
    { to: "/products", label: "Shop", icon: ShoppingBag },
    { to: "/orders", label: "Orders", icon: Package },
  ],
};

const DashboardLayout = ({ title, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const links = roleLinks[user?.role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#172312]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#dbe5d1] bg-white px-5 py-6 lg:block">
        <Link to="/" className="flex items-center gap-3 text-xl font-black">
          <Home className="h-6 w-6 text-[#3c7a3a]" />
          Plant SaaS
        </Link>
        <nav className="mt-10 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-[#e9f3df] text-[#245b24]" : "text-[#52604d] hover:bg-[#f1f5ec]"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#9b2c2c] hover:bg-[#fff1f1]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="lg:pl-64">
        <header className="border-b border-[#dbe5d1] bg-white px-5 py-5">
          <p className="text-sm text-[#64705f]">{user?.name}</p>
          <h1 className="text-2xl font-black">{title}</h1>
        </header>
        <div className="px-5 py-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
