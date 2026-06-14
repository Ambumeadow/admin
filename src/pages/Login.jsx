import { useState } from "react";
import { FaEye, FaEyeSlash, FaHospitalUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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

      const response = await api.post("/login/", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-700 items-center justify-center p-12">

        <div className="text-center text-white">

          <FaHospitalUser className="text-8xl mx-auto mb-6" />

          <h1 className="text-5xl font-bold mb-4">
            Vitacura
          </h1>

          <p className="text-xl text-teal-100">
            Healthcare Management System
          </p>

          <p className="mt-6 text-teal-200">
            Manage patients, doctors,
            nurses, appointments and
            medical records from one place.
          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-slate-100 px-6">

        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

          <div className="text-center mb-8">

            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHospitalUser className="text-white text-2xl" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Sign In
            </h2>

            <p className="text-gray-500 mt-2">
              Login to your account
            </p>

          </div>

          <form
            onSubmit={login}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

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
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-4 text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}