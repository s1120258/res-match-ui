import React, { useState, useEffect, useMemo } from "react";
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
  useBreakpointValue,
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
import PageHeader from "../components/common/PageHeader";

// Import resume service
import { getResume } from "../services/resume";

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  // Essential responsive values only - using useMemo for performance
  const layoutValues = useMemo(
    () => ({
      containerPadding: { base: 3, md: 8 },
      containerPx: { base: 2, md: 6 },
      vStackSpacing: { base: 4, md: 8 },
      headerDirection: { base: "column", sm: "row" },
      headerAlign: { base: "center", sm: "start" },
      headerJustify: { base: "center", sm: "flex-start" },
      headerTextAlign: { base: "center", sm: "left" },
      mobileDisplay: { base: "block", md: "none" },
      desktopDisplay: { base: "none", md: "flex" },
      tabVariant: { base: "soft-rounded", md: "enclosed" },
      buttonWidth: { base: "full", sm: "auto" },
    }),
    []
  );

  // Only keep useBreakpointValue for values that need to be used in logic
  const headerDirection = useBreakpointValue(layoutValues.headerDirection);
  const headerAlign = useBreakpointValue(layoutValues.headerAlign);

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

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
      <Container maxW="container.lg" py={layoutValues.containerPadding}>
        <VStack spacing={{ base: 4, md: 6 }}>
          <HStack spacing={3} w="full" justify="center">
            <Spinner size="lg" color="blue.500" />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              color="gray.700"
            >
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
      <Container maxW="container.lg" py={layoutValues.containerPadding}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2} flex={1}>
            <AlertTitle fontSize={{ base: "md", md: "lg" }}>
              Failed to load resume data
            </AlertTitle>
            <AlertDescription fontSize={{ base: "sm", md: "md" }}>
              {error}
            </AlertDescription>
            <Button
              size={{ base: "xs", md: "sm" }}
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
    <Box>
      <PageHeader
        title="Resume Management"
        subtitle="Upload, analyze, and improve your resume with AI-powered insights"
        icon={FiFileText}
      />

      <Container
        maxW="container.lg"
        py={layoutValues.containerPadding}
        px={layoutValues.containerPx}
      >
        <VStack spacing={layoutValues.vStackSpacing} align="stretch">
          {/* Status indicator */}
          <Card
            w="full"
            bg={resumeExists ? "green.50" : "orange.50"}
            borderColor={resumeExists ? "green.200" : "orange.200"}
          >
            <CardBody py={{ base: 2, md: 3 }} px={{ base: 3, md: 6 }}>
              <VStack spacing={{ base: 1, md: 0 }} align="start">
                <HStack
                  spacing={{ base: 2, md: 3 }}
                  w="full"
                  justify="space-between"
                >
                  <HStack spacing={{ base: 2, md: 3 }}>
                    <Icon
                      as={resumeExists ? FiFileText : FiUpload}
                      color={resumeExists ? "green.500" : "orange.500"}
                      w={{ base: 4, md: 5 }}
                      h={{ base: 4, md: 5 }}
                    />
                    <VStack align="start" spacing={0}>
                      <Text
                        fontWeight="semibold"
                        color="gray.800"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {resumeExists ? "Resume Active" : "No Resume Uploaded"}
                      </Text>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.600"
                      >
                        {resumeExists
                          ? "Your resume is ready for analysis"
                          : "Upload your resume to unlock AI features"}
                      </Text>
                    </VStack>
                  </HStack>

                  {resumeExists && (
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.500"
                      textAlign="right"
                      flexShrink={0}
                    >
                      {formatDate(resume?.uploaded_at)}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Divider />

          {/* Main Content */}
          <Box>
            <Tabs
              index={activeTab}
              onChange={setActiveTab}
              variant={layoutValues.tabVariant}
              size={{ base: "sm", md: "md" }}
            >
              <TabList
                overflowX="auto"
                overflowY="hidden"
                whiteSpace="nowrap"
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  "& > *": {
                    flexShrink: 0,
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab.id}
                    minW={{ base: "70px", md: "unset" }}
                    px={{ base: 2, md: 4 }}
                  >
                    <HStack spacing={{ base: 1, md: 2 }}>
                      <Icon
                        as={tab.icon}
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        display={{ base: "none", sm: "block" }}
                      >
                        {tab.label}
                      </Text>
                    </HStack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {tabs.map((tab, index) => (
                  <TabPanel key={tab.id} px={0} py={{ base: 3, md: 6 }}>
                    {tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>

          {/* Quick Actions (when no resume) */}
          {!resumeExists && (
            <Card bg="blue.50" borderColor="blue.200">
              <CardHeader pb={{ base: 2, md: 4 }}>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="bold"
                  color="blue.800"
                >
                  Get Started with Resume Analysis
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={{ base: 3, md: 4 }} align="start">
                  <Text color="blue.700" fontSize={{ base: "sm", md: "md" }}>
                    Upload your resume to unlock powerful AI features:
                  </Text>
                  <VStack
                    spacing={{ base: 1, md: 2 }}
                    align="start"
                    pl={{ base: 2, md: 4 }}
                  >
                    <HStack spacing={2}>
                      <Icon
                        as={FiCode}
                        color="blue.500"
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color="blue.600"
                      >
                        Automatic skills extraction and categorization
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon
                        as={FiMessageSquare}
                        color="blue.500"
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color="blue.600"
                      >
                        AI-powered feedback and improvement suggestions
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon
                        as={FiFileText}
                        color="blue.500"
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color="blue.600"
                      >
                        Job-specific resume optimization recommendations
                      </Text>
                    </HStack>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    size={{ base: "sm", md: "md" }}
                    leftIcon={<Icon as={FiUpload} />}
                    onClick={() => setActiveTab(0)}
                    w={layoutValues.buttonWidth}
                  >
                    Upload Resume Now
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Help Section */}
          <Card bg="gray.50" borderColor="gray.200">
            <CardHeader pb={{ base: 2, md: 4 }}>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="gray.800"
              >
                Tips for Better Results
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={{ base: 2, md: 3 }} align="start">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  • Use a well-formatted PDF or Word document for best text
                  extraction
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  • Include specific skills, technologies, and frameworks you've
                  used
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  • List quantifiable achievements and project details
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                  • Keep your resume updated with recent experience and skills
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ResumePage;
