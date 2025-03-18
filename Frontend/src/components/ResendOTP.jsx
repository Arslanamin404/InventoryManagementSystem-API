import axiosInstance from "../api/api";
import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";

export const ResendOTP = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/resend-otp", { email });
      showToast("success", response?.data?.message);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.error(error.response?.data);
      if (Array.isArray(error.response?.data?.errors)) {
        const errorMessages = error.response.data.errors[0].msg;
        showToast("error", errorMessages);
      } else {
        showToast(
          "error",
          error.response?.data?.message || "An error occurred"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-gray-100 border border-gray-200/40 p-6 rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Resend OTP</h2>
        <p className="text-sm text-gray-500">
          We will resend a new OTP to your registered email
          <span className="font-bold ml-1">{email}</span>
        </p>
      </div>
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            readOnly
            value={email}
            disabled
            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
        </div>
        <button
          disabled={loading}
          className={`inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {loading ? "Sending OTP ..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};
