import React from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Box,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import EnhancedCard from "./EnhancedCard";

// Animation for number counting effect
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Enhanced Stat Card with modern design and animations
 */
const StatCard = ({
  icon,
  label,
  value,
  helpText,
  trend,
  trendValue,
  colorScheme = "brand",
  isLoading = false,
  animateValue = true,
  ...props
}) => {
  const iconBgColor = useColorModeValue(
    `${colorScheme}.50`,
    `${colorScheme}.900`
  );
  const iconColor = useColorModeValue(
    `${colorScheme}.500`,
    `${colorScheme}.200`
  );
  const valueColor = useColorModeValue("neutral.800", "white");
  const labelColor = useColorModeValue("neutral.600", "gray.400");
  const helpColor = useColorModeValue("neutral.500", "gray.500");

  return (
    <EnhancedCard variant="elevated" isInteractive {...props}>
      <VStack spacing={4} align="stretch">
        {/* Icon and Label Row */}
        <HStack spacing={3} align="center">
          {icon && (
            <Box
              p={3}
              borderRadius="xl"
              bg={iconBgColor}
              transition="all 0.2s"
              _hover={{
                transform: "scale(1.05)",
              }}
            >
              <Icon as={icon} color={iconColor} boxSize={6} />
            </Box>
          )}
          <Box flex={1}>
            <StatLabel fontSize="sm" fontWeight="500" color={labelColor} mb={1}>
              {label}
            </StatLabel>
          </Box>
        </HStack>

        {/* Value and Trend */}
        <Stat>
          <HStack justify="space-between" align="baseline">
            <StatNumber
              fontSize="3xl"
              fontWeight="700"
              color={valueColor}
              fontFamily="mono"
              animation={animateValue ? `${fadeInUp} 0.6s ease-out` : undefined}
            >
              {isLoading ? "—" : value}
            </StatNumber>

            {trend && trendValue && (
              <VStack spacing={0} align="end">
                <HStack spacing={1} align="center">
                  <StatArrow
                    type={trend === "increase" ? "increase" : "decrease"}
                  />
                  <StatNumber
                    fontSize="sm"
                    fontWeight="600"
                    color={trend === "increase" ? "green.500" : "red.500"}
                  >
                    {trendValue}
                  </StatNumber>
                </HStack>
              </VStack>
            )}
          </HStack>

          {helpText && (
            <StatHelpText
              fontSize="xs"
              color={helpColor}
              mt={2}
              fontWeight="500"
            >
              {helpText}
            </StatHelpText>
          )}
        </Stat>
      </VStack>
    </EnhancedCard>
  );
};

export default StatCard;
