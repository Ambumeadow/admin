import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaAmbulance,
  FaCrown,
  FaCogs,
  FaCalendarCheck,
} from "react-icons/fa";
import { FaPills } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-teal-700 text-white min-h-screen p-4">

      <h1 className="text-2xl font-bold mb-8">
        Vitacura
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
          to="/nurses"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaUserMd />
          Nurses
        </Link>

        <Link
          to="/medical-records"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaClipboardList />
          Medical Records
        </Link>

        <Link
          to="/ambulances"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaAmbulance />
          Ambulances
        </Link>

        <Link
          to="/packages"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaCrown />
          Packages
        </Link>

        <Link
          to="/subscriptions"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaClipboardList />
          Subscriptions
        </Link>

        <Link
          to="/appointments"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
        <FaCalendarCheck />
        Appointments
        </Link>

        <Link
          to="/my-appointments"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
        <FaCalendarCheck />
        My Appointments
        </Link>

        <Link
          to="/pharmacy"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
        <FaPills />
        Pharmacy
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-600"
        >
          <FaCogs />
          Settings
        </Link>

      </div>

    </div>
  );
}