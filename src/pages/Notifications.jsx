import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FaBell,
  FaCalendarCheck,
  FaAmbulance,
  FaVideo,
  FaUserInjured,
  FaCheckCircle,
  FaSyncAlt,
  FaEnvelopeOpen,
  FaClock,
  FaCrown,
} from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications/");

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.log(
        "Fetch notifications error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      setUpdatingId(id);

      await api.post(
        "/mark_notification_read/",
        {
          notification_id: id,
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.log(
        "Mark notification as read error:",
        error
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const unread = notifications.filter(
      (n) => !n.is_read
    ).length;

    const read = notifications.filter(
      (n) => n.is_read
    ).length;

    return {
      total: notifications.length,
      unread,
      read,
    };
  }, [notifications]);

  const getNotificationStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "appointment":
        return {
          icon: FaCalendarCheck,
          label: "Appointment",
          iconClass: "text-[#123B70]",
          iconBg: "bg-[#123B70]/10",
          borderClass: "border-[#123B70]/15",
        };

      case "telemedicine":
        return {
          icon: FaVideo,
          label: "Telemedicine",
          iconClass: "text-[#08764F]",
          iconBg: "bg-[#08764F]/10",
          borderClass: "border-[#08764F]/15",
        };

      case "ambulance":
        return {
          icon: FaAmbulance,
          label: "Ambulance",
          iconClass: "text-red-600",
          iconBg: "bg-red-50",
          borderClass: "border-red-100",
        };

      case "patient":
        return {
          icon: FaUserInjured,
          label: "Patient",
          iconClass: "text-[#08764F]",
          iconBg: "bg-[#08764F]/10",
          borderClass: "border-[#08764F]/15",
        };

      default:
        return {
          icon: FaBell,
          label: "System",
          iconClass: "text-[#C6A24A]",
          iconBg: "bg-[#C6A24A]/15",
          borderClass: "border-[#C6A24A]/20",
        };
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "Time unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-6 py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          <div className="absolute -top-20 -right-16 w-60 h-60 rounded-full bg-[#C6A24A]/10" />

          <div className="absolute bottom-[-65px] left-[38%] w-44 h-44 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center">
                <FaBell className="text-[#E8D58C] text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Notifications
                </h1>

                <p className="text-white/70 text-sm mt-1">
                  Monitor important healthcare and system updates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchNotifications}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total Notifications"
            value={stats.total}
            subtitle="All system alerts"
            icon={FaBell}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Unread"
            value={stats.unread}
            subtitle="Require attention"
            icon={FaClock}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />

          <StatCard
            title="Read"
            value={stats.read}
            subtitle="Reviewed notifications"
            icon={FaEnvelopeOpen}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />
        </div>

        {/* LIST HEADER */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#102033]">
                Notification Center
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {notifications.length}{" "}
                {notifications.length === 1
                  ? "notification"
                  : "notifications"}{" "}
                available.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                SYSTEM ALERTS
              </span>
            </div>
          </div>
        )}

        {/* NOTIFICATION LIST */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[24px] py-24 flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
              <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
            </div>

            <p className="text-[#102033] font-semibold mt-4">
              Loading notifications...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching system updates
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[24px] py-20 px-6 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaBell className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Notifications
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md leading-6">
              System updates, appointments, telemedicine alerts and
              other notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const style =
                getNotificationStyle(
                  notification.type
                );

              const Icon = style.icon;

              const isUpdating =
                updatingId === notification.id;

              return (
                <div
                  key={notification.id}
                  className={`relative overflow-hidden rounded-[22px] border bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)] ${
                    notification.is_read
                      ? "border-gray-200"
                      : "border-[#C6A24A]/35"
                  }`}
                >
                  {/* UNREAD GOLD ACCENT */}
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />
                  )}

                  <div
                    className={`p-5 md:p-6 ${
                      !notification.is_read
                        ? "bg-gradient-to-r from-[#FFFDF6] to-white"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* ICON */}
                      <div
                        className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl flex items-center justify-center border ${style.iconBg} ${style.borderClass}`}
                      >
                        <Icon
                          className={`${style.iconClass} text-xl`}
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-[#102033] text-base">
                            {notification.title ||
                              style.label}
                          </h3>

                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-wide ${style.iconBg} ${style.iconClass} ${style.borderClass}`}
                          >
                            {style.label}
                          </span>

                          {!notification.is_read && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C6A24A]/15 border border-[#C6A24A]/20 text-[#8B6A22] text-[9px] font-extrabold uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A24A]" />

                              New
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm leading-6 mt-2 max-w-4xl">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <FaClock className="text-[#C6A24A] text-xs" />

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              notification.created_at
                            )}
                          </p>
                        </div>
                      </div>

                      {/* ACTION */}
                      <div className="lg:ml-4">
                        {!notification.is_read ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#123B70] text-white text-sm font-bold hover:bg-[#0A274A] transition disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}

                            {isUpdating
                              ? "Updating..."
                              : "Mark as Read"}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-xs font-bold">
                            <FaCheckCircle />

                            Read
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GOLD FOOTER NOTE */}
        {!loading &&
          notifications.length > 0 && (
            <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

              <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
                <FaBell className="text-[#C6A24A]" />
              </div>

              <div className="relative z-10">
                <p className="text-sm font-bold text-[#8B6A22]">
                  VitaCura Notification Center
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-5">
                  Review unread alerts regularly to stay updated on
                  appointments, patient activity, telemedicine sessions
                  and emergency operations.
                </p>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  gold = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] ${
        gold
          ? "bg-gradient-to-br from-white to-[#FFFDF6] border border-[#C6A24A]/25"
          : "bg-white border border-gray-200"
      }`}
    >
      {gold && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              gold
                ? "text-[#8B6A22]"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h2 className="text-3xl font-extrabold text-[#102033] mt-2">
            {value}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`${iconColor} text-xl`} />
        </div>
      </div>
    </div>
  );
}