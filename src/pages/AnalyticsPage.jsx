import React, { useState, useEffect } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Badge,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import {
  FiBarChart2,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiRefreshCw,
  FiHome,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

// Import analytics service
import { analyticsAPI, analyticsUtils } from "../services/analytics";

// Import chart components
import StatusSummaryChart from "../components/analytics/StatusSummaryChart";
import JobsOverTimeChart from "../components/analytics/JobsOverTimeChart";
import MatchScoreChart from "../components/analytics/MatchScoreChart";

const AnalyticsPage = () => {
  // State management
  const [statusSummary, setStatusSummary] = useState(null);
  const [jobsOverTime, setJobsOverTime] = useState(null);
  const [matchScoreSummary, setMatchScoreSummary] = useState(null);
  const [timePeriod, setTimePeriod] = useState("weekly");

  // Loading states
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingOverTime, setLoadingOverTime] = useState(true);
  const [loadingMatchScore, setLoadingMatchScore] = useState(true);

  // Error states
  const [statusError, setStatusError] = useState(null);
  const [overTimeError, setOverTimeError] = useState(null);
  const [matchScoreError, setMatchScoreError] = useState(null);

  const toast = useToast();

  // Load all analytics data on component mount
  useEffect(() => {
    loadAllAnalytics();
  }, []);

  // Reload jobs over time when period changes
  useEffect(() => {
    loadJobsOverTime();
  }, [timePeriod]);

  const loadAllAnalytics = async () => {
    await Promise.all([
      loadStatusSummary(),
      loadJobsOverTime(),
      loadMatchScoreSummary(),
    ]);
  };

  const loadStatusSummary = async () => {
    setLoadingStatus(true);
    setStatusError(null);

    try {
      const data = await analyticsAPI.getStatusSummary();
      setStatusSummary(data);
    } catch (error) {
      setStatusError(error.message);
      toast({
        title: "Failed to load status summary",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadJobsOverTime = async () => {
    setLoadingOverTime(true);
    setOverTimeError(null);

    try {
      const data = await analyticsAPI.getJobsOverTime(timePeriod);
      setJobsOverTime(data);
    } catch (error) {
      setOverTimeError(error.message);
      toast({
        title: "Failed to load jobs over time",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingOverTime(false);
    }
  };

  const loadMatchScoreSummary = async () => {
    setLoadingMatchScore(true);
    setMatchScoreError(null);

    try {
      const data = await analyticsAPI.getMatchScoreSummary();
      setMatchScoreSummary(data);
    } catch (error) {
      setMatchScoreError(error.message);
      toast({
        title: "Failed to load match score summary",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingMatchScore(false);
    }
  };

  const handleRefresh = () => {
    loadAllAnalytics();
  };

  const transformedMatchData = matchScoreSummary
    ? analyticsUtils.transformMatchScoreSummary(matchScoreSummary)
    : null;

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/dashboard">
              <Icon as={FiHome} mr={1} />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Analytics</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Page Header */}
        <HStack justify="space-between" align="center" wrap="wrap">
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Icon as={FiBarChart2} color="brand.500" boxSize={8} />
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                Analytics Dashboard
              </Text>
            </HStack>
            <Text fontSize="md" color="gray.600">
              Track your job search progress and performance metrics
            </Text>
          </VStack>

          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            colorScheme="brand"
            variant="outline"
            onClick={handleRefresh}
            isLoading={loadingStatus || loadingOverTime || loadingMatchScore}
            size="sm"
          >
            Refresh Data
          </Button>
        </HStack>

        {/* Quick Stats Summary */}
        {statusSummary && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel>Total Jobs</StatLabel>
              <StatNumber color="brand.500">
                {statusSummary.total_jobs}
              </StatNumber>
              <StatHelpText>All saved jobs</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Matched</StatLabel>
              <StatNumber color="green.500">
                {statusSummary.status_summary?.matched || 0}
              </StatNumber>
              <StatHelpText>Good fit jobs</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Applied</StatLabel>
              <StatNumber color="yellow.500">
                {statusSummary.status_summary?.applied || 0}
              </StatNumber>
              <StatHelpText>Applications sent</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Avg. Match Score</StatLabel>
              <StatNumber color="purple.500">
                {transformedMatchData?.averageScore || 0}%
              </StatNumber>
              <StatHelpText>Resume compatibility</StatHelpText>
            </Stat>
          </SimpleGrid>
        )}

        {/* Charts Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Job Status Summary Chart */}
          <Card>
            <CardHeader>
              <HStack spacing={3}>
                <Icon as={FiTarget} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Job Status Distribution
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Current status breakdown
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody>
              {loadingStatus ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" color="brand.500" />
                </Box>
              ) : statusError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Failed to load!</AlertTitle>
                  <AlertDescription>{statusError}</AlertDescription>
                </Alert>
              ) : (
                <StatusSummaryChart
                  data={statusSummary}
                  isLoading={loadingStatus}
                />
              )}
            </CardBody>
          </Card>

          {/* Jobs Over Time Chart */}
          <Card>
            <CardHeader>
              <HStack justify="space-between" align="center">
                <HStack spacing={3}>
                  <Icon as={FiTrendingUp} color="green.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="semibold">
                      Jobs Over Time
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Job activity trends
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={2}>
                  <Button
                    size="xs"
                    variant={timePeriod === "weekly" ? "solid" : "ghost"}
                    colorScheme="brand"
                    onClick={() => setTimePeriod("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    size="xs"
                    variant={timePeriod === "monthly" ? "solid" : "ghost"}
                    colorScheme="brand"
                    onClick={() => setTimePeriod("monthly")}
                  >
                    Monthly
                  </Button>
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody>
              {loadingOverTime ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" color="brand.500" />
                </Box>
              ) : overTimeError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Failed to load!</AlertTitle>
                  <AlertDescription>{overTimeError}</AlertDescription>
                </Alert>
              ) : (
                <JobsOverTimeChart
                  data={jobsOverTime}
                  period={timePeriod}
                  isLoading={loadingOverTime}
                />
              )}
            </CardBody>
          </Card>

          {/* Match Score Summary - Full Width */}
          <Card gridColumn={{ base: "1", lg: "1 / -1" }}>
            <CardHeader>
              <HStack spacing={3}>
                <Icon as={FiUsers} color="purple.500" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Match Score Analysis
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Resume compatibility metrics
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody>
              {loadingMatchScore ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" color="brand.500" />
                </Box>
              ) : matchScoreError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Failed to load!</AlertTitle>
                  <AlertDescription>{matchScoreError}</AlertDescription>
                </Alert>
              ) : (
                <MatchScoreChart
                  data={matchScoreSummary}
                  isLoading={loadingMatchScore}
                />
              )}
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AnalyticsPage;
