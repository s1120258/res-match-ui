import { extendTheme } from "@chakra-ui/react";

// Custom color palette based on ResMatch design system
const colors = {
  brand: {
    50: "#EBF4FF",
    100: "#C3DAFE",
    200: "#9BC5FE",
    300: "#73B0FD",
    400: "#4B9BFC",
    500: "#3972e6", // Primary Professional Blue
    600: "#2B69D6",
    700: "#1E5BC6",
    800: "#1A4DA6",
    900: "#1A365D",
  },
  semantic: {
    success: "#38A169", // Chakra Green 500
    warning: "#DD6B20", // Chakra Orange 500
    error: "#E53E3E", // Chakra Red 500
    info: "#4299E1", // Chakra Blue 500
  },
};

// Custom component styles
const components = {
  Button: {
    defaultProps: {
      colorScheme: "brand",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
          transform: "translateY(-1px)",
          boxShadow: "lg",
        },
        _active: {
          bg: "brand.700",
          transform: "translateY(0)",
        },
        transition: "all 0.15s ease-in-out",
      },
      outline: {
        borderColor: "brand.500",
        color: "brand.500",
        _hover: {
          bg: "brand.50",
          transform: "translateY(-1px)",
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
  },
  Card: {
    baseStyle: {
      container: {
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  Progress: {
    defaultProps: {
      colorScheme: "brand",
    },
  },
  CircularProgress: {
    defaultProps: {
      color: "brand.500",
    },
  },
  Spinner: {
    defaultProps: {
      color: "brand.500",
    },
  },
};

// Typography configuration
const fonts = {
  heading:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace",
};

// Global styles
const styles = {
  global: {
    body: {
      bg: "gray.50",
      color: "gray.800",
    },
    "*": {
      borderColor: "gray.200",
    },
  },
};

// Breakpoints (matching our design system)
const breakpoints = {
  sm: "30em", // 480px
  md: "48em", // 768px
  lg: "62em", // 992px
  xl: "80em", // 1280px
  "2xl": "96em", // 1536px
};

// Create the theme
const theme = extendTheme({
  colors,
  components,
  fonts,
  styles,
  breakpoints,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  space: {
    // Custom spacing values (8px base)
    18: "4.5rem", // 72px
    22: "5.5rem", // 88px
  },
  shadows: {
    brand: "0 4px 14px 0 rgba(57, 114, 230, 0.15)",
  },
});

export default theme;
