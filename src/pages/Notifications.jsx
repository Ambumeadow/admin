import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaBell,
  FaCalendarCheck,
  FaAmbulance,
  FaVideo,
  FaUserInjured,
  FaCheckCircle,
} from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/");

      setNotifications(response.data.notifications);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post("/mark_notification_read/", {
        notification_id: id,
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "appointment":
        return (
          <FaCalendarCheck className="text-blue-600 text-xl" />
        );

      case "telemedicine":
        return (
          <FaVideo className="text-purple-600 text-xl" />
        );

      case "ambulance":
        return (
          <FaAmbulance className="text-red-600 text-xl" />
        );

      case "patient":
        return (
          <FaUserInjured className="text-green-600 text-xl" />
        );

      default:
        return (
          <FaBell className="text-yellow-600 text-xl" />
        );
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-gray-500">
            View all system notifications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Total Notifications
            </p>

            <h2 className="text-3xl font-bold text-teal-600">
              {notifications.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Unread
            </p>

            <h2 className="text-3xl font-bold text-red-500">
              {
                notifications.filter(
                  (n) => !n.is_read
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Read
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {
                notifications.filter(
                  (n) => n.is_read
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Notification List */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">
              Loading notifications...
            </div>

          ) : notifications.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No notifications available
            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className={`border-b p-5 flex justify-between items-center
                ${
                  !notification.is_read
                    ? "bg-blue-50"
                    : ""
                }`}
              >

                <div className="flex items-start gap-4">

                  <div>
                    {getIcon(notification.type)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      {notification.message}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      {notification.created_at}
                    </p>

                  </div>

                </div>

                {!notification.is_read && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    Mark Read
                  </button>
                )}

              </div>

            ))
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}