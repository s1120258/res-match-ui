import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { authAPI, tokenManager } from "../services/auth";

// Auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth actions
const authActions = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case authActions.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case authActions.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case authActions.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case authActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case authActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  console.log("🔵 AuthProvider: Rendering AuthProvider component");
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isInitialized = useRef(false);

  // Login function
  const login = useCallback(async (email, password) => {
    dispatch({ type: authActions.LOGIN_START });

    try {
      const response = await authAPI.login(email, password);
      const { access_token, refresh_token, user } = response;

      // Store tokens
      tokenManager.setTokens(access_token, refresh_token);

      dispatch({
        type: authActions.LOGIN_SUCCESS,
        payload: { user },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: authActions.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    dispatch({ type: authActions.LOGIN_START });

    try {
      const response = await authAPI.register(userData);
      const { access_token, refresh_token, user } = response;

      // Store tokens
      tokenManager.setTokens(access_token, refresh_token);

      dispatch({
        type: authActions.LOGIN_SUCCESS,
        payload: { user },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: authActions.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    tokenManager.clearTokens();
    dispatch({ type: authActions.LOGOUT });
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: authActions.CLEAR_ERROR });
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    // Prevent multiple initialization
    if (isInitialized.current) {
      return;
    }

    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");

        if (tokenManager.isAuthenticated()) {
          try {
            const user = await authAPI.getCurrentUser();
            dispatch({
              type: authActions.SET_USER,
              payload: { user },
            });
            console.log("User authenticated successfully");
          } catch (error) {
            console.log("Auth check failed:", error.message);
            // Token is invalid, clear it
            tokenManager.clearTokens();
            dispatch({ type: authActions.LOGOUT });
          }
        } else {
          console.log("No token found, user not authenticated");
          dispatch({
            type: authActions.SET_LOADING,
            payload: { isLoading: false },
          });
        }
      } catch (error) {
        console.error("Auth status check error:", error);
        dispatch({
          type: authActions.SET_LOADING,
          payload: { isLoading: false },
        });
      }
    };

    isInitialized.current = true;
    checkAuthStatus();
  }, []); // Empty dependency array - runs only once on mount

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
