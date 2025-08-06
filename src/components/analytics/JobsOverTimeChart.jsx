import React from "react";
import {
  Box,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { FiTrendingUp, FiCalendar } from "react-icons/fi";
import { analyticsUtils } from "../../services/analytics";
import ConsistentIcon from "../common/ConsistentIcon";
import ConsistentText from "../common/ConsistentText";

const JobsOverTimeChart = ({ data, period = "weekly", isLoading = false }) => {
  // Transform data for chart
  const chartData = data ? analyticsUtils.transformJobsOverTime(data) : [];

  // Chart colors
  const lineColor = "#3182CE"; // blue.500
  const areaColor = "#EBF8FF"; // blue.50
  const gridColor = useColorModeValue("#E2E8F0", "#4A5568"); // gray.300/600

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
            <HStack spacing={2}>
              <ConsistentIcon
                as={FiCalendar}
                size="xs"
                context="status"
                color="blue.500"
              />
              <ConsistentText variant="supportText" fontWeight="semibold">
                {data.payload.displayPeriod}
              </ConsistentText>
            </HStack>
            <ConsistentText variant="supportText" color="gray.600">
              Jobs: {data.value}
            </ConsistentText>
            <ConsistentText variant="caption" color="gray.500">
              {period === "weekly" ? "Weekly total" : "Monthly total"}
            </ConsistentText>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  // Handle empty data
  if (!data || !chartData.length) {
    return (
      <Box h="300px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={3}>
          <ConsistentIcon
            as={FiTrendingUp}
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
              No activity data available
            </ConsistentText>
            <ConsistentText variant="supportText" color="gray.400">
              Job activity will appear here as you save jobs
            </ConsistentText>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Calculate trend
  const trend =
    chartData.length > 1
      ? chartData[chartData.length - 1].count -
        chartData[chartData.length - 2].count
      : 0;

  const trendColor =
    trend > 0 ? "green.500" : trend < 0 ? "red.500" : "gray.500";
  const trendIcon = trend > 0 ? "↗" : trend < 0 ? "↘" : "→";

  return (
    <Box h="300px" w="full">
      {/* Chart Header Stats */}
      <HStack justify="space-between" align="center" mb={3}>
        <HStack spacing={2}>
          <ConsistentText variant="supportText" color="gray.600">
            Total Jobs:
          </ConsistentText>
          <Badge colorScheme="blue" variant="subtle">
            {chartData.reduce((sum, item) => sum + item.count, 0)}
          </Badge>
        </HStack>

        {trend !== 0 && (
          <HStack spacing={1}>
            <ConsistentText variant="caption" color="gray.500">
              Trend:
            </ConsistentText>
            <ConsistentText
              variant="caption"
              color={trendColor}
              fontWeight="medium"
            >
              {trendIcon} {Math.abs(trend)}
            </ConsistentText>
          </HStack>
        )}
      </HStack>

      {/* Chart */}
      <Box h="260px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              opacity={0.6}
            />

            <XAxis
              dataKey="displayPeriod"
              tick={{ fontSize: 12, fill: "#4A5568" }}
              tickLine={{ stroke: gridColor }}
              axisLine={{ stroke: gridColor }}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#4A5568" }}
              tickLine={{ stroke: gridColor }}
              axisLine={{ stroke: gridColor }}
              domain={[0, "dataMax"]}
              allowDecimals={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={3}
              fill="url(#colorJobs)"
              dot={{
                fill: lineColor,
                strokeWidth: 2,
                stroke: "#fff",
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: lineColor,
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default JobsOverTimeChart;
