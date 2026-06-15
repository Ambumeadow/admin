import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import {
  FaPills,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Pharmacy() {
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDrugs = async () => {
    try {
      const response = await api.get("/drugs/");
      setDrugs(response.data.drugs);
      setFilteredDrugs(response.data.drugs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredDrugs(drugs);
      return;
    }

    const filtered = drugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(search.toLowerCase()) ||
        drug.category.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDrugs(filtered);
  }, [search, drugs]);

  const lowStockCount = drugs.filter(
    (drug) => drug.quantity <= 10
  ).length;

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Pharmacy Inventory
            </h1>

            <p className="text-gray-500">
              Manage medicines and stock levels
            </p>
          </div>

          <button className="bg-teal-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-teal-700">
            <FaPlus />
            Add Drug
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Total Drugs
            </p>

            <h2 className="text-3xl font-bold text-teal-600">
              {drugs.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Low Stock
            </p>

            <h2 className="text-3xl font-bold text-red-500">
              {lowStockCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Categories
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {
                new Set(
                  drugs.map((drug) => drug.category)
                ).size
              }
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Inventory Value
            </p>

            <h2 className="text-3xl font-bold text-purple-600">
              KES{" "}
              {drugs.reduce(
                (sum, drug) =>
                  sum +
                  drug.price * drug.quantity,
                0
              )}
            </h2>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-4">

          <div className="flex items-center border rounded-xl px-3">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search drug..."
              className="w-full p-3 outline-none"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Inventory Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {loading ? (

            <div className="p-10 text-center">
              Loading inventory...
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-teal-600 text-white">

                <tr>
                  <th className="p-4 text-left">
                    Drug
                  </th>

                  <th className="p-4 text-left">
                    Category
                  </th>

                  <th className="p-4 text-left">
                    Price
                  </th>

                  <th className="p-4 text-left">
                    Quantity
                  </th>

                  <th className="p-4 text-left">
                    Expiry Date
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredDrugs.map((drug) => (

                  <tr
                    key={drug.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <FaPills className="text-teal-600" />

                        {drug.name}

                      </div>

                    </td>

                    <td className="p-4">
                      {drug.category}
                    </td>

                    <td className="p-4">
                      KES {drug.price}
                    </td>

                    <td className="p-4">
                      {drug.quantity}
                    </td>

                    <td className="p-4">
                      {drug.expiry_date}
                    </td>

                    <td className="p-4">

                      {drug.quantity <= 10 ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit">
                          <FaExclamationTriangle />
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          In Stock
                        </span>
                      )}

                    </td>

                    <td className="p-4">

                      <div className="flex gap-2">

                        <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                          <FaEdit />
                        </button>

                        <button className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700">
                          <FaTrash />
                        </button>

                      </div>

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