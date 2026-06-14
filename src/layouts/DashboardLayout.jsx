import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// 1. Accept the children prop here
export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar />

        {/* 2. Replace <Outlet /> with {children} */}
        <main className="mt-6">
          {children}
        </main>
      </div>
    </div>
  );
}