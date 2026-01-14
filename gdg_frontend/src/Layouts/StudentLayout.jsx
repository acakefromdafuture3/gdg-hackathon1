import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        {/* Left: Brand */}
        <h1 className="font-bold text-slate-800 tracking-wide">
          STCET • Student
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 text-sm">
          <Link
            to="/student/dashboard"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/student/report"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Report Issue
          </Link>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate("/student/profile")}
            className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center
              hover:bg-slate-300 transition"
            title="Profile"
          >
            <FiUser className="text-slate-600" />
          </button>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-500 transition"
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
