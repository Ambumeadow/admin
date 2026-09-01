import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

import {
  FaPills,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSyncAlt,
  FaCrown,
  FaBoxes,
  FaTags,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Pharmacy() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDrugs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_all_drugs/");

      setDrugs(response.data.drugs || []);
    } catch (error) {
      console.log("Fetch drugs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const filteredDrugs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return drugs;
    }

    return drugs.filter((drug) => {
      return (
        drug?.name
          ?.toLowerCase()
          .includes(query) ||
        drug?.category
          ?.toLowerCase()
          .includes(query) ||
        drug?.expiry_date
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [drugs, search]);

  const lowStockCount = drugs.filter(
    (drug) => Number(drug.quantity) <= 10
  ).length;

  const totalCategories = new Set(
    drugs
      .map((drug) => drug.category)
      .filter(Boolean)
  ).size;

  const inventoryValue = drugs.reduce(
    (sum, drug) =>
      sum +
      Number(drug.price || 0) *
        Number(drug.quantity || 0),
    0
  );

  const formatPrice = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return number.toLocaleString("en-KE");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          <div className="absolute -top-16 -right-16 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-[#C6A24A]/10" />
          <div className="absolute bottom-[-60px] left-[30%] w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center shrink-0">
                <FaPills className="text-[#E8D58C] text-xl sm:text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Pharmacy Inventory
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                  Manage medicines, stock levels, pricing and expiry dates.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={fetchDrugs}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-sm hover:bg-white/15 transition disabled:opacity-50"
              >
                <FaSyncAlt
                  className={loading ? "animate-spin" : ""}
                />

                Refresh
              </button>

              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition"
              >
                <FaPlus />

                Add Drug
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          <StatCard
            title="Total Drugs"
            value={drugs.length}
            subtitle="Inventory items"
            icon={FaPills}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Low Stock"
            value={lowStockCount}
            subtitle="Need restocking"
            icon={FaExclamationTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <StatCard
            title="Categories"
            value={totalCategories}
            subtitle="Medicine groups"
            icon={FaCrown}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />

          <StatCard
            title="Inventory Value"
            value={`KES ${formatPrice(inventoryValue)}`}
            subtitle="Current stock value"
            icon={FaMoneyBillWave}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="h-12 flex items-center rounded-xl border border-gray-200 bg-[#F8FAF9] px-3 sm:px-4 focus-within:border-[#C6A24A] focus-within:ring-4 focus-within:ring-[#C6A24A]/10 transition">
            <FaSearch className="text-[#C6A24A] text-sm shrink-0" />

            <input
              type="text"
              placeholder="Search drug, category or expiry date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-3 w-full bg-transparent outline-none text-sm text-[#102033] placeholder:text-gray-400 min-w-0"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-gray-400 hover:text-[#C6A24A] transition shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* DIRECTORY HEADER */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                Inventory Overview
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredDrugs.length}{" "}
                {filteredDrugs.length === 1
                  ? "drug"
                  : "drugs"}{" "}
                shown
              </p>
            </div>

            <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                PHARMACY STOCK
              </span>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-20 flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-14 h-14 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
              <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
            </div>

            <p className="text-[#102033] font-semibold mt-4">
              Loading inventory...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching pharmacy stock
            </p>
          </div>
        ) : filteredDrugs.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-16 sm:py-20 px-5 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaPills className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Drugs Found
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md">
              {search
                ? "No medicines match your current search."
                : "No pharmacy inventory records are available."}
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">
              {filteredDrugs.map((drug) => (
                <DrugMobileCard
                  key={drug.id}
                  drug={drug}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* DESKTOP / TABLET */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px]">
                  <thead>
                    <tr className="bg-[#0A274A]">
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Drug
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Quantity
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Expiry Date
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredDrugs.map((drug) => {
                      const isLowStock =
                        Number(drug.quantity) <= 10;

                      return (
                        <tr
                          key={drug.id}
                          className="hover:bg-[#FCFBF6] transition"
                        >
                          {/* DRUG */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-[#123B70]/10 border border-[#C6A24A]/25 flex items-center justify-center shrink-0">
                                <FaPills className="text-[#123B70]" />
                              </div>

                              <div>
                                <p className="font-bold text-[#102033]">
                                  {drug.name || "Unnamed Drug"}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  Pharmacy Item
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E8D58C]/20 text-[#8B6A22] text-xs font-semibold">
                              <FaTags className="text-[#C6A24A]" />

                              {drug.category || "General"}
                            </span>
                          </td>

                          {/* PRICE */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-[#123B70]">
                              KES {formatPrice(drug.price)}
                            </span>
                          </td>

                          {/* QUANTITY */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaBoxes className="text-[#08764F] text-xs" />

                              <span className="font-semibold">
                                {drug.quantity ?? 0}
                              </span>
                            </div>
                          </td>

                          {/* EXPIRY */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCalendarAlt className="text-[#C6A24A] text-xs" />

                              <span>
                                {drug.expiry_date ||
                                  "Not available"}
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                                <FaExclamationTriangle className="text-[10px]" />

                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-xs font-bold">
                                <FaCheckCircle className="text-[10px]" />

                                In Stock
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-[#123B70]/10 text-[#123B70] flex items-center justify-center hover:bg-[#123B70] hover:text-white transition"
                                title="Edit drug"
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                                title="Delete drug"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GOLD NOTICE */}
        {!loading && drugs.length > 0 && (
          <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaPills className="text-[#C6A24A]" />
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-[#8B6A22]">
                VitaCura Pharmacy Inventory
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-5">
                Monitor stock quantities and expiry dates regularly to
                reduce shortages and ensure medicines remain safe for
                dispensing.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function DrugMobileCard({
  drug,
  formatPrice,
}) {
  const isLowStock =
    Number(drug.quantity) <= 10;

  return (
    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-[22px] shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
      {/* GOLD TOP BORDER */}
      <div className="h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />

      <div className="p-4">
        {/* TOP */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#123B70]/10 border border-[#C6A24A]/30 flex items-center justify-center shrink-0">
            <FaPills className="text-[#123B70] text-lg" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-[#102033] truncate">
              {drug.name || "Unnamed Drug"}
            </p>

            <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-[#E8D58C]/20 border border-[#C6A24A]/20 text-[#8B6A22] text-[10px] font-bold">
              <FaTags />

              {drug.category || "General"}
            </span>
          </div>

          {isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold shrink-0">
              <FaExclamationTriangle />

              Low
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-[10px] font-bold shrink-0">
              <FaCheckCircle />

              Stock
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          {/* PRICE */}
          <div className="rounded-xl bg-[#123B70]/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
              Price
            </p>

            <p className="text-sm font-extrabold text-[#123B70] mt-1">
              KES {formatPrice(drug.price)}
            </p>
          </div>

          {/* QUANTITY */}
          <div
            className={`rounded-xl p-3 ${
              isLowStock
                ? "bg-red-50"
                : "bg-[#08764F]/5"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
              Quantity
            </p>

            <p
              className={`text-sm font-extrabold mt-1 ${
                isLowStock
                  ? "text-red-600"
                  : "text-[#08764F]"
              }`}
            >
              {drug.quantity ?? 0}
            </p>
          </div>
        </div>

        {/* EXPIRY */}
        <div className="flex items-center gap-3 bg-[#E8D58C]/15 rounded-xl p-3 mt-3">
          <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
            <FaCalendarAlt className="text-[#C6A24A] text-sm" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
              Expiry Date
            </p>

            <p className="text-sm font-semibold text-[#102033] mt-0.5">
              {drug.expiry_date ||
                "Not available"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B70] text-white text-sm font-bold hover:bg-[#0A274A] transition"
          >
            <FaEdit />

            Edit
          </button>

          <button
            type="button"
            className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold hover:bg-red-100 transition"
          >
            <FaTrash />

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  gold = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] ${
        gold
          ? "bg-gradient-to-br from-white to-[#FFFDF6] border border-[#C6A24A]/25"
          : "bg-white border border-gray-200"
      }`}
    >
      {gold && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`text-xs sm:text-sm font-medium ${
              gold
                ? "text-[#8B6A22]"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h2 className="text-xl sm:text-3xl font-extrabold text-[#102033] mt-1 sm:mt-2 break-words">
            {value}
          </h2>

          <p className="hidden sm:block text-xs text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon
            className={`${iconColor} text-lg sm:text-xl`}
          />
        </div>
      </div>
    </div>
  );
}