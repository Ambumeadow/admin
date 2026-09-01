import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaAmbulance,
  FaCrown,
  FaCogs,
  FaCalendarCheck,
  FaPills,
  FaShieldAlt,
  FaHeartbeat,
} from "react-icons/fa";

export default function Sidebar() {
  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: FaHome,
        },
      ],
    },

    {
      title: "Healthcare",
      items: [
        {
          label: "Patients",
          path: "/patients",
          icon: FaUsers,
        },
        {
          label: "Doctors",
          path: "/doctors",
          icon: FaUserMd,
        },
        {
          label: "Nurses",
          path: "/nurses",
          icon: FaUserMd,
        },
        {
          label: "Medical Records",
          path: "/medical-records",
          icon: FaClipboardList,
        },
      ],
    },

    {
      title: "Services",
      items: [
        {
          label: "Ambulances",
          path: "/ambulances",
          icon: FaAmbulance,
        },
        {
          label: "Appointments",
          path: "/appointments",
          icon: FaCalendarCheck,
        },
        {
          label: "My Appointments",
          path: "/my-appointments",
          icon: FaCalendarCheck,
        },
        {
          label: "Pharmacy",
          path: "/pharmacy",
          icon: FaPills,
        },
      ],
    },

    {
      title: "Membership",
      items: [
        {
          label: "Packages",
          path: "/packages",
          icon: FaCrown,
        },
        {
          label: "Subscriptions",
          path: "/subscriptions",
          icon: FaShieldAlt,
        },
      ],
    },

    {
      title: "System",
      items: [
        {
          label: "Settings",
          path: "/settings",
          icon: FaCogs,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-[#0A274A] via-[#123B70] to-[#08764F] text-white flex flex-col shadow-xl">
      {/* BRAND */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Brand Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-sm">
            <FaHeartbeat className="text-[#E8D58C] text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              VitaCura
            </h1>

            <p className="text-[11px] text-white/60 mt-0.5">
              Healthcare Management
            </p>
          </div>
        </div>

        {/* Gold Accent */}
        <div className="w-12 h-1 rounded-full bg-[#C6A24A] mt-5" />
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div
            key={section.title}
            className="mb-6"
          >
            {/* Section Title */}
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-bold px-3 mb-2">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      group relative
                      flex items-center gap-3
                      px-3 py-3
                      rounded-xl
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-white text-[#123B70] shadow-lg"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute left-0 w-1 h-7 rounded-r-full bg-[#C6A24A]" />
                        )}

                        {/* Icon Container */}
                        <div
                          className={`
                            w-9 h-9
                            rounded-xl
                            flex items-center justify-center
                            transition

                            ${
                              isActive
                                ? "bg-[#123B70]/10"
                                : "bg-white/10 group-hover:bg-white/15"
                            }
                          `}
                        >
                          <Icon
                            className={`text-base ${
                              isActive
                                ? "text-[#123B70]"
                                : "text-white/80"
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className={`text-sm flex-1 ${
                            isActive
                              ? "font-bold"
                              : "font-medium"
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Active Gold Dot */}
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-[#C6A24A]" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM STATUS */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C6A24A]/20 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-[#E8D58C] text-sm" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Secure Portal
              </p>

              <p className="text-[11px] text-white/55 leading-4 mt-1">
                Authorized VitaCura staff access only.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-white/30 text-center mt-4">
          VitaCura Healthcare
        </p>
      </div>
    </aside>
  );
}