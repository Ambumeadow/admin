import {
  FaBell,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import {
  MdOutlineSettings,
  MdOutlineVerifiedUser,
} from "react-icons/md";

import { Link } from "react-router-dom";

export default function Navbar() {
  const staff = JSON.parse(
    localStorage.getItem("staff")
  );

  const getInitials = () => {
    if (!staff?.staff_name) {
      return "A";
    }

    const names = staff.staff_name
      .trim()
      .split(" ");

    if (names.length === 1) {
      return names[0]
        .charAt(0)
        .toUpperCase();
    }

    return `${names[0].charAt(0)}${names[
      names.length - 1
    ].charAt(0)}`.toUpperCase();
  };

  const getFirstName = () => {
    if (!staff?.staff_name) {
      return "Admin";
    }

    return staff.staff_name
      .trim()
      .split(" ")[0];
  };

  return (
    <header className="sticky top-0 z-40 mb-6">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)] rounded-2xl px-4 sm:px-5 lg:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#102033] truncate">
                Welcome back, {getFirstName()}
              </h1>

              <span className="hidden sm:flex w-7 h-7 rounded-lg bg-[#08764F]/10 items-center justify-center">
                <MdOutlineVerifiedUser className="text-[#08764F]" />
              </span>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">
              Manage your VitaCura healthcare platform
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SEARCH */}
            <div className="hidden lg:flex items-center h-11 min-w-[240px] xl:min-w-[280px] bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 transition focus-within:border-[#123B70] focus-within:ring-4 focus-within:ring-[#123B70]/5">
              <FaSearch className="text-[#123B70] text-sm shrink-0" />

              <input
                type="text"
                placeholder="Search dashboard..."
                className="bg-transparent outline-none ml-3 w-full text-sm text-[#102033] placeholder:text-gray-400"
              />

              <div className="hidden xl:flex items-center justify-center text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-md px-2 py-1">
                Search
              </div>
            </div>

            {/* MOBILE SEARCH BUTTON */}
            <button
              type="button"
              className="lg:hidden w-11 h-11 rounded-xl bg-[#F8FAF9] border border-gray-200 flex items-center justify-center text-[#123B70] hover:bg-[#123B70]/5 transition"
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {/* NOTIFICATIONS */}
            <Link to="/notifications">
              <button
                type="button"
                className="relative w-11 h-11 rounded-xl bg-[#F8FAF9] border border-gray-200 flex items-center justify-center hover:bg-[#123B70]/5 hover:border-[#123B70]/20 transition group"
                aria-label="Notifications"
              >
                <FaBell className="text-gray-600 group-hover:text-[#123B70] transition" />

                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#D92D20] text-white text-[10px] font-bold border-2 border-white flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>

            {/* SETTINGS */}
            <Link to="/settings">
              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-[#F8FAF9] border border-gray-200 flex items-center justify-center hover:bg-[#C6A24A]/10 hover:border-[#C6A24A]/20 transition group"
                aria-label="Settings"
              >
                <MdOutlineSettings className="text-gray-600 text-xl group-hover:text-[#C6A24A] transition" />
              </button>
            </Link>

            {/* DIVIDER */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

            {/* USER PROFILE */}
            <Link
              to="/profile"
              className="flex items-center gap-2 sm:gap-3 bg-[#F8FAF9] hover:bg-[#08764F]/5 border border-gray-200 hover:border-[#08764F]/15 rounded-xl px-2 py-1.5 sm:px-3 transition group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123B70] to-[#08764F] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  {getInitials()}
                </div>

                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#15A474] border-2 border-white" />
              </div>

              {/* Info */}
              <div className="hidden md:block min-w-0 max-w-[150px]">
                <p className="font-bold text-[#102033] text-sm truncate">
                  {staff?.staff_name || "Admin"}
                </p>

                <p className="text-[11px] text-gray-500 capitalize truncate mt-0.5">
                  {staff?.role || "Administrator"}
                </p>
              </div>

              <FaChevronDown className="hidden md:block text-gray-400 text-xs group-hover:text-[#123B70] transition" />
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="lg:hidden mt-3">
          <div className="flex items-center h-11 bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 focus-within:border-[#123B70] focus-within:ring-4 focus-within:ring-[#123B70]/5">
            <FaSearch className="text-[#123B70] text-sm" />

            <input
              type="text"
              placeholder="Search dashboard..."
              className="bg-transparent outline-none ml-3 w-full text-sm text-[#102033] placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}