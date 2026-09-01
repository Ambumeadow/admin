import { useEffect, useMemo, useState } from "react";

import api from "../api/api";

import {
  FaSearch,
  FaUserMd,
  FaHospital,
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaStethoscope,
  FaSyncAlt,
  FaCrown,
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_all_doctors/");

      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.log("Fetch doctors error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      return (
        doctor?.full_name
          ?.toLowerCase()
          .includes(query) ||
        doctor?.email
          ?.toLowerCase()
          .includes(query) ||
        doctor?.specialization
          ?.toLowerCase()
          .includes(query) ||
        doctor?.department
          ?.toLowerCase()
          .includes(query) ||
        doctor?.hospital
          ?.toLowerCase()
          .includes(query) ||
        doctor?.phone_number
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [search, doctors]);

  const availableDoctors = doctors.filter(
    (doctor) =>
      doctor.is_active || doctor.is_available
  ).length;

  const uniqueSpecializations = new Set(
    doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean)
  ).size;

  const uniqueDepartments = new Set(
    doctors
      .map((doctor) => doctor.department)
      .filter(Boolean)
  ).size;

  const getInitials = (name) => {
    if (!name) return "DR";

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
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-6 py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          {/* Decorative Gold */}
          <div className="absolute -top-20 -right-12 w-56 h-56 rounded-full bg-[#C6A24A]/10" />
          <div className="absolute bottom-[-60px] left-[35%] w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center">
                <FaUserMd className="text-[#E8D58C] text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Doctors
                </h1>

                <p className="text-white/70 text-sm mt-1">
                  Manage hospital doctors, departments and specialists.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchDoctors}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />

              Refresh Doctors
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="h-12 flex items-center rounded-xl border border-gray-200 bg-[#F8FAF9] px-4 focus-within:border-[#C6A24A] focus-within:ring-4 focus-within:ring-[#C6A24A]/10 transition">
            <FaSearch className="text-[#C6A24A] text-sm shrink-0" />

            <input
              type="text"
              placeholder="Search doctor, specialization, hospital or department..."
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
                className="text-xs font-semibold text-gray-400 hover:text-[#C6A24A] transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Doctors"
            value={doctors.length}
            subtitle="Registered doctors"
            icon={FaUserMd}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Available Today"
            value={availableDoctors}
            subtitle="Ready for consultation"
            icon={FaCheckCircle}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />

          <StatCard
            title="Specializations"
            value={uniqueSpecializations}
            subtitle="Clinical specialties"
            icon={FaCrown}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />

          <StatCard
            title="Departments"
            value={uniqueDepartments}
            subtitle="Medical departments"
            icon={FaStethoscope}
            iconBg="bg-[#E8D58C]/25"
            iconColor="text-[#8B6A22]"
            gold
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {/* Table Heading */}
          <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#102033]">
                Doctor Directory
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "doctor"
                  : "doctors"}{" "}
                shown
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                MEDICAL STAFF
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
                <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
              </div>

              <p className="text-[#102033] font-semibold mt-4">
                Loading doctors...
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Fetching medical staff information
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 flex items-center justify-center border border-[#C6A24A]/20">
                <FaUserMd className="text-[#C6A24A] text-3xl" />
              </div>

              <h3 className="text-lg font-extrabold text-[#102033] mt-5">
                No Doctors Found
              </h3>

              <p className="text-gray-500 text-sm mt-2 max-w-md">
                {search
                  ? "No doctors match your current search."
                  : "No doctor records are currently available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-[#0A274A]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Doctor
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Hospital
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Specialization
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Department
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#E8D58C]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((doctor) => {
                    const isAvailable =
                      doctor.is_active ||
                      doctor.is_available;

                    return (
                      <tr
                        key={doctor.id}
                        className="hover:bg-[#FCFBF6] transition"
                      >
                        {/* DOCTOR */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#123B70]/10 border-2 border-[#C6A24A] flex items-center justify-center shrink-0">
                              <span className="text-[#123B70] text-sm font-extrabold">
                                {getInitials(
                                  doctor.full_name
                                )}
                              </span>
                            </div>

                            <div>
                              <p className="font-bold text-[#102033]">
                                {doctor.full_name ||
                                  "Unknown Doctor"}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {doctor.email ||
                                  "Email unavailable"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* HOSPITAL */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#123B70]/10 flex items-center justify-center shrink-0">
                              <FaHospital className="text-[#123B70] text-xs" />
                            </div>

                            <span className="text-sm text-gray-600">
                              {doctor.hospital ||
                                "Not assigned"}
                            </span>
                          </div>
                        </td>

                        {/* SPECIALIZATION */}
                        <td className="px-5 py-4">
                          {doctor.specialization ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 text-[#8B6A22] text-xs font-bold">
                              <FaCrown className="text-[#C6A24A] text-[10px]" />

                              {doctor.specialization}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Not specified
                            </span>
                          )}
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E8D58C]/20 text-[#8B6A22] text-xs font-semibold">
                            <FaStethoscope className="text-[#C6A24A]" />

                            {doctor.department ||
                              "General"}
                          </div>
                        </td>

                        {/* PHONE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhoneAlt className="text-[#08764F] text-xs" />

                            <span>
                              {doctor.phone_number ||
                                "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-xs font-bold">
                              <FaCheckCircle className="text-[10px]" />

                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                              <FaTimesCircle className="text-[10px]" />

                              Busy
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* GOLD INFORMATION CARD */}
        {!loading && doctors.length > 0 && (
          <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaCrown className="text-[#C6A24A]" />
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-[#8B6A22]">
                VitaCura Medical Team
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-5">
                Keep doctor availability, specialization and
                department information accurate so patients can be
                matched to the right healthcare professional.
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
          <Icon
            className={`${iconColor} text-xl`}
          />
        </div>
      </div>
    </div>
  );
}