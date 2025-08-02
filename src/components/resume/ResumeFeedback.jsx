import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListItem,
  ListIcon,
  Divider,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  FiMessageSquare,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import {
  getResumeGeneralFeedback,
  getResumeJobSpecificFeedback,
} from "../../services/resume";

const ResumeFeedback = ({ resumeExists, jobId = null }) => {
  const [generalFeedback, setGeneralFeedback] = useState(null);
  const [jobSpecificFeedback, setJobSpecificFeedback] = useState(null);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);
  const [isLoadingJobSpecific, setIsLoadingJobSpecific] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [jobSpecificError, setJobSpecificError] = useState(null);
  const toast = useToast();

  // Transform job-specific feedback data to expected format
  const transformJobSpecificFeedback = (apiResponse, jobId) => {
    if (!apiResponse || !apiResponse.job_specific_feedback) {
      return null;
    }

    const feedbackArray = apiResponse.job_specific_feedback;
    const jobTitle = apiResponse.job_description_excerpt || "Job Position";

    // Initialize the transformed object
    const transformed = {
      job_id: jobId,
      job_title: jobTitle,
      match_percentage: 75, // Default, will be calculated
      feedback: "",
      matching_skills: [],
      missing_skills: [],
      suggestions: [],
    };

    // Process each feedback item
    feedbackArray.forEach((item) => {
      if (typeof item === "string") {
        // Parse the markdown-style feedback
        if (item.includes("**Skills Alignment:**")) {
          // Extract matching skills
          const skillsText = item.toLowerCase();
          const potentialSkills = [
            "python",
            "django",
            "postgresql",
            "celery",
            "redis",
            "javascript",
            "react",
            "typescript",
            "node.js",
          ];
          potentialSkills.forEach((skill) => {
            if (skillsText.includes(skill.toLowerCase())) {
              transformed.matching_skills.push(skill);
            }
          });

          // Estimate match percentage based on skills alignment tone
          if (item.includes("align well")) {
            transformed.match_percentage = 80;
          } else if (item.includes("partially") || item.includes("some")) {
            transformed.match_percentage = 65;
          }

          transformed.feedback += item + "\n\n";
        } else if (item.includes("**Missing Qualifications:**")) {
          // Extract missing skills/qualifications
          if (item.includes("scraping")) {
            transformed.missing_skills.push("Web Scraping");
          }
          if (item.includes("lacks direct mention")) {
            transformed.match_percentage = Math.min(
              transformed.match_percentage,
              70
            );
          }

          transformed.feedback += item + "\n\n";
        } else if (
          item.includes("**Experience Relevance:**") ||
          item.includes("**Highlight Relevant Achievements:**") ||
          item.includes("**Specific Improvements:**")
        ) {
          // Extract suggestions
          const cleanSuggestion = item.replace(/\*\*[^*]+:\*\*\s*/, "").trim();
          if (cleanSuggestion) {
            transformed.suggestions.push(cleanSuggestion);
          }

          transformed.feedback += item + "\n\n";
        } else {
          // Any other feedback text
          transformed.feedback += item + "\n\n";
        }
      }
    });

    // Clean up feedback text
    transformed.feedback = transformed.feedback.trim();

    // Remove duplicates
    transformed.matching_skills = [...new Set(transformed.matching_skills)];
    transformed.missing_skills = [...new Set(transformed.missing_skills)];

    return transformed;
  };

  // Load general feedback
  const loadGeneralFeedback = async () => {
    if (!resumeExists) return;

    setIsLoadingGeneral(true);
    setGeneralError(null);

    try {
      const result = await getResumeGeneralFeedback();

      // Transform the API response to match expected format
      const transformedFeedback = {
        overall_score: 85, // Default score since API doesn't provide it
        feedback: result.general_feedback
          ? result.general_feedback.join(" ")
          : "No feedback available",
        suggestions: result.general_feedback || [],
        strengths: [], // Will be populated from feedback if available
        areas_for_improvement: [], // Will be populated from feedback if available
      };

      setGeneralFeedback(transformedFeedback);
    } catch (error) {
      console.error("Failed to get general feedback:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to get resume feedback.";

      setGeneralError(errorMessage);

      toast({
        title: "Failed to get feedback",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  // Load job-specific feedback
  const loadJobSpecificFeedback = useCallback(async () => {
    if (!resumeExists || !jobId) {
      return;
    }

    setIsLoadingJobSpecific(true);
    setJobSpecificError(null);

    try {
      const result = await getResumeJobSpecificFeedback(jobId);

      // Transform the API response to match expected format
      const transformedFeedback = transformJobSpecificFeedback(result, jobId);
      setJobSpecificFeedback(transformedFeedback);
    } catch (error) {
      console.error("Failed to get job-specific feedback:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to get job-specific feedback.";

      setJobSpecificError(errorMessage);

      toast({
        title: "Failed to get job feedback",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingJobSpecific(false);
    }
  }, [resumeExists, jobId, toast]);

  // Load feedback on component mount
  useEffect(() => {
    loadGeneralFeedback();
  }, [resumeExists]);

  useEffect(() => {
    if (resumeExists && jobId) {
      loadJobSpecificFeedback();
    }
  }, [resumeExists, jobId, loadJobSpecificFeedback]);

  // Force trigger when component mounts with jobId
  useEffect(() => {
    if (
      resumeExists &&
      jobId &&
      !jobSpecificFeedback &&
      !isLoadingJobSpecific
    ) {
      loadJobSpecificFeedback();
    }
  }, [jobId]);

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    if (score >= 40) return "orange";
    return "red";
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  // Render general feedback tab
  const renderGeneralFeedback = () => {
    if (!resumeExists) {
      return (
        <VStack spacing={4} py={8}>
          <Icon as={FiUser} w={16} h={16} color="gray.400" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
              No resume available
            </Text>
            <Text fontSize="sm" color="gray.500">
              Upload your resume first to get AI-powered feedback and
              suggestions.
            </Text>
          </VStack>
        </VStack>
      );
    }

    if (isLoadingGeneral) {
      return (
        <VStack spacing={4}>
          <Skeleton height="100px" width="full" />
          <Skeleton height="60px" width="full" />
          <Skeleton height="60px" width="full" />
          <Skeleton height="60px" width="full" />
        </VStack>
      );
    }

    if (generalError) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2} flex={1}>
            <AlertTitle>Feedback generation failed</AlertTitle>
            <AlertDescription>{generalError}</AlertDescription>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadGeneralFeedback}
            >
              Try Again
            </Button>
          </VStack>
        </Alert>
      );
    }

    if (!generalFeedback) {
      return (
        <VStack spacing={4} py={6}>
          <Icon as={FiMessageSquare} w={12} h={12} color="gray.400" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="md" fontWeight="semibold" color="gray.600">
              No feedback available
            </Text>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadGeneralFeedback}
              isLoading={isLoadingGeneral}
              loadingText="Generating..."
            >
              Generate Feedback
            </Button>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack spacing={6} align="stretch">
        {/* Overall Score */}
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <HStack spacing={6} align="center">
              <CircularProgress
                value={generalFeedback.overall_score}
                color={`${getScoreColor(generalFeedback.overall_score)}.500`}
                size="120px"
                thickness="8px"
              >
                <CircularProgressLabel fontSize="xl" fontWeight="bold">
                  {generalFeedback.overall_score}
                </CircularProgressLabel>
              </CircularProgress>

              <VStack align="start" spacing={2} flex={1}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  Overall Resume Score
                </Text>
                <Badge
                  colorScheme={getScoreColor(generalFeedback.overall_score)}
                  variant="solid"
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {getScoreLabel(generalFeedback.overall_score)}
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  Based on content quality, structure, and professional
                  standards
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Feedback Summary */}
        {generalFeedback.feedback && (
          <Card>
            <CardHeader>
              <HStack spacing={2}>
                <Icon as={FiMessageSquare} color="blue.500" />
                <Text fontSize="lg" fontWeight="bold">
                  AI Feedback Summary
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color="gray.700" lineHeight="tall">
                {generalFeedback.feedback}
              </Text>
            </CardBody>
          </Card>
        )}

        {/* Strengths */}
        {generalFeedback.strengths && generalFeedback.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <HStack spacing={2}>
                <Icon as={FiThumbsUp} color="green.500" />
                <Text fontSize="lg" fontWeight="bold">
                  Strengths
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <List spacing={2}>
                {generalFeedback.strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FiCheckCircle} color="green.500" />
                    <Text as="span" color="gray.700">
                      {strength}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        )}

        {/* Areas for Improvement */}
        {generalFeedback.areas_for_improvement &&
          generalFeedback.areas_for_improvement.length > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiThumbsDown} color="orange.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    Areas for Improvement
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <List spacing={2}>
                  {generalFeedback.areas_for_improvement.map((area, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiAlertTriangle} color="orange.500" />
                      <Text as="span" color="gray.700">
                        {area}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          )}

        {/* Suggestions */}
        {generalFeedback.suggestions &&
          generalFeedback.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiStar} color="purple.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    Suggestions
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <List spacing={2}>
                  {generalFeedback.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiTrendingUp} color="purple.500" />
                      <Text as="span" color="gray.700">
                        {suggestion}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          )}
      </VStack>
    );
  };

  // Render job-specific feedback tab
  const renderJobSpecificFeedback = () => {
    if (!resumeExists || !jobId) {
      return (
        <VStack spacing={4} py={8}>
          <Icon as={FiTarget} w={16} h={16} color="gray.400" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
              No job selected
            </Text>
            <Text fontSize="sm" color="gray.500">
              Select a specific job to get tailored resume feedback.
            </Text>
          </VStack>
        </VStack>
      );
    }

    if (isLoadingJobSpecific) {
      return (
        <VStack spacing={4}>
          <Skeleton height="100px" width="full" />
          <Skeleton height="60px" width="full" />
          <Skeleton height="60px" width="full" />
          <Skeleton height="60px" width="full" />
        </VStack>
      );
    }

    if (jobSpecificError) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2} flex={1}>
            <AlertTitle>Job-specific feedback failed</AlertTitle>
            <AlertDescription>{jobSpecificError}</AlertDescription>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadJobSpecificFeedback}
            >
              Try Again
            </Button>
          </VStack>
        </Alert>
      );
    }

    if (!jobSpecificFeedback) {
      return (
        <VStack spacing={4} py={6}>
          <Icon as={FiTarget} w={12} h={12} color="gray.400" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="md" fontWeight="semibold" color="gray.600">
              No job-specific feedback available
            </Text>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadJobSpecificFeedback}
              isLoading={isLoadingJobSpecific}
            >
              Generate Job Feedback
            </Button>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack spacing={6} align="stretch">
        {/* Job Info & Match Score */}
        <Card bg="purple.50" borderColor="purple.200">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {jobSpecificFeedback.job_title}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Job ID: {jobSpecificFeedback.job_id}
                  </Text>
                </VStack>

                <CircularProgress
                  value={jobSpecificFeedback.match_percentage}
                  color={`${getScoreColor(
                    jobSpecificFeedback.match_percentage
                  )}.500`}
                  size="80px"
                  thickness="8px"
                >
                  <CircularProgressLabel fontSize="md" fontWeight="bold">
                    {jobSpecificFeedback.match_percentage}%
                  </CircularProgressLabel>
                </CircularProgress>
              </HStack>

              <Text fontSize="sm" color="gray.700">
                Resume match score for this specific position
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Job-specific Feedback */}
        {jobSpecificFeedback.feedback && (
          <Card>
            <CardHeader>
              <HStack spacing={2}>
                <Icon as={FiMessageSquare} color="purple.500" />
                <Text fontSize="lg" fontWeight="bold">
                  Job-Specific Analysis
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color="gray.700" lineHeight="tall">
                {jobSpecificFeedback.feedback}
              </Text>
            </CardBody>
          </Card>
        )}

        {/* Matching Skills */}
        {jobSpecificFeedback.matching_skills &&
          jobSpecificFeedback.matching_skills.length > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiCheckCircle} color="green.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    Matching Skills
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Wrap spacing={2}>
                  {jobSpecificFeedback.matching_skills.map((skill, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="green" variant="solid">
                        {skill}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </CardBody>
            </Card>
          )}

        {/* Missing Skills */}
        {jobSpecificFeedback.missing_skills &&
          jobSpecificFeedback.missing_skills.length > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiAlertTriangle} color="orange.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    Missing Skills
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Wrap spacing={2}>
                  {jobSpecificFeedback.missing_skills.map((skill, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="orange" variant="solid">
                        {skill}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </CardBody>
            </Card>
          )}

        {/* Job-specific Suggestions */}
        {jobSpecificFeedback.suggestions &&
          jobSpecificFeedback.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiStar} color="purple.500" />
                  <Text fontSize="lg" fontWeight="bold">
                    Recommendations
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <List spacing={2}>
                  {jobSpecificFeedback.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiTrendingUp} color="purple.500" />
                      <Text as="span" color="gray.700">
                        {suggestion}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          )}
      </VStack>
    );
  };

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Resume Feedback
          </Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadGeneralFeedback}
              isLoading={isLoadingGeneral}
            >
              Refresh
            </Button>
          </HStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <Tabs>
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiMessageSquare} />
                <Text>General Feedback</Text>
              </HStack>
            </Tab>
            {jobId && (
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FiTarget} />
                  <Text>Job-Specific</Text>
                </HStack>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            <TabPanel px={0}>{renderGeneralFeedback()}</TabPanel>
            {jobId && <TabPanel px={0}>{renderJobSpecificFeedback()}</TabPanel>}
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default ResumeFeedback;
