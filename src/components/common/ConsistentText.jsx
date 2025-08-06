import React from "react";
import { Text, useTheme } from "@chakra-ui/react";

/**
 * Consistent Text component using design system text variants
 *
 * @param {string} variant - Text variant: pageTitle, sectionTitle, cardTitle, bodyText, supportText, caption
 * @param {React.ReactNode} children - Text content
 * @param {object} props - Additional Chakra UI Text props
 */
const ConsistentText = ({ variant = "bodyText", children, ...props }) => {
  const theme = useTheme();

  // Get text styles from design tokens with fallback
  const textStyle =
    theme.designTokens?.textVariants?.[variant] || theme.textStyles?.[variant];

  return (
    <Text {...textStyle} {...props}>
      {children}
    </Text>
  );
};

export default ConsistentText;
