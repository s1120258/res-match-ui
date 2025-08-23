import apiClient from "./api";

// Authentication API functions
export const authAPI = {
  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post("/api/v1/auth/register", {
        email: userData.email,
        password: userData.password,
        firstname: userData.firstname,
        lastname: userData.lastname,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
  },

  // User login
  login: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email); // Note: field name is 'username'
      formData.append("password", password);

      const response = await apiClient.post("/api/v1/auth/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  },

  // Token refresh
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post("/api/v1/auth/refresh", {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Token refresh failed");
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/api/v1/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to get user info"
      );
    }
  },

  // Google OAuth authentication
  googleAuth: async (idToken) => {
    try {
      const response = await apiClient.post("/api/v1/auth/google/verify", {
        id_token: idToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Google authentication failed"
      );
    }
  },
};

// Token management utilities
export const tokenManager = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },

  getAccessToken: () => {
    return localStorage.getItem("access_token");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refresh_token");
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};
