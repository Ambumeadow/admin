import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaBell,
  FaCog,
} from "react-icons/fa";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state (password change UI only)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // system toggles (UI only)
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await api.get("/me/");
      setUser(response.data.user);

    } catch (error) {
      console.log(error);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Settings
          </h1>

          <p className="text-gray-500">
            Manage your account and system preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">

          <div className="w-14 h-14 bg-teal-100 text-teal-600 flex items-center justify-center rounded-full">
            <FaUser size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user?.name || "Admin User"}
            </h2>

            <p className="text-gray-500">
              {user?.email || "admin@example.com"}
            </p>
          </div>

        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Password Change */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">

            <div className="flex items-center gap-2">
              <FaLock className="text-teal-600" />
              <h3 className="font-semibold text-lg">
                Change Password
              </h3>
            </div>

            <input
              type="password"
              placeholder="Old password"
              className="w-full border p-3 rounded-xl"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              className="w-full border p-3 rounded-xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handlePasswordChange}
              className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700"
            >
              Update Password
            </button>

          </div>

          {/* Preferences */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">

            <div className="flex items-center gap-2">
              <FaCog className="text-purple-600" />
              <h3 className="font-semibold text-lg">
                Preferences
              </h3>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBell className="text-yellow-500" />
                <span>Notifications</span>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="w-5 h-5"
              />
            </div>

            {/* Dark mode */}
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="w-5 h-5"
              />
            </div>

          </div>

        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-2xl shadow border border-red-200">

          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Danger Zone
          </h3>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}