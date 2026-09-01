import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FaVideo,
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaUser,
  FaClock,
  FaSyncAlt,
  FaCrown,
  FaStethoscope,
} from "react-icons/fa";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/my_appointments/");

      setAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.log(
        "Fetch my appointments error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    try {
      setUpdatingId(appointmentId);

      await api.post(
        `/update_appointment_status/`,
        {
          appointment_id: appointmentId,
          status,
        }
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentId
            ? {
                ...item,
                status,
              }
            : item
        )
      );
    } catch (error) {
      console.log(
        "Update appointment status error:",
        error
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const startTelemedicine = (appointment) => {
    if (appointment.meeting_link) {
      window.open(
        appointment.meeting_link,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const stats = useMemo(() => {
    return {
      total: appointments.length,

      pending: appointments.filter(
        (a) =>
          a?.status?.toLowerCase() ===
          "pending"
      ).length,

      approved: appointments.filter(
        (a) =>
          a?.status?.toLowerCase() ===
          "approved"
      ).length,

      telemedicine: appointments.filter(
        (a) =>
          a?.type?.toLowerCase() ===
          "telemedicine"
      ).length,
    };
  }, [appointments]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          label: "Approved",
          icon: FaCheckCircle,
          className:
            "bg-[#08764F]/10 text-[#08764F] border-[#08764F]/15",
        };

      case "pending":
        return {
          label: "Pending",
          icon: FaClock,
          className:
            "bg-[#C6A24A]/12 text-[#8B6A22] border-[#C6A24A]/25",
        };

      case "in_progress":
        return {
          label: "In Progress",
          icon: FaPlayCircle,
          className:
            "bg-[#123B70]/10 text-[#123B70] border-[#123B70]/15",
        };

      case "completed":
        return {
          label: "Completed",
          icon: FaCheckCircle,
          className:
            "bg-[#08764F]/10 text-[#08764F] border-[#08764F]/15",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: FaTimesCircle,
          className:
            "bg-red-50 text-red-600 border-red-100",
        };

      default:
        return {
          label: status || "Unknown",
          icon: FaClock,
          className:
            "bg-gray-100 text-gray-500 border-gray-200",
        };
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-6 py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          {/* Decorative accents */}
          <div className="absolute -top-20 -right-14 w-60 h-60 rounded-full bg-[#C6A24A]/10" />

          <div className="absolute bottom-[-65px] left-[40%] w-44 h-44 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center">
                <FaCalendarCheck className="text-[#E8D58C] text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  My Appointments
                </h1>

                <p className="text-white/70 text-sm mt-1">
                  Manage your consultations and telemedicine sessions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total"
            value={stats.total}
            subtitle="All appointments"
            icon={FaCalendarCheck}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting confirmation"
            icon={FaClock}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            subtitle="Ready for consultation"
            icon={FaCheckCircle}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />

          <StatCard
            title="Telemedicine"
            value={stats.telemedicine}
            subtitle="Virtual consultations"
            icon={FaVideo}
            iconBg="bg-[#E8D58C]/25"
            iconColor="text-[#8B6A22]"
            gold
          />
        </div>

        {/* SECTION HEADER */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#102033]">
                Consultation Schedule
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {appointments.length}{" "}
                {appointments.length === 1
                  ? "appointment"
                  : "appointments"}{" "}
                assigned to you.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                CLINICAL SCHEDULE
              </span>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[24px] py-24 flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
              <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
            </div>

            <p className="text-[#102033] font-semibold mt-4">
              Loading appointments...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching your consultation schedule
            </p>
          </div>
        ) : appointments.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-[24px] py-20 px-6 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaCalendarCheck className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Appointments Yet
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md leading-6">
              Appointments assigned to you will appear here once
              patients book consultations or care sessions.
            </p>
          </div>
        ) : (
          /* APPOINTMENT CARDS */
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
            {appointments.map((appointment) => {
              const status =
                getStatusStyle(
                  appointment.status
                );

              const StatusIcon =
                status.icon;

              const isTelemedicine =
                appointment.type?.toLowerCase() ===
                "telemedicine";

              const isUpdating =
                updatingId ===
                appointment.id;

              return (
                <div
                  key={appointment.id}
                  className="relative overflow-hidden bg-white border border-gray-200 rounded-[24px] shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition"
                >
                  {/* GOLD TOP BORDER */}
                  <div className="h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />

                  <div className="p-5 md:p-6">
                    {/* TOP */}
                    <div className="flex items-start gap-4">
                      {/* PATIENT AVATAR */}
                      <div className="w-14 h-14 rounded-2xl bg-[#123B70]/10 border border-[#C6A24A]/30 flex items-center justify-center shrink-0">
                        <FaUser className="text-[#123B70] text-xl" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="font-extrabold text-lg text-[#102033] truncate">
                          {appointment.patient_name ||
                            "Unknown Patient"}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                          <FaCalendarCheck className="text-[#C6A24A] text-xs" />

                          <span className="text-sm text-gray-500">
                            {formatDate(
                              appointment.date
                            )}
                          </span>
                        </div>
                      </div>

                      {/* STATUS */}
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 ${status.className}`}
                      >
                        <StatusIcon className="text-[10px]" />

                        {status.label}
                      </span>
                    </div>

                    {/* CONSULTATION TYPE */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      {isTelemedicine ? (
                        <div className="inline-flex items-center gap-3 bg-[#C6A24A]/10 border border-[#C6A24A]/20 rounded-2xl px-4 py-3">
                          <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center">
                            <FaVideo className="text-[#C6A24A]" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#8B6A22]">
                              Telemedicine
                            </p>

                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Virtual consultation
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 bg-[#08764F]/8 border border-[#08764F]/15 rounded-2xl px-4 py-3">
                          <div className="w-9 h-9 rounded-xl bg-[#08764F]/10 flex items-center justify-center">
                            <FaStethoscope className="text-[#08764F]" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#08764F]">
                              Physical Consultation
                            </p>

                            <p className="text-[11px] text-gray-500 mt-0.5">
                              In-person care session
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 mt-5">
                      {/* PENDING */}
                      {appointment.status ===
                        "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "approved"
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#08764F] text-white text-sm font-bold hover:bg-[#05563A] transition disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}

                            Accept
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "cancelled"
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
                          >
                            <FaTimesCircle />

                            Cancel
                          </button>
                        </>
                      )}

                      {/* APPROVED */}
                      {appointment.status ===
                        "approved" && (
                        <>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "in_progress"
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#123B70] text-white text-sm font-bold hover:bg-[#0A274A] transition disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : (
                              <FaPlayCircle />
                            )}

                            Start Consultation
                          </button>

                          {isTelemedicine && (
                            <button
                              type="button"
                              disabled={
                                !appointment.meeting_link
                              }
                              onClick={() =>
                                startTelemedicine(
                                  appointment
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#C6A24A] text-[#0A274A] text-sm font-bold hover:bg-[#E8D58C] transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <FaVideo />

                              Start Video Call
                            </button>
                          )}
                        </>
                      )}

                      {/* IN PROGRESS */}
                      {appointment.status ===
                        "in_progress" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              appointment.id,
                              "completed"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#08764F] text-white text-sm font-bold hover:bg-[#05563A] transition disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <FaSyncAlt className="animate-spin" />
                          ) : (
                            <FaCalendarCheck />
                          )}

                          Mark Completed
                        </button>
                      )}

                      {/* COMPLETED */}
                      {appointment.status ===
                        "completed" && (
                        <div className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-sm font-bold">
                          <FaCheckCircle />

                          Consultation Completed
                        </div>
                      )}

                      {/* CANCELLED */}
                      {appointment.status ===
                        "cancelled" && (
                        <div className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                          <FaTimesCircle />

                          Appointment Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GOLD FOOTER NOTE */}
        {!loading &&
          appointments.length > 0 && (
            <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

              <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
                <FaCrown className="text-[#C6A24A]" />
              </div>

              <div className="relative z-10">
                <p className="text-sm font-bold text-[#8B6A22]">
                  VitaCura Consultation Management
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-5">
                  Update appointment statuses as consultations
                  progress so patients receive accurate information
                  about their healthcare sessions.
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