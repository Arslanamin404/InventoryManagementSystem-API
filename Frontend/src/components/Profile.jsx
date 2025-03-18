import React from "react";
import { useAuth } from "../contexts/AuthContext";

export const Profile = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  const fullName = `${user.first_name} ${user.last_name || ""}`.trim();

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200">
      <div className="flex flex-col items-center sm:flex-row sm:space-x-8">
        <img
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
          src={`https://ui-avatars.com/api/?name=${
            fullName || user.username
          }&background=random`}
          alt="Profile"
        />
        <div className="text-center sm:text-left mt-6 sm:mt-0">
          <h2 className="text-3xl font-semibold text-gray-900">
            {fullName || user.username}
          </h2>
          <p className="text-gray-500 text-lg">@{user.username}</p>
          <p className="text-gray-600 mt-1">{user.email}</p>
          <span
            className={`inline-block mt-3 px-4 py-1.5 ${
              user.role.toLowerCase() === "admin"
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            } rounded-full text-sm font-medium shadow-sm`}
          >
            {user.role}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t pt-5 space-y-3 text-gray-700">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Phone:</span>
          <span className="text-gray-600">{user.phone_number || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Account Status:</span>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              user.isVerified
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {user.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Joined:</span>
          <span className="text-gray-600">
            {new Date(user.createdAt).toDateString()}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center sm:text-right">
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
          Edit Profile
        </button>
      </div>
    </div>
  );
};
