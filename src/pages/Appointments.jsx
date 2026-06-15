import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaCalendarCheck,
  FaVideo,
  FaSearch,
  FaUserMd,
} from "react-icons/fa";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/appointments/");

      setAppointments(response.data.appointments);
      setFiltered(response.data.appointments);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let results = appointments;

    // Search
    if (search) {
      results = results.filter(
        (item) =>
          item.patient_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.doctor_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Filter
    if (filter !== "all") {
      results = results.filter(
        (item) => item.status === filter
      );
    }

    setFiltered(results);

  }, [search, filter, appointments]);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Appointments
            </h1>

            <p className="text-gray-500">
              Manage appointments and telemedicine sessions
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">Total Appointments</p>

            <h2 className="text-3xl font-bold text-teal-600">
              {appointments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">Telemedicine</p>

            <h2 className="text-3xl font-bold text-purple-600">
              {
                appointments.filter(
                  (a) => a.type === "telemedicine"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">Pending</p>

            <h2 className="text-3xl font-bold text-orange-500">
              {
                appointments.filter(
                  (a) => a.status === "pending"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-4">

          <div className="flex items-center border rounded-lg px-3 flex-1">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search patient or doctor..."
              className="w-full p-2 outline-none"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">
              Loading appointments...
            </div>
          ) : (

            <table className="w-full">

              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 text-left">
                    Patient
                  </th>

                  <th className="p-4 text-left">
                    Doctor
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Type
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((appointment) => (

                  <tr
                    key={appointment.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {appointment.patient_name}
                    </td>

                    <td className="p-4">
                      {appointment.doctor_name}
                    </td>

                    <td className="p-4">
                      {appointment.date}
                    </td>

                    <td className="p-4">

                      {appointment.type === "telemedicine" ? (
                        <span className="flex items-center gap-2 text-purple-600">
                          <FaVideo />
                          Telemedicine
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-teal-600">
                          <FaUserMd />
                          Physical
                        </span>
                      )}

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appointment.status}
                      </span>

                    </td>

                    <td className="p-4">

                      {appointment.type ===
                      "telemedicine" ? (

                        <button
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                          Join Session
                        </button>

                      ) : (

                        <button
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                        >
                          View
                        </button>

                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}