import React, { useCallback, useEffect, useRef } from "react";
import { Button, useToast, HStack, Text, Box } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

const GoogleSignInButton = ({
  text = "Sign in with Google",
  isLoading = false,
  mode = "login", // "login" or "register"
}) => {
  const { googleLogin, googleRegister } = useAuth();
  const toast = useToast();
  const googleButtonRef = useRef(null);
  const isInitialized = useRef(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        console.log("Google credential response received:", response);

        if (!response.credential) {
          throw new Error("No credential received from Google");
        }

        console.log(`Sending credential to backend for ${mode}...`);
        const result =
          mode === "register"
            ? await googleRegister(response.credential)
            : await googleLogin(response.credential);

        if (result.success) {
          console.log("Google authentication successful");
          toast({
            title: "Google authentication successful",
            description: "Welcome to ResMatch!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.error("Authentication failed:", result.error);
          toast({
            title: "Authentication failed",
            description: result.error || "Google authentication failed",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication error",
          description: error.message || "An unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [googleLogin, googleRegister, toast, mode]
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

          // Initialize Google Identity Services with COOP workaround
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false,
            // Aggressive COOP prevention settings
            use_fedcm_for_prompt: false,
            itp_support: false,
            // Force popup mode
            ux_mode: "popup",
            context: "signin",
            // Additional safety settings
            state_cookie_domain: window.location.hostname,
          });

          // Render Google's native button with improved configuration
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            // Improve accessibility
            locale: "en",
            // Hide the button visually but keep functionality
            type: "standard",
          });

          // Store the Google button instance for manual triggering
          window.googleButtonInstance = googleButtonRef.current;

          isInitialized.current = true;
          console.log(
            "Google button rendered successfully with improved settings"
          );
        } catch (error) {
          console.error("Failed to initialize Google button:", error);
        }
      } else {
        // Retry if not ready
        setTimeout(initializeGoogleButton, 200);
      }
    };

    // Wait for Google SDK to load with timeout
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait

    const checkGoogleSDK = () => {
      if (window.google && window.google.accounts) {
        initializeGoogleButton();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkGoogleSDK, 100);
      } else {
        console.warn("Google SDK failed to load after 5 seconds");
      }
    };

    checkGoogleSDK();
  }, [GOOGLE_CLIENT_ID, handleCredentialResponse]);

  const handleManualGoogleAuth = () => {
    if (window.google && window.google.accounts && isInitialized.current) {
      try {
        // Trigger Google authentication directly
        window.google.accounts.id.prompt((notification) => {
          console.log("Google prompt notification:", notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            toast({
              title: "Google Sign-in Issue",
              description:
                "Google One Tap is not available. This may be due to browser settings or security policies. Please try email/password login instead.",
              status: "warning",
              duration: 8000,
              isClosable: true,
            });
          }
        });
      } catch (error) {
        console.error("Manual Google auth error:", error);
        toast({
          title: "Google Authentication Issue",
          description:
            "Unable to initiate Google sign-in due to browser security policies. Please use email/password login.",
          status: "warning",
          duration: 8000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Google Authentication Setup Required",
        description:
          "Google SDK not loaded. Please refresh the page and try again.",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full">
      {/* Hidden Google button for functionality only */}
      <div
        ref={googleButtonRef}
        style={{
          width: "100%",
          height: "0",
          overflow: "hidden",
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main styled button that triggers Google auth */}
      <Button
        onClick={handleManualGoogleAuth}
        size="lg"
        variant="outline"
        colorScheme="gray"
        w="full"
        borderColor="gray.300"
        _hover={{
          borderColor: "gray.400",
          shadow: "md",
        }}
        borderRadius="md"
        isLoading={isLoading}
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
            {text}
          </Text>
        </HStack>
      </Button>
    </Box>
  );
};

export default GoogleSignInButton;
