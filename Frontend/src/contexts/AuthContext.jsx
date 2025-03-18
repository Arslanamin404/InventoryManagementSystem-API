import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setUser(response.data.data);
      setRole(response.data.data.role);
    } catch (error) {
      setUser(null);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      showToast("success", response.data.message);
      await checkAuth();
      navigate("/dashboard");
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
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
