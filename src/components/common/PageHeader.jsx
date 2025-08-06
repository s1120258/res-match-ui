import React from "react";
import {
  Box,
  HStack,
  VStack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ConsistentIcon from "./ConsistentIcon";
import ConsistentText from "./ConsistentText";

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
  const borderColor = useColorModeValue("neutral.200", "gray.600");

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
            separator={<ChevronRightIcon color="neutral.400" boxSize={3} />}
          >
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem
                key={index}
                isCurrentPage={index === breadcrumbs.length - 1}
              >
                <BreadcrumbLink
                  href={crumb.href}
                  color={
                    index === breadcrumbs.length - 1
                      ? "neutral.800"
                      : "neutral.500"
                  }
                  fontWeight={index === breadcrumbs.length - 1 ? "600" : "400"}
                >
                  <ConsistentText variant="supportText">
                    {crumb.label}
                  </ConsistentText>
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
                <ConsistentIcon
                  as={icon}
                  size="lg"
                  context="action"
                  color="brand.500"
                />
              </Box>
            )}

            <VStack spacing={1} align="start" flex={1}>
              <ConsistentText variant="pageTitle">{title}</ConsistentText>
              {subtitle && (
                <ConsistentText variant="supportText" color="neutral.600">
                  {subtitle}
                </ConsistentText>
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
