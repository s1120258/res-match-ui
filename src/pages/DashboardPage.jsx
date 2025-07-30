import React from "react";
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
} from "@chakra-ui/react";
import {
  FiBookmark,
  FiTarget,
  FiCheckCircle,
  FiTrendingUp,
  FiSearch,
  FiUpload,
  FiBarChart3,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  // Placeholder data - will be replaced with real API calls
  const stats = {
    saved: 24,
    matched: 8,
    applied: 3,
    avgScore: 76.5,
  };

  const QuickActionCard = ({
    icon,
    title,
    description,
    action,
    colorScheme = "brand",
  }) => (
    <Card
      h="full"
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      transition="all 0.2s"
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

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Welcome back, {user?.full_name?.split(" ")[0] || "User"}! 👋
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Here's your career journey overview
          </Text>
        </Box>

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
                <Heading size="md">Recent Activity</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {/* Placeholder content - will be replaced with real activity feed */}
                  <Skeleton height="60px" />
                  <Skeleton height="60px" />
                  <Skeleton height="60px" />
                  <SkeletonText noOfLines={2} />
                </VStack>
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
                    colorScheme="brand"
                  />
                  <QuickActionCard
                    icon={FiUpload}
                    title="Upload Resume"
                    description="Update your resume for better matching"
                    action="Upload File"
                    colorScheme="green"
                  />
                  <QuickActionCard
                    icon={FiBarChart3}
                    title="View Analytics"
                    description="Track your application progress"
                    action="View Reports"
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
                Upload your latest resume to get AI-powered feedback and improve
                your match scores with potential employers.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default DashboardPage;
