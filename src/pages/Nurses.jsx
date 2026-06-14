import { useEffect, useState } from "react";
import api from "../api/api";
import { FaSearch, FaUserNurse } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch nurses
  const fetchNurses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/nurses/");

      setNurses(response.data.nurses);
      setFiltered(response.data.nurses);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  // Search filter
  useEffect(() => {
    const results = nurses.filter((n) =>
      n.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      n.department?.toLowerCase().includes(search.toLowerCase()) ||
      n.ward?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results);
  }, [search, nurses]);

  return (
    <DashboardLayout>
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Nurses
          </h1>

          <p className="text-gray-500">
            Manage hospital nursing staff
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search nurses..."
            className="ml-3 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Nurses</p>
          <h2 className="text-3xl font-bold text-teal-600">
            {nurses.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">On Duty</p>
          <h2 className="text-3xl font-bold text-green-600">
            {
              nurses.filter((n) => n.is_on_duty).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Departments</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {new Set(nurses.map((n) => n.department)).size}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading nurses...
          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3 text-left">Nurse</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Ward</th>
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
                    No nurses found
                  </td>
                </tr>
              ) : (

                filtered.map((nurse) => (
                  <tr
                    key={nurse.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Nurse */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
                        <FaUserNurse />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {nurse.full_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {nurse.email}
                        </p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-3">
                      {nurse.department}
                    </td>

                    {/* Ward */}
                    <td className="p-3">
                      {nurse.ward}
                    </td>

                    {/* Phone */}
                    <td className="p-3">
                      {nurse.phone_number}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {nurse.is_on_duty ? (
                        <span className="text-green-600 font-semibold">
                          On Duty
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Off Duty
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