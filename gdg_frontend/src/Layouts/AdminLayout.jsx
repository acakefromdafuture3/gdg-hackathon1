import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-md px-6 py-4 flex justify-between items-center">
        {/* Left: Brand */}
        <h1 className="font-bold text-white tracking-wide">
          STCET • Admin
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 text-sm">
          <Link
            to="/admin"
            className="text-slate-300 hover:text-white transition"
          >
            Dashboard
          </Link>

          {/* Profile Avatar (placeholder) */}
          <button
            onClick={() => navigate("/admin/profile")}
            className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center
              hover:bg-slate-600 transition"
            title="Profile"
          >
            <FiUser className="text-slate-200" />
          </button>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
