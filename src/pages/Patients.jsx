import { useEffect, useMemo, useState } from "react";

import api from "../api/api";

import {
  FaSearch,
  FaUserInjured,
  FaTint,
  FaBed,
  FaPills,
  FaPhoneAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSyncAlt,
  FaCrown,
  FaVenusMars,
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/patients/");

      setPatients(response.data.patients || []);
    } catch (error) {
      console.log("Fetch patients error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        patient?.full_name
          ?.toLowerCase()
          .includes(query) ||
        patient?.user_email
          ?.toLowerCase()
          .includes(query) ||
        patient?.ward
          ?.toLowerCase()
          .includes(query) ||
        patient?.blood_group
          ?.toLowerCase()
          .includes(query) ||
        patient?.gender
          ?.toLowerCase()
          .includes(query) ||
        patient?.emergency_contact
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  const underMedication = patients.filter(
    (patient) => patient.under_medication
  ).length;

  const notUnderMedication = patients.filter(
    (patient) => !patient.under_medication
  ).length;

  const totalWards = new Set(
    patients
      .map((patient) => patient.ward)
      .filter(Boolean)
  ).size;

  const getInitials = (name) => {
    if (!name) return "PT";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[
      parts.length - 1
    ].charAt(0)}`.toUpperCase();
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
                <FaUserInjured className="text-[#E8D58C] text-xl sm:text-2xl" />
              </div>

              <div className="min-w-0">
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Patients
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                  Manage registered patients, wards, medication status
                  and emergency information.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchPatients}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />

              Refresh Patients
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="h-12 flex items-center rounded-xl border border-gray-200 bg-[#F8FAF9] px-3 sm:px-4 focus-within:border-[#C6A24A] focus-within:ring-4 focus-within:ring-[#C6A24A]/10 transition">
            <FaSearch className="text-[#C6A24A] text-sm shrink-0" />

            <input
              type="text"
              placeholder="Search patient, ward or blood group..."
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

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          <StatCard
            title="Total Patients"
            value={patients.length}
            subtitle="Registered patients"
            icon={FaUserInjured}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Under Medication"
            value={underMedication}
            subtitle="Active medication"
            icon={FaPills}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <StatCard
            title="Wards"
            value={totalWards}
            subtitle="Active patient wards"
            icon={FaCrown}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />

          <StatCard
            title="No Medication"
            value={notUnderMedication}
            subtitle="No active medication"
            icon={FaCheckCircle}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />
        </div>

        {/* DIRECTORY HEADER */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                Patient Directory
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "patient"
                  : "patients"}{" "}
                shown
              </p>
            </div>

            <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                PATIENT CARE
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
              Loading patients...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching patient information
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-16 sm:py-20 px-5 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaUserInjured className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Patients Found
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md">
              {search
                ? "No patients match your current search."
                : "No patient records are currently available."}
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">
              {filtered.map((patient) => (
                <PatientMobileCard
                  key={patient.id}
                  patient={patient}
                  initials={getInitials(
                    patient.full_name
                  )}
                />
              ))}
            </div>

            {/* DESKTOP / TABLET TABLE */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="bg-[#0A274A]">
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Gender
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Ward
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Blood Group
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Medication
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                        Emergency Contact
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-[#FCFBF6] transition"
                      >
                        {/* PATIENT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#123B70]/10 border-2 border-[#C6A24A] flex items-center justify-center shrink-0">
                              <span className="text-[#123B70] text-sm font-extrabold">
                                {getInitials(
                                  patient.full_name
                                )}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-[#102033]">
                                {patient.full_name ||
                                  "Unknown Patient"}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {patient.user_email ||
                                  "Email unavailable"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* GENDER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaVenusMars className="text-[#123B70] text-xs" />

                            <span>
                              {patient.gender ||
                                "Not specified"}
                            </span>
                          </div>
                        </td>

                        {/* WARD */}
                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E8D58C]/20 text-[#8B6A22] text-xs font-semibold">
                            <FaBed className="text-[#C6A24A]" />

                            {patient.ward ||
                              "Not assigned"}
                          </div>
                        </td>

                        {/* BLOOD GROUP */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-extrabold">
                            <FaTint className="text-[10px]" />

                            {patient.blood_group ||
                              "Unknown"}
                          </span>
                        </td>

                        {/* MEDICATION */}
                        <td className="px-5 py-4">
                          {patient.under_medication ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                              <FaExclamationCircle className="text-[10px]" />

                              Under Medication
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-xs font-bold">
                              <FaCheckCircle className="text-[10px]" />

                              No Medication
                            </span>
                          )}
                        </td>

                        {/* EMERGENCY */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhoneAlt className="text-red-500 text-xs" />

                            <span>
                              {patient.emergency_contact ||
                                "Not available"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GOLD INFO CARD */}
        {!loading && patients.length > 0 && (
          <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaUserInjured className="text-[#C6A24A]" />
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-[#8B6A22]">
                VitaCura Patient Management
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-5">
                Keep patient contact details, ward assignments, blood
                groups, medication status and emergency information
                accurate to support safe and coordinated healthcare.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PatientMobileCard({
  patient,
  initials,
}) {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-[22px] shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
      <div className="h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />

      <div className="p-4">
        {/* TOP */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#123B70]/10 border-2 border-[#C6A24A] flex items-center justify-center shrink-0">
            <span className="text-[#123B70] text-sm font-extrabold">
              {initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-[#102033] truncate">
              {patient.full_name ||
                "Unknown Patient"}
            </p>

            <p className="text-xs text-gray-400 mt-1 truncate">
              {patient.user_email ||
                "Email unavailable"}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-extrabold shrink-0">
            <FaTint />
            {patient.blood_group || "--"}
          </span>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 gap-3 mt-4 pt-4 border-t border-gray-100">
          {/* Gender */}
          <div className="flex items-center gap-3 bg-[#123B70]/5 rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-[#123B70]/10 flex items-center justify-center shrink-0">
              <FaVenusMars className="text-[#123B70] text-sm" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                Gender
              </p>

              <p className="text-sm font-semibold text-[#102033] mt-0.5">
                {patient.gender ||
                  "Not specified"}
              </p>
            </div>
          </div>

          {/* Ward */}
          <div className="flex items-center gap-3 bg-[#E8D58C]/15 rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
              <FaBed className="text-[#C6A24A] text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                Ward
              </p>

              <p className="text-sm font-semibold text-[#102033] mt-0.5 truncate">
                {patient.ward ||
                  "Not assigned"}
              </p>
            </div>
          </div>

          {/* Medication */}
          <div
            className={`flex items-center gap-3 rounded-xl p-3 ${
              patient.under_medication
                ? "bg-red-50"
                : "bg-[#08764F]/5"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                patient.under_medication
                  ? "bg-red-100"
                  : "bg-[#08764F]/10"
              }`}
            >
              <FaPills
                className={
                  patient.under_medication
                    ? "text-red-600 text-sm"
                    : "text-[#08764F] text-sm"
                }
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                Medication
              </p>

              <p
                className={`text-sm font-semibold mt-0.5 ${
                  patient.under_medication
                    ? "text-red-600"
                    : "text-[#08764F]"
                }`}
              >
                {patient.under_medication
                  ? "Under Medication"
                  : "No Medication"}
              </p>
            </div>
          </div>

          {/* Emergency */}
          <div className="flex items-center gap-3 bg-red-50/60 rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <FaPhoneAlt className="text-red-600 text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                Emergency Contact
              </p>

              <p className="text-sm font-semibold text-[#102033] mt-0.5">
                {patient.emergency_contact ||
                  "Not available"}
              </p>
            </div>
          </div>
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
        <div>
          <p
            className={`text-xs sm:text-sm font-medium ${
              gold
                ? "text-[#8B6A22]"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102033] mt-1 sm:mt-2">
            {value}
          </h2>

          <p className="hidden sm:block text-xs text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon
            className={`${iconColor} text-lg sm:text-xl`}
          />
        </div>
      </div>
    </div>
  );
}