import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Wrap,
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
  Divider,
} from "@chakra-ui/react";
import {
  FiCode,
  FiTool,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import { extractResumeSkills } from "../../services/resume";

const ResumeSkills = ({ resumeExists }) => {
  const [skills, setSkills] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Category icons mapping
  const categoryIcons = {
    "Programming Language": FiCode,
    Framework: FiTool,
    Technology: FiTool,
    "Soft Skill": FiUsers,
    Industry: FiBriefcase,
    Certification: FiStar,
    Tool: FiTool,
    Database: FiTool,
    Other: FiTrendingUp,
  };

  // Category colors mapping
  const categoryColors = {
    "Programming Language": "blue",
    Framework: "purple",
    Technology: "green",
    "Soft Skill": "orange",
    Industry: "gray",
    Certification: "yellow",
    Tool: "cyan",
    Database: "teal",
    Other: "pink",
  };

  // Load skills data
  const loadSkills = async () => {
    if (!resumeExists) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await extractResumeSkills();
      setSkills(result);
    } catch (error) {
      console.error("Failed to extract resume skills:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to extract skills from resume.";

      setError(errorMessage);

      toast({
        title: "Skill extraction failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, [resumeExists]);

  // Group skills by category
  const groupSkillsByCategory = (extractedSkills) => {
    const grouped = {};

    extractedSkills.forEach((skill) => {
      const category = skill.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    // Sort skills within each category by confidence
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => b.confidence - a.confidence);
    });

    return grouped;
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "green";
    if (confidence >= 0.6) return "yellow";
    if (confidence >= 0.4) return "orange";
    return "red";
  };

  // Get confidence label
  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    if (confidence >= 0.4) return "Low";
    return "Very Low";
  };

  // No resume uploaded
  if (!resumeExists) {
    return (
      <Card bg="gray.50" borderColor="gray.200">
        <CardBody>
          <VStack spacing={4} py={8}>
            <Icon as={FiCode} w={16} h={16} color="gray.400" />
            <VStack spacing={2} textAlign="center">
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                No resume available
              </Text>
              <Text fontSize="sm" color="gray.500">
                Upload your resume first to extract and analyze your skills.
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton height="24px" width="200px" />
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Skeleton height="20px" width="full" />
            <Skeleton height="60px" width="full" />
            <Skeleton height="60px" width="full" />
            <Skeleton height="60px" width="full" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardBody>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2} flex={1}>
              <AlertTitle>Skills extraction failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={FiRefreshCw} />}
                onClick={loadSkills}
              >
                Try Again
              </Button>
            </VStack>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  // No skills extracted
  if (
    !skills ||
    !skills.extracted_skills ||
    skills.extracted_skills.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Extracted Skills
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={loadSkills}
            >
              Refresh
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} py={6}>
            <Icon as={FiCode} w={12} h={12} color="gray.400" />
            <VStack spacing={2} textAlign="center">
              <Text fontSize="md" fontWeight="semibold" color="gray.600">
                No skills detected
              </Text>
              <Text fontSize="sm" color="gray.500">
                We couldn't extract skills from your resume. Try uploading a
                different format.
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const groupedSkills = groupSkillsByCategory(skills.extracted_skills);
  const totalSkills = skills.extracted_skills.length;

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Extracted Skills
            </Text>
            <Text fontSize="sm" color="gray.500">
              {totalSkills} skills found across{" "}
              {Object.keys(groupedSkills).length} categories
            </Text>
          </VStack>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<Icon as={FiRefreshCw} />}
            onClick={loadSkills}
          >
            Refresh
          </Button>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Skills Overview */}
          <Box>
            <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
              Skills Overview
            </Text>
            <Wrap spacing={2}>
              {Object.entries(groupedSkills).map(
                ([category, categorySkills]) => (
                  <WrapItem key={category}>
                    <Badge
                      colorScheme={categoryColors[category] || "gray"}
                      variant="subtle"
                      px={3}
                      py={1}
                    >
                      <HStack spacing={2}>
                        <Icon as={categoryIcons[category] || FiTrendingUp} />
                        <Text>
                          {category} ({categorySkills.length})
                        </Text>
                      </HStack>
                    </Badge>
                  </WrapItem>
                )
              )}
            </Wrap>
          </Box>

          <Divider />

          {/* Skills by Category */}
          <Box>
            <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
              Skills by Category
            </Text>

            <Accordion allowMultiple defaultIndex={[0]}>
              {Object.entries(groupedSkills).map(
                ([category, categorySkills], index) => (
                  <AccordionItem
                    key={category}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    mb={2}
                  >
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <HStack spacing={3}>
                          <Icon
                            as={categoryIcons[category] || FiTrendingUp}
                            color={`${categoryColors[category] || "gray"}.500`}
                          />
                          <Text fontWeight="semibold">{category}</Text>
                          <Badge
                            colorScheme={categoryColors[category] || "gray"}
                            variant="subtle"
                          >
                            {categorySkills.length}
                          </Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel pb={4}>
                      <VStack spacing={3} align="stretch">
                        {categorySkills.map((skill, skillIndex) => (
                          <Box
                            key={skillIndex}
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <VStack spacing={2} align="stretch">
                              <HStack justify="space-between" align="center">
                                <Text fontWeight="semibold" color="gray.800">
                                  {skill.skill}
                                </Text>
                                <Badge
                                  colorScheme={getConfidenceColor(
                                    skill.confidence
                                  )}
                                  variant="solid"
                                >
                                  {getConfidenceLabel(skill.confidence)}
                                </Badge>
                              </HStack>

                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="xs" color="gray.600">
                                    Confidence Score
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {Math.round(skill.confidence * 100)}%
                                  </Text>
                                </HStack>
                                <Progress
                                  value={skill.confidence * 100}
                                  colorScheme={getConfidenceColor(
                                    skill.confidence
                                  )}
                                  size="sm"
                                  borderRadius="md"
                                />
                              </Box>

                              {skill.context && (
                                <Box>
                                  <Text fontSize="xs" color="gray.600" mb={1}>
                                    Context:
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.700"
                                    fontStyle="italic"
                                  >
                                    "{skill.context}"
                                  </Text>
                                </Box>
                              )}
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ResumeSkills;
