import { FaBell, FaSearch } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Navbar() {
  const staff = JSON.parse(localStorage.getItem("staff"));

  return (
    <div className="bg-white shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between mb-6">
      
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage your healthcare platform
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl">
          <FaSearch className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-48"
          />
        </div>

        {/* Notifications */}
        <Link
        to="/notifications"
        >
        <button className="relative bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition">
          <FaBell className="text-gray-700 text-lg" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        </Link>

        {/* Settings */}
        <Link to="/settings">
        <button className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition">
          <MdOutlineSettings className="text-gray-700 text-xl" />
        </button>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 bg-teal-50 px-3 py-2 rounded-xl">
          
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
            {staff?.staff_name
              ? staff.staff_name.charAt(0).toUpperCase()
              : "A"}
          </div>

          <div className="hidden md:block">
            <p className="font-semibold text-gray-800">
              {staff?.staff_name || "Admin"}
            </p>

            <p className="text-xs text-gray-500 capitalize">
              {staff?.role || "Administrator"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}