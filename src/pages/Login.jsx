import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaHospitalUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/staff_signin/", {
        email: email.trim(),
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );

      localStorage.setItem(
        "staff",
        JSON.stringify(response.data.staff)
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Sign in failed",
        text:
          error?.response?.data?.message ||
          "Invalid email or password.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#123B70",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-[#0A274A] via-[#123B70] to-[#08764F]">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-24 right-10 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute bottom-[-90px] right-[-50px] w-80 h-80 rounded-full bg-[#C6A24A]/10" />

        <div className="relative z-10 flex flex-col justify-center w-full px-16 xl:px-20">
          {/* Brand icon */}
          <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <FaHospitalUser className="text-4xl text-white" />
          </div>

          <div className="w-14 h-1 rounded-full bg-[#C6A24A] mb-6" />

          <p className="text-[#E8D58C] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            VitaCura Healthcare
          </p>

          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-xl">
            Smarter healthcare management.
          </h1>

          <p className="text-white/75 text-lg leading-8 mt-6 max-w-lg">
            Manage patients, healthcare professionals, appointments,
            medical records, subscriptions and care services from one
            secure platform.
          </p>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <FaShieldAlt className="text-[#E8D58C] text-xl mb-3" />

              <p className="text-white font-semibold text-sm">
                Secure Access
              </p>

              <p className="text-white/60 text-xs mt-1">
                Protected healthcare administration.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <FaHospitalUser className="text-[#E8D58C] text-xl mb-3" />

              <p className="text-white font-semibold text-sm">
                Unified Care
              </p>

              <p className="text-white/60 text-xs mt-1">
                One place for healthcare operations.
              </p>
            </div>
          </div>

          <p className="text-white/40 text-xs mt-12">
            VitaCura Healthcare Management System
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#123B70] to-[#08764F] flex items-center justify-center shadow-lg">
              <FaHospitalUser className="text-white text-2xl" />
            </div>

            <h1 className="text-2xl font-extrabold text-[#123B70] mt-4">
              VitaCura
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Healthcare Management System
            </p>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-[28px] border border-gray-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-7 sm:p-9">
            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#08764F] mb-2">
                    Staff Portal
                  </p>

                  <h2 className="text-3xl font-extrabold text-[#102033]">
                    Welcome Back
                  </h2>
                </div>

                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#C6A24A]/15 items-center justify-center">
                  <FaShieldAlt className="text-[#C6A24A]" />
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-6 mt-3">
                Sign in with your staff account to continue to the
                VitaCura dashboard.
              </p>
            </div>

            <form onSubmit={login} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-[#102033] mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#123B70]" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="w-full h-14 bg-[#F8FAF9] border border-gray-200 rounded-2xl pl-11 pr-4 text-[#102033] placeholder:text-gray-400 outline-none transition focus:border-[#123B70] focus:ring-4 focus:ring-[#123B70]/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#102033]">
                    Password
                  </label>
                </div>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#123B70]" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full h-14 bg-[#F8FAF9] border border-gray-200 rounded-2xl pl-11 pr-12 text-[#102033] placeholder:text-gray-400 outline-none transition focus:border-[#123B70] focus:ring-4 focus:ring-[#123B70]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#123B70] transition"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#123B70] to-[#08764F] hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {loading && (
                  <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                )}

                <span>
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </span>
              </button>
            </form>

            {/* SECURITY NOTE */}
            <div className="mt-7 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3 bg-[#08764F]/5 border border-[#08764F]/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-xl bg-[#08764F]/10 flex items-center justify-center shrink-0">
                  <FaShieldAlt className="text-[#08764F] text-sm" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#102033]">
                    Secure staff access
                  </p>

                  <p className="text-xs text-gray-500 leading-5 mt-1">
                    Only authorized VitaCura staff should use this
                    portal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} VitaCura. Healthcare
            Management System.
          </p>
        </div>
      </div>
    </div>
  );
}