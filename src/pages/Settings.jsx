import { useEffect, useState } from "react";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaSyncAlt,
  FaCrown,
  FaMoon,
  FaEnvelope,
} from "react-icons/fa";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await api.get("/me/");

      setUser(response.data.user || null);
    } catch (error) {
      console.log("Fetch user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePasswordChange = () => {
    alert("Password change endpoint not connected yet");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name) {
      return "AU";
    }

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[
      parts.length - 1
    ].charAt(0)}`.toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          <div className="absolute -top-16 -right-16 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-[#C6A24A]/10" />
          <div className="absolute bottom-[-60px] left-[30%] w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center shrink-0">
                <FaCog className="text-[#E8D58C] text-xl sm:text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Settings
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                  Manage your profile, password and system preferences.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchUser}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />

              Refresh Profile
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#C6A24A]/15 flex items-center justify-center">
                <FaSyncAlt className="text-[#C6A24A] animate-spin" />
              </div>

              <div>
                <p className="font-semibold text-[#102033]">
                  Loading profile...
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Fetching account information
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#123B70]/10 border-2 border-[#C6A24A] flex items-center justify-center">
                  <span className="text-[#123B70] text-lg font-extrabold">
                    {getInitials(user?.name)}
                  </span>
                </div>

                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#08764F] border-2 border-white flex items-center justify-center">
                  <FaShieldAlt className="text-white text-[9px]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                    {user?.name || "Admin User"}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 text-[#8B6A22] text-[10px] font-bold">
                    <FaCrown className="text-[#C6A24A]" />
                    STAFF ACCOUNT
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <FaEnvelope className="text-[#08764F] text-xs" />

                  <span className="truncate">
                    {user?.email || "admin@example.com"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* PASSWORD */}
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#123B70]/10 flex items-center justify-center shrink-0">
                <FaLock className="text-[#123B70]" />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#102033]">
                  Change Password
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Update the password used to access your account.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#102033] mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) =>
                    setOldPassword(e.target.value)
                  }
                  className="w-full h-12 border border-gray-200 bg-[#F8FAF9] rounded-xl px-4 text-sm text-[#102033] outline-none focus:border-[#C6A24A] focus:ring-4 focus:ring-[#C6A24A]/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102033] mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full h-12 border border-gray-200 bg-[#F8FAF9] rounded-xl px-4 text-sm text-[#102033] outline-none focus:border-[#C6A24A] focus:ring-4 focus:ring-[#C6A24A]/10 transition"
                />
              </div>

              <div className="flex items-start gap-3 bg-[#C6A24A]/10 border border-[#C6A24A]/20 rounded-xl p-3">
                <FaShieldAlt className="text-[#C6A24A] mt-0.5 shrink-0" />

                <p className="text-xs text-gray-600 leading-5">
                  Use a strong password with uppercase and lowercase
                  letters, numbers and symbols.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePasswordChange}
                className="w-full h-12 rounded-xl bg-[#123B70] text-white font-bold text-sm hover:bg-[#0A274A] transition"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
                <FaCog className="text-[#C6A24A]" />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#102033]">
                  Preferences
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Customize how the VitaCura admin portal behaves.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* NOTIFICATIONS */}
              <PreferenceRow
                icon={FaBell}
                title="Notifications"
                description="Receive platform alerts and updates"
                checked={notifications}
                onChange={() =>
                  setNotifications((prev) => !prev)
                }
                color="#C6A24A"
                background="rgba(198,162,74,0.15)"
              />

              {/* DARK MODE */}
              <PreferenceRow
                icon={FaMoon}
                title="Dark Mode"
                description="Use a darker dashboard appearance"
                checked={darkMode}
                onChange={() =>
                  setDarkMode((prev) => !prev)
                }
                color="#123B70"
                background="rgba(18,59,112,0.10)"
              />
            </div>

            <div className="mt-5 rounded-xl bg-[#08764F]/5 border border-[#08764F]/10 p-4">
              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-[#08764F] mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-bold text-[#102033]">
                    System Preferences
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    These preference controls are currently UI-only
                    until their backend or persistent storage is
                    connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GOLD SECURITY NOTICE */}
        <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

          <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
            <FaCrown className="text-[#C6A24A]" />
          </div>

          <div className="relative z-10">
            <p className="text-sm font-bold text-[#8B6A22]">
              VitaCura Account Security
            </p>

            <p className="text-xs text-gray-600 mt-1 leading-5">
              Protect your staff account by keeping your credentials
              private and signing out when using a shared computer.
            </p>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-white border border-red-200 rounded-[22px] sm:rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="h-1 bg-red-500" />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <FaSignOutAlt className="text-red-600" />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-red-600">
                    Danger Zone
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl leading-5">
                    Signing out will remove the current session from
                    this browser and return you to the login page.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
              >
                <FaSignOutAlt />

                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  color,
  background,
}) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-2xl p-3 sm:p-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          color,
          backgroundColor: background,
        }}
      >
        <Icon />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#102033]">
          {title}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
          checked
            ? "bg-[#08764F]"
            : "bg-gray-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}