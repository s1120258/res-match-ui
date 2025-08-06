import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
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
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  IconButton,
  Tooltip,
  useBreakpointValue,
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
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiTarget,
  FiBook,
  FiMessageSquare,
} from "react-icons/fi";
import { jobsAPI, JOB_STATUS } from "../services/jobs";
import ResumeFeedback from "../components/resume/ResumeFeedback";
import { hasResume } from "../services/resume";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [job, setJob] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [jobSkills, setJobSkills] = useState(null);
  const [jobSummary, setJobSummary] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Responsive layout values for performance
  const layoutValues = useMemo(
    () => ({
      containerMaxW: "7xl",
      containerPy: { base: 3, md: 8 },
      containerPx: { base: 2, md: 6 },
      vStackSpacing: { base: 4, md: 6 },
      cardHeaderDirection: { base: "column", lg: "row" },
      cardHeaderAlign: { base: "stretch", lg: "start" },
      cardHeaderSpacing: { base: 3, lg: 4 },
      titleFontSize: { base: "xl", md: "2xl", lg: "3xl" },
      companyFontSize: { base: "md", md: "lg", lg: "xl" },
      buttonSize: { base: "sm", md: "md", lg: "lg" },
      actionButtonDirection: { base: "column", sm: "row" },
      actionButtonSpacing: { base: 2, sm: 3 },
      actionButtonMinW: { base: "full", sm: "120px", lg: "200px" },
    }),
    []
  );

  // Only essential useBreakpointValue calls
  const cardHeaderDirection = useBreakpointValue(
    layoutValues.cardHeaderDirection
  );
  const cardHeaderAlign = useBreakpointValue(layoutValues.cardHeaderAlign);
  const actionButtonDirection = useBreakpointValue(
    layoutValues.actionButtonDirection
  );

  // Load job details on component mount
  useEffect(() => {
    if (id) {
      loadJobData();
    }
  }, [id]);

  const loadJobData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Load basic job details first (fast display)
      const jobData = await jobsAPI.getJob(id);
      setJob(jobData);
      setLoading(false); // Show basic job info immediately

      // Step 2: Execute all analysis APIs in parallel
      // Summary, match score, skill gap analysis, and job skills run independently
      loadJobSummary(id);
      loadMatchScore();
      loadSkillGapAnalysis();
      loadJobSkills();
      checkResumeExists();
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast({
        title: "Failed to load job details",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const loadJobSummary = async (jobId) => {
    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const summaryData = await jobsAPI.getJobSummary(jobId);
      setJobSummary(summaryData);
    } catch (err) {
      console.error("AI summary failed:", err.message);
      setSummaryError(err.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Load match score (independent API for overall job compatibility)
  const loadMatchScore = async () => {
    try {
      const matchData = await jobsAPI.getMatchScore(id);
      setMatchScore(matchData);
    } catch (err) {
      console.log("Match score not available:", err.message);
    }
  };

  // Load skill gap analysis (skill-specific analysis)
  const loadSkillGapAnalysis = async () => {
    try {
      const skillData = await jobsAPI.getSkillGapAnalysis(id);
      setSkillGapAnalysis(skillData);
    } catch (err) {
      console.log("Skill gap analysis not available:", err.message);
    }
  };

  // Load job skills extraction (skill extraction from job description)
  const loadJobSkills = async () => {
    try {
      const skillsData = await jobsAPI.extractJobSkills(id);
      setJobSkills(skillsData);
    } catch (err) {
      console.log("Job skills extraction not available:", err.message);
    }
  };

  // Check if user has uploaded a resume
  const checkResumeExists = async () => {
    try {
      const exists = await hasResume();
      setResumeExists(exists);
    } catch (err) {
      console.log("Resume check failed:", err.message);
      setResumeExists(false);
    }
  };

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      const jobData = {
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        url: job.url,
        source: job.source,
        date_posted: job.date_posted,
        status: JOB_STATUS.SAVED,
      };

      await jobsAPI.saveJob(jobData);

      // Update local state
      setJob((prev) => ({ ...prev, status: JOB_STATUS.SAVED }));

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

  const handleApplyToJob = async () => {
    setApplying(true);
    try {
      await jobsAPI.applyToJob(id, {
        resume_id: "default", // This should come from user context
      });

      // Update local state
      setJob((prev) => ({ ...prev, status: JOB_STATUS.APPLIED }));

      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job link has been copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case JOB_STATUS.SAVED:
        return "blue";
      case JOB_STATUS.APPLIED:
        return "green";
      case JOB_STATUS.MATCHED:
        return "purple";
      case JOB_STATUS.REJECTED:
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Container
        maxW={layoutValues.containerMaxW}
        py={layoutValues.containerPy}
        px={layoutValues.containerPx}
      >
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container
        maxW={layoutValues.containerMaxW}
        py={layoutValues.containerPy}
        px={layoutValues.containerPx}
      >
        <Alert status="error">
          <AlertIcon />
          {error || "Job not found"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxW={layoutValues.containerMaxW}
      py={layoutValues.containerPy}
      px={layoutValues.containerPx}
    >
      <VStack spacing={layoutValues.vStackSpacing} align="stretch">
        {/* Breadcrumb Navigation */}
        <Breadcrumb fontSize={{ base: "sm", md: "md" }}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/jobs")}>
              Jobs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink isTruncated maxW={{ base: "150px", md: "300px" }}>
              {job.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Job Header */}
        <Card>
          <CardHeader>
            <Flex
              direction={cardHeaderDirection}
              align={cardHeaderAlign}
              gap={layoutValues.cardHeaderSpacing}
            >
              <VStack
                align="start"
                spacing={{ base: 2, md: 3 }}
                flex={1}
                minW={0}
              >
                <HStack spacing={{ base: 2, md: 3 }} wrap="wrap">
                  <Button
                    leftIcon={<Icon as={FiArrowLeft} />}
                    variant="ghost"
                    size={{ base: "xs", md: "sm" }}
                    onClick={() => navigate("/jobs")}
                  >
                    <Text display={{ base: "none", sm: "inline" }}>
                      Back to Jobs
                    </Text>
                    <Text display={{ base: "inline", sm: "none" }}>Back</Text>
                  </Button>
                  {job.status && (
                    <Badge
                      colorScheme={getStatusColor(job.status)}
                      size={{ base: "sm", md: "lg" }}
                    >
                      {job.status}
                    </Badge>
                  )}
                </HStack>

                <Text
                  fontSize={layoutValues.titleFontSize}
                  fontWeight="bold"
                  lineHeight="short"
                  isTruncated
                >
                  {job.title}
                </Text>

                <VStack align="start" spacing={{ base: 1, md: 2 }} w="full">
                  <Text
                    color="brand.500"
                    fontSize={layoutValues.companyFontSize}
                    fontWeight="semibold"
                    isTruncated
                  >
                    {job.company}
                  </Text>

                  {job.location && (
                    <HStack spacing={1}>
                      <Icon
                        as={FiMapPin}
                        color="gray.500"
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        color="gray.600"
                        fontSize={{ base: "sm", md: "md", lg: "lg" }}
                        isTruncated
                      >
                        {job.location}
                      </Text>
                    </HStack>
                  )}
                </VStack>

                {/* Quick Info */}
                <VStack
                  align="start"
                  spacing={{ base: 1, md: 2 }}
                  color="gray.600"
                  w="full"
                >
                  {job.date_posted && (
                    <HStack spacing={2}>
                      <Icon
                        as={FiClock}
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text fontSize={{ base: "xs", md: "sm" }}>
                        Posted: {new Date(job.date_posted).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                  {job.source && (
                    <HStack spacing={2}>
                      <Icon
                        as={FiBriefcase}
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text fontSize={{ base: "xs", md: "sm" }}>
                        Source: {job.source}
                      </Text>
                    </HStack>
                  )}
                  {matchScore && (
                    <HStack spacing={2}>
                      <Icon
                        as={FiStar}
                        color="yellow.400"
                        w={{ base: 3, md: 4 }}
                        h={{ base: 3, md: 4 }}
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="medium"
                      >
                        {Math.round(matchScore.similarity_score * 100)}% Match
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              {/* Action Buttons */}
              <VStack
                spacing={layoutValues.actionButtonSpacing}
                align="stretch"
                minW={layoutValues.actionButtonMinW}
              >
                <VStack spacing={2} direction={actionButtonDirection} w="full">
                  {job.status !== JOB_STATUS.SAVED && (
                    <Button
                      leftIcon={<Icon as={FiBookmark} />}
                      onClick={handleSaveJob}
                      isLoading={saving}
                      loadingText="Saving..."
                      colorScheme="brand"
                      variant="outline"
                      size={layoutValues.buttonSize}
                      w="full"
                    >
                      <Text display={{ base: "none", sm: "inline" }}>
                        Save Job
                      </Text>
                      <Text display={{ base: "inline", sm: "none" }}>Save</Text>
                    </Button>
                  )}

                  {job.status !== JOB_STATUS.APPLIED && (
                    <Button
                      leftIcon={<Icon as={FiCheck} />}
                      onClick={handleApplyToJob}
                      isLoading={applying}
                      loadingText="Applying..."
                      colorScheme="brand"
                      size={layoutValues.buttonSize}
                      w="full"
                    >
                      <Text display={{ base: "none", sm: "inline" }}>
                        Apply Now
                      </Text>
                      <Text display={{ base: "inline", sm: "none" }}>
                        Apply
                      </Text>
                    </Button>
                  )}
                </VStack>

                <HStack spacing={2} justify="center">
                  {job.url && (
                    <Tooltip label="View original job posting">
                      <IconButton
                        icon={<Icon as={FiExternalLink} />}
                        onClick={() => window.open(job.url, "_blank")}
                        variant="outline"
                        size={{ base: "sm", md: "md" }}
                        aria-label="View original"
                      />
                    </Tooltip>
                  )}
                  <Tooltip label="Share job">
                    <IconButton
                      icon={<Icon as={FiShare2} />}
                      onClick={handleShare}
                      variant="outline"
                      size={{ base: "sm", md: "md" }}
                      aria-label="Share job"
                    />
                  </Tooltip>
                </HStack>
              </VStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Card>
          <CardBody px={{ base: 2, md: 6 }}>
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList
                overflowX="auto"
                overflowY="hidden"
                flexWrap="nowrap"
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
                <Tab
                  flexShrink={0}
                  fontSize={{ base: "xs", md: "sm" }}
                  px={{ base: 3, md: 4 }}
                  py={{ base: 2, md: 3 }}
                >
                  <VStack spacing={0}>
                    <Icon
                      as={FiBriefcase}
                      w={{ base: 4, md: 4 }}
                      h={{ base: 4, md: 4 }}
                    />
                    <Text
                      display={{ base: "none", md: "inline" }}
                      fontSize="xs"
                    >
                      Details
                    </Text>
                  </VStack>
                </Tab>
                {jobSkills && (
                  <Tab
                    flexShrink={0}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 3 }}
                  >
                    <VStack spacing={0}>
                      <Icon
                        as={FiTarget}
                        w={{ base: 4, md: 4 }}
                        h={{ base: 4, md: 4 }}
                      />
                      <Text
                        display={{ base: "none", md: "inline" }}
                        fontSize="xs"
                      >
                        Skills
                      </Text>
                    </VStack>
                  </Tab>
                )}
                {matchScore && (
                  <Tab
                    flexShrink={0}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 3 }}
                  >
                    <VStack spacing={0}>
                      <Icon
                        as={FiStar}
                        w={{ base: 4, md: 4 }}
                        h={{ base: 4, md: 4 }}
                      />
                      <Text
                        display={{ base: "none", md: "inline" }}
                        fontSize="xs"
                      >
                        Match
                      </Text>
                    </VStack>
                  </Tab>
                )}
                {resumeExists && (
                  <Tab
                    flexShrink={0}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 3 }}
                  >
                    <VStack spacing={0}>
                      <Icon
                        as={FiMessageSquare}
                        w={{ base: 4, md: 4 }}
                        h={{ base: 4, md: 4 }}
                      />
                      <Text
                        display={{ base: "none", md: "inline" }}
                        fontSize="xs"
                      >
                        Feedback
                      </Text>
                    </VStack>
                  </Tab>
                )}
                {skillGapAnalysis && (
                  <Tab
                    flexShrink={0}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 3 }}
                  >
                    <VStack spacing={0}>
                      <Icon
                        as={FiTrendingUp}
                        w={{ base: 4, md: 4 }}
                        h={{ base: 4, md: 4 }}
                      />
                      <Text
                        display={{ base: "none", md: "inline" }}
                        fontSize="xs"
                      >
                        Gap
                      </Text>
                    </VStack>
                  </Tab>
                )}
              </TabList>

              <TabPanels>
                {/* Job Details Tab */}
                <TabPanel px={0} py={{ base: 3, md: 6 }}>
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    {/* AI Summary Section */}
                    <Box>
                      <Text
                        fontSize={{ base: "md", md: "lg", lg: "xl" }}
                        fontWeight="semibold"
                        mb={{ base: 2, md: 4 }}
                      >
                        <Icon as={FiStar} mr={2} color="brand.500" />
                        AI Summary
                      </Text>

                      {summaryLoading && (
                        <Box
                          p={{ base: 4, md: 6 }}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <HStack spacing={3}>
                            <Spinner size="md" color="brand.500" />
                            <Text
                              color="gray.600"
                              fontSize={{ base: "sm", md: "md" }}
                            >
                              Generating job summary...
                            </Text>
                          </HStack>
                        </Box>
                      )}

                      {summaryError && (
                        <Box
                          p={{ base: 4, md: 6 }}
                          bg="red.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="red.200"
                        >
                          <VStack spacing={4} align="start">
                            <HStack spacing={2}>
                              <Icon as={FiX} color="red.500" />
                              <Text
                                color="red.700"
                                fontSize={{ base: "sm", md: "md" }}
                              >
                                Failed to generate summary
                              </Text>
                            </HStack>
                            <Text
                              color="red.600"
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {summaryError}
                            </Text>
                            <Button
                              size={{ base: "xs", md: "sm" }}
                              colorScheme="red"
                              variant="outline"
                              onClick={() => loadJobSummary(id)}
                              leftIcon={<Icon as={FiStar} />}
                            >
                              Try Again
                            </Button>
                          </VStack>
                        </Box>
                      )}

                      {jobSummary && !summaryLoading && !summaryError && (
                        <Box
                          p={{ base: 4, md: 6 }}
                          bg="blue.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="blue.200"
                        >
                          <VStack spacing={4} align="start">
                            <Text
                              color="blue.800"
                              lineHeight="tall"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                            >
                              {jobSummary.summary || "No summary text found"}
                            </Text>

                            {jobSummary.key_points &&
                              jobSummary.key_points.length > 0 && (
                                <Box w="full">
                                  <Text
                                    fontSize={{ base: "sm", md: "md" }}
                                    fontWeight="semibold"
                                    color="blue.700"
                                    mb={3}
                                  >
                                    Key Points:
                                  </Text>
                                  <SimpleGrid
                                    columns={{ base: 1, md: 2 }}
                                    spacing={2}
                                  >
                                    {jobSummary.key_points.map(
                                      (point, index) => (
                                        <HStack
                                          key={index}
                                          align="start"
                                          spacing={2}
                                        >
                                          <Icon
                                            as={FiCheck}
                                            color="blue.500"
                                            mt={1}
                                            flexShrink={0}
                                          />
                                          <Text
                                            fontSize={{ base: "xs", md: "sm" }}
                                            color="blue.700"
                                          >
                                            {point}
                                          </Text>
                                        </HStack>
                                      )
                                    )}
                                  </SimpleGrid>
                                </Box>
                              )}

                            <HStack
                              spacing={6}
                              fontSize="xs"
                              color="gray.500"
                              flexWrap="wrap"
                            >
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
                  </VStack>
                </TabPanel>

                {/* Required Skills Tab */}
                {jobSkills && (
                  <TabPanel px={0} py={{ base: 3, md: 6 }}>
                    <VStack spacing={6} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {/* Required Skills */}
                        {jobSkills.skills_data?.required_skills?.length > 0 && (
                          <Card variant="outline">
                            <CardHeader>
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="red.600"
                              >
                                <Icon as={FiTarget} mr={2} />
                                Required Skills
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <List spacing={2}>
                                {jobSkills.skills_data.required_skills.map(
                                  (skill, index) => (
                                    <ListItem key={index}>
                                      <ListIcon as={FiCheck} color="red.500" />
                                      <strong>{skill.name}</strong>
                                      <Badge ml={2} colorScheme="red" size="sm">
                                        {skill.level}
                                      </Badge>
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </CardBody>
                          </Card>
                        )}

                        {/* Preferred Skills */}
                        {jobSkills.skills_data?.preferred_skills?.length >
                          0 && (
                          <Card variant="outline">
                            <CardHeader>
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="blue.600"
                              >
                                <Icon as={FiStar} mr={2} />
                                Preferred Skills
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <List spacing={2}>
                                {jobSkills.skills_data.preferred_skills.map(
                                  (skill, index) => (
                                    <ListItem key={index}>
                                      <ListIcon as={FiCheck} color="blue.500" />
                                      <strong>{skill.name}</strong>
                                      <Badge
                                        ml={2}
                                        colorScheme="blue"
                                        size="sm"
                                      >
                                        {skill.level}
                                      </Badge>
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </CardBody>
                          </Card>
                        )}
                      </SimpleGrid>

                      {/* Technical Skills Categories */}
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {jobSkills.skills_data?.programming_languages?.length >
                          0 && (
                          <Card variant="outline" size="sm">
                            <CardHeader pb={2}>
                              <Text fontSize="md" fontWeight="medium">
                                Programming Languages
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <HStack wrap="wrap" spacing={2}>
                                {jobSkills.skills_data.programming_languages.map(
                                  (lang, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      colorScheme="purple"
                                    >
                                      {lang}
                                    </Badge>
                                  )
                                )}
                              </HStack>
                            </CardBody>
                          </Card>
                        )}

                        {jobSkills.skills_data?.frameworks?.length > 0 && (
                          <Card variant="outline" size="sm">
                            <CardHeader pb={2}>
                              <Text fontSize="md" fontWeight="medium">
                                Frameworks
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <HStack wrap="wrap" spacing={2}>
                                {jobSkills.skills_data.frameworks.map(
                                  (framework, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      colorScheme="cyan"
                                    >
                                      {framework}
                                    </Badge>
                                  )
                                )}
                              </HStack>
                            </CardBody>
                          </Card>
                        )}

                        {jobSkills.skills_data?.tools?.length > 0 && (
                          <Card variant="outline" size="sm">
                            <CardHeader pb={2}>
                              <Text fontSize="md" fontWeight="medium">
                                Tools
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <HStack wrap="wrap" spacing={2}>
                                {jobSkills.skills_data.tools.map(
                                  (tool, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      colorScheme="green"
                                    >
                                      {tool}
                                    </Badge>
                                  )
                                )}
                              </HStack>
                            </CardBody>
                          </Card>
                        )}
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                )}

                {/* Match Analysis Tab */}
                {matchScore && (
                  <TabPanel px={0} py={{ base: 3, md: 6 }}>
                    <VStack spacing={6} align="stretch">
                      <Card variant="outline">
                        <CardBody>
                          <Stat textAlign="center">
                            <StatLabel fontSize="lg">Match Score</StatLabel>
                            <StatNumber fontSize="4xl" color="brand.500">
                              {Math.round(matchScore.similarity_score * 100)}%
                            </StatNumber>
                            <StatHelpText fontSize="md">
                              Based on your resume and job requirements
                            </StatHelpText>
                          </Stat>

                          <Progress
                            value={matchScore.similarity_score * 100}
                            colorScheme="brand"
                            size="lg"
                            borderRadius="md"
                            mt={4}
                          />
                        </CardBody>
                      </Card>
                    </VStack>
                  </TabPanel>
                )}

                {/* Resume Feedback Tab */}
                {resumeExists && (
                  <TabPanel px={0} py={{ base: 3, md: 6 }}>
                    <ResumeFeedback resumeExists={resumeExists} jobId={id} />
                  </TabPanel>
                )}

                {/* Skill Gap Analysis Tab */}
                {skillGapAnalysis && (
                  <TabPanel px={0} py={{ base: 3, md: 6 }}>
                    <VStack spacing={6} align="stretch">
                      {/* Overall Match */}
                      <Card variant="outline">
                        <CardBody>
                          <Stat textAlign="center">
                            <StatLabel fontSize="lg">Overall Match</StatLabel>
                            <StatNumber fontSize="3xl" color="brand.500">
                              {skillGapAnalysis.overall_match_percentage}%
                            </StatNumber>
                            <StatHelpText fontSize="md">
                              {skillGapAnalysis.match_summary}
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {/* Strengths */}
                        {skillGapAnalysis.strengths?.length > 0 && (
                          <Card variant="outline">
                            <CardHeader>
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="green.600"
                              >
                                <Icon as={FiCheck} mr={2} />
                                Your Strengths
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <List spacing={3}>
                                {skillGapAnalysis.strengths.map(
                                  (strength, index) => (
                                    <ListItem key={index}>
                                      <ListIcon
                                        as={FiCheck}
                                        color="green.500"
                                      />
                                      <Box>
                                        <Text fontWeight="medium">
                                          {strength.skill}
                                        </Text>
                                        <Text
                                          fontSize="sm"
                                          color="gray.600"
                                          mt={1}
                                        >
                                          {strength.reason}
                                        </Text>
                                      </Box>
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </CardBody>
                          </Card>
                        )}

                        {/* Skill Gaps */}
                        {skillGapAnalysis.skill_gaps?.length > 0 && (
                          <Card variant="outline">
                            <CardHeader>
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="orange.600"
                              >
                                <Icon as={FiTrendingUp} mr={2} />
                                Areas for Improvement
                              </Text>
                            </CardHeader>
                            <CardBody pt={0}>
                              <List spacing={3}>
                                {skillGapAnalysis.skill_gaps.map(
                                  (gap, index) => (
                                    <ListItem key={index}>
                                      <ListIcon as={FiX} color="orange.500" />
                                      <Box>
                                        <HStack
                                          justify="space-between"
                                          align="start"
                                        >
                                          <Text fontWeight="medium">
                                            {gap.skill}
                                          </Text>
                                          <Badge
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
                                        </HStack>
                                        <Text
                                          fontSize="sm"
                                          color="gray.600"
                                          mt={1}
                                        >
                                          {gap.impact}
                                        </Text>
                                      </Box>
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </CardBody>
                          </Card>
                        )}
                      </SimpleGrid>

                      {/* Learning Recommendations */}
                      {skillGapAnalysis.learning_recommendations?.length >
                        0 && (
                        <Card variant="outline">
                          <CardHeader>
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color="blue.600"
                            >
                              <Icon as={FiBook} mr={2} />
                              Learning Recommendations
                            </Text>
                          </CardHeader>
                          <CardBody pt={0}>
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              {skillGapAnalysis.learning_recommendations.map(
                                (rec, index) => (
                                  <Card key={index} variant="outline" size="sm">
                                    <CardBody>
                                      <VStack align="start" spacing={3}>
                                        <HStack
                                          justify="space-between"
                                          w="full"
                                        >
                                          <Text fontWeight="semibold">
                                            {rec.skill}
                                          </Text>
                                          <Badge
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
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600">
                                          {rec.suggested_approach}
                                        </Text>
                                        {rec.estimated_learning_time && (
                                          <HStack spacing={1}>
                                            <Icon
                                              as={FiCalendar}
                                              color="gray.400"
                                              w={4}
                                              h={4}
                                            />
                                            <Text
                                              fontSize="xs"
                                              color="gray.500"
                                            >
                                              Est. Time:{" "}
                                              {rec.estimated_learning_time}
                                            </Text>
                                          </HStack>
                                        )}
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                )
                              )}
                            </SimpleGrid>
                          </CardBody>
                        </Card>
                      )}

                      {/* Next Steps */}
                      {skillGapAnalysis.recommended_next_steps?.length > 0 && (
                        <Card variant="outline" bg="blue.50">
                          <CardHeader>
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color="blue.700"
                            >
                              <Icon as={FiAward} mr={2} />
                              Recommended Next Steps
                            </Text>
                          </CardHeader>
                          <CardBody pt={0}>
                            <List spacing={2}>
                              {skillGapAnalysis.recommended_next_steps.map(
                                (step, index) => (
                                  <ListItem key={index}>
                                    <ListIcon as={FiTarget} color="blue.500" />
                                    <Text color="blue.700">{step}</Text>
                                  </ListItem>
                                )
                              )}
                            </List>
                          </CardBody>
                        </Card>
                      )}
                    </VStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default JobDetailPage;
