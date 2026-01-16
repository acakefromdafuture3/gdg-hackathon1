import { FiUser, FiShield } from "react-icons/fi";

export default function AdminProfile() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Admin Profile
      </h1>

      {/* Profile Section */}
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
          <FiUser className="text-3xl text-white" />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-800">
            Admin Name
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <FiShield className="text-slate-500" />
            Administrator
          </p>
        </div>
      </div>

      <hr className="my-6" />

      {/* Admin Panel Placeholder */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="font-medium text-slate-700">
          Admin Controls
        </p>
        <p className="text-sm text-slate-600 mt-1">
          Advanced administrative settings will be available here in future
          iterations.
        </p>
      </div>
    </div>
  );
}
