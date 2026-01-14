import { Link } from "react-router-dom";
import { FiArrowLeft, FiTool } from "react-icons/fi";

export default function NotReady() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <FiTool className="text-5xl text-slate-400 mb-4" />

      <h1 className="text-2xl font-bold text-slate-800">
        Page Under Construction
      </h1>

      <p className="text-slate-600 mt-2 max-w-md">
        This section is part of our future roadmap and will be available soon.
      </p>

      <Link
        to="/student/dashboard"
        className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
      >
        <FiArrowLeft />
        Back to Dashboard
      </Link>
    </div>
  );
}
