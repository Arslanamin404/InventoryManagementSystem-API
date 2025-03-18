import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  let email;

  const [loading, setLoading] = useState(false);
  const handleFormSubmit = async (data) => {
    email = data.email;
    setLoading(true);
    try {
      await login(data);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Login to Dashboard</h2>
        <p className="text-sm text-gray-500">
          Enter your credentials to access the system
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <Link
              to="/reset-password"
              state={email}
              className="text-sm text-gray-900 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
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
                : "border-gray-300 focus:ring-white/60"
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button className="inline-flex h-10 w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
          {loading ? "Logging in ..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-500">
          Need access?
          <Link
            to="/register"
            className="text-gray-900 underline-offset-4 hover:underline ml-1"
          >
            Register to new account
          </Link>
        </p>
      </form>
    </div>
  );
};
