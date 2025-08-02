import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Button,
  Icon,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from "@chakra-ui/react";
import {
  FiFileText,
  FiUpload,
  FiUser,
  FiMessageSquare,
  FiCode,
  FiRefreshCw,
} from "react-icons/fi";

// Import resume components
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeDisplay from "../components/resume/ResumeDisplay";
import ResumeSkills from "../components/resume/ResumeSkills";
import ResumeFeedback from "../components/resume/ResumeFeedback";
import ErrorBoundary from "../components/common/ErrorBoundary";

// Import resume service
import { getResume } from "../services/resume";

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  // Load resume data
  const loadResume = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getResume();
      setResume(result);
    } catch (error) {
      console.error("Failed to load resume:", error);

      // If 404, it means no resume exists - this is normal
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

  // Handle successful upload
  const handleUploadSuccess = (uploadedResume) => {
    setResume(uploadedResume);

    // Show success notification
    toast({
      title: "Resume uploaded successfully",
      description:
        "Your resume has been processed. You can now get feedback and extract skills.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Switch to the resume display tab
    setActiveTab(1);
  };

  // Handle resume deletion
  const handleResumeDeleted = () => {
    setResume(null);

    // Switch back to upload tab
    setActiveTab(0);

    toast({
      title: "Resume deleted",
      description: "Your resume has been successfully removed.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Check if resume exists
  const resumeExists = resume !== null;

  // Tab configuration
  const tabs = [
    {
      id: "upload",
      label: "Upload",
      icon: FiUpload,
      component: (
        <ResumeUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(error) => {
            console.error("Upload error:", error);
          }}
        />
      ),
    },
    {
      id: "overview",
      label: "Overview",
      icon: FiFileText,
      component: (
        <ResumeDisplay
          resume={resume}
          onResumeDeleted={handleResumeDeleted}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: "skills",
      label: "Skills",
      icon: FiCode,
      component: (
        <ErrorBoundary>
          <ResumeSkills resumeExists={resumeExists} />
        </ErrorBoundary>
      ),
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: FiMessageSquare,
      component: (
        <ErrorBoundary>
          <ResumeFeedback resumeExists={resumeExists} />
        </ErrorBoundary>
      ),
    },
  ];

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
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <VStack spacing={4} align="start">
            <HStack spacing={3}>
              <Icon as={FiUser} w={8} h={8} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Resume Management
                </Text>
                <Text fontSize="md" color="gray.600">
                  Upload, analyze, and improve your resume with AI-powered
                  insights
                </Text>
              </VStack>
            </HStack>

            {/* Status indicator */}
            <Card
              w="full"
              bg={resumeExists ? "green.50" : "orange.50"}
              borderColor={resumeExists ? "green.200" : "orange.200"}
            >
              <CardBody py={3}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Icon
                      as={resumeExists ? FiFileText : FiUpload}
                      color={resumeExists ? "green.500" : "orange.500"}
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" color="gray.800">
                        {resumeExists ? "Resume Active" : "No Resume Uploaded"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {resumeExists
                          ? "Your resume is ready for analysis and feedback"
                          : "Upload your resume to unlock AI-powered features"}
                      </Text>
                    </VStack>
                  </HStack>

                  {resumeExists && (
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.500">
                        Last updated:{" "}
                        {new Date(resume.uploaded_at).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>

        <Divider />

        {/* Main Content */}
        <Box>
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
            <TabList>
              {tabs.map((tab, index) => (
                <Tab key={tab.id}>
                  <HStack spacing={2}>
                    <Icon as={tab.icon} />
                    <Text>{tab.label}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabs.map((tab, index) => (
                <TabPanel key={tab.id} px={0} py={6}>
                  {tab.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        {/* Quick Actions (when no resume) */}
        {!resumeExists && (
          <Card bg="blue.50" borderColor="blue.200">
            <CardHeader>
              <Text fontSize="lg" fontWeight="bold" color="blue.800">
                Get Started with Resume Analysis
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="start">
                <Text color="blue.700">
                  Upload your resume to unlock powerful AI features:
                </Text>
                <VStack spacing={2} align="start" pl={4}>
                  <HStack spacing={2}>
                    <Icon as={FiCode} color="blue.500" w={4} h={4} />
                    <Text fontSize="sm" color="blue.600">
                      Automatic skills extraction and categorization
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiMessageSquare} color="blue.500" w={4} h={4} />
                    <Text fontSize="sm" color="blue.600">
                      AI-powered feedback and improvement suggestions
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} color="blue.500" w={4} h={4} />
                    <Text fontSize="sm" color="blue.600">
                      Job-specific resume optimization recommendations
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  colorScheme="blue"
                  leftIcon={<Icon as={FiUpload} />}
                  onClick={() => setActiveTab(0)}
                >
                  Upload Resume Now
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Help Section */}
        <Card bg="gray.50" borderColor="gray.200">
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Tips for Better Results
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="start">
              <Text fontSize="sm" color="gray.700">
                • Use a well-formatted PDF or Word document for best text
                extraction
              </Text>
              <Text fontSize="sm" color="gray.700">
                • Include specific skills, technologies, and frameworks you've
                used
              </Text>
              <Text fontSize="sm" color="gray.700">
                • List quantifiable achievements and project details
              </Text>
              <Text fontSize="sm" color="gray.700">
                • Keep your resume updated with recent experience and skills
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ResumePage;
