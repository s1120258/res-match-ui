# Development Setup Guide

Complete development environment setup and technical configuration for ResMatch Frontend.

## 📋 Prerequisites

### Required Software

```bash
# Node.js (v18+)
node --version

# Package Manager (npm or yarn)
npm --version

# Git
git --version
```

### Recommended IDE Setup

**VS Code** with these extensions:

- ES7+ React/Redux/React-Native snippets
- Chakra UI Snippets
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

## 🚀 Project Setup

### 1. Initial Installation

```bash
# Clone repository
git clone <repository-url>
cd res-match-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Required Additional Packages

```bash
# Icon library
npm install react-icons

# Date handling
npm install date-fns

# Charts (for analytics screens)
npm install recharts

# Form management
npm install react-hook-form
```

### 3. Environment Configuration

Create `.env.local` file:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000

# Environment
VITE_ENV=development
```

## 🛠️ Technical Stack Details

### Core Framework

- **React 19** + **Vite** - Fast development with HMR
- **Chakra UI v2.10.3** - Component library
- **React Router v7** - Client-side routing
- **Axios** - API client with interceptors

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Build tool and dev server

### Vite Configuration

Current setup uses `@vitejs/plugin-react` for:

- Fast Refresh with Babel
- HMR (Hot Module Replacement)
- Optimized builds

Alternative: `@vitejs/plugin-react-swc` for SWC-based Fast Refresh.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Generic components
│   ├── auth/           # Authentication related
│   ├── jobs/           # Job related
│   ├── resume/         # Resume related
│   ├── analytics/      # Analytics related
│   └── layout/         # Layout related
├── pages/              # Page components
├── hooks/              # Custom hooks
├── services/           # API call services
├── contexts/           # React contexts
├── theme/              # Chakra UI theme
├── utils/              # Utility functions
└── assets/             # Static resources
```

## 🎨 Design System Configuration

### Color Palette

```javascript
// Primary colors
const colors = {
  brand: {
    primary: "#3972e6", // Professional Blue
    secondary: "#4A5568", // Gray
    success: "#38A169", // Green
    warning: "#DD6B20", // Orange
    error: "#E53E3E", // Red
  },
};
```

### Responsive Breakpoints

```javascript
// Chakra UI breakpoints
const breakpoints = {
  sm: "30em", // 480px (Mobile)
  md: "48em", // 768px (Tablet)
  lg: "62em", // 992px (Desktop)
  xl: "80em", // 1280px (Large Desktop)
};
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier

# Testing (when implemented)
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
```

## 📱 Responsive Design Setup

### Layout Patterns

- **Mobile** (~480px): Stack layout, drawer navigation
- **Tablet** (481px~992px): 2-column grid
- **Desktop** (993px+): Sidebar + main content

### Mobile-First Approach

```jsx
// Example responsive component
<Box display={{ base: "block", md: "flex" }} padding={{ base: 4, md: 6 }}>
  {/* Content adapts to screen size */}
</Box>
```

## 🔒 Security Configuration

### JWT Token Management

```javascript
// Automatic token refresh setup
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### File Upload Validation

- File type restrictions
- File size limits
- Virus scanning (server-side)

## 🐛 Debugging Setup

### Browser DevTools

- React Developer Tools
- Redux DevTools (if implemented)
- Chakra UI DevTools

### Console Configuration

```javascript
// Development logging
if (import.meta.env.DEV) {
  console.log("Development mode enabled");
}
```

## 📈 Performance Configuration

### Code Splitting

```javascript
// Route-based code splitting
const LazyComponent = React.lazy(() => import("./Component"));

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>;
```

### Build Optimization

```javascript
// vite.config.js optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@chakra-ui/react"],
        },
      },
    },
  },
});
```

## 🧪 Testing Setup (Future Implementation)

### Recommended Testing Stack

- **Unit Tests**: React Testing Library + Jest
- **Integration Tests**: MSW (Mock Service Worker)
- **E2E Tests**: Playwright or Cypress

### Test Structure

```
__tests__/
├── components/         # Component tests
├── pages/             # Page tests
├── utils/             # Utility tests
└── integration/       # Integration tests
```

## 🔄 ESLint Configuration

Current ESLint setup includes:

- React-specific rules
- Import order enforcement
- Unused variable detection

For production applications, consider:

- TypeScript integration with `typescript-eslint`
- Stricter type-checking rules
- Custom rules for team consistency

## 🚨 Common Issues & Solutions

### Development Server Issues

```bash
# Port conflicts
npm run dev -- --port 3001

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Build Issues

```bash
# Clear build cache
rm -rf dist
npm run build
```

### Package Conflicts

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```
