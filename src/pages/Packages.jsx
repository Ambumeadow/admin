import { useEffect, useState } from "react";
import api from "../api/api";
import { FaCrown, FaCheck } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/packages/");

      setPackages(response.data.packages);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Subscribe to package
  const subscribePackage = async (packageId) => {
    try {
      setSubscribing(packageId);

      const response = await api.post("/subscribe_package/", {
        package_id: packageId,
      });

      alert(response.data.message || "Subscribed successfully");

    } catch (error) {
      console.log(error);
      alert("Subscription failed");

    } finally {
      setSubscribing(null);
    }
  };

  return (
    <DashboardLayout>
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Subscription Packages
        </h1>

        <p className="text-gray-500">
          Choose a healthcare plan that suits you
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">
          Loading packages...
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
            >

              {/* Header */}
              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-800">
                  {pkg.name}
                </h2>

                <FaCrown className="text-yellow-500 text-xl" />

              </div>

              {/* Price */}
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-teal-600">
                  KES {pkg.price}
                </h3>

                <p className="text-gray-500 text-sm">
                  per month
                </p>
              </div>

              {/* Features */}
              <div className="mt-5 space-y-2">

                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>{pkg.maximum_members} Members</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>{pkg.no_of_consultations} Consultations</span>
                </div>

                {pkg.access_telemedicine && (
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Telemedicine Access</span>
                  </div>
                )}

                {pkg.book_ambulance && (
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Ambulance Booking</span>
                  </div>
                )}

                {pkg.book_care_appointment && (
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Care Appointments</span>
                  </div>
                )}

              </div>

              {/* Button */}
              <button
                onClick={() => subscribePackage(pkg.id)}
                disabled={subscribing === pkg.id}
                className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
              >
                {subscribing === pkg.id
                  ? "Subscribing..."
                  : "Subscribe"}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
    </DashboardLayout>
  );
}