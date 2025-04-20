import axios from "axios";
import { store } from "../src/redux/store.js";
import { signoutUserSuccess,signInFailure } from "../src/features/user/userSlice.js";

const axiosInstance = axios.create({
  baseURL: "https://blog-app-client-1whn.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // Dynamic base URL
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

axiosInstance.interceptors.response.use(
  (response) => {    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest.url?.includes("/refreshToken");

    // ✅ Handle Network Errors (no response received)
    if (!error.response) {
      console.error("❌ Network Error:", error.message);

      // Example: Handle ERR_CONNECTION_RESET or any network failure
      if (
        error.message.includes("ERR_CONNECTION_RESET") ||
        error.code === "ECONNABORTED" ||
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        // alert("Connection lost. Please check your internet or try again later.");
        // Optionally redirect or logout
        store.dispatch(signInFailure("Connection lost."));
        
        // window.location.href = "/sign-in";
        return Promise.reject(error);
      }
    }


    // Prevent infinite loop if refreshToken itself fails
    if ([401, 403,500].includes(status) && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/refreshToken");
        return axiosInstance(originalRequest); 
      } catch (refreshError) {
        store.dispatch(signoutUserSuccess());
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
