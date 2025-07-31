import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { jobsAPI, JOB_STATUS } from "../../services/jobs";

const JobDetailModal = ({ isOpen, onClose, job, onSave, onApply }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const toast = useToast();

  // Load job details when modal opens
  useEffect(() => {
    if (isOpen && job?.id) {
      loadJobDetails();
    }
  }, [isOpen, job?.id]);

  const loadJobDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load basic job details if we have an ID
      if (job.id) {
        const details = await jobsAPI.getJob(job.id);
        setJobDetails(details);

        // Try to load match score and skill gap analysis
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
      } else {
        // Use the job data we already have
        setJobDetails(job);
      }
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

                    {/* Job Description */}
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={3}>
                        Job Description
                      </Text>
                      <Box
                        p={4}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <Text
                          color="gray.700"
                          lineHeight="tall"
                          whiteSpace="pre-wrap"
                        >
                          {displayJob.description || "No description available"}
                        </Text>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <HStack spacing={3} pt={4}>
                      {displayJob.url && (
                        <Button
                          leftIcon={<Icon as={FiExternalLink} />}
                          onClick={() => window.open(displayJob.url, "_blank")}
                          variant="outline"
                        >
                          View Original
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
                          colorScheme="brand"
                        >
                          Apply Now
                        </Button>
                      )}
                    </HStack>
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
                            {skillGapAnalysis.strengths.map(
                              (strength, index) => (
                                <ListItem key={index}>
                                  <ListIcon as={FiCheck} color="green.500" />
                                  <strong>{strength.skill}:</strong>{" "}
                                  {strength.reason}
                                </ListItem>
                              )
                            )}
                          </List>
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
                            {skillGapAnalysis.skill_gaps.map((gap, index) => (
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
                        </Box>
                      )}

                      {/* Learning Recommendations */}
                      {skillGapAnalysis.learning_recommendations?.length >
                        0 && (
                        <Box>
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            mb={3}
                            color="blue.600"
                          >
                            <Icon as={FiAward} mr={2} />
                            Learning Recommendations
                          </Text>
                          <List spacing={2}>
                            {skillGapAnalysis.learning_recommendations.map(
                              (rec, index) => (
                                <ListItem key={index}>
                                  <ListIcon as={FiStar} color="blue.500" />
                                  <strong>{rec.skill}:</strong>{" "}
                                  {rec.suggested_approach}
                                  <Badge
                                    ml={2}
                                    colorScheme={
                                      rec.priority === "High"
                                        ? "red"
                                        : rec.priority === "Medium"
                                        ? "yellow"
                                        : "green"
                                    }
                                    size="sm"
                                  >
                                    {rec.priority}
                                  </Badge>
                                </ListItem>
                              )
                            )}
                          </List>
                        </Box>
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
