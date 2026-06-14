import { useEffect, useState } from "react";
import api from "../api/api";
import {
  FaCrown,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaBox,
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch ALL subscriptions (ADMIN)
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/subscriptions/");

      setSubscriptions(response.data.subscriptions);

    } catch (error) {
      console.log(error);
      setSubscriptions([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Filter search
  const filtered = subscriptions.filter((sub) =>
    sub.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    sub.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    sub.package?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              All Subscriptions
            </h1>

            <p className="text-gray-500">
              Manage all user subscriptions
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search user or package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-xl shadow"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Total Subscriptions</p>
            <h2 className="text-3xl font-bold text-teal-600">
              {subscriptions.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Active</p>
            <h2 className="text-3xl font-bold text-green-600">
              {subscriptions.filter((s) => s.is_active).length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Expired</p>
            <h2 className="text-3xl font-bold text-red-600">
              {subscriptions.filter((s) => !s.is_active).length}
            </h2>
          </div>

        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading subscriptions...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {filtered.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl shadow p-5 border"
              >

                {/* User */}
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {sub.user?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {sub.user?.email}
                    </p>
                  </div>

                </div>

                {/* Package */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-purple-500" />
                    <span className="font-semibold">
                      {sub.package?.name}
                    </span>
                  </div>

                  <FaCrown className="text-yellow-500" />
                </div>

                {/* Status */}
                <div className="mb-3">
                  {sub.is_active ? (
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <FaCheckCircle />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-600 font-semibold">
                      <FaTimesCircle />
                      Expired
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <FaCalendarAlt className="inline mr-2" />
                    Start: {formatDate(sub.start_date)}
                  </p>

                  <p>
                    <FaCalendarAlt className="inline mr-2" />
                    End: {formatDate(sub.end_date)}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}