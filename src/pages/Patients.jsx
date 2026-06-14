import { useEffect, useState } from "react";
import api from "../api/api";
import { FaSearch, FaUserInjured } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/patients/");

      setPatients(response.data.patients);
      setFiltered(response.data.patients);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Search filter
  useEffect(() => {
    const results = patients.filter((p) =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.ward?.toLowerCase().includes(search.toLowerCase()) ||
      p.blood_group?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results);
  }, [search, patients]);

  return (
    <DashboardLayout>
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Patients
          </h1>

          <p className="text-gray-500">
            Manage all registered patients
          </p>
        </div>

        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search patients..."
            className="ml-3 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Patients</p>
          <h2 className="text-3xl font-bold text-teal-600">
            {patients.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Under Medication</p>
          <h2 className="text-3xl font-bold text-orange-500">
            {
              patients.filter((p) => p.under_medication).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Wards</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {new Set(patients.map((p) => p.ward)).size}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading patients...
          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Ward</th>
                <th className="p-3 text-left">Blood Group</th>
                <th className="p-3 text-left">Medication</th>
                <th className="p-3 text-left">Emergency Contact</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>
              ) : (

                filtered.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Patient */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                        <FaUserInjured />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {patient.full_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {patient.user_email}
                        </p>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="p-3">
                      {patient.gender}
                    </td>

                    {/* Ward */}
                    <td className="p-3">
                      {patient.ward}
                    </td>

                    {/* Blood Group */}
                    <td className="p-3 font-semibold">
                      {patient.blood_group}
                    </td>

                    {/* Medication */}
                    <td className="p-3">
                      {patient.under_medication ? (
                        <span className="text-red-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          No
                        </span>
                      )}
                    </td>

                    {/* Emergency */}
                    <td className="p-3">
                      {patient.emergency_contact}
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