import { useEffect, useState } from "react";

import {
  FaCrown,
  FaCheck,
  FaUsers,
  FaStethoscope,
  FaVideo,
  FaAmbulance,
  FaCalendarCheck,
  FaSyncAlt,
  FaTrash,
  FaEdit,
  FaShieldAlt,
} from "react-icons/fa";

import Swal from "sweetalert2";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_packages/");

      setPackages(response.data.packages || []);
    } catch (error) {
      console.log("Fetch packages error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const deletePackage = async (id, packageName) => {
    const result = await Swal.fire({
      title: "Delete Package?",
      text: `Are you sure you want to delete ${packageName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#D92D20",
      cancelButtonColor: "#123B70",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(`/delete_package/${id}/`);

      setPackages((prev) =>
        prev.filter((pkg) => pkg.id !== id)
      );

      Swal.fire({
        title: "Deleted",
        text: "The package has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#08764F",
      });
    } catch (error) {
      console.log("Delete package error:", error);

      Swal.fire({
        title: "Delete Failed",
        text:
          error?.response?.data?.message ||
          "Unable to delete this package.",
        icon: "error",
        confirmButtonColor: "#123B70",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return price;
    }

    return value.toLocaleString("en-KE");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-[#0A274A] via-[#123B70] to-[#08764F] px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 text-white shadow-[0_14px_35px_rgba(18,59,112,0.16)]">
          <div className="absolute -top-16 -right-16 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-[#C6A24A]/10" />

          <div className="absolute bottom-[-60px] left-[35%] w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center shrink-0">
                <FaCrown className="text-[#E8D58C] text-xl sm:text-2xl" />
              </div>

              <div>
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Subscription Packages
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                  Manage healthcare plans, benefits and membership
                  options.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchPackages}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />

              Refresh Packages
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Packages"
              value={packages.length}
              subtitle="Available healthcare plans"
              icon={FaShieldAlt}
              iconBg="bg-[#123B70]/10"
              iconColor="text-[#123B70]"
            />

            <SummaryCard
              title="Telemedicine Plans"
              value={
                packages.filter(
                  (pkg) => pkg.access_telemedicine
                ).length
              }
              subtitle="Virtual care included"
              icon={FaVideo}
              iconBg="bg-[#08764F]/10"
              iconColor="text-[#08764F]"
            />

            <SummaryCard
              title="Premium Benefits"
              value={
                packages.filter(
                  (pkg) =>
                    pkg.book_ambulance ||
                    pkg.book_care_appointment
                ).length
              }
              subtitle="Enhanced care packages"
              icon={FaCrown}
              iconBg="bg-[#C6A24A]/15"
              iconColor="text-[#C6A24A]"
              gold
            />
          </div>
        )}

        {/* SECTION HEADING */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                Available Healthcare Plans
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {packages.length}{" "}
                {packages.length === 1
                  ? "package"
                  : "packages"}{" "}
                configured.
              </p>
            </div>

            <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/20 px-3 py-1.5">
              <FaCrown className="text-[#C6A24A] text-xs" />

              <span className="text-[10px] font-extrabold tracking-wide text-[#8B6A22]">
                MEMBER PLANS
              </span>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-20 flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A24A]/15 flex items-center justify-center">
              <FaSyncAlt className="text-[#C6A24A] text-xl animate-spin" />
            </div>

            <p className="text-[#102033] font-semibold mt-4">
              Loading packages...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching healthcare subscription plans
            </p>
          </div>
        ) : packages.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-16 sm:py-20 px-5 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaCrown className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Packages Available
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md leading-6">
              Healthcare subscription packages will appear here once
              they are configured.
            </p>
          </div>
        ) : (
          /* PACKAGE CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {packages.map((pkg, index) => {
              const isDeleting =
                deletingId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className="relative overflow-hidden bg-white rounded-[22px] sm:rounded-[24px] border border-gray-200 shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-200"
                >
                  {/* GOLD TOP BORDER */}
                  <div className="h-1.5 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />

                  <div className="p-5 sm:p-6">
                    {/* CARD HEADER */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
                          <FaCrown className="text-[#C6A24A] text-xl" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                            {pkg.name || "Healthcare Plan"}
                          </h2>

                          {pkg.category && (
                            <span className="inline-flex mt-2 px-2.5 py-1 rounded-full bg-[#E8D58C]/20 border border-[#C6A24A]/20 text-[#8B6A22] text-[10px] font-extrabold uppercase tracking-wide">
                              {pkg.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-[#08764F]/10 flex items-center justify-center shrink-0">
                        <FaCheck className="text-[#08764F] text-xs" />
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="mt-6 pb-5 border-b border-gray-100">
                      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                        Monthly Price
                      </p>

                      <div className="flex items-end flex-wrap gap-2 mt-2">
                        <span className="text-sm font-bold text-[#8B6A22] mb-1">
                          KES
                        </span>

                        <span className="text-3xl sm:text-4xl font-extrabold text-[#123B70]">
                          {formatPrice(pkg.price)}
                        </span>

                        <span className="text-xs text-gray-400 mb-1.5">
                          / month
                        </span>
                      </div>
                    </div>

                    {/* FEATURES */}
                    <div className="mt-5">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#8B6A22] mb-4">
                        Included Benefits
                      </p>

                      <div className="space-y-3">
                        <FeatureRow
                          icon={FaUsers}
                          text={`${pkg.maximum_members ?? 0} ${
                            Number(pkg.maximum_members) === 1
                              ? "Member"
                              : "Members"
                          }`}
                          color="#123B70"
                          background="rgba(18,59,112,0.10)"
                        />

                        <FeatureRow
                          icon={FaStethoscope}
                          text={`${pkg.no_of_consultations ?? 0} ${
                            Number(
                              pkg.no_of_consultations
                            ) === 1
                              ? "Consultation"
                              : "Consultations"
                          }`}
                          color="#08764F"
                          background="rgba(8,118,79,0.10)"
                        />

                        {pkg.access_telemedicine && (
                          <FeatureRow
                            icon={FaVideo}
                            text="Telemedicine Access"
                            color="#C6A24A"
                            background="rgba(198,162,74,0.15)"
                          />
                        )}

                        {pkg.book_ambulance && (
                          <FeatureRow
                            icon={FaAmbulance}
                            text="Ambulance Booking"
                            color="#D92D20"
                            background="rgba(217,45,32,0.08)"
                          />
                        )}

                        {pkg.book_care_appointment && (
                          <FeatureRow
                            icon={FaCalendarCheck}
                            text="Care Appointments"
                            color="#8B6A22"
                            background="rgba(232,213,140,0.22)"
                          />
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <button
                        type="button"
                        className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B70] text-white text-sm font-bold hover:bg-[#0A274A] transition"
                      >
                        <FaEdit />

                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          deletePackage(
                            pkg.id,
                            pkg.name || "this package"
                          )
                        }
                        className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <FaSyncAlt className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}

                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GOLD FOOTER CARD */}
        {!loading && packages.length > 0 && (
          <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-[#C6A24A]" />
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-[#8B6A22]">
                VitaCura Membership Plans
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-5">
                Keep package prices, consultation limits and included
                healthcare services accurate so members clearly
                understand the benefits available under each plan.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function FeatureRow({
  icon: Icon,
  text,
  color,
  background,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          color,
          backgroundColor: background,
        }}
      >
        <Icon className="text-sm" />
      </div>

      <span className="flex-1 text-sm text-[#102033] font-medium">
        {text}
      </span>

      <div className="w-6 h-6 rounded-full bg-[#08764F]/10 flex items-center justify-center">
        <FaCheck className="text-[#08764F] text-[9px]" />
      </div>
    </div>
  );
}

function SummaryCard({
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

      <div className="flex items-start justify-between gap-3">
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

          <p className="text-xs text-gray-400 mt-2">
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