import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash/Splash";
import Onboarding from "./pages/Onboarding/Onboarding";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import CreatePassword from "./pages/CreatePassword/CreatePassword";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";
import Profile from "./pages/Profile/Profile";
import DashboardPage from "./pages/Dashboard/Dashboard";
import CandidateProfile from "./pages/CandidateProfile/CandidateProfile";
import Requests from "./pages/Requests/Requests";
import Settings from "./pages/Settings/Settings";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import SocialCallback from "./pages/SocialCallback/SocialCallback";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<SocialCallback />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/company-register" element={<CompanyRegister />} />


      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/candidate-profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
