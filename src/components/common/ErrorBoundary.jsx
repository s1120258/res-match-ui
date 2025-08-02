import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Text,
  Code,
} from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={6}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={4} flex={1}>
              <Box>
                <AlertTitle>Something went wrong!</AlertTitle>
                <AlertDescription>
                  The component encountered an error and couldn't render
                  properly.
                </AlertDescription>
              </Box>

              {this.state.error && (
                <Box w="full">
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Error Details:
                  </Text>
                  <Code
                    p={3}
                    bg="red.50"
                    borderRadius="md"
                    w="full"
                    fontSize="xs"
                  >
                    {this.state.error.toString()}
                  </Code>
                </Box>
              )}

              <VStack spacing={2} align="start">
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </VStack>
            </VStack>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
