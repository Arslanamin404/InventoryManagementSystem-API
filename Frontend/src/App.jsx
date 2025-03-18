import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { Layout } from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerifyOTP } from "./components/VerifyOTP";
import { ResendOTP } from "./components/ResendOTP";
import { ResetPassword } from "./components/ResetPassword";
import { VerifyResetPassword } from "./components/VerifyResetPassword";
import { Profile } from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { PageNotFound } from "./components/PageNotFound";

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="resend-otp" element={<ResendOTP />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            path="verify-reset-password"
            element={<VerifyResetPassword />}
          />
          <Route path="login" element={<Login />} />
          <Route path="inventory" element={<Inventory />} />

          {/* protected */}
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* catch all other routes */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};
