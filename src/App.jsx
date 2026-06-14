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
    
      </Routes>

    </BrowserRouter>
  );
}

export default App;