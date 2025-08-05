import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  VStack,
  HStack,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
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
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Enhanced components
import EnhancedCard from "../components/common/EnhancedCard";
import StatCard from "../components/common/StatCard";
import MatchScoreDisplay from "../components/common/MatchScoreDisplay";
import StatusBadge from "../components/common/StatusBadge";

// Import services
import { analyticsAPI } from "../services/analytics";
import { jobsAPI } from "../services/jobs";
import { hasResume } from "../services/resume";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Color values
  const bgColor = useColorModeValue("neutral.50", "gray.900");
  const welcomeCardBg = useColorModeValue("brand.500", "brand.600");

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
    isHighlighted = false,
  }) => (
    <EnhancedCard
      isInteractive
      onClick={onClick}
      variant="elevated"
      h="full"
      borderLeft={isHighlighted ? "4px solid" : undefined}
      borderColor={isHighlighted ? `${colorScheme}.500` : undefined}
      bg={isHighlighted ? `${colorScheme}.50` : "white"}
    >
      <VStack spacing={4} align="start" h="full">
        <Box
          p={3}
          borderRadius="xl"
          bg={`${colorScheme}.100`}
          alignSelf="start"
        >
          <Icon as={icon} color={`${colorScheme}.600`} boxSize={6} />
        </Box>

        <VStack spacing={2} align="start" flex={1}>
          <Heading size="md" fontWeight="600" color="neutral.800">
            {title}
          </Heading>
          <Text color="neutral.600" fontSize="sm" lineHeight="1.5">
            {description}
          </Text>
        </VStack>

        <HStack
          w="full"
          justify="space-between"
          align="center"
          pt={2}
          borderTop="1px solid"
          borderColor="neutral.100"
        >
          <Text fontSize="sm" fontWeight="600" color={`${colorScheme}.600`}>
            {action}
          </Text>
          <Icon as={FiArrowRight} color={`${colorScheme}.500`} boxSize={4} />
        </HStack>
      </VStack>
    </EnhancedCard>
  );

  // Recent activity component with enhanced design
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
        spacing={4}
        p={4}
        _hover={{ bg: "neutral.50" }}
        borderRadius="lg"
        cursor="pointer"
        onClick={() => navigate(`/jobs/${job.id}`)}
        transition="all 0.2s"
      >
        <Box
          w={3}
          h={3}
          bg={`${getActivityColor(job.status)}.500`}
          borderRadius="full"
          flexShrink={0}
        />
        <VStack spacing={1} align="start" flex={1}>
          <Text
            fontSize="sm"
            fontWeight="600"
            noOfLines={1}
            color="neutral.800"
          >
            {getActivityText(job.status)} {job.title}
          </Text>
          <HStack spacing={2}>
            <Text fontSize="xs" color="neutral.500" noOfLines={1}>
              {job.company}
            </Text>
            <Box w={1} h={1} bg="neutral.300" borderRadius="full" />
            <Text fontSize="xs" color="neutral.500">
              {new Date(job.updated_at || job.created_at).toLocaleDateString()}
            </Text>
          </HStack>
        </VStack>
        <StatusBadge status={job.status} size="sm" variant="subtle" />
      </HStack>
    );
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Skeleton height="80px" borderRadius="xl" />
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="140px" borderRadius="xl" />
              ))}
            </Grid>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
              <Skeleton height="500px" borderRadius="xl" />
              <Skeleton height="500px" borderRadius="xl" />
            </Grid>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="7xl" py={8}>
          <Alert
            status="error"
            borderRadius="xl"
            p={6}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Failed to load dashboard!
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb={4}>
              {error}
            </AlertDescription>
            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              colorScheme="red"
              variant="outline"
              onClick={loadDashboardData}
            >
              Try Again
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Header with enhanced design */}
          <EnhancedCard
            variant="elevated"
            bg={welcomeCardBg}
            color="white"
            borderWidth={0}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <Heading
                  size="xl"
                  fontWeight="700"
                  textShadow="0 1px 3px rgba(0,0,0,0.1)"
                >
                  Welcome back
                  {user?.firstname && user?.lastname
                    ? `, ${user.firstname}`
                    : user?.email
                    ? `, ${user.email.split("@")[0]}`
                    : ""}
                  ! 👋
                </Heading>
                <Text opacity={0.9} fontSize="lg">
                  Here's your career journey overview
                </Text>
              </VStack>
              <Button
                leftIcon={<Icon as={FiRefreshCw} />}
                variant="outline"
                colorScheme="whiteAlpha"
                color="white"
                borderColor="rgba(255,255,255,0.3)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.5)",
                }}
                onClick={loadDashboardData}
                isLoading={loading}
              >
                Refresh
              </Button>
            </HStack>
          </EnhancedCard>

          {/* Enhanced Stats Grid */}
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
              trend={stats.saved > 5 ? "increase" : undefined}
              trendValue={stats.saved > 5 ? "+12%" : undefined}
            />
            <StatCard
              icon={FiTarget}
              label="Matched Jobs"
              value={stats.matched}
              helpText="High compatibility"
              colorScheme="green"
              trend={stats.matched > 0 ? "increase" : undefined}
              trendValue={stats.matched > 0 ? "+8%" : undefined}
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
              trend={stats.avgScore > 70 ? "increase" : "decrease"}
              trendValue={stats.avgScore > 70 ? "+5%" : "-3%"}
            />
          </Grid>

          {/* Main Content Grid */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            {/* Recent Activity with enhanced design */}
            <GridItem>
              <EnhancedCard
                title="Recent Activity"
                icon={FiActivity}
                iconColor="brand.500"
                variant="elevated"
                headerAction={
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<FiArrowRight />}
                    onClick={() => navigate("/jobs")}
                  >
                    View All
                  </Button>
                }
              >
                <Box h="400px" overflowY="auto">
                  {recentJobs.length > 0 ? (
                    <VStack spacing={0} align="stretch" divider={<Divider />}>
                      {recentJobs.slice(0, 6).map((job) => (
                        <RecentActivityItem key={job.id} job={job} />
                      ))}
                    </VStack>
                  ) : (
                    <VStack
                      spacing={6}
                      align="center"
                      justify="center"
                      h="full"
                    >
                      <Box
                        p={6}
                        borderRadius="full"
                        bg="neutral.100"
                        color="neutral.400"
                      >
                        <Icon as={FiSearch} boxSize={12} />
                      </Box>
                      <VStack spacing={3} textAlign="center" maxW="sm">
                        <Heading size="md" color="neutral.600">
                          No recent activity
                        </Heading>
                        <Text
                          fontSize="sm"
                          color="neutral.500"
                          lineHeight="1.6"
                        >
                          Start by searching and saving jobs to see your
                          activity here
                        </Text>
                        <Button
                          colorScheme="brand"
                          leftIcon={<FiSearch />}
                          onClick={() => navigate("/jobs")}
                        >
                          Search Jobs
                        </Button>
                      </VStack>
                    </VStack>
                  )}
                </Box>
              </EnhancedCard>
            </GridItem>

            {/* Quick Actions & Match Score */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Match Score Display */}
                {stats.avgScore > 0 && (
                  <EnhancedCard
                    title="Your Match Score"
                    subtitle="Overall compatibility with saved jobs"
                    variant="elevated"
                  >
                    <Box textAlign="center" py={4}>
                      <MatchScoreDisplay
                        score={stats.avgScore}
                        size="140px"
                        thickness="12px"
                        animateOnMount
                        variant="detailed"
                      />
                    </Box>
                  </EnhancedCard>
                )}

                {/* Quick Actions */}
                <EnhancedCard
                  title="Quick Actions"
                  subtitle="Jump start your career journey"
                  variant="elevated"
                >
                  <VStack spacing={4}>
                    <QuickActionCard
                      icon={FiSearch}
                      title="Search Jobs"
                      description="Find new opportunities that match your profile"
                      action="Start Searching"
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
                      isHighlighted={!resumeExists}
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
                </EnhancedCard>
              </VStack>
            </GridItem>
          </Grid>

          {/* Enhanced Tips Section */}
          <EnhancedCard
            variant="elevated"
            bg="brand.50"
            borderLeft="4px solid"
            borderColor="brand.500"
          >
            <VStack spacing={4} align="start">
              <HStack spacing={3}>
                <Box p={2} borderRadius="lg" bg="brand.100">
                  <Text fontSize="xl">💡</Text>
                </Box>
                <Heading size="md" color="brand.700">
                  Tip of the Day
                </Heading>
              </HStack>
              <Text color="brand.600" lineHeight="1.6">
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
              {(!resumeExists || (resumeExists && stats.saved === 0)) && (
                <Button
                  colorScheme="brand"
                  leftIcon={<Icon as={!resumeExists ? FiUpload : FiSearch} />}
                  onClick={() => navigate(!resumeExists ? "/resume" : "/jobs")}
                >
                  {!resumeExists ? "Upload Resume" : "Search Jobs"}
                </Button>
              )}
            </VStack>
          </EnhancedCard>
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
