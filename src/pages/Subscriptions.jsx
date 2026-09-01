import { useEffect, useMemo, useState } from "react";

import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FaCrown,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaBox,
  FaSearch,
  FaSyncAlt,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/admin/subscriptions/"
      );

      setSubscriptions(
        response.data.subscriptions || []
      );
    } catch (error) {
      console.log(
        "Fetch subscriptions error:",
        error
      );

      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return subscriptions;
    }

    return subscriptions.filter((sub) => {
      return (
        sub.user?.name
          ?.toLowerCase()
          .includes(query) ||
        sub.user?.email
          ?.toLowerCase()
          .includes(query) ||
        sub.package?.name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [subscriptions, search]);

  const stats = useMemo(() => {
    const active = subscriptions.filter(
      (sub) => sub.is_active
    ).length;

    const expired = subscriptions.filter(
      (sub) => !sub.is_active
    ).length;

    return {
      total: subscriptions.length,
      active,
      expired,
    };
  }, [subscriptions]);

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) {
      return "US";
    }

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
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

          <div className="absolute bottom-[-60px] left-[35%] w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-[#E8D58C]/40 flex items-center justify-center shrink-0">
                <FaCrown className="text-[#E8D58C] text-xl sm:text-2xl" />
              </div>

              <div className="min-w-0">
                <div className="w-12 h-1 rounded-full bg-[#C6A24A] mb-3" />

                <h1 className="text-2xl md:text-3xl font-extrabold">
                  All Subscriptions
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
                  Monitor user healthcare memberships, active plans
                  and subscription periods.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchSubscriptions}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C6A24A] text-[#0A274A] font-bold text-sm hover:bg-[#E8D58C] transition disabled:opacity-50"
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
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="h-12 flex items-center rounded-xl border border-gray-200 bg-[#F8FAF9] px-3 sm:px-4 focus-within:border-[#C6A24A] focus-within:ring-4 focus-within:ring-[#C6A24A]/10 transition">
            <FaSearch className="text-[#C6A24A] text-sm shrink-0" />

            <input
              type="text"
              placeholder="Search user, email or package..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="ml-3 w-full bg-transparent outline-none text-sm text-[#102033] placeholder:text-gray-400 min-w-0"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-xs font-semibold text-gray-400 hover:text-[#C6A24A] transition shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="Total Subscriptions"
            value={stats.total}
            subtitle="All memberships"
            icon={FaShieldAlt}
            iconBg="bg-[#123B70]/10"
            iconColor="text-[#123B70]"
          />

          <StatCard
            title="Active"
            value={stats.active}
            subtitle="Current memberships"
            icon={FaCheckCircle}
            iconBg="bg-[#08764F]/10"
            iconColor="text-[#08764F]"
          />

          <StatCard
            title="Expired"
            value={stats.expired}
            subtitle="Inactive memberships"
            icon={FaCrown}
            iconBg="bg-[#C6A24A]/15"
            iconColor="text-[#C6A24A]"
            gold
          />
        </div>

        {/* SECTION HEADER */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102033]">
                Membership Directory
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "subscription"
                  : "subscriptions"}{" "}
                shown
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
              Loading subscriptions...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Fetching membership information
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-[22px] sm:rounded-[24px] py-16 sm:py-20 px-5 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <div className="w-20 h-20 rounded-[24px] bg-[#C6A24A]/15 border border-[#C6A24A]/20 flex items-center justify-center">
              <FaCrown className="text-[#C6A24A] text-3xl" />
            </div>

            <h3 className="text-lg font-extrabold text-[#102033] mt-5">
              No Subscriptions Found
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-md leading-6">
              {search
                ? "No subscriptions match your current search."
                : "No user subscriptions are currently available."}
            </p>
          </div>
        ) : (
          /* SUBSCRIPTION CARDS */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {filtered.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                sub={sub}
                formatDate={formatDate}
                initials={getInitials(
                  sub.user?.name
                )}
              />
            ))}
          </div>
        )}

        {/* GOLD FOOTER */}
        {!loading &&
          subscriptions.length > 0 && (
            <div className="relative overflow-hidden flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#C6A24A]/15 to-[#E8D58C]/20 border border-[#C6A24A]/25 p-4">
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A24A]/10" />

              <div className="relative z-10 w-10 h-10 rounded-xl bg-[#C6A24A]/20 border border-[#C6A24A]/20 flex items-center justify-center shrink-0">
                <FaCrown className="text-[#C6A24A]" />
              </div>

              <div className="relative z-10">
                <p className="text-sm font-bold text-[#8B6A22]">
                  VitaCura Membership Management
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-5">
                  Review membership status and expiry dates regularly
                  so users retain the correct access to healthcare
                  benefits and subscription services.
                </p>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

function SubscriptionCard({
  sub,
  formatDate,
  initials,
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-[22px] sm:rounded-[24px] shadow-[0_7px_22px_rgba(15,23,42,0.05)] ${
        sub.is_active
          ? "border border-gray-200"
          : "border border-[#C6A24A]/30"
      }`}
    >
      {/* GOLD TOP ACCENT */}
      <div className="h-1 bg-gradient-to-r from-[#8B6A22] via-[#C6A24A] to-[#E8D58C]" />

      <div className="p-4 sm:p-5">
        {/* USER */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#123B70]/10 border-2 border-[#C6A24A] flex items-center justify-center shrink-0">
            <span className="text-[#123B70] text-sm font-extrabold">
              {initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-[#102033] truncate">
              {sub.user?.name ||
                "Unknown User"}
            </p>

            <p className="text-xs text-gray-400 mt-1 truncate">
              {sub.user?.email ||
                "Email unavailable"}
            </p>
          </div>

          {/* STATUS */}
          {sub.is_active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#08764F]/10 border border-[#08764F]/15 text-[#08764F] text-[10px] sm:text-xs font-bold shrink-0">
              <FaCheckCircle />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-xs font-bold shrink-0">
              <FaTimesCircle />
              Expired
            </span>
          )}
        </div>

        {/* PACKAGE */}
        <div className="mt-5 bg-gradient-to-r from-[#FFFDF6] to-[#F8FAF9] border border-[#C6A24A]/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#C6A24A]/15 flex items-center justify-center shrink-0">
              <FaBox className="text-[#C6A24A]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#8B6A22] font-extrabold">
                Subscription Package
              </p>

              <p className="font-extrabold text-[#102033] mt-1 truncate">
                {sub.package?.name ||
                  "Package unavailable"}
              </p>
            </div>

            <FaCrown className="text-[#C6A24A] text-xl shrink-0" />
          </div>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="bg-[#123B70]/5 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#123B70] text-xs" />

              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                Start Date
              </p>
            </div>

            <p className="text-sm font-bold text-[#102033] mt-2">
              {formatDate(
                sub.start_date
              )}
            </p>
          </div>

          <div className="bg-[#C6A24A]/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <FaClock className="text-[#C6A24A] text-xs" />

              <p className="text-[10px] uppercase tracking-wide text-[#8B6A22] font-bold">
                End Date
              </p>
            </div>

            <p className="text-sm font-bold text-[#102033] mt-2">
              {formatDate(
                sub.end_date
              )}
            </p>
          </div>
        </div>

        {/* MEMBERSHIP STATE */}
        <div
          className={`flex items-start gap-3 rounded-xl p-3 mt-4 ${
            sub.is_active
              ? "bg-[#08764F]/5"
              : "bg-red-50"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              sub.is_active
                ? "bg-[#08764F]/10"
                : "bg-red-100"
            }`}
          >
            {sub.is_active ? (
              <FaShieldAlt className="text-[#08764F] text-sm" />
            ) : (
              <FaTimesCircle className="text-red-600 text-sm" />
            )}
          </div>

          <div>
            <p
              className={`text-xs font-bold ${
                sub.is_active
                  ? "text-[#08764F]"
                  : "text-red-600"
              }`}
            >
              {sub.is_active
                ? "Membership Active"
                : "Membership Expired"}
            </p>

            <p className="text-[11px] text-gray-500 mt-1 leading-4">
              {sub.is_active
                ? "The user currently has access to the benefits included in this plan."
                : "The subscription period has ended and may require renewal."}
            </p>
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