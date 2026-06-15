import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaVideo,
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaUser,
} from "react-icons/fa";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/my_appointments/");
      setAppointments(response.data.appointments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await api.post(`/update_appointment_status/`, {
        appointment_id: appointmentId,
        status,
      });

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentId
            ? { ...item, status }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startTelemedicine = (appointment) => {
    if (appointment.meeting_link) {
      window.open(appointment.meeting_link, "_blank");
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Appointments
          </h1>

          <p className="text-gray-500">
            Manage consultations and telemedicine sessions
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold text-teal-600">
              {appointments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {
                appointments.filter(
                  (a) => a.status === "pending"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold text-green-600">
              {
                appointments.filter(
                  (a) => a.status === "approved"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500">Telemedicine</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {
                appointments.filter(
                  (a) => a.type === "telemedicine"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Appointments */}

        {loading ? (
          <div className="text-center py-10">
            Loading appointments...
          </div>
        ) : (
          <div className="space-y-4">

            {appointments.map((appointment) => (

              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow p-5"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="font-bold text-lg">
                      {appointment.patient_name}
                    </h2>

                    <p className="text-gray-500">
                      {appointment.date}
                    </p>

                    <div className="flex items-center gap-2 mt-2">

                      {appointment.type ===
                      "telemedicine" ? (
                        <>
                          <FaVideo className="text-purple-600" />
                          <span>
                            Telemedicine
                          </span>
                        </>
                      ) : (
                        <>
                          <FaUser className="text-teal-600" />
                          <span>
                            Physical Consultation
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                  {/* Status */}

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
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

                </div>

                {/* Actions */}

                <div className="flex flex-wrap gap-3 mt-5">

                  {appointment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "approved"
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaCheckCircle />
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "cancelled"
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaTimesCircle />
                        Cancel
                      </button>
                    </>
                  )}

                  {appointment.status === "approved" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "in_progress"
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlayCircle />
                        Start Consultation
                      </button>

                      {appointment.type ===
                        "telemedicine" && (
                        <button
                          onClick={() =>
                            startTelemedicine(
                              appointment
                            )
                          }
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FaVideo />
                          Start Video Call
                        </button>
                      )}
                    </>
                  )}

                  {appointment.status ===
                    "in_progress" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "completed"
                        )
                      }
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaCalendarCheck />
                      Mark Completed
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}