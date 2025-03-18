import axiosInstance from "../api/api";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";
import { useState } from "react";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const email = data?.email;
    try {
      const response = await axiosInstance.post("/auth/register", data);
      // console.log(response.data);
      showToast("success", response.data.message);
      reset();
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
        <h2 className="text-2xl font-bold">Register to your new account</h2>
        <p className="text-sm text-gray-500">
          Fill in the details below to create a new account
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="first_name"
            className="text-sm font-medium leading-none"
          >
            First Name
          </label>
          <input
            id="first_name"
            placeholder="Jhon"
            {...register("first_name", {
              required: "First name is required",
              minLength: {
                value: 5,
                message: "At least 5 characters required",
              },
            })}
            className={`flex h-10 w-full rounded-md border ${
              errors.first_name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-400"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="text"
          />
          {errors.first_name && (
            <p className="text-red-400 text-xs mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="last_name"
            className="text-sm font-medium leading-none"
          >
            Last Name
          </label>
          <input
            id="last_name"
            placeholder="Doe"
            {...register("last_name")}
            className={`flex h-10 w-full rounded-md border
                border-gray-300  bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium leading-none"
          >
            Username
          </label>
          <input
            id="username"
            placeholder="jhondoe123"
            {...register("username", { required: "Username is required" })}
            className={`flex h-10 w-full rounded-md border ${
              errors.username
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-400"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="text"
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phone_number"
            className="text-sm font-medium leading-none"
          >
            Phone Number
          </label>
          <input
            id="phone_number"
            placeholder="9070xxxx46"
            {...register("phone_number", {
              required: "Phone number is required",
              minLength: { value: 10, message: "Invalid phone number" },
              maxLength: { value: 10, message: "Invalid phone number" },
            })}
            className={`flex h-10 w-full rounded-md  border ${
              errors.phone_number
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-400"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="text"
          />
          {errors.phone_number && (
            <p className="text-red-400 text-xs mt-1">
              {errors.phone_number.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            placeholder="m.smith@company.com"
            {...register("email", { required: "Email is required" })}
            className={`flex h-10 w-full rounded-md border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border - gray - 300 focus:ring-white/60"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            type="email"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 7,
                message: "At least 7 characters required",
              },
            })}
            className={`flex h-10 w-full rounded-md border ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-400"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
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
          {loading ? "Processing..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="text-gray-900 underline-offset-4 hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
