import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

import {
  FaFileMedical,
  FaSearch,
  FaUser,
  FaUserMd,
  FaEye,
  FaSyncAlt,
  FaNotesMedical,
  FaCrown,
  FaCalendarAlt,
} from "react-icons/fa";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medical_records/");

      setRecords(response.data.records || []);
    } catch (error) {
      console.log("Fetch medical records error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter((record) => {
      return (
        record?.patient_name
          ?.toLowerCase()
          .includes(query) ||
        record?.doctor_name
          ?.toLowerCase()
          .includes(query) ||
        record?.diagnosis
          ?.toLowerCase()
          .includes(query) ||
        record?.date
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [records, search]);

  const totalPatients = new Set(
    records
      .map((record) => record.patient_name)
      .filter(Boolean)
  ).size;

  const totalDoctors = new Set(
    records
      .map((record) => record.doctor_name)
      .filter(Boolean)
  ).size;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-6 py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#C6A24A]/10" />
          <div className="absolute bottom-[-60px] left-[35%] w-44 h-44 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center">
                <FaFileMedical className="text-[#E8D58C] text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Medical Records
                </h1>

                <p className="text-white/70 text-sm mt-1">
                  Manage patient diagnoses, prescriptions and clinical notes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={fetchRecords}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-sm hover:bg-white/15 transition disabled:opacity-50"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition shadow-lg"
              >
                <FaNotesMedical />
                Add Record
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total Records"
            value={records.length}
            subtitle="Clinical records stored"
            icon={FaFileMedical}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Patients"
            value={totalPatients}
            subtitle="Patients with records"
            icon={FaUser}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />

          <StatCard
            title="Doctors"
            value={totalDoctors}
            subtitle="Contributing clinicians"
            icon={FaCrown}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="h-12 flex items-center rounded-xl border border-gray-200 bg-[#F8FAF9] px-4 focus-within:border-[#C6A24A] focus-within:ring-4 focus-within:ring-[#C6A24A]/10 transition">
            <FaSearch className="text-[#C6A24A] text-sm shrink-0" />

            <input
              type="text"
              placeholder="Search patient, doctor, diagnosis or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-3 w-full bg-transparent outline-none text-sm text-[#102033] placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-gray-400 hover:text-[#C6A24A] transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#102033]">
                Clinical Records
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1
                  ? "record"
                  : "records"}{" "}
                shown
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                SECURE RECORDS
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
                <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
              </div>

              <p className="text-[#102033] font-semibold mt-4">
                Loading medical records...
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Fetching clinical information
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
                <FaFileMedical className="text-[#C6A24A] text-3xl" />
              </div>

              <h3 className="text-lg font-extrabold text-[#102033] mt-5">
                No Medical Records Found
              </h3>

              <p className="text-gray-500 text-sm mt-2 max-w-md">
                {search
                  ? "No records match your current search."
                  : "No medical records are currently available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-[#0A274A]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Doctor
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Diagnosis
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-[#FCFBF6] transition"
                    >
                      {/* PATIENT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#123B70]/10 border border-[#C6A24A]/30 flex items-center justify-center shrink-0">
                            <FaUser className="text-[#123B70] text-sm" />
                          </div>

                          <div>
                            <p className="font-bold text-[#102033]">
                              {record.patient_name || "Unknown Patient"}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Patient Record
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DOCTOR */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#08764F]/10 flex items-center justify-center">
                            <FaUserMd className="text-[#08764F] text-xs" />
                          </div>

                          <span className="text-sm font-medium text-[#102033]">
                            {record.doctor_name || "Not assigned"}
                          </span>
                        </div>
                      </td>

                      {/* DIAGNOSIS */}
                      <td className="px-5 py-4">
                        <div className="max-w-[300px]">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E8D58C]/20 text-[#8B6A22] text-xs font-semibold">
                            <FaNotesMedical className="text-[#C6A24A]" />

                            {record.diagnosis || "No diagnosis"}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendarAlt className="text-[#C6A24A] text-xs" />

                          <span>
                            {record.date || "Date unavailable"}
                          </span>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123B70] text-white text-xs font-bold hover:bg-[#0A274A] transition"
                        >
                          <FaEye />
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* GOLD INFO CARD */}
        {!loading && records.length > 0 && (
          <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaFileMedical className="text-[#C6A24A]" />
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-[#8B6A22]">
                Protected Clinical Information
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-5">
                Medical records contain sensitive healthcare information.
                Ensure access is limited to authorized staff and that
                diagnoses, notes and prescriptions remain accurate.
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
  iconBg,
  iconColor,
  gold = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] ${
        gold
          ? "bg-gradient-to-br from-white to-[#FFFDF6] border border-[#C6A24A]/25"
          : "bg-white border border-gray-200"
      }`}
    >
      {gold && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              gold
                ? "text-[#8B6A22]"
                : "text-gray-500"
            }`}
          >
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
          <Icon className={`${iconColor} text-xl`} />
        </div>
      </div>
    </div>
  );
}