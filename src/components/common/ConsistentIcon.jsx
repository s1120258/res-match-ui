import React from "react";
import { Icon, useTheme } from "@chakra-ui/react";

/**
 * Consistent Icon component with standardized sizing based on design tokens
 *
 * @param {string} size - Icon size: xs, sm, md, lg, xl, 2xl
 * @param {string} context - Usage context for semantic coloring: navigation, action, status, general
 * @param {string} color - Override color
 * @param {React.Component} as - Icon component from react-icons
 * @param {object} props - Additional Chakra UI Icon props
 */
const ConsistentIcon = ({
  as,
  size = "md",
  context = "general",
  color,
  ...props
}) => {
  const theme = useTheme();

  // Get size from design tokens with fallback
  const iconSize = theme.designTokens?.iconSizes?.[size] || 5;

  // Context-based color defaults for semantic consistency
  const contextColors = {
    navigation: "neutral.600",
    action: "brand.500",
    status: "neutral.500",
    success: "green.500",
    warning: "orange.500",
    error: "red.500",
    general: "current",
  };

  const iconColor = color || contextColors[context];

  return <Icon as={as} boxSize={iconSize} color={iconColor} {...props} />;
};

export default ConsistentIcon;
