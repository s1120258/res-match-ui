import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Icon,
  Divider,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiMapPin,
  FiBookmark,
  FiExternalLink,
  FiClock,
  FiStar,
  FiFilter,
} from "react-icons/fi";
import {
  jobsAPI,
  JOB_STATUS,
  JOB_SOURCES,
  SORT_OPTIONS,
} from "../services/jobs";
import JobDetailModal from "../components/jobs/JobDetailModal";

const JobsPage = () => {
  // State management
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "",
    source: JOB_SOURCES.REMOTEOK,
    sort_by: SORT_OPTIONS.DATE,
    limit: 20,
    fetch_full_description: true,
  });

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("search"); // "search" or "saved"
  const [saving, setSaving] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();

  // Load saved jobs on component mount
  useEffect(() => {
    if (activeTab === "saved") {
      loadSavedJobs();
    }
  }, [activeTab]);

  // Search jobs
  const handleSearch = async () => {
    if (!searchParams.keyword.trim()) {
      toast({
        title: "Search keyword required",
        description: "Please enter a keyword to search for jobs",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await jobsAPI.searchJobs(searchParams);
      setJobs(results);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Search failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load saved jobs
  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await jobsAPI.getJobs();
      setSavedJobs(results);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Failed to load saved jobs",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save job
  const handleSaveJob = async (job) => {
    setSaving({ ...saving, [job.id || job.title]: true });

    try {
      const jobData = {
        title: job.title,
        description: job.description || job.tags?.join(", ") || "",
        company: job.company,
        location: job.location,
        url: job.url,
        source: job.source || searchParams.source,
        date_posted: job.date,
        status: JOB_STATUS.SAVED,
      };

      await jobsAPI.saveJob(jobData);

      toast({
        title: "Job saved!",
        description: `"${job.title}" has been saved to your list`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh saved jobs if we're on that tab
      if (activeTab === "saved") {
        loadSavedJobs();
      }
    } catch (err) {
      toast({
        title: "Failed to save job",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving({ ...saving, [job.id || job.title]: false });
    }
  };

  // Update search parameters
  const updateSearchParam = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Enter key in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Open job detail modal
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Close job detail modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" mb={2}>
            Job Search
          </Text>
          <Text color="gray.600">
            Find your next opportunity and track your applications
          </Text>
        </Box>

        {/* Tab Navigation */}
        <ButtonGroup isAttached variant="outline">
          <Button
            colorScheme={activeTab === "search" ? "brand" : "gray"}
            variant={activeTab === "search" ? "solid" : "outline"}
            onClick={() => setActiveTab("search")}
            leftIcon={<Icon as={FiSearch} />}
          >
            Search Jobs
          </Button>
          <Button
            colorScheme={activeTab === "saved" ? "brand" : "gray"}
            variant={activeTab === "saved" ? "solid" : "outline"}
            onClick={() => setActiveTab("saved")}
            leftIcon={<Icon as={FiBookmark} />}
          >
            Saved Jobs ({savedJobs.length})
          </Button>
        </ButtonGroup>

        {/* Search Form */}
        {activeTab === "search" && (
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 4 }}
                  spacing={4}
                  w="full"
                >
                  {/* Keyword Search */}
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Job title, skills, company..."
                      value={searchParams.keyword}
                      onChange={(e) =>
                        updateSearchParam("keyword", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>

                  {/* Location */}
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMapPin} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Location (optional)"
                      value={searchParams.location}
                      onChange={(e) =>
                        updateSearchParam("location", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>

                  {/* Job Source */}
                  <Select
                    value={searchParams.source}
                    onChange={(e) =>
                      updateSearchParam("source", e.target.value)
                    }
                  >
                    <option value={JOB_SOURCES.REMOTEOK}>RemoteOK</option>
                  </Select>

                  {/* Sort By */}
                  <Select
                    value={searchParams.sort_by}
                    onChange={(e) =>
                      updateSearchParam("sort_by", e.target.value)
                    }
                  >
                    <option value={SORT_OPTIONS.DATE}>Most Recent</option>
                    <option value={SORT_OPTIONS.MATCH_SCORE}>Best Match</option>
                  </Select>
                </SimpleGrid>

                {/* Search Button */}
                <Button
                  colorScheme="brand"
                  size="lg"
                  leftIcon={<Icon as={FiSearch} />}
                  onClick={handleSearch}
                  isLoading={loading}
                  loadingText="Searching..."
                  w={{ base: "full", md: "auto" }}
                >
                  Search Jobs
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <Flex justify="center" py={8}>
            <Spinner size="xl" color="brand.500" />
          </Flex>
        )}

        {/* Jobs Display */}
        {!loading && (
          <VStack spacing={4} align="stretch">
            {/* Results Count */}
            {((activeTab === "search" && jobs.length > 0) ||
              (activeTab === "saved" && savedJobs.length > 0)) && (
              <Text color="gray.600">
                {activeTab === "search"
                  ? `Found ${jobs.length} jobs`
                  : `${savedJobs.length} saved jobs`}
              </Text>
            )}

            {/* Job Cards */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
              {(activeTab === "search" ? jobs : savedJobs).map((job, index) => (
                <JobCard
                  key={job.id || `${job.title}-${index}`}
                  job={job}
                  onSave={activeTab === "search" ? handleSaveJob : null}
                  isSaving={saving[job.id || job.title]}
                  showSaveButton={activeTab === "search"}
                  onClick={handleJobClick}
                />
              ))}
            </SimpleGrid>

            {/* Empty State */}
            {((activeTab === "search" &&
              jobs.length === 0 &&
              searchParams.keyword) ||
              (activeTab === "saved" && savedJobs.length === 0)) && (
              <Box textAlign="center" py={8}>
                <Text fontSize="lg" color="gray.500">
                  {activeTab === "search"
                    ? "No jobs found. Try adjusting your search criteria."
                    : "No saved jobs yet. Start by searching and saving some jobs!"}
                </Text>
              </Box>
            )}
          </VStack>
        )}
      </VStack>

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        job={selectedJob}
        onSave={handleSaveJob}
      />
    </Container>
  );
};

// Job Card Component
const JobCard = ({ job, onSave, isSaving, showSaveButton, onClick }) => {
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

  return (
    <Card
      variant="outline"
      _hover={{
        shadow: "md",
        transform: "translateY(-2px)",
        cursor: "pointer",
      }}
      transition="all 0.2s"
      onClick={(e) => {
        // Don't trigger modal if clicking on buttons
        if (!e.target.closest("button")) {
          onClick(job);
        }
      }}
    >
      <CardHeader pb={2}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
              {job.title}
            </Text>
            <HStack spacing={2}>
              <Text color="brand.500" fontWeight="medium">
                {job.company}
              </Text>
              {job.location && (
                <>
                  <Text color="gray.400">•</Text>
                  <HStack spacing={1}>
                    <Icon as={FiMapPin} color="gray.400" size="sm" />
                    <Text color="gray.600" fontSize="sm">
                      {job.location}
                    </Text>
                  </HStack>
                </>
              )}
            </HStack>
          </VStack>

          {job.status && (
            <Badge colorScheme={getStatusColor(job.status)} ml={2}>
              {job.status}
            </Badge>
          )}
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <VStack align="stretch" spacing={3}>
          {/* Job Description/Tags */}
          <Text color="gray.600" fontSize="sm" noOfLines={3}>
            {job.description ||
              (job.tags && job.tags.join(", ")) ||
              "No description available"}
          </Text>

          <Divider />

          {/* Footer */}
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              {job.date && (
                <HStack spacing={1}>
                  <Icon as={FiClock} color="gray.400" size="sm" />
                  <Text fontSize="xs" color="gray.500">
                    {new Date(job.date || job.date_posted).toLocaleDateString()}
                  </Text>
                </HStack>
              )}

              {job.match_score && (
                <HStack spacing={1}>
                  <Icon as={FiStar} color="yellow.400" size="sm" />
                  <Text fontSize="xs" color="gray.600">
                    {Math.round(job.match_score * 100)}% match
                  </Text>
                </HStack>
              )}
            </HStack>

            <HStack spacing={2}>
              {job.url && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FiExternalLink} />}
                  onClick={() => window.open(job.url, "_blank")}
                >
                  View
                </Button>
              )}

              {showSaveButton && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                  leftIcon={<Icon as={FiBookmark} />}
                  onClick={() => onSave(job)}
                  isLoading={isSaving}
                  loadingText="Saving..."
                >
                  Save
                </Button>
              )}
            </HStack>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default JobsPage;
