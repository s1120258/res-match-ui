import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Badge,
  Flex,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiTarget, FiFileText, FiFolder, FiArrowRight } from "react-icons/fi";
import logoImage from "../assets/icons/custom/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");

  const features = [
    {
      icon: FiTarget,
      title: "Smart Job Matching",
      description: "Find jobs where you'll actually thrive",
      details: [
        "Get a match score for every opportunity",
        "See exactly which skills to develop next",
        "Stop applying to wrong-fit positions",
      ],
      color: "blue",
    },
    {
      icon: FiFileText,
      title: "Resume Optimization",
      description: "Turn your resume into an interview magnet",
      details: [
        "Instantly extract and highlight your best skills",
        "Get specific fixes that actually work",
        "Tailor your resume for each application",
      ],
      color: "green",
    },
    {
      icon: FiFolder,
      title: "Organized Job Search",
      description: "Never lose track of opportunities again",
      details: [
        "AI breaks down job posts into key points",
        "Save and organize with one click",
        "Track your progress with clear analytics",
      ],
      color: "orange",
    },
  ];

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Container maxW="7xl" py={6}>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Image src={logoImage} alt="ResMatch Logo" boxSize="40px" />
            <Heading size="lg" color="blue.500">
              ResMatch
            </Heading>
          </HStack>
          <HStack spacing={4}>
            <Button variant="ghost" colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
            <Button colorScheme="blue" onClick={handleGetStarted}>
              Sign Up
            </Button>
          </HStack>
        </Flex>
      </Container>

      {/* Hero Section */}
      <Container maxW="6xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={8} textAlign="center">
          <Badge
            colorScheme="blue"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
          >
            AI-Powered Career Support Platform
          </Badge>

          <VStack spacing={6}>
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              lineHeight="shorter"
              maxW="4xl"
            >
              Make Smarter{" "}
              <Text as="span" color="blue.500">
                Career Decisions
              </Text>{" "}
              with AI
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Stop guessing which jobs are right for you. ResMatch analyzes your
              resume and matches you with opportunities where you'll actually
              succeed. Get personalized insights that turn job hunting into
              career building.
            </Text>
          </VStack>

          <HStack spacing={4} pt={4}>
            <Button
              size="lg"
              colorScheme="blue"
              rightIcon={<Icon as={FiArrowRight} />}
              onClick={handleGetStarted}
            >
              Get My Match Score
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="blue"
              onClick={handleLogin}
            >
              Login
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="7xl" py={{ base: 16, md: 20 }}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Badge
              colorScheme="gray"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
            >
              Key Features
            </Badge>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              Everything You Need to Land Your Dream Job
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Skip the guesswork. Our AI shows you exactly where you fit and how
              to get there.
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 10 }}
            w="full"
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={cardBg}
                p={8}
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "xl",
                  borderColor: `${feature.color}.200`,
                }}
                transition="all 0.3s"
              >
                <VStack spacing={6} align="start">
                  <Box
                    p={3}
                    bg={`${feature.color}.50`}
                    borderRadius="lg"
                    border="1px"
                    borderColor={`${feature.color}.200`}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={6}
                      color={`${feature.color}.500`}
                    />
                  </Box>

                  <VStack spacing={3} align="start">
                    <Heading size="md">{feature.title}</Heading>
                    <Text color={textColor} fontWeight="medium">
                      {feature.description}
                    </Text>
                    <VStack spacing={2} align="start">
                      {feature.details.map((detail, detailIndex) => (
                        <Text
                          key={detailIndex}
                          fontSize="sm"
                          color={textColor}
                          pl={4}
                          position="relative"
                          _before={{
                            content: '"•"',
                            position: "absolute",
                            left: 0,
                            color: `${feature.color}.500`,
                            fontWeight: "bold",
                          }}
                        >
                          {detail}
                        </Text>
                      ))}
                    </VStack>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="blue.50" py={{ base: 16, md: 20 }}>
        <Container maxW="4xl">
          <VStack spacing={8} textAlign="center">
            <VStack spacing={4}>
              <Heading fontSize={{ base: "2xl", md: "3xl" }}>
                Ready to Find Your Perfect Job Match?
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Join thousands of job seekers who've found their dream roles.
                Upload your resume and get your personalized match report in
                under 60 seconds.
              </Text>
            </VStack>

            <VStack spacing={4}>
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<Icon as={FiArrowRight} />}
                onClick={handleGetStarted}
              >
                Get My Free Match Report
              </Button>
              <Text fontSize="sm" color={textColor}>
                100% Free • No credit card required • Takes less than 2 minutes
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white" py={8}>
        <Container maxW="7xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Heading size="md" color="blue.400">
              ResMatch
            </Heading>
            <Text fontSize="sm" color="gray.400">
              © 2024 ResMatch. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
