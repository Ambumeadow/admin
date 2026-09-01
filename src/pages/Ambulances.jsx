import { useEffect, useMemo, useState } from "react";

import {
  FaSearch,
  FaAmbulance,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaCheckCircle,
  FaRoute,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

export default function Ambulances() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAmbulances = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/get_all_ambulances/"
      );

      setAmbulances(
        response.data.ambulances || []
      );
    } catch (error) {
      console.log(
        "Fetch ambulances error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return ambulances;
    }

    return ambulances.filter((a) => {
      return (
        a?.plate_number
          ?.toLowerCase()
          .includes(query) ||
        a?.driver_name
          ?.toLowerCase()
          .includes(query) ||
        a?.driver_phone
          ?.toLowerCase()
          .includes(query) ||
        a?.current_location
          ?.toLowerCase()
          .includes(query) ||
        a?.status
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [search, ambulances]);

  const totalAvailable = ambulances.filter(
    (a) =>
      a.status?.toLowerCase() ===
      "available"
  ).length;

  const totalOnTrip = ambulances.filter(
    (a) =>
      a.status?.toLowerCase() ===
      "on_trip"
  ).length;

  const totalOffline = ambulances.filter(
    (a) => {
      const status =
        a.status?.toLowerCase();

      return (
        status !== "available" &&
        status !== "on_trip"
      );
    }
  ).length;

  const getStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return {
          label: "Available",
          icon: FaCheckCircle,
          className:
            "bg-[#08764F]/10 text-[#08764F] border-[#08764F]/15",
        };

      case "on_trip":
        return {
          label: "On Trip",
          icon: FaRoute,
          className:
            "bg-red-50 text-red-600 border-red-100",
        };

      default:
        return {
          label: "Offline",
          icon: FaTimesCircle,
          className:
            "bg-gray-100 text-gray-500 border-gray-200",
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <FaAmbulance className="text-red-600 text-xl" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#102033]">
                  Ambulances
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                  Monitor and manage the
                  emergency ambulance fleet.
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="w-full xl:w-[340px]">
            <div className="h-12 bg-white border border-gray-200 rounded-2xl px-4 flex items-center shadow-[0_4px_14px_rgba(15,23,42,0.04)] focus-within:border-[#123B70] focus-within:ring-4 focus-within:ring-[#123B70]/5 transition">
              <FaSearch className="text-[#123B70] text-sm shrink-0" />

              <input
                type="text"
                placeholder="Search plate, driver, location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="ml-3 w-full bg-transparent outline-none text-sm text-[#102033] placeholder:text-gray-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-[#123B70] text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Ambulances"
            value={ambulances.length}
            subtitle="Fleet vehicles"
            icon={FaAmbulance}
            iconClass="text-[#123B70]"
            iconBg="bg-[#123B70]/10"
          />

          <StatCard
            title="Available"
            value={totalAvailable}
            subtitle="Ready for dispatch"
            icon={FaCheckCircle}
            iconClass="text-[#08764F]"
            iconBg="bg-[#08764F]/10"
          />

          <StatCard
            title="On Trip"
            value={totalOnTrip}
            subtitle="Active emergency trips"
            icon={FaRoute}
            iconClass="text-red-600"
            iconBg="bg-red-50"
          />

          <StatCard
            title="Offline"
            value={totalOffline}
            subtitle="Unavailable vehicles"
            icon={FaTimesCircle}
            iconClass="text-[#C6A24A]"
            iconBg="bg-[#C6A24A]/15"
          />
        </div>

        {/* TABLE CARD */}
        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {/* TABLE HEADER */}
          <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#102033]">
                Fleet Overview
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "ambulance"
                  : "ambulances"}{" "}
                shown
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAmbulances}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#123B70]/10 text-[#123B70] font-semibold text-sm hover:bg-[#123B70]/15 transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {loading ? (
            /* LOADING */
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#123B70]/10 flex items-center justify-center">
                <FaSyncAlt className="text-[#123B70] text-xl animate-spin" />
              </div>

              <p className="text-[#102033] font-semibold mt-4">
                Loading ambulances...
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Fetching fleet information
              </p>
            </div>
          ) : filtered.length === 0 ? (
            /* EMPTY */
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-[24px] bg-red-50 flex items-center justify-center">
                <FaAmbulance className="text-red-500 text-3xl" />
              </div>

              <h3 className="text-lg font-extrabold text-[#102033] mt-5">
                No Ambulances Found
              </h3>

              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                {search
                  ? "No ambulances match your current search."
                  : "No ambulance records are currently available."}
              </p>
            </div>
          ) : (
            /* TABLE */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#F8FAF9] border-b border-gray-200">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Ambulance
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Driver
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a) => {
                    const status =
                      getStatus(a.status);

                    const StatusIcon =
                      status.icon;

                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-[#F8FAF9] transition"
                      >
                        {/* AMBULANCE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                              <FaAmbulance className="text-red-600" />
                            </div>

                            <div>
                              <p className="font-bold text-[#102033]">
                                {a.plate_number ||
                                  "No Plate"}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Emergency Unit
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DRIVER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#123B70]/10 flex items-center justify-center">
                              <FaUser className="text-[#123B70] text-xs" />
                            </div>

                            <span className="text-sm font-medium text-[#102033]">
                              {a.driver_name ||
                                "Not assigned"}
                            </span>
                          </div>
                        </td>

                        {/* PHONE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhoneAlt className="text-[#08764F] text-xs" />

                            <span>
                              {a.driver_phone ||
                                "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* LOCATION */}
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2 max-w-[220px]">
                            <FaMapMarkerAlt className="text-[#C6A24A] text-xs mt-1 shrink-0" />

                            <span className="text-sm text-gray-600">
                              {a.current_location ||
                                "Location unavailable"}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${status.className}`}
                          >
                            <StatusIcon className="text-[10px]" />

                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* INFO NOTE */}
        {!loading &&
          ambulances.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl bg-[#C6A24A]/10 border border-[#C6A24A]/15 p-4">
              <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
                <FaAmbulance className="text-[#C6A24A] text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#102033]">
                  Emergency fleet monitoring
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-5">
                  Keep ambulance availability,
                  driver assignments and current
                  locations updated to support
                  faster emergency response.
                </p>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBg,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-extrabold text-[#102033] mt-2">
            {value}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon
            className={`${iconClass} text-xl`}
          />
        </div>
      </div>
    </div>
  );
}