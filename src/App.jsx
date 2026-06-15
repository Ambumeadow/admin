import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Nurses from "./pages/Nurses";
import Ambulances from "./pages/Ambulances";
import Packages from "./pages/Packages";
import Subscription from "./pages/Subscriptions";
import Settings from "./pages/Settings";
import Appointments from "./pages/Appointments";
import MyAppointments from "./pages/MyAppointments";
import Notifications from "./pages/Notifications";
import MedicalRecords from "./pages/MedicalRecords";
import Pharmacy from "./pages/Pharmacy";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/nurses" element={<Nurses />} />
        <Route path="/ambulances" element={<Ambulances />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/pharmacy" element={<Pharmacy />} />

    
      </Routes>

    </BrowserRouter>
  );
}

export default App;