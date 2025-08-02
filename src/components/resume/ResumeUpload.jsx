import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  useToast,
  Spinner,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FiUploadCloud, FiFile, FiCheck } from "react-icons/fi";
import {
  uploadResume,
  validateResumeFile,
  formatFileSize,
} from "../../services/resume";

const ResumeUpload = ({ onUploadSuccess, onUploadError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Handle file selection (both drag & drop and click)
  const handleFileSelect = (file) => {
    const validation = validateResumeFile(file);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Upload the selected file
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadResume(selectedFile);

      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been processed and skills extracted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset state
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      console.error("Upload failed:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Upload failed. Please try again.";

      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);

      toast({
        title: "Upload failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // Call error callback
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={6}>
          {/* Upload Area */}
          <Box
            w="full"
            h="200px"
            border="2px dashed"
            borderColor={
              isDragOver ? "blue.400" : error ? "red.300" : "gray.300"
            }
            borderRadius="lg"
            bg={isDragOver ? "blue.50" : error ? "red.50" : "gray.50"}
            position="relative"
            cursor="pointer"
            transition="all 0.2s"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            _hover={{
              borderColor: "blue.400",
              bg: "blue.50",
            }}
          >
            <VStack spacing={4} align="center" justify="center" h="full" p={6}>
              <Icon
                as={FiUploadCloud}
                w={12}
                h={12}
                color={isDragOver ? "blue.500" : "gray.400"}
              />
              <VStack spacing={2}>
                <Text fontWeight="semibold" color="gray.700">
                  {isDragOver ? "Drop your resume here" : "Upload your resume"}
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Drag and drop your file here, or click to browse
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Supports PDF and Word documents (max 10MB)
                </Text>
              </VStack>
            </VStack>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />
          </Box>

          {/* Error Message */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle>Upload Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Selected File Info */}
          {selectedFile && !isUploading && (
            <Card
              w="full"
              bg="blue.50"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <CardBody>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Icon as={FiFile} color="blue.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" color="blue.700">
                        {selectedFile.name}
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        {formatFileSize(selectedFile.size)}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      onClick={handleClear}
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={handleUpload}
                      leftIcon={<Icon as={FiUploadCloud} />}
                    >
                      Upload
                    </Button>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Box w="full">
              <VStack spacing={4}>
                <HStack spacing={3} w="full" justify="center">
                  <Spinner size="sm" color="blue.500" />
                  <Text fontWeight="semibold" color="blue.700">
                    Uploading and processing resume...
                  </Text>
                </HStack>
                <Box w="full">
                  <Progress
                    value={uploadProgress}
                    colorScheme="blue"
                    size="lg"
                    borderRadius="md"
                    bg="blue.100"
                  />
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    textAlign="center"
                    mt={2}
                  >
                    {uploadProgress}% completed
                  </Text>
                </Box>
                {uploadProgress === 100 && (
                  <HStack spacing={2} color="green.600">
                    <Icon as={FiCheck} />
                    <Text fontSize="sm" fontWeight="semibold">
                      Processing complete! Extracting skills...
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Box>
          )}

          {/* Instructions */}
          {!selectedFile && !isUploading && (
            <VStack spacing={2} textAlign="center">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                Supported formats:
              </Text>
              <HStack spacing={4} fontSize="sm" color="gray.500">
                <Text>• PDF (.pdf)</Text>
                <Text>• Word (.doc, .docx)</Text>
              </HStack>
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ResumeUpload;
