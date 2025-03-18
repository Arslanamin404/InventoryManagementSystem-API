import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Ensure cookies are sent
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired token (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        await axiosInstance.post("/auth/refresh-token");
        // If refresh successful, retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
