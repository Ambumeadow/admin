import { useEffect, useState } from "react";

import {
  FaUserInjured,
  FaUserMd,
  FaUserNurse,
  FaCalendarCheck,
  FaAmbulance,
  FaMoneyBillWave,
  FaArrowRight,
  FaClipboardList,
  FaUserPlus,
  FaCrown,
  FaHeartbeat,
  FaClock,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

const RECENT_ACTIVITIES = [
  {
    id: 1,
    text: "Dr. Mwangi added a medical record.",
    type: "record",
  },
  {
    id: 2,
    text: "Patient John Doe booked an appointment.",
    type: "appointment",
  },
  {
    id: 3,
    text: "New nurse account created.",
    type: "staff",
  },
  {
    id: 4,
    text: "Premium subscription activated.",
    type: "subscription",
  },
  {
    id: 5,
    text: "Ambulance booking completed.",
    type: "ambulance",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalNurses, setTotalNurses] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalAmbulances, setTotalAmbulances] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStaff = localStorage.getItem("staff");

      if (storedStaff) {
        setStaff(JSON.parse(storedStaff));
      }
    } catch (error) {
      console.error(
        "Failed to parse staff data from localStorage",
        error
      );
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        usersResponse,
        doctorsResponse,
        nursesResponse,
        appointmentsResponse,
        ambulanceResponse,
        revenueResponse,
      ] = await Promise.all([
        api.get("/get_all_users/"),
        api.get("/get_all_doctors/"),
        api.get("/get_all_nurses/"),
        api.get("/get_all_appointments/"),
        api.get("/get_all_ambulances/"),
        api.get("/get_all_payments/"),
      ]);

      setTotalUsers(
        usersResponse.data.total_users ?? 0
      );

      setTotalDoctors(
        doctorsResponse.data.total_doctors ?? 0
      );

      setTotalNurses(
        nursesResponse.data.total_nurses ?? 0
      );

      setTotalAppointments(
        appointmentsResponse.data.total_appointments ?? 0
      );

      setTotalAmbulances(
        ambulanceResponse.data.total_ambulances ?? 0
      );

      setTotalRevenue(
        revenueResponse.data.total_revenue ?? 0
      );
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return number.toLocaleString("en-KE");
  };

  const formatRevenue = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return `KES ${value}`;
    }

    return `KES ${number.toLocaleString("en-KE")}`;
  };

  const getFirstName = () => {
    if (!staff?.staff_name) {
      return "Administrator";
    }

    return staff.staff_name.trim().split(" ")[0];
  };

  const stats = [
    {
      id: "users",
      title: "Patients",
      value: formatNumber(totalUsers),
      icon: FaUserInjured,
      color: "#123B70",
      background: "rgba(18,59,112,0.10)",
      description: "Registered patients",
    },
    {
      id: "doctors",
      title: "Doctors",
      value: formatNumber(totalDoctors),
      icon: FaUserMd,
      color: "#08764F",
      background: "rgba(8,118,79,0.10)",
      description: "Healthcare providers",
    },
    {
      id: "nurses",
      title: "Nurses",
      value: formatNumber(totalNurses),
      icon: FaUserNurse,
      color: "#C6A24A",
      background: "rgba(198,162,74,0.14)",
      description: "Nursing staff",
    },
    {
      id: "appointments",
      title: "Appointments",
      value: formatNumber(totalAppointments),
      icon: FaCalendarCheck,
      color: "#123B70",
      background: "rgba(18,59,112,0.10)",
      description: "Total appointments",
    },
    {
      id: "ambulances",
      title: "Ambulances",
      value: formatNumber(totalAmbulances),
      icon: FaAmbulance,
      color: "#D92D20",
      background: "rgba(217,45,32,0.09)",
      description: "Emergency vehicles",
    },
    {
      id: "revenue",
      title: "Revenue",
      value: formatRevenue(totalRevenue),
      icon: FaMoneyBillWave,
      color: "#08764F",
      background: "rgba(8,118,79,0.10)",
      description: "Platform revenue",
    },
  ];

  const quickActions = [
    {
      title: "Add Patient",
      description: "Register a new patient",
      icon: FaUserPlus,
      path: "/patients",
      color: "#123B70",
      background: "rgba(18,59,112,0.10)",
    },
    {
      title: "Appointments",
      description: "Manage care schedules",
      icon: FaCalendarCheck,
      path: "/appointments",
      color: "#08764F",
      background: "rgba(8,118,79,0.10)",
    },
    {
      title: "Medical Records",
      description: "View patient records",
      icon: FaClipboardList,
      path: "/medical-records",
      color: "#C6A24A",
      background: "rgba(198,162,74,0.14)",
    },
    {
      title: "Manage Staff",
      description: "Doctors and nurses",
      icon: FaUserMd,
      path: "/doctors",
      color: "#123B70",
      background: "rgba(18,59,112,0.10)",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* WELCOME */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A274A] via-[#123B70] to-[#08764F] p-6 md:p-8 text-white shadow-[0_18px_50px_rgba(18,59,112,0.20)]">
          {/* Decorations */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />

          <div className="absolute bottom-[-80px] left-[35%] w-56 h-56 rounded-full bg-[#C6A24A]/10" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <FaHeartbeat className="text-[#E8D58C]" />
                </div>

                <span className="text-[#E8D58C] text-xs uppercase tracking-[0.2em] font-semibold">
                  VitaCura Dashboard
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold">
                Welcome back, {getFirstName()}
              </h1>

              <p className="text-white/70 mt-3 max-w-2xl leading-7">
                Monitor patients, healthcare staff, appointments,
                subscriptions and daily healthcare operations from
                one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[170px]">
                <p className="text-white/60 text-xs">
                  Staff Member
                </p>

                <p className="font-bold mt-1">
                  {staff?.staff_name || "Administrator"}
                </p>

                <p className="text-[#E8D58C] text-xs capitalize mt-1">
                  {staff?.role || "Administrator"}
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[170px]">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-[#E8D58C]" />

                  <p className="font-semibold text-sm">
                    System Status
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />

                  <span className="text-white/70 text-xs">
                    Platform Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      {item.title}
                    </p>

                    {loading ? (
                      <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse mt-3" />
                    ) : (
                      <h2 className="text-2xl lg:text-3xl font-extrabold text-[#102033] mt-2">
                        {item.value}
                      </h2>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: item.background,
                      color: item.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#102033]">
                  Recent Activity
                </h2>

                <p className="text-gray-500 text-xs mt-1">
                  Latest activity across the healthcare platform
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#123B70]/10 flex items-center justify-center">
                <FaClock className="text-[#123B70]" />
              </div>
            </div>

            <div className="px-5 md:px-6">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-4 py-4 ${
                    index !== RECENT_ACTIVITIES.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="mt-1 w-9 h-9 rounded-xl bg-[#08764F]/10 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-[#08764F] text-sm" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[#102033] text-sm font-medium">
                      {activity.text}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Recent platform activity
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(15,23,42,0.04)] p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-extrabold text-[#102033]">
                Quick Actions
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Access frequently used tools
              </p>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={() =>
                      navigate(action.path)
                    }
                    className="w-full flex items-center gap-3 text-left border border-gray-200 hover:border-[#123B70]/20 rounded-2xl p-3 hover:bg-[#F8FAF9] transition group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          action.background,
                        color: action.color,
                      }}
                    >
                      <Icon />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#102033]">
                        {action.title}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">
                        {action.description}
                      </p>
                    </div>

                    <FaArrowRight className="text-gray-300 group-hover:text-[#123B70] group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* TODAY'S APPOINTMENTS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#102033]">
                  Today's Appointments
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Upcoming healthcare consultations
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#08764F]/10 flex items-center justify-center">
                <FaCalendarCheck className="text-[#08764F]" />
              </div>
            </div>

            <div className="px-5 md:px-6">
              {[
                {
                  name: "John Doe",
                  time: "09:00 AM",
                },
                {
                  name: "Mary Wanjiku",
                  time: "10:30 AM",
                },
                {
                  name: "David Kimani",
                  time: "12:00 PM",
                },
              ].map((appointment, index) => (
                <div
                  key={appointment.name}
                  className={`flex items-center justify-between py-4 ${
                    index !== 2
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#123B70]/10 flex items-center justify-center text-[#123B70] font-bold text-xs">
                      {appointment.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="text-sm font-semibold text-[#102033]">
                      {appointment.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#08764F] bg-[#08764F]/10 px-3 py-1.5 rounded-full">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/appointments")
              }
              className="w-full border-t border-gray-100 py-4 text-sm font-semibold text-[#123B70] hover:bg-[#123B70]/5 transition"
            >
              View All Appointments
            </button>
          </div>

          {/* SUBSCRIPTIONS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#102033]">
                  Subscription Summary
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Healthcare membership performance
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center">
                <FaCrown className="text-[#C6A24A]" />
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between bg-[#08764F]/5 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold text-[#102033]">
                    Active Plans
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Current subscriptions
                  </p>
                </div>

                <span className="font-extrabold text-[#08764F] bg-[#08764F]/10 px-3 py-1.5 rounded-full text-sm">
                  342
                </span>
              </div>

              <div className="flex items-center justify-between bg-red-50 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold text-[#102033]">
                    Expired Plans
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Require renewal
                  </p>
                </div>

                <span className="font-extrabold text-red-600 bg-red-100 px-3 py-1.5 rounded-full text-sm">
                  27
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#C6A24A]/10 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold text-[#102033]">
                    Monthly Revenue
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Subscription income
                  </p>
                </div>

                <span className="font-extrabold text-[#123B70]">
                  KES 580,000
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/subscriptions")
              }
              className="w-full border-t border-gray-100 py-4 text-sm font-semibold text-[#123B70] hover:bg-[#123B70]/5 transition"
            >
              Manage Subscriptions
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}