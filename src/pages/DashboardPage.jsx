import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Icon,
  Button,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  FiBookmark,
  FiTarget,
  FiCheckCircle,
  FiTrendingUp,
  FiSearch,
  FiUpload,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Import services
import { analyticsAPI } from "../services/analytics";
import { jobsAPI } from "../services/jobs";
import { hasResume } from "../services/resume";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [stats, setStats] = useState({
    saved: 0,
    matched: 0,
    applied: 0,
    avgScore: 0,
    total: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [resumeExists, setResumeExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load data in parallel for better performance
      const [statusData, matchScoreData, jobsData, resumeStatus] =
        await Promise.allSettled([
          analyticsAPI.getStatusSummary(),
          analyticsAPI.getMatchScoreSummary(),
          jobsAPI.getJobs({ limit: 5 }), // Get recent 5 jobs
          hasResume(),
        ]);

      // Process status summary
      if (statusData.status === "fulfilled") {
        const { status_summary, total_jobs } = statusData.value;
        setStats((prev) => ({
          ...prev,
          saved: status_summary.saved || 0,
          matched: status_summary.matched || 0,
          applied: status_summary.applied || 0,
          total: total_jobs || 0,
        }));
      }

      // Process match score data
      if (matchScoreData.status === "fulfilled") {
        const avgScore =
          Math.round(matchScoreData.value.average_score * 100) || 0;
        setStats((prev) => ({
          ...prev,
          avgScore,
        }));
      }

      // Process recent jobs
      if (jobsData.status === "fulfilled") {
        setRecentJobs(jobsData.value.jobs || []);
      }

      // Process resume status
      if (resumeStatus.status === "fulfilled") {
        setResumeExists(resumeStatus.value);
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: "Failed to load dashboard data",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({
    icon,
    title,
    description,
    action,
    onClick,
    colorScheme = "brand",
  }) => (
    <Card
      h="full"
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      <CardBody>
        <VStack spacing={4} align="start">
          <Icon as={icon} size="24px" color={`${colorScheme}.500`} />
          <VStack spacing={2} align="start">
            <Text fontWeight="semibold" fontSize="lg">
              {title}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {description}
            </Text>
          </VStack>
          <Button colorScheme={colorScheme} variant="outline" size="sm">
            {action}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );

  const StatCard = ({
    icon,
    label,
    value,
    helpText,
    colorScheme = "brand",
  }) => (
    <Card>
      <CardBody>
        <Stat>
          <HStack spacing={3} mb={2}>
            <Icon as={icon} color={`${colorScheme}.500`} size="20px" />
            <StatLabel fontSize="sm" color="gray.600">
              {label}
            </StatLabel>
          </HStack>
          <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">
            {value}
          </StatNumber>
          <StatHelpText fontSize="xs" color="gray.500">
            {helpText}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

  // Recent activity component
  const RecentActivityItem = ({ job, type }) => {
    const getActivityColor = (status) => {
      switch (status) {
        case "applied":
          return "green";
        case "matched":
          return "blue";
        case "saved":
          return "purple";
        default:
          return "gray";
      }
    };

    const getActivityText = (status) => {
      switch (status) {
        case "applied":
          return "Applied to";
        case "matched":
          return "Matched with";
        case "saved":
          return "Saved";
        default:
          return "Viewed";
      }
    };

    return (
      <HStack
        spacing={3}
        p={3}
        _hover={{ bg: "gray.50" }}
        borderRadius="md"
        cursor="pointer"
        onClick={() => navigate(`/jobs/${job.id}`)}
      >
        <Box
          w={2}
          h={2}
          bg={`${getActivityColor(job.status)}.500`}
          borderRadius="full"
          flexShrink={0}
        />
        <VStack spacing={1} align="start" flex={1}>
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {getActivityText(job.status)} {job.title}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {job.company} •{" "}
            {new Date(job.updated_at || job.created_at).toLocaleDateString()}
          </Text>
        </VStack>
      </HStack>
    );
  };

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="60px" />
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </Grid>
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            <Skeleton height="400px" />
            <Skeleton height="400px" />
          </Grid>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <VStack align="start">
            <AlertTitle>Failed to load dashboard!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              size="sm"
              onClick={loadDashboardData}
            >
              Retry
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="xl" mb={2}>
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
              👋
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Here's your career journey overview
            </Text>
          </Box>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            isLoading={loading}
          >
            Refresh
          </Button>
        </HStack>

        {/* Stats Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          <StatCard
            icon={FiBookmark}
            label="Saved Jobs"
            value={stats.saved}
            helpText="Jobs in your pipeline"
            colorScheme="blue"
          />
          <StatCard
            icon={FiTarget}
            label="Matched Jobs"
            value={stats.matched}
            helpText="High compatibility"
            colorScheme="green"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Applied Jobs"
            value={stats.applied}
            helpText="Applications sent"
            colorScheme="purple"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Avg. Match Score"
            value={`${stats.avgScore}%`}
            helpText="Your compatibility"
            colorScheme="orange"
          />
        </Grid>

        {/* Main Content Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Recent Activity */}
          <GridItem>
            <Card h="400px">
              <CardHeader>
                <HStack justify="space-between" align="center">
                  <Heading size="md">Recent Activity</Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/jobs")}
                  >
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                {recentJobs.length > 0 ? (
                  <VStack
                    spacing={0}
                    align="stretch"
                    divider={<Box h="1px" bg="gray.100" />}
                  >
                    {recentJobs.slice(0, 6).map((job) => (
                      <RecentActivityItem key={job.id} job={job} />
                    ))}
                  </VStack>
                ) : (
                  <VStack spacing={4} align="center" justify="center" h="full">
                    <Icon as={FiSearch} color="gray.300" boxSize={12} />
                    <VStack spacing={2} textAlign="center">
                      <Text fontSize="md" color="gray.500" fontWeight="medium">
                        No recent activity
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Start by searching and saving jobs to see your activity
                        here
                      </Text>
                      <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={() => navigate("/jobs")}
                      >
                        Search Jobs
                      </Button>
                    </VStack>
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>

          {/* Quick Actions */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={4}>
                  Quick Actions
                </Heading>
                <VStack spacing={4}>
                  <QuickActionCard
                    icon={FiSearch}
                    title="Search Jobs"
                    description="Find new opportunities that match your profile"
                    action="Start Search"
                    onClick={() => navigate("/jobs")}
                    colorScheme="brand"
                  />
                  <QuickActionCard
                    icon={FiUpload}
                    title={resumeExists ? "Update Resume" : "Upload Resume"}
                    description={
                      resumeExists
                        ? "Update your resume for better matching"
                        : "Upload your resume to get started"
                    }
                    action={resumeExists ? "Update File" : "Upload File"}
                    onClick={() => navigate("/resume")}
                    colorScheme="green"
                  />
                  <QuickActionCard
                    icon={FiBarChart2}
                    title="View Analytics"
                    description="Track your application progress and insights"
                    action="View Reports"
                    onClick={() => navigate("/analytics")}
                    colorScheme="purple"
                  />
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        {/* Tips Section */}
        <Card bg="brand.50" borderLeft="4px solid" borderColor="brand.500">
          <CardBody>
            <VStack spacing={3} align="start">
              <Heading size="sm" color="brand.700">
                💡 Tip of the Day
              </Heading>
              <Text color="brand.600">
                {!resumeExists && stats.total === 0
                  ? "Start by uploading your resume to get AI-powered feedback and begin your job search journey."
                  : !resumeExists
                  ? "Upload your resume to get AI-powered feedback and improve your match scores with saved jobs."
                  : stats.saved === 0
                  ? "Start searching and saving jobs that interest you to build your application pipeline."
                  : stats.applied === 0
                  ? "Consider applying to your saved jobs with high match scores to increase your chances."
                  : stats.avgScore < 70
                  ? "Review your resume feedback to improve your match scores with potential employers."
                  : "Great job! Keep monitoring your analytics to track your progress and identify new opportunities."}
              </Text>
              {!resumeExists && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={() => navigate("/resume")}
                >
                  Upload Resume
                </Button>
              )}
              {resumeExists && stats.saved === 0 && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={() => navigate("/jobs")}
                >
                  Search Jobs
                </Button>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default DashboardPage;
