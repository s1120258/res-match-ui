import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Box,
  Heading,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import ConsistentIcon from "./ConsistentIcon";
import ConsistentText from "./ConsistentText";

/**
 * Enhanced Card Component with modern design patterns
 * Features: improved shadows, hover effects, customizable variants
 */
const EnhancedCard = ({
  children,
  title,
  subtitle,
  icon,
  iconColor = "brand.500",
  variant = "default",
  isInteractive = false,
  onClick,
  headerAction,
  ...props
}) => {
  // Enhanced shadow values based on variant
  const shadowMap = {
    default: "soft",
    elevated: "medium",
    floating: "large",
  };

  // Background colors for different states
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("neutral.200", "gray.600");

  const cardVariant = isInteractive ? "interactive" : variant;

  return (
    <Card
      variant={cardVariant}
      bg={bgColor}
      borderColor={borderColor}
      cursor={isInteractive ? "pointer" : "default"}
      onClick={onClick}
      boxShadow={shadowMap[variant]}
      {...props}
    >
      {(title || icon || headerAction) && (
        <CardHeader pb={title && !subtitle ? 4 : 2}>
          <HStack justify="space-between" align="start">
            <HStack spacing={3} align="center">
              {icon && (
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={`${iconColor.split(".")[0]}.50`}
                >
                  <ConsistentIcon
                    as={icon}
                    size="md"
                    context="action"
                    color={iconColor}
                  />
                </Box>
              )}
              {title && (
                <VStack spacing={1} align="start">
                  <ConsistentText
                    variant="cardTitle"
                    color="neutral.800"
                    lineHeight="1.3"
                  >
                    {title}
                  </ConsistentText>
                  {subtitle && (
                    <ConsistentText
                      variant="supportText"
                      color="neutral.500"
                      lineHeight="1.4"
                    >
                      {subtitle}
                    </ConsistentText>
                  )}
                </VStack>
              )}
            </HStack>
            {headerAction && <Box flexShrink={0}>{headerAction}</Box>}
          </HStack>
        </CardHeader>
      )}
      <CardBody pt={title || icon ? 0 : 6}>{children}</CardBody>
    </Card>
  );
};

export default EnhancedCard;
