import React from "react";
import {
  Box,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FiCircle } from "react-icons/fi";
import { analyticsUtils } from "../../services/analytics";
import ConsistentIcon from "../common/ConsistentIcon";
import ConsistentText from "../common/ConsistentText";

const StatusSummaryChart = ({ data, isLoading = false }) => {
  // Transform data for chart
  const chartData = data ? analyticsUtils.transformStatusSummary(data) : [];

  // Colors for different statuses
  const getStatusColor = (status) => {
    return analyticsUtils.getStatusColor(status);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
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
                as={FiCircle}
                size="xs"
                context="status"
                color={data.color}
              />
              <ConsistentText variant="supportText" fontWeight="semibold">
                {data.payload.name}
              </ConsistentText>
            </HStack>
            <ConsistentText variant="supportText" color="gray.600">
              Jobs: {data.value}
            </ConsistentText>
            <ConsistentText variant="caption" color="gray.500">
              {((data.value / data.payload.total) * 100).toFixed(1)}%
            </ConsistentText>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry) => {
    const percentage = ((entry.value / entry.total) * 100).toFixed(1);
    return percentage > 5 ? `${percentage}%` : ""; // Only show label if > 5%
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <HStack justify="center" wrap="wrap" spacing={4} mt={4}>
        {payload.map((entry, index) => (
          <HStack key={index} spacing={2}>
            <ConsistentIcon
              as={FiCircle}
              size="xs"
              context="status"
              color={entry.color}
            />
            <ConsistentText variant="supportText" color="gray.600">
              {entry.value}
            </ConsistentText>
            <Badge colorScheme="gray" size="sm">
              {entry.payload.value}
            </Badge>
          </HStack>
        ))}
      </HStack>
    );
  };

  // Calculate total for percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = chartData.map((item) => ({ ...item, total }));

  // Handle empty data
  if (!data || !chartData.length) {
    return (
      <Box h="300px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={3}>
          <ConsistentIcon
            as={FiCircle}
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
              No job data available
            </ConsistentText>
            <ConsistentText variant="supportText" color="gray.400">
              Start saving jobs to see your status distribution
            </ConsistentText>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box h="300px" w="full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="45%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={renderLabel}
            labelLine={false}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getStatusColor(entry.status)}
                stroke={getStatusColor(entry.status)}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend />}
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StatusSummaryChart;
