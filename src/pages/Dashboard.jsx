import { useState, useEffect } from "react";
import {
  FaUserInjured,
  FaUserMd,
  FaUserNurse,
  FaCalendarCheck,
  FaAmbulance,
  FaMoneyBillWave,
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

// 1. Move static configuration data OUTSIDE the component to prevent recreation on every render
const STATS_CONFIG = [
  { id: "users", title: "Users", value: 1250, icon: <FaUserInjured size={28} /> },
  { id: "doctors", title: "Doctors", value: 42, icon: <FaUserMd size={28} /> },
  { id: "nurses", title: "Nurses", value: 68, icon: <FaUserNurse size={28} /> },
  { id: "appointments", title: "Appointments", value: 315, icon: <FaCalendarCheck size={28} /> },
  { id: "ambulances", title: "Ambulances", value: 12, icon: <FaAmbulance size={28} /> },
  { id: "revenue", title: "Revenue", value: "KES 580K", icon: <FaMoneyBillWave size={28} /> },
];

const RECENT_ACTIVITIES = [
  { id: 1, text: "Dr. Mwangi added a medical record." },
  { id: 2, text: "Patient John Doe booked an appointment." },
  { id: 3, text: "New nurse account created." },
  { id: 4, text: "Premium subscription activated." },
  { id: 5, text: "Ambulance booking completed." },
];

export default function Dashboard() {
  const [staff, setStaff] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);

  const stats = [
  {
    id: "users",
    title: "Users",
    value: totalUsers || "Loading...",
    icon: <FaUserInjured size={28} />,
  },
  {
    id: "doctors",
    title: "Doctors",
    value: totalDoctors || "Loading...",
    icon: <FaUserMd size={28} />,
  },
  {
    id: "nurses",
    title: "Nurses",
    value: 68,
    icon: <FaUserNurse size={28} />,
  },
  {
    id: "appointments",
    title: "Appointments",
    value: 315,
    icon: <FaCalendarCheck size={28} />,
  },
  {
    id: "ambulances",
    title: "Ambulances",
    value: 12,
    icon: <FaAmbulance size={28} />,
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "KES 580K",
    icon: <FaMoneyBillWave size={28} />,
  },
];

  // 2. Safe localStorage fetching after component mounts (fixes SSR crashes)
  useEffect(() => {
    try {
      const storedStaff = localStorage.getItem("staff");
      if (storedStaff) {
        setStaff(JSON.parse(storedStaff));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    }
  }, []);

 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [
        usersResponse,
        doctorsResponse,
      ] = await Promise.all([
        api.get("/get_all_users/"),
        api.get("/get_all_doctors/"),
      ]);

      setTotalUsers(usersResponse.data.total_users);
      setTotalDoctors(doctorsResponse.data.total_doctors);

    } catch (err) {
      console.error("An error occurred:", err);
    }
  };

  fetchDashboardData();
}, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome Back 👋</h1>
          <p className="text-teal-100 text-lg">
            {staff?.staff_name || "Administrator"}
          </p>
          <p className="mt-4 text-teal-50">
            Manage patients, staff, appointments, subscriptions, medical records and healthcare operations.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">{item.value}</h2>
                </div>
                <div className="bg-teal-100 text-teal-700 p-4 rounded-xl">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Recent Activities</h2>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="w-3 h-3 rounded-full bg-teal-500 shrink-0"></div>
                  <p className="text-gray-700">{activity.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition duration-200 font-medium">
                Add Patient
              </button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-medium">
                Create Appointment
              </button>
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition duration-200 font-medium">
                Medical Records
              </button>
              <button className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition duration-200 font-medium">
                Manage Staff
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Appointment Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Appointments</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">John Doe</span>
                <span className="text-teal-600 font-medium">09:00 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-700">Mary Wanjiku</span>
                <span className="text-teal-600 font-medium">10:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">David Kimani</span>
                <span className="text-teal-600 font-medium">12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Subscription Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Subscription Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Active Plans</span>
                <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">342</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expired Plans</span>
                <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">27</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Revenue</span>
                <span className="font-bold text-teal-600">KES 580,000</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}