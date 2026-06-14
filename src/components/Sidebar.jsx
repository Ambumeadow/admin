import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-teal-700 text-white min-h-screen p-4">

      <h1 className="text-2xl font-bold mb-8">
        AfyaCare
      </h1>

      <div className="space-y-3">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/patients"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaUsers />
          Patients
        </Link>

        <Link
          to="/doctors"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaUserMd />
          Doctors
        </Link>

        <Link
          to="/medical-records"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaClipboardList />
          Medical Records
        </Link>

      </div>

    </div>
  );
}