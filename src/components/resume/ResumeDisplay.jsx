import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  Divider,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import {
  FiFile,
  FiDownload,
  FiTrash2,
  FiCalendar,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiUser,
} from "react-icons/fi";
import { deleteResume, formatFileSize } from "../../services/resume";

const ResumeDisplay = ({ resume, onResumeDeleted, isLoading }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  // Handle resume deletion
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteResume();

      toast({
        title: "Resume deleted successfully",
        description: "Your resume has been removed from the system.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();

      // Call callback
      if (onResumeDeleted) {
        onResumeDeleted();
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete resume. Please try again.";

      toast({
        title: "Deletion failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            <Skeleton height="20px" width="80%" />
            <Skeleton height="100px" width="full" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // No resume state
  if (!resume) {
    return (
      <Card bg="gray.50" borderColor="gray.200">
        <CardBody>
          <VStack spacing={4} py={8}>
            <Icon as={FiUser} w={16} h={16} color="gray.400" />
            <VStack spacing={2} textAlign="center">
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                No resume uploaded
              </Text>
              <Text fontSize="sm" color="gray.500">
                Upload your resume to get started with AI-powered feedback and
                job matching.
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FiFile} w={6} h={6} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Current Resume
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Uploaded {formatDate(resume.uploaded_at)}
                </Text>
              </VStack>
            </HStack>
            <Badge colorScheme="green" variant="solid">
              Active
            </Badge>
          </HStack>
        </CardHeader>

        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* File Information */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
                File Information
              </Text>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" color="gray.800">
                        {resume.filename}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatFileSize(resume.file_size)}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiDownload} />}
                      isDisabled
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      leftIcon={<Icon as={FiTrash2} />}
                      onClick={onOpen}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Resume Statistics */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
                Document Analysis
              </Text>
              <HStack spacing={6}>
                <Stat>
                  <StatLabel>Text Length</StatLabel>
                  <StatNumber fontSize="md">
                    {resume.extracted_text?.length || 0} chars
                  </StatNumber>
                  <StatHelpText>
                    <Icon as={FiCalendar} mr={1} />
                    Processed
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Word Count</StatLabel>
                  <StatNumber fontSize="md">
                    {resume.extracted_text
                      ? resume.extracted_text.split(/\s+/).length
                      : 0}
                  </StatNumber>
                  <StatHelpText>Approximately</StatHelpText>
                </Stat>
              </HStack>
            </Box>

            <Divider />

            {/* Extracted Text Section */}
            <Box>
              <HStack justify="space-between" align="center" mb={3}>
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  Extracted Text Content
                </Text>
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={
                    <Icon
                      as={showExtractedText ? FiChevronUp : FiChevronDown}
                    />
                  }
                  onClick={() => setShowExtractedText(!showExtractedText)}
                  aria-label={showExtractedText ? "Hide text" : "Show text"}
                />
              </HStack>

              <Collapse in={showExtractedText}>
                <Box>
                  {resume.extracted_text ? (
                    <Textarea
                      value={resume.extracted_text}
                      readOnly
                      minH="300px"
                      bg="gray.50"
                      borderColor="gray.200"
                      fontSize="sm"
                      fontFamily="mono"
                      resize="vertical"
                      placeholder="No text content available"
                    />
                  ) : (
                    <Box
                      p={6}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      textAlign="center"
                    >
                      <Text color="gray.500" fontSize="sm">
                        No extracted text available for this resume.
                      </Text>
                    </Box>
                  )}

                  <Text fontSize="xs" color="gray.500" mt={2}>
                    This is the text content extracted from your resume file for
                    analysis.
                  </Text>
                </Box>
              </Collapse>
            </Box>

            {/* Actions Section */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
                Quick Actions
              </Text>
              <HStack spacing={3}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  leftIcon={<Icon as={FiFileText} />}
                >
                  Get Feedback
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                  leftIcon={<Icon as={FiUser} />}
                >
                  Extract Skills
                </Button>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Resume
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete your resume? This action cannot be
              undone. You will need to upload a new resume to continue using AI
              features.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ResumeDisplay;
