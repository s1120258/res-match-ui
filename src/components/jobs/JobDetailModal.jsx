import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
  Flex,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiStar,
  FiBookmark,
  FiCheck,
  FiX,
  FiBriefcase,
  FiTrendingUp,
  FiAward,
  FiEye,
} from "react-icons/fi";
import { jobsAPI, JOB_STATUS } from "../../services/jobs";

const JobDetailModal = ({ isOpen, onClose, job, onSave, onApply }) => {
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Job summary states
  const [jobSummary, setJobSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const toast = useToast();

  // Reset states when modal opens or job changes
  useEffect(() => {
    if (isOpen && job) {
      // Clear previous data immediately to prevent showing wrong content
      setJobDetails(null);
      setMatchScore(null);
      setSkillGapAnalysis(null);
      setJobSummary(null);
      setError(null);
      setSummaryError(null);
      setLoading(false);
      setSummaryLoading(false);

      // Load new data with priority order
      loadJobDataWithPriority();
    }
  }, [isOpen, job]);

  const loadJobDataWithPriority = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Load basic job details first
      if (job?.id) {
        const details = await jobsAPI.getJob(job.id);
        setJobDetails(details);
      } else {
        // Use the job data we already have
        setJobDetails(job);
      }

      // Step 2: Load AI summary first (priority)
      await loadJobSummary(job);

      // Step 3: Start skill-related APIs in background
      loadSkillRelatedAPIs();
    } catch (err) {
      setError(err.message);
      toast({
        title: "Failed to load job details",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSkillRelatedAPIs = async () => {
    if (!job?.id) return;

    // Load skill APIs in parallel
    try {
      const matchData = await jobsAPI.getMatchScore(job.id);
      setMatchScore(matchData);
    } catch (err) {
      console.log("Match score not available:", err.message);
    }

    try {
      const skillData = await jobsAPI.getSkillGapAnalysis(job.id);
      setSkillGapAnalysis(skillData);
    } catch (err) {
      console.log("Skill gap analysis not available:", err.message);
    }
  };

  // Load job summary
  const loadJobSummary = async (currentJob) => {
    if (!currentJob) {
      console.log("No job provided, skipping summary");
      return;
    }

    setSummaryLoading(true);
    setSummaryError(null);

    try {
      let summaryData;

      if (currentJob?.id) {
        // Job is saved - use GET endpoint
        summaryData = await jobsAPI.getJobSummary(currentJob.id);
      } else {
        // Job is from search results - use POST endpoint
        summaryData = await jobsAPI.generateJobSummary({
          job_description: currentJob.description,
          job_title: currentJob.title,
          company_name: currentJob.company,
          max_length: 150,
        });
      }

      setJobSummary(summaryData);
    } catch (err) {
      console.error(
        "Summary loading failed for:",
        currentJob.title,
        "Error:",
        err.message
      );
      setSummaryError(err.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Retry summary generation
  const retryJobSummary = () => {
    loadJobSummary(job);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(jobDetails);
      toast({
        title: "Job saved!",
        description: "Job has been added to your saved list",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to save job",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      if (onApply) {
        await onApply(jobDetails);
      } else {
        // Default apply logic
        await jobsAPI.applyToJob(jobDetails.id, {
          resume_id: "default", // This should come from context
        });
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      toast({
        title: "Failed to apply",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setApplying(false);
    }
  };

  const handleViewDetails = () => {
    const jobId = jobDetails?.id || job?.id;
    if (jobId) {
      onClose(); // Close modal first
      navigate(`/jobs/${jobId}`);
    }
  };

  const displayJob = jobDetails || job;

  if (!displayJob) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              {displayJob.title}
            </Text>
            <HStack spacing={3}>
              <Text color="brand.500" fontWeight="semibold">
                {displayJob.company}
              </Text>
              {displayJob.location && (
                <>
                  <Text color="gray.400">•</Text>
                  <HStack spacing={1}>
                    <Icon as={FiMapPin} color="gray.500" size="sm" />
                    <Text color="gray.600" fontSize="sm">
                      {displayJob.location}
                    </Text>
                  </HStack>
                </>
              )}
              {displayJob.status && (
                <Badge colorScheme="blue" ml={2}>
                  {displayJob.status}
                </Badge>
              )}
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {loading && (
            <Flex justify="center" py={8}>
              <Spinner size="lg" color="brand.500" />
            </Flex>
          )}

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!loading && (
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>
                  <Icon as={FiBriefcase} mr={2} />
                  Job Details
                </Tab>
                {matchScore && (
                  <Tab>
                    <Icon as={FiStar} mr={2} />
                    Match Score
                  </Tab>
                )}
                {skillGapAnalysis && (
                  <Tab>
                    <Icon as={FiTrendingUp} mr={2} />
                    Skill Analysis
                  </Tab>
                )}
              </TabList>

              <TabPanels>
                {/* Job Details Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {/* Quick Info */}
                    <HStack spacing={6} wrap="wrap">
                      {displayJob.date_posted && (
                        <HStack spacing={2}>
                          <Icon as={FiClock} color="gray.500" />
                          <Text fontSize="sm" color="gray.600">
                            Posted:{" "}
                            {new Date(
                              displayJob.date_posted
                            ).toLocaleDateString()}
                          </Text>
                        </HStack>
                      )}
                      {displayJob.source && (
                        <Badge variant="outline" colorScheme="blue">
                          {displayJob.source}
                        </Badge>
                      )}
                    </HStack>

                    <Divider />

                    {/* AI Summary Section */}
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={3}>
                        <Icon as={FiStar} mr={2} color="brand.500" />
                        AI Summary
                      </Text>

                      {summaryLoading && (
                        <Box
                          p={4}
                          bg="gray.50"
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <HStack spacing={3}>
                            <Spinner size="sm" color="brand.500" />
                            <Text color="gray.600" fontSize="sm">
                              Generating job summary...
                            </Text>
                          </HStack>
                        </Box>
                      )}

                      {summaryError && (
                        <Box
                          p={4}
                          bg="red.50"
                          borderRadius="md"
                          border="1px"
                          borderColor="red.200"
                        >
                          <VStack spacing={3} align="start">
                            <HStack spacing={2}>
                              <Icon as={FiX} color="red.500" />
                              <Text color="red.700" fontSize="sm">
                                Failed to generate summary
                              </Text>
                            </HStack>
                            <Text color="red.600" fontSize="sm">
                              {summaryError}
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={retryJobSummary}
                              leftIcon={<Icon as={FiStar} />}
                            >
                              Try Again
                            </Button>
                          </VStack>
                        </Box>
                      )}

                      {jobSummary && !summaryLoading && !summaryError && (
                        <Box
                          p={4}
                          bg="blue.50"
                          borderRadius="md"
                          border="1px"
                          borderColor="blue.200"
                        >
                          <VStack spacing={3} align="start">
                            <Text
                              color="blue.800"
                              lineHeight="tall"
                              fontSize="md"
                            >
                              {jobSummary.summary}
                            </Text>

                            {jobSummary.key_points &&
                              jobSummary.key_points.length > 0 && (
                                <Box>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="blue.700"
                                    mb={2}
                                  >
                                    Key Points:
                                  </Text>
                                  <List spacing={1}>
                                    {jobSummary.key_points
                                      .slice(0, 4)
                                      .map((point, index) => (
                                        <ListItem
                                          key={index}
                                          fontSize="sm"
                                          color="blue.700"
                                        >
                                          <ListIcon
                                            as={FiCheck}
                                            color="blue.500"
                                          />
                                          {point}
                                        </ListItem>
                                      ))}
                                  </List>
                                </Box>
                              )}

                            <HStack spacing={4} fontSize="xs" color="gray.500">
                              {jobSummary.summary_length && (
                                <Text>
                                  Summary: {jobSummary.summary_length} words
                                </Text>
                              )}
                              {jobSummary.original_length && (
                                <Text>
                                  Original: {jobSummary.original_length} words
                                </Text>
                              )}
                              {jobSummary.generated_at && (
                                <Text>
                                  Generated:{" "}
                                  {new Date(
                                    jobSummary.generated_at
                                  ).toLocaleTimeString()}
                                </Text>
                              )}
                            </HStack>
                          </VStack>
                        </Box>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <VStack spacing={3} align="stretch">
                      {/* Primary Actions */}
                      <HStack spacing={3} wrap="wrap">
                        {displayJob.id && (
                          <Button
                            leftIcon={<Icon as={FiEye} />}
                            onClick={handleViewDetails}
                            colorScheme="brand"
                            size="lg"
                          >
                            View Full Details
                          </Button>
                        )}

                        {onSave && displayJob.status !== JOB_STATUS.SAVED && (
                          <Button
                            leftIcon={<Icon as={FiBookmark} />}
                            onClick={handleSave}
                            isLoading={saving}
                            loadingText="Saving..."
                            colorScheme="brand"
                            variant="outline"
                            size="lg"
                          >
                            Save Job
                          </Button>
                        )}

                        {displayJob.status !== JOB_STATUS.APPLIED && (
                          <Button
                            leftIcon={<Icon as={FiCheck} />}
                            onClick={handleApply}
                            isLoading={applying}
                            loadingText="Applying..."
                            colorScheme="green"
                            size="lg"
                          >
                            Apply Now
                          </Button>
                        )}
                      </HStack>

                      {/* Secondary Actions */}
                      <HStack spacing={3}>
                        {displayJob.url && (
                          <Button
                            leftIcon={<Icon as={FiExternalLink} />}
                            onClick={() =>
                              window.open(displayJob.url, "_blank")
                            }
                            variant="ghost"
                            size="sm"
                          >
                            View Original
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </VStack>
                </TabPanel>

                {/* Match Score Tab */}
                {matchScore && (
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      <Stat>
                        <StatLabel>Match Score</StatLabel>
                        <StatNumber>
                          {Math.round(matchScore.similarity_score * 100)}%
                        </StatNumber>
                        <StatHelpText>
                          Based on your resume and job requirements
                        </StatHelpText>
                      </Stat>

                      <Progress
                        value={matchScore.similarity_score * 100}
                        colorScheme="brand"
                        size="lg"
                        borderRadius="md"
                      />

                      {/* View Details Button for deeper analysis */}
                      {displayJob.id && (
                        <Button
                          leftIcon={<Icon as={FiEye} />}
                          onClick={handleViewDetails}
                          colorScheme="brand"
                          variant="outline"
                          alignSelf="start"
                        >
                          View Detailed Analysis
                        </Button>
                      )}
                    </VStack>
                  </TabPanel>
                )}

                {/* Skill Analysis Tab */}
                {skillGapAnalysis && (
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      <Stat>
                        <StatLabel>Overall Match</StatLabel>
                        <StatNumber>
                          {skillGapAnalysis.overall_match_percentage}%
                        </StatNumber>
                        <StatHelpText>
                          {skillGapAnalysis.match_summary}
                        </StatHelpText>
                      </Stat>

                      {/* Strengths */}
                      {skillGapAnalysis.strengths?.length > 0 && (
                        <Box>
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            mb={3}
                            color="green.600"
                          >
                            <Icon as={FiCheck} mr={2} />
                            Your Strengths
                          </Text>
                          <List spacing={2}>
                            {skillGapAnalysis.strengths
                              .slice(0, 3)
                              .map((strength, index) => (
                                <ListItem key={index}>
                                  <ListIcon as={FiCheck} color="green.500" />
                                  <strong>{strength.skill}:</strong>{" "}
                                  {strength.reason}
                                </ListItem>
                              ))}
                          </List>
                          {skillGapAnalysis.strengths.length > 3 && (
                            <Text fontSize="sm" color="gray.500" mt={2}>
                              And {skillGapAnalysis.strengths.length - 3}{" "}
                              more...
                            </Text>
                          )}
                        </Box>
                      )}

                      {/* Skill Gaps */}
                      {skillGapAnalysis.skill_gaps?.length > 0 && (
                        <Box>
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            mb={3}
                            color="orange.600"
                          >
                            <Icon as={FiTrendingUp} mr={2} />
                            Areas for Improvement
                          </Text>
                          <List spacing={2}>
                            {skillGapAnalysis.skill_gaps
                              .slice(0, 3)
                              .map((gap, index) => (
                                <ListItem key={index}>
                                  <ListIcon as={FiX} color="orange.500" />
                                  <strong>{gap.skill}:</strong> {gap.impact}
                                  <Badge
                                    ml={2}
                                    colorScheme={
                                      gap.gap_severity === "Major"
                                        ? "red"
                                        : gap.gap_severity === "Minor"
                                        ? "yellow"
                                        : "green"
                                    }
                                    size="sm"
                                  >
                                    {gap.gap_severity}
                                  </Badge>
                                </ListItem>
                              ))}
                          </List>
                          {skillGapAnalysis.skill_gaps.length > 3 && (
                            <Text fontSize="sm" color="gray.500" mt={2}>
                              And {skillGapAnalysis.skill_gaps.length - 3} more
                              gaps...
                            </Text>
                          )}
                        </Box>
                      )}

                      {/* View Full Analysis Button */}
                      {displayJob.id && (
                        <Button
                          leftIcon={<Icon as={FiEye} />}
                          onClick={handleViewDetails}
                          colorScheme="brand"
                          variant="outline"
                          alignSelf="start"
                        >
                          View Complete Skill Analysis
                        </Button>
                      )}
                    </VStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JobDetailModal;
