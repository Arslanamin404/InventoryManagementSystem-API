import axiosInstance from "../api/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";

export const VerifyOTP = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, email };
      const response = await axiosInstance.post("/auth/verify-otp", payload);
      console.log(response.data);
      showToast("success", response?.data?.message);
      reset();
      navigate("/login");
    } catch (error) {
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
        <h2 className="text-2xl font-bold">Verify your OTP</h2>
        <p className="text-sm text-gray-500">
          Enter the 6-digit OTP sent to
          <span className="font-bold">{email}</span>
        </p>
      </div>
      <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            readOnly
            value={email}
            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="otp" className="text-sm font-medium leading-none">
              OTP
            </label>
            <Link
              to="/resend-otp"
              state={{ email }}
              className="text-sm text-gray-900 underline-offset-4 hover:underline"
            >
              Resend OTP?
            </Link>
          </div>
          <input
            id="otp"
            type="number"
            placeholder="xxxxxx"
            {...register("otp", {
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "Enter a valid 6 digit otp number",
              },
              maxLength: {
                value: 6,
                message: "Enter a valid 6 digit otp number",
              },
            })}
            className={`flex h-10 w-full rounded-md border ${
              errors.otp
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-white/60"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.otp && (
            <p className="text-red-400 text-xs mt-1">{errors.otp.message}</p>
          )}
        </div>
        <button
          disabled={loading}
          className={`inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {loading ? "Verifying OTP" : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};
