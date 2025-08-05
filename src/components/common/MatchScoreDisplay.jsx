import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Animation for score reveal
const progressAnimation = keyframes`
  from {
    stroke-dasharray: 0 100;
  }
  to {
    stroke-dasharray: var(--progress) 100;
  }
`;

/**
 * Enhanced Match Score Display with animations and modern design
 */
const MatchScoreDisplay = ({
  score = 0,
  size = "120px",
  thickness = "8px",
  showLabel = true,
  showBadge = true,
  animateOnMount = true,
  variant = "default",
  ...props
}) => {
  const [displayScore, setDisplayScore] = useState(animateOnMount ? 0 : score);

  // Animate score counting on mount
  useEffect(() => {
    if (animateOnMount && score > 0) {
      const duration = 1500; // 1.5 seconds
      const steps = 60; // 60 FPS
      const increment = score / steps;
      const stepDuration = duration / steps;

      let currentScore = 0;
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
          currentScore = score;
          clearInterval(timer);
        }
        setDisplayScore(Math.round(currentScore));
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [score, animateOnMount]);

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 60) return "blue";
    if (score >= 40) return "orange";
    return "red";
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  const colorScheme = getScoreColor(displayScore);
  const scoreLabel = getScoreLabel(displayScore);

  // Color values
  const progressColor = useColorModeValue(
    `${colorScheme}.500`,
    `${colorScheme}.300`
  );
  const trackColor = useColorModeValue("neutral.200", "gray.600");
  const textColor = useColorModeValue("neutral.800", "white");
  const subtextColor = useColorModeValue("neutral.600", "gray.300");

  return (
    <VStack spacing={4} align="center" {...props}>
      {/* Circular Progress */}
      <Box position="relative">
        <CircularProgress
          value={displayScore}
          color={progressColor}
          trackColor={trackColor}
          size={size}
          thickness={thickness}
          capIsRound
          style={{
            transition: "all 0.3s ease-in-out",
          }}
        >
          <CircularProgressLabel>
            <VStack spacing={0}>
              <Text
                fontSize="2xl"
                fontWeight="800"
                color={textColor}
                fontFamily="mono"
              >
                {displayScore}%
              </Text>
              {variant === "detailed" && (
                <Text
                  fontSize="xs"
                  color={subtextColor}
                  fontWeight="500"
                  textAlign="center"
                >
                  Match
                </Text>
              )}
            </VStack>
          </CircularProgressLabel>
        </CircularProgress>

        {/* Glow effect for high scores */}
        {displayScore >= 80 && (
          <Box
            position="absolute"
            top="-2px"
            left="-2px"
            right="-2px"
            bottom="-2px"
            borderRadius="full"
            boxShadow={`0 0 20px ${progressColor}33`}
            pointerEvents="none"
          />
        )}
      </Box>

      {/* Labels */}
      {showLabel && (
        <VStack spacing={2} align="center">
          <Text
            fontSize="md"
            fontWeight="600"
            color={textColor}
            textAlign="center"
          >
            {scoreLabel}
          </Text>
          {showBadge && (
            <Badge
              colorScheme={colorScheme}
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
            >
              Score: {displayScore}%
            </Badge>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default MatchScoreDisplay;
