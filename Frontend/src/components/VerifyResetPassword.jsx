import axiosInstance from "../api/api";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";
import { useForm } from "react-hook-form";

export const VerifyResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const email = location?.state?.email;

  const handleOtpSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/verify-reset-password-otp",
        {
          ...data,
          email,
        }
      );
      showToast("success", response?.data?.message);
      reset();
      navigate("/login");
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
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        <p className="text-sm text-gray-500">
          Create a new password to secure your account
        </p>
      </div>
      <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            value={email}
            readOnly
            className={`flex h-10 w-full rounded-md border  border-gray-300 
             bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium leading-none">
            OTP
          </label>
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
        <div className="space-y-2">
          <label
            htmlFor="new_password"
            className="text-sm font-medium leading-none"
          >
            New Password
          </label>
          <input
            id="new_password"
            type="password"
            {...register("new_password", {
              required: "Password is required",
              minLength: {
                value: 7,
                message: "At least 7 characters required",
              },
            })}
            className={`flex h-10 w-full rounded-md border ${
              errors.new_password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-400"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
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
          {loading ? "Resetting Password ..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};
