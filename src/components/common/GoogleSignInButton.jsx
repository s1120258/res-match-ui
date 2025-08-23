import React, { useCallback, useEffect, useRef } from "react";
import { Button, useToast, HStack, Text, Box } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

const GoogleSignInButton = ({
  text = "Sign in with Google",
  isLoading = false,
}) => {
  const { googleLogin } = useAuth();
  const toast = useToast();
  const googleButtonRef = useRef(null);
  const isInitialized = useRef(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        const result = await googleLogin(response.credential);

        if (result.success) {
          toast({
            title: "Google authentication successful",
            description: "Welcome to ResMatch!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Authentication failed",
            description: result.error || "Google authentication failed",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Authentication error",
          description: error.message || "An unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [googleLogin, toast]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID environment variable not found");
      return;
    }

    if (isInitialized.current) {
      return;
    }

    const initializeGoogleButton = () => {
      if (window.google && window.google.accounts && googleButtonRef.current) {
        try {
          console.log(
            "Initializing Google button with Client ID:",
            GOOGLE_CLIENT_ID
          );

          // Initialize Google Identity Services
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          // Render Google's native button directly
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
          });

          isInitialized.current = true;
          console.log("Google button rendered successfully");
        } catch (error) {
          console.error("Failed to initialize Google button:", error);
        }
      } else {
        // Retry if not ready
        setTimeout(initializeGoogleButton, 200);
      }
    };

    // Wait for Google SDK to load
    const checkGoogleSDK = () => {
      if (window.google && window.google.accounts) {
        initializeGoogleButton();
      } else {
        setTimeout(checkGoogleSDK, 100);
      }
    };

    checkGoogleSDK();
  }, [GOOGLE_CLIENT_ID, handleCredentialResponse]);

  const handleManualGoogleAuth = () => {
    toast({
      title: "Google Authentication Setup Required",
      description:
        "Please configure Google Cloud Console settings and restart the backend server to enable Google sign-in.",
      status: "info",
      duration: 8000,
      isClosable: true,
    });
  };

  return (
    <Box w="full">
      {/* Google's native button container */}
      <div ref={googleButtonRef} style={{ width: "100%" }} />

      {/* Fallback button if Google button fails to load */}
      {!isInitialized.current && (
        <Button
          onClick={handleManualGoogleAuth}
          size="lg"
          variant="outline"
          colorScheme="blue"
          w="full"
          borderColor="blue.300"
          _hover={{
            borderColor: "blue.400",
            shadow: "md",
          }}
        >
          <HStack spacing={3}>
            {/* Google Logo */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.72c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-2.7z"
              />
            </svg>
            <Text fontSize="md" fontWeight="medium">
              {text} (Setup Required)
            </Text>
          </HStack>
        </Button>
      )}
    </Box>
  );
};

export default GoogleSignInButton;
