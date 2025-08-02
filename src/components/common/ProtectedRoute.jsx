import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  console.log("🟡 ProtectedRoute: Component rendering, calling useAuth()");
  try {
    const { isAuthenticated, isLoading } = useAuth();
    console.log("🟢 ProtectedRoute: useAuth() success", {
      isAuthenticated,
      isLoading,
    });
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
      return (
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        </Center>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render protected content
    return children;
  } catch (error) {
    console.error("🔴 ProtectedRoute: useAuth() failed with error:", error);
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.600">Authentication Error</Text>
          <Text color="gray.600">Please refresh the page</Text>
        </VStack>
      </Center>
    );
  }
};

export default ProtectedRoute;
