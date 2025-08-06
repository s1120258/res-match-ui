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
  Image,
} from "@chakra-ui/react";
import { FiUser, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import logoImage from "../../assets/icons/custom/logo.png";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { register, login, isAuthenticated, error, clearError } = useAuth();
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
    setValidationError("");
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstname: formData.firstname,
      lastname: formData.lastname,
    });

    if (result.success) {
      // Auto-login after successful registration
      try {
        const loginResult = await login(formData.email, formData.password);

        if (loginResult.success) {
          toast({
            title: "Registration successful",
            description: "Welcome to ResMatch! Your account has been created.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Navigate to dashboard after successful registration and login
          navigate("/dashboard", { replace: true });
        } else {
          toast({
            title: "Registration successful",
            description: "Please log in with your new account.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/login", { replace: true });
        }
      } catch (loginError) {
        toast({
          title: "Registration successful",
          description: "Please log in with your new account.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login", { replace: true });
      }
    } else {
      toast({
        title: "Registration failed",
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
          <HStack spacing={4} align="center">
            <Image src={logoImage} alt="ResMatch Logo" boxSize="60px" />
            <Heading size="2xl" color="brand.500" fontWeight="bold">
              ResMatch
            </Heading>
          </HStack>
          <Text color="gray.600" textAlign="center">
            AI-Powered Career Support Platform
          </Text>
        </VStack>

        {/* Registration Form */}
        <Card w="full" shadow="xl" borderRadius="xl">
          <CardHeader pb={4}>
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Create Your Account
              </Heading>
              <Text color="gray.600" textAlign="center">
                Start your AI-powered career journey today
              </Text>
            </VStack>
          </CardHeader>

          <CardBody pt={0}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                {/* Error Alert */}
                {(error || validationError) && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error || validationError}
                  </Alert>
                )}

                {/* First Name Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiUser} />
                      <Text>First Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    size="lg"
                    borderRadius="md"
                    autoComplete="given-name"
                  />
                </FormControl>

                {/* Last Name Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiUser} />
                      <Text>Last Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    size="lg"
                    borderRadius="md"
                    autoComplete="family-name"
                  />
                </FormControl>

                {/* Email Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiMail} />
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
                    autoComplete="email"
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
                    autoComplete="new-password"
                  />
                </FormControl>

                {/* Confirm Password Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700">
                    <HStack spacing={2}>
                      <Icon as={FiLock} />
                      <Text>Confirm Password</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    size="lg"
                    borderRadius="md"
                    autoComplete="new-password"
                  />
                </FormControl>

                {/* Register Button */}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  rightIcon={<FiArrowRight />}
                  w="full"
                >
                  Create Account
                </Button>

                {/* Login Link */}
                <Box textAlign="center" pt={4}>
                  <Text color="gray.600">
                    Already have an account?{" "}
                    <Link
                      as={RouterLink}
                      to="/login"
                      color="brand.500"
                      fontWeight="semibold"
                      _hover={{ color: "brand.600" }}
                    >
                      Sign in here
                    </Link>
                  </Text>
                </Box>
              </Stack>
            </form>
          </CardBody>
        </Card>

        {/* Footer */}
        <Text color="gray.500" fontSize="sm" textAlign="center">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </Text>
      </VStack>
    </Container>
  );
};

export default RegisterPage;
