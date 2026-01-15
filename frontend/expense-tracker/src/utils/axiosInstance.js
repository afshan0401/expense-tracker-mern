import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (global error handling)
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized → redirect to login
        window.location.href = "/login";
      } 
      else if (error.response.status === 500) {
        console.log("Internal Server Error. Please try again later.");
      }
      else if (error.response.data?.message) {
        console.log(error.response.data.message);
      }
    } 
    else if (error.code === "ECONNABORTED") {
      console.log("Request timeout. Please try again.");
    } 
    else {
      console.log("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
