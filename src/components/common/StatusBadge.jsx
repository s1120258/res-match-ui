import React from "react";
import { Badge, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import {
  FiBookmark,
  FiTarget,
  FiCheckCircle,
  FiSend,
  FiClock,
  FiX,
  FiEye,
} from "react-icons/fi";

/**
 * Enhanced Status Badge with modern design and icons
 */
const StatusBadge = ({
  status,
  variant = "subtle",
  size = "md",
  showIcon = true,
  ...props
}) => {
  // Status configuration with colors and icons
  const statusConfig = {
    saved: {
      colorScheme: "blue",
      label: "Saved",
      icon: FiBookmark,
    },
    matched: {
      colorScheme: "green",
      label: "Matched",
      icon: FiTarget,
    },
    applied: {
      colorScheme: "purple",
      label: "Applied",
      icon: FiSend,
    },
    completed: {
      colorScheme: "green",
      label: "Completed",
      icon: FiCheckCircle,
    },
    pending: {
      colorScheme: "orange",
      label: "Pending",
      icon: FiClock,
    },
    rejected: {
      colorScheme: "red",
      label: "Rejected",
      icon: FiX,
    },
    viewed: {
      colorScheme: "gray",
      label: "Viewed",
      icon: FiEye,
    },
    interview: {
      colorScheme: "cyan",
      label: "Interview",
      icon: FiCheckCircle,
    },
    offer: {
      colorScheme: "teal",
      label: "Offer",
      icon: FiCheckCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.viewed;

  // Size configurations
  const sizeConfig = {
    sm: {
      fontSize: "xs",
      px: 2,
      py: 1,
      iconSize: 3,
    },
    md: {
      fontSize: "sm",
      px: 3,
      py: 1.5,
      iconSize: 4,
    },
    lg: {
      fontSize: "md",
      px: 4,
      py: 2,
      iconSize: 5,
    },
  };

  const sizeProps = sizeConfig[size];

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant={variant}
      borderRadius="full"
      fontWeight="600"
      fontSize={sizeProps.fontSize}
      px={sizeProps.px}
      py={sizeProps.py}
      display="inline-flex"
      alignItems="center"
      gap={showIcon ? 1 : 0}
      {...props}
    >
      <HStack spacing={1} align="center">
        {showIcon && (
          <Icon as={config.icon} boxSize={sizeProps.iconSize} opacity={0.8} />
        )}
        {config.label}
      </HStack>
    </Badge>
  );
};

export default StatusBadge;
