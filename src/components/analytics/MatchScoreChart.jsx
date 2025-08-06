import React from "react";
import {
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiAward,
} from "react-icons/fi";
import { analyticsUtils } from "../../services/analytics";
import ConsistentIcon from "../common/ConsistentIcon";
import ConsistentText from "../common/ConsistentText";

const MatchScoreChart = ({ data, isLoading = false }) => {
  // Transform data
  const transformedData = data
    ? analyticsUtils.transformMatchScoreSummary(data)
    : null;

  // Chart colors
  const gridColor = useColorModeValue("#E2E8F0", "#4A5568");

  // Get bar color for each score category
  const getBarColor = (category) => {
    return analyticsUtils.getScoreColor(category);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={1} align="start">
            <ConsistentText variant="supportText" fontWeight="semibold">
              {label} Match Scores
            </ConsistentText>
            <ConsistentText variant="supportText" color="gray.600">
              Count: {data.value}
            </ConsistentText>
            <ConsistentText variant="caption" color="gray.500">
              {data.payload.percentage}% of total
            </ConsistentText>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  // Handle empty data
  if (!data || !transformedData) {
    return (
      <Box h="300px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={3}>
          <ConsistentIcon
            as={FiTarget}
            size="2xl"
            context="status"
            color="gray.300"
          />
          <VStack spacing={1} textAlign="center">
            <ConsistentText
              variant="bodyText"
              color="gray.500"
              fontWeight="medium"
            >
              No match score data available
            </ConsistentText>
            <ConsistentText variant="supportText" color="gray.400">
              Match scores will appear as you analyze job compatibility
            </ConsistentText>
          </VStack>
        </VStack>
      </Box>
    );
  }

  const { averageScore, minScore, maxScore, totalScores, distribution } =
    transformedData;

  // Filter out zero values for chart
  const chartData = distribution.filter((item) => item.count > 0);

  return (
    <VStack spacing={6} align="stretch" h="full">
      {/* Summary Stats Cards */}
      <SimpleGrid columns={{ base: 3 }} spacing={4}>
        <Card variant="outline" size="sm">
          <CardBody textAlign="center">
            <Stat>
              <StatLabel fontSize="xs" color="gray.500">
                Average Score
              </StatLabel>
              <StatNumber fontSize="xl" color="purple.500">
                {averageScore}%
              </StatNumber>
              <StatHelpText fontSize="xs">
                <ConsistentIcon
                  as={FiTarget}
                  size="xs"
                  context="status"
                  mr={1}
                />
                Overall compatibility
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card variant="outline" size="sm">
          <CardBody textAlign="center">
            <Stat>
              <StatLabel fontSize="xs" color="gray.500">
                Highest Score
              </StatLabel>
              <StatNumber fontSize="xl" color="green.500">
                {maxScore}%
              </StatNumber>
              <StatHelpText fontSize="xs">
                <ConsistentIcon
                  as={FiTrendingUp}
                  size="xs"
                  context="success"
                  mr={1}
                />
                Best match
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card variant="outline" size="sm">
          <CardBody textAlign="center">
            <Stat>
              <StatLabel fontSize="xs" color="gray.500">
                Lowest Score
              </StatLabel>
              <StatNumber fontSize="xl" color="orange.500">
                {minScore}%
              </StatNumber>
              <StatHelpText fontSize="xs">
                <ConsistentIcon
                  as={FiTrendingDown}
                  size="xs"
                  context="warning"
                  mr={1}
                />
                Needs improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Distribution Chart */}
      <Box>
        <HStack justify="space-between" align="center" mb={4}>
          <VStack align="start" spacing={0}>
            <ConsistentText variant="cardTitle" fontWeight="semibold">
              Score Distribution
            </ConsistentText>
            <ConsistentText variant="supportText" color="gray.500">
              Breakdown by compatibility level
            </ConsistentText>
          </VStack>

          <Badge colorScheme="purple" variant="subtle">
            {totalScores} jobs analyzed
          </Badge>
        </HStack>

        {chartData.length > 0 ? (
          <Box h="200px" w="full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  opacity={0.6}
                />

                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#4A5568" }}
                  tickLine={{ stroke: gridColor }}
                  axisLine={{ stroke: gridColor }}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "#4A5568" }}
                  tickLine={{ stroke: gridColor }}
                  axisLine={{ stroke: gridColor }}
                  allowDecimals={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fontSize: 12,
                    fill: "#4A5568",
                    formatter: (value) => value,
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.category)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            h="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
          >
            <VStack spacing={2}>
              <ConsistentIcon
                as={FiAward}
                size="xl"
                context="status"
                color="gray.400"
              />
              <ConsistentText variant="supportText" color="gray.500">
                No distribution data to display
              </ConsistentText>
            </VStack>
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default MatchScoreChart;
