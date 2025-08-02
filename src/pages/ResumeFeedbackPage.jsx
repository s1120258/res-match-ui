import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import {
  FiMessageSquare,
  FiRefreshCw,
  FiHome,
  FiFileText,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// Import resume components
import ResumeFeedback from "../components/resume/ResumeFeedback";

// Import resume service
import { getResume } from "../services/resume";

const ResumeFeedbackPage = () => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Get job ID from URL params if provided
  const jobId = searchParams.get("jobId");

  // Load resume data
  const loadResume = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getResume();
      setResume(result);
    } catch (error) {
      console.error("Failed to load resume:", error);

      // If 404, it means no resume exists
      if (error.response?.status === 404) {
        setResume(null);
        return;
      }

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to load resume data.";

      setError(errorMessage);

      toast({
        title: "Failed to load resume",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load resume on component mount
  useEffect(() => {
    loadResume();
  }, []);

  // Check if resume exists
  const resumeExists = resume !== null;

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <HStack spacing={3} w="full" justify="center">
            <Spinner size="lg" color="blue.500" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              Loading resume data...
            </Text>
          </HStack>
        </VStack>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2} flex={1}>
              <AlertTitle>Failed to load resume data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={FiRefreshCw} />}
                onClick={loadResume}
              >
                Try Again
              </Button>
            </VStack>
          </Alert>
        </VStack>
      </Container>
    );
  }

  // No resume state
  if (!resumeExists) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Navigation */}
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/dashboard">
                <Icon as={FiHome} mr={2} />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/resume">
                <Icon as={FiFileText} mr={2} />
                Resume
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Feedback</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* No resume message */}
          <Card bg="orange.50" borderColor="orange.200">
            <CardBody>
              <VStack spacing={6} py={8}>
                <Icon as={FiUser} w={16} h={16} color="orange.500" />
                <VStack spacing={4} textAlign="center">
                  <Text fontSize="xl" fontWeight="bold" color="orange.800">
                    No Resume Available
                  </Text>
                  <Text fontSize="md" color="orange.700" maxW="md">
                    You need to upload a resume before getting AI-powered
                    feedback and analysis.
                  </Text>
                  <VStack spacing={3}>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      leftIcon={<Icon as={FiFileText} />}
                      as={RouterLink}
                      to="/resume"
                    >
                      Upload Resume
                    </Button>
                    <Button
                      variant="ghost"
                      leftIcon={<Icon as={FiArrowLeft} />}
                      onClick={() => navigate(-1)}
                    >
                      Go Back
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <VStack spacing={4} align="start">
            {/* Navigation */}
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to="/dashboard">
                  <Icon as={FiHome} mr={2} />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to="/resume">
                  <Icon as={FiFileText} mr={2} />
                  Resume
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Feedback</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Page Title */}
            <HStack spacing={3}>
              <Icon as={FiMessageSquare} w={8} h={8} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Resume Feedback & Analysis
                </Text>
                <Text fontSize="md" color="gray.600">
                  {jobId
                    ? "Get personalized feedback for this specific job opportunity"
                    : "Comprehensive AI-powered analysis of your resume"}
                </Text>
              </VStack>
            </HStack>

            {/* Resume Status */}
            <Card w="full" bg="green.50" borderColor="green.200">
              <CardBody py={3}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color="green.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" color="gray.800">
                        Resume: {resume.filename}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Uploaded{" "}
                        {new Date(resume.uploaded_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiFileText} />}
                      as={RouterLink}
                      to="/resume"
                    >
                      Manage Resume
                    </Button>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>

        <Divider />

        {/* Feedback Component */}
        <Box>
          <ResumeFeedback resumeExists={resumeExists} jobId={jobId} />
        </Box>

        {/* Action Buttons */}
        <Card bg="gray.50" borderColor="gray.200">
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Need More Help?
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="start">
              <Text color="gray.700">
                Looking for additional ways to improve your resume?
              </Text>
              <HStack spacing={3}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<Icon as={FiFileText} />}
                  as={RouterLink}
                  to="/resume"
                >
                  View Skills Analysis
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  leftIcon={<Icon as={FiFileText} />}
                  as={RouterLink}
                  to="/jobs"
                >
                  Browse Job Opportunities
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Back Navigation */}
        <Box>
          <Button
            leftIcon={<Icon as={FiArrowLeft} />}
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default ResumeFeedbackPage;
