import { useEffect, useState } from "react";
import api from "../api/api";
import { FaSearch, FaAmbulance } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Ambulances() {
  const [ambulances, setAmbulances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch ambulances
  const fetchAmbulances = async () => {
    try {
      setLoading(true);

      const response = await api.get("/ambulances/");

      setAmbulances(response.data.ambulances);
      setFiltered(response.data.ambulances);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  // Search filter
  useEffect(() => {
    const results = ambulances.filter((a) =>
      a.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
      a.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results);
  }, [search, ambulances]);

  return (
    <DashboardLayout>
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Ambulances
          </h1>

          <p className="text-gray-500">
            Manage emergency ambulance fleet
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search ambulances..."
            className="ml-3 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Ambulances</p>
          <h2 className="text-3xl font-bold text-teal-600">
            {ambulances.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Available</p>
          <h2 className="text-3xl font-bold text-green-600">
            {
              ambulances.filter((a) => a.status === "available").length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">On Trip</p>
          <h2 className="text-3xl font-bold text-red-600">
            {
              ambulances.filter((a) => a.status === "on_trip").length
            }
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading ambulances...
          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3 text-left">Ambulance</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Location</th>
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
                    No ambulances found
                  </td>
                </tr>
              ) : (

                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Ambulance */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <FaAmbulance />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {a.plate_number}
                        </p>

                        <p className="text-sm text-gray-500">
                          Emergency Unit
                        </p>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="p-3">
                      {a.driver_name}
                    </td>

                    {/* Phone */}
                    <td className="p-3">
                      {a.driver_phone}
                    </td>

                    {/* Location */}
                    <td className="p-3">
                      {a.current_location}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {a.status === "available" ? (
                        <span className="text-green-600 font-semibold">
                          Available
                        </span>
                      ) : a.status === "on_trip" ? (
                        <span className="text-red-600 font-semibold">
                          On Trip
                        </span>
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          Offline
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