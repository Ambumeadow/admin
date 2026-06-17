import { useEffect, useState } from "react";
import api from "../api/api";
import { FaSearch, FaUserMd } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_all_doctors/");

      setDoctors(response.data.doctors);
      setFiltered(response.data.doctors);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Search filter
  useEffect(() => {
    const results = doctors.filter((d) =>
      d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.department?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results);
  }, [search, doctors]);

  return (
    <DashboardLayout>
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Doctors
          </h1>

          <p className="text-gray-500">
            Manage hospital doctors and specialists
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search doctors..."
            className="ml-3 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Doctors</p>
          <h2 className="text-3xl font-bold text-teal-600">
            {doctors.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Available Today</p>
          <h2 className="text-3xl font-bold text-green-600">
            {
              doctors.filter((d) => d.is_available).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Specializations</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {new Set(doctors.map((d) => d.specialization)).size}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading doctors...
          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Hospital</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No doctors found
                  </td>
                </tr>
              ) : (

                filtered.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Doctor */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                        <FaUserMd />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {doctor.full_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {doctor.email}
                        </p>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="p-3">
                      {doctor.hospital}
                    </td>

                    {/* Department */}
                    <td className="p-3">
                      {doctor.department}
                    </td>

                    {/* Phone */}
                    <td className="p-3">
                      {doctor.phone_number}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {doctor.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Busy
                        </span>
                      )}
                    </td>

                  </tr>
                ))

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
    </DashboardLayout>
  );
}