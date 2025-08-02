import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // Extended to 45s for external job API calls
  timeoutErrorMessage:
    "Request timeout - the server is taking longer than expected to respond",
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${
            config.url
          } with auth token`
        );
      } else {
        console.warn(
          `API Request: ${config.method?.toUpperCase()} ${
            config.url
          } - NO AUTH TOKEN FOUND`
        );
      }
      console.log("API Request config:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        baseURL: config.baseURL,
      });
    } catch (error) {
      console.error("Error getting token from localStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor (automatic token refresh)
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    console.log("API Response data:", response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.log("No refresh token available");
          throw new Error("No refresh token available");
        }

        console.log("Attempting token refresh...");
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);
        console.log("Token refreshed successfully");

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError.message);
        // Refresh failed → clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
