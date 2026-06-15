import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import {
  FaFileMedical,
  FaSearch,
  FaUser,
  FaUserMd,
  FaEye,
} from "react-icons/fa";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medical_records/");

      setRecords(response.data.records);
      setFilteredRecords(response.data.records);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(
      (record) =>
        record.patient_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        record.doctor_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        record.diagnosis
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredRecords(filtered);

  }, [search, records]);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Medical Records
            </h1>

            <p className="text-gray-500">
              Patient diagnosis, prescriptions and notes
            </p>
          </div>

          <button className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700">
            Add Record
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Total Records
            </p>

            <h2 className="text-3xl font-bold text-teal-600">
              {records.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Patients
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {
                new Set(
                  records.map(
                    (record) => record.patient_name
                  )
                ).size
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500">
              Doctors
            </p>

            <h2 className="text-3xl font-bold text-purple-600">
              {
                new Set(
                  records.map(
                    (record) => record.doctor_name
                  )
                ).size
              }
            </h2>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-4">

          <div className="flex items-center border rounded-xl px-3">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search patient, doctor or diagnosis..."
              className="w-full p-3 outline-none"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Records Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">
              Loading records...
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
                    Diagnosis
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr
                    key={record.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <FaUser className="text-teal-600" />

                        {record.patient_name}

                      </div>

                    </td>

                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <FaUserMd className="text-purple-600" />

                        {record.doctor_name}

                      </div>

                    </td>

                    <td className="p-4">
                      {record.diagnosis}
                    </td>

                    <td className="p-4">
                      {record.date}
                    </td>

                    <td className="p-4">

                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>

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