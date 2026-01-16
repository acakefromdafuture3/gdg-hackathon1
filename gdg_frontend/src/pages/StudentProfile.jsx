import { FiUser } from "react-icons/fi";

export default function StudentProfile() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Student Profile
      </h1>

      {/* Profile Section */}
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
          <FiUser className="text-3xl text-slate-500" />
        </div>

        {/* Basic Info */}
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-800">
            Student Name
          </p>
          <p className="text-sm text-slate-600">
            Department: —
          </p>
          <p className="text-sm text-slate-600">
            Year: —
          </p>
        </div>
      </div>

      <hr className="my-6" />

      {/* Placeholder Note */}
      <p className="text-sm text-slate-500 italic">
        This profile section will include editable details and activity history
        in future versions.
      </p>
    </div>
  );
}
