import axios from "axios";
import { store } from "../src/redux/store.js";
import { signoutUserSuccess } from "../src/features/user/userSlice.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Success Response:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest.url.includes("/refreshToken");

    // Prevent infinite loop if refreshToken itself fails
    if ([401, 403,500].includes(status) && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post("/refreshToken");
        console.log("🔁 Token refreshed:", refreshResponse.data);
        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.log("❌ Refresh failed:", refreshError);
        // Clear Redux and redirect
        store.dispatch(signoutUserSuccess());
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
