import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FaCalendarCheck,
  FaVideo,
  FaSearch,
  FaUserMd,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSyncAlt,
  FaHospitalUser,
} from "react-icons/fa";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/appointments/");

      setAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.log(
        "Fetch appointments error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = useMemo(() => {
    let results = [...appointments];

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      results = results.filter((item) => {
        return (
          item?.patient_name
            ?.toLowerCase()
            .includes(query) ||
          item?.doctor_name
            ?.toLowerCase()
            .includes(query) ||
          item?.type
            ?.toLowerCase()
            .includes(query) ||
          item?.status
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    if (filter !== "all") {
      results = results.filter(
        (item) =>
          item?.status?.toLowerCase() === filter
      );
    }

    return results;
  }, [appointments, search, filter]);

  const totalTelemedicine = appointments.filter(
    (a) =>
      a?.type?.toLowerCase() === "telemedicine"
  ).length;

  const totalPending = appointments.filter(
    (a) =>
      a?.status?.toLowerCase() === "pending"
  ).length;

  const totalCompleted = appointments.filter(
    (a) =>
      a?.status?.toLowerCase() === "completed"
  ).length;

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
          icon: FaHourglassHalf,
          className:
            "bg-[#C6A24A]/10 text-[#8B6A22] border-[#C6A24A]/20",
        };

      case "completed":
        return {
          label: "Completed",
          icon: FaCheckCircle,
          className:
            "bg-[#123B70]/10 text-[#123B70] border-[#123B70]/15",
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#123B70]/10 flex items-center justify-center">
              <FaCalendarCheck className="text-[#123B70] text-xl" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#102033]">
                Appointments
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Manage physical appointments and
                telemedicine consultations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#123B70]/10 text-[#123B70] font-semibold text-sm hover:bg-[#123B70]/15 transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Appointments"
            value={appointments.length}
            subtitle="All healthcare bookings"
            icon={FaCalendarCheck}
            iconClass="text-[#123B70]"
            iconBg="bg-[#123B70]/10"
          />

          <StatCard
            title="Telemedicine"
            value={totalTelemedicine}
            subtitle="Virtual consultations"
            icon={FaVideo}
            iconClass="text-[#08764F]"
            iconBg="bg-[#08764F]/10"
          />

          <StatCard
            title="Pending"
            value={totalPending}
            subtitle="Awaiting action"
            icon={FaHourglassHalf}
            iconClass="text-[#C6A24A]"
            iconBg="bg-[#C6A24A]/15"
          />

          <StatCard
            title="Completed"
            value={totalCompleted}
            subtitle="Finished appointments"
            icon={FaCheckCircle}
            iconClass="text-[#08764F]"
            iconBg="bg-[#08764F]/10"
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="h-12 flex items-center border border-gray-200 rounded-xl px-4 bg-[#F8FAF9] focus-within:border-[#123B70] focus-within:ring-4 focus-within:ring-[#123B70]/5 transition">
                <FaSearch className="text-[#123B70] text-sm" />

                <input
                  type="text"
                  placeholder="Search patient, doctor, type or status..."
                  className="w-full ml-3 bg-transparent outline-none text-sm text-[#102033] placeholder:text-gray-400"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-[#123B70] text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="md:w-56">
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="w-full h-12 bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 text-sm text-[#102033] outline-none focus:border-[#123B70] focus:ring-4 focus:ring-[#123B70]/5"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#102033]">
                Appointment Overview
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "appointment"
                  : "appointments"}{" "}
                shown
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#123B70]/10 flex items-center justify-center">
                <FaSyncAlt className="text-[#123B70] text-xl animate-spin" />
              </div>

              <p className="text-[#102033] font-semibold mt-4">
                Loading appointments...
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Fetching healthcare schedules
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-[24px] bg-[#123B70]/10 flex items-center justify-center">
                <FaCalendarCheck className="text-[#123B70] text-3xl" />
              </div>

              <h3 className="text-lg font-extrabold text-[#102033] mt-5">
                No Appointments Found
              </h3>

              <p className="text-gray-500 text-sm mt-2 max-w-md">
                {search || filter !== "all"
                  ? "No appointments match your current search or filter."
                  : "No appointment records are currently available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="bg-[#F8FAF9] border-b border-gray-200">
                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Doctor
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((appointment) => {
                    const status =
                      getStatusStyle(
                        appointment.status
                      );

                    const StatusIcon =
                      status.icon;

                    const isTelemedicine =
                      appointment.type?.toLowerCase() ===
                      "telemedicine";

                    return (
                      <tr
                        key={appointment.id}
                        className="hover:bg-[#F8FAF9] transition"
                      >
                        {/* PATIENT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#123B70]/10 flex items-center justify-center">
                              <FaHospitalUser className="text-[#123B70] text-sm" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#102033]">
                                {appointment.patient_name ||
                                  "Unknown Patient"}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Patient
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DOCTOR */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#08764F]/10 flex items-center justify-center">
                              <FaUserMd className="text-[#08764F] text-xs" />
                            </div>

                            <span className="text-sm font-medium text-[#102033]">
                              {appointment.doctor_name ||
                                "Not assigned"}
                            </span>
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarCheck className="text-[#C6A24A] text-xs" />

                            {appointment.date ||
                              "Not set"}
                          </div>
                        </td>

                        {/* TYPE */}
                        <td className="px-5 py-4">
                          {isTelemedicine ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08764F]/10 text-[#08764F] text-xs font-bold">
                              <FaVideo />

                              Telemedicine
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123B70]/10 text-[#123B70] text-xs font-bold">
                              <FaUserMd />

                              Physical Visit
                            </span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${status.className}`}
                          >
                            <StatusIcon className="text-[10px]" />

                            {status.label}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">
                          {isTelemedicine ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08764F] text-white text-xs font-bold hover:bg-[#05563A] transition"
                            >
                              <FaVideo />

                              Join Session
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123B70]/10 text-[#123B70] text-xs font-bold hover:bg-[#123B70]/15 transition"
                            >
                              <FaCalendarCheck />

                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* INFO NOTE */}
        {!loading &&
          appointments.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl bg-[#C6A24A]/10 border border-[#C6A24A]/15 p-4">
              <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
                <FaCalendarCheck className="text-[#C6A24A] text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#102033]">
                  Appointment management
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-5">
                  Review appointment status regularly
                  to keep physical visits and
                  telemedicine sessions properly
                  coordinated.
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
  iconClass,
  iconBg,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">
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
          <Icon
            className={`${iconClass} text-xl`}
          />
        </div>
      </div>
    </div>
  );
}