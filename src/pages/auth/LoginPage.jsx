import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast({
        title: "Login successful",
        description: "Welcome back to ResMatch!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate to dashboard after successful login
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Login failed",
        description: result.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        {/* Logo/Brand */}
        <VStack spacing={2}>
          <Heading size="2xl" color="brand.500" fontWeight="bold">
            ResMatch
          </Heading>
          <Text color="gray.600" textAlign="center">
            AI-Powered Career Support Platform
          </Text>
        </VStack>

        {/* Login Form */}
        <Card w="full" shadow="xl" borderRadius="xl">
          <CardHeader pb={4}>
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Welcome Back
              </Heading>
              <Text color="gray.600" textAlign="center">
                Sign in to continue your career journey
              </Text>
            </VStack>
          </CardHeader>

          <CardBody pt={0}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                {/* Error Alert */}
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {/* Email Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiUser} />
                      <Text>Email Address</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    size="lg"
                    borderRadius="md"
                    autoComplete="username"
                  />
                </FormControl>

                {/* Password Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiLock} />
                      <Text>Password</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    size="lg"
                    borderRadius="md"
                    autoComplete="current-password"
                  />
                </FormControl>

                {/* Login Button */}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  rightIcon={<FiArrowRight />}
                  w="full"
                >
                  Sign In
                </Button>

                {/* Register Link */}
                <Box textAlign="center" pt={4}>
                  <Text color="gray.600">
                    Don't have an account?{" "}
                    <Link
                      as={RouterLink}
                      to="/register"
                      color="brand.500"
                      fontWeight="semibold"
                      _hover={{ color: "brand.600" }}
                    >
                      Create one here
                    </Link>
                  </Text>
                </Box>
              </Stack>
            </form>
          </CardBody>
        </Card>

        {/* Footer */}
        <Text color="gray.500" fontSize="sm" textAlign="center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </VStack>
    </Container>
  );
};

export default LoginPage;
