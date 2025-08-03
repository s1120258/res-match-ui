import { extendTheme } from "@chakra-ui/react";

// Enhanced color palette with more sophisticated gradients and semantic colors
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
  // Enhanced grays with better contrast
  neutral: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },
};

// Enhanced component styles with sophisticated design patterns
const components = {
  Button: {
    defaultProps: {
      colorScheme: "brand",
      size: "md",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        fontWeight: "600",
        borderRadius: "lg",
        _hover: {
          bg: "brand.600",
          transform: "translateY(-1px)",
          boxShadow:
            "0 10px 25px -5px rgba(57, 114, 230, 0.25), 0 4px 6px -2px rgba(57, 114, 230, 0.05)",
        },
        _active: {
          bg: "brand.700",
          transform: "translateY(0)",
        },
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      outline: {
        borderColor: "brand.500",
        color: "brand.500",
        fontWeight: "600",
        borderRadius: "lg",
        borderWidth: "2px",
        _hover: {
          bg: "brand.50",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px -2px rgba(57, 114, 230, 0.12)",
        },
        _active: {
          bg: "brand.100",
        },
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      ghost: {
        color: "neutral.600",
        fontWeight: "500",
        _hover: {
          bg: "neutral.100",
          color: "neutral.800",
        },
      },
    },
    sizes: {
      xs: {
        h: "6",
        minW: "6",
        fontSize: "xs",
        px: "2",
      },
      sm: {
        h: "8",
        minW: "8",
        fontSize: "sm",
        px: "3",
      },
      md: {
        h: "10",
        minW: "10",
        fontSize: "md",
        px: "4",
      },
      lg: {
        h: "12",
        minW: "12",
        fontSize: "lg",
        px: "6",
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "xl",
        borderWidth: "1px",
        borderColor: "neutral.200",
        bg: "white",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderColor: "neutral.300",
        },
      },
    },
    variants: {
      elevated: {
        container: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          _hover: {
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
          },
        },
      },
      interactive: {
        container: {
          cursor: "pointer",
          _hover: {
            transform: "translateY(-4px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "brand.500",
      size: "md",
    },
    variants: {
      outline: {
        field: {
          borderRadius: "lg",
          borderWidth: "2px",
          _hover: {
            borderColor: "neutral.400",
          },
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px rgba(57, 114, 230, 0.2)",
          },
        },
      },
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
    variants: {
      outline: {
        borderRadius: "lg",
        borderWidth: "2px",
        _hover: {
          borderColor: "neutral.400",
        },
        _focus: {
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px rgba(57, 114, 230, 0.2)",
        },
      },
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
    variants: {
      outline: {
        field: {
          borderRadius: "lg",
          borderWidth: "2px",
          _hover: {
            borderColor: "neutral.400",
          },
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px rgba(57, 114, 230, 0.2)",
          },
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: "full",
      fontWeight: "600",
      fontSize: "xs",
      px: "3",
      py: "1",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
      },
      subtle: {
        bg: "brand.100",
        color: "brand.800",
      },
      success: {
        bg: "green.100",
        color: "green.800",
      },
      warning: {
        bg: "orange.100",
        color: "orange.800",
      },
      error: {
        bg: "red.100",
        color: "red.800",
      },
    },
  },
  Progress: {
    defaultProps: {
      colorScheme: "brand",
    },
    baseStyle: {
      track: {
        borderRadius: "full",
      },
      filledTrack: {
        borderRadius: "full",
      },
    },
  },
  CircularProgress: {
    defaultProps: {
      color: "brand.500",
    },
    baseStyle: {
      track: {
        color: "neutral.200",
      },
    },
  },
  Spinner: {
    defaultProps: {
      color: "brand.500",
    },
  },
  Stat: {
    baseStyle: {
      container: {
        p: 0,
      },
      number: {
        fontFamily: "mono",
        fontWeight: "700",
        color: "neutral.800",
      },
      label: {
        fontWeight: "500",
        color: "neutral.600",
        fontSize: "sm",
      },
      helpText: {
        color: "neutral.500",
        fontSize: "xs",
      },
    },
  },
};

// Enhanced typography with better hierarchy
const fonts = {
  heading:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace",
};

// Enhanced text styles
const textStyles = {
  h1: {
    fontSize: ["3xl", "4xl", "5xl"],
    fontWeight: "800",
    lineHeight: "1.2",
    letterSpacing: "-0.025em",
  },
  h2: {
    fontSize: ["2xl", "3xl", "4xl"],
    fontWeight: "700",
    lineHeight: "1.25",
    letterSpacing: "-0.02em",
  },
  h3: {
    fontSize: ["xl", "2xl", "3xl"],
    fontWeight: "600",
    lineHeight: "1.3",
  },
  body: {
    fontSize: "md",
    lineHeight: "1.6",
    color: "neutral.700",
  },
  caption: {
    fontSize: "sm",
    color: "neutral.500",
    lineHeight: "1.5",
  },
};

// Enhanced global styles
const styles = {
  global: {
    "html, body": {
      bg: "neutral.50",
      color: "neutral.800",
      lineHeight: "1.6",
    },
    "*": {
      borderColor: "neutral.200",
    },
    "::selection": {
      bg: "brand.100",
      color: "brand.800",
    },
  },
};

// Responsive breakpoints
const breakpoints = {
  sm: "30em", // 480px
  md: "48em", // 768px
  lg: "62em", // 992px
  xl: "80em", // 1280px
  "2xl": "96em", // 1536px
};

// Enhanced spacing system (8px base)
const space = {
  18: "4.5rem", // 72px
  22: "5.5rem", // 88px
  28: "7rem", // 112px
  36: "9rem", // 144px
};

// Enhanced shadow system
const shadows = {
  brand: "0 4px 14px 0 rgba(57, 114, 230, 0.15)",
  brandLg:
    "0 10px 25px -5px rgba(57, 114, 230, 0.25), 0 4px 6px -2px rgba(57, 114, 230, 0.05)",
  soft: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  medium:
    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  large:
    "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  xl: "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
};

// Create the enhanced theme
const theme = extendTheme({
  colors,
  components,
  fonts,
  textStyles,
  styles,
  breakpoints,
  space,
  shadows,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  radii: {
    none: "0",
    sm: "0.25rem",
    base: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },
});

export default theme;
