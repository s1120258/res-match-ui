import React from "react";
import {
  Box,
  HStack,
  VStack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

/**
 * Standardized Page Header Component
 *
 * @param {string} title - Main page title
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.Component} icon - Optional icon for the page
 * @param {Array} breadcrumbs - Optional breadcrumb navigation
 * @param {React.ReactNode} action - Optional action button(s)
 * @param {object} props - Additional props
 */
const PageHeader = ({
  title,
  subtitle,
  icon,
  breadcrumbs,
  action,
  ...props
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg="white"
      borderBottomWidth="1px"
      borderColor={borderColor}
      px={6}
      py={6}
      {...props}
    >
      <VStack spacing={4} align="stretch">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            spacing={2}
            separator={
              <Icon as={FiChevronRight} color="gray.400" boxSize={3} />
            }
          >
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem
                key={index}
                isCurrentPage={index === breadcrumbs.length - 1}
              >
                <BreadcrumbLink
                  as={RouterLink}
                  to={crumb.href}
                  color={
                    index === breadcrumbs.length - 1 ? "gray.800" : "gray.500"
                  }
                  fontWeight={index === breadcrumbs.length - 1 ? "600" : "400"}
                  fontSize="sm"
                >
                  {crumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}

        {/* Title Row */}
        <Flex justify="space-between" align="flex-start" gap={4}>
          <HStack spacing={4} align="center" flex={1}>
            {icon && (
              <Box p={3} borderRadius="xl" bg="brand.50" flexShrink={0}>
                <Icon as={icon} boxSize={6} color="brand.500" />
              </Box>
            )}

            <VStack spacing={1} align="start" flex={1}>
              <Text
                fontSize={["lg", "xl", "2xl"]}
                fontWeight="800"
                lineHeight="1.2"
                letterSpacing="-0.02em"
                color="gray.800"
              >
                {title}
              </Text>
              {subtitle && (
                <Text fontSize={["sm", "md"]} lineHeight="1.5" color="gray.600">
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Action Buttons */}
          {action && <Box flexShrink={0}>{action}</Box>}
        </Flex>
      </VStack>
    </Box>
  );
};

export default PageHeader;
