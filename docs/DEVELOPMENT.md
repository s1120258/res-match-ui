# Development Guidelines

Coding standards, best practices, and workflow guidelines for ResMatch Frontend development.

## 📝 Code Style & Standards

### JavaScript/React Conventions

```javascript
// ✅ Good: Use descriptive names
const [isLoadingJobs, setIsLoadingJobs] = useState(false);
const handleJobSave = useCallback(() => {}, []);

// ❌ Avoid: Generic names
const [loading, setLoading] = useState(false);
const handleClick = () => {};
```

### Component Structure

```jsx
// ✅ Recommended component structure
import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Component description and usage examples
 */
const MyComponent = ({ prop1, prop2, ...props }) => {
  // 1. Hooks
  const { user } = useAuth();
  const [localState, setLocalState] = useState(null);

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 3. Event handlers
  const handleAction = () => {
    // Handler logic
  };

  // 4. Render
  return (
    <Box {...props}>
      <Button onClick={handleAction}>Action</Button>
    </Box>
  );
};

export default MyComponent;
```

### File Naming Conventions

```
✅ Components: PascalCase
   - JobDetailModal.jsx
   - StatusBadge.jsx
   - UserProfile.jsx

✅ Services/Utilities: camelCase
   - apiClient.js
   - formatUtils.js
   - authService.js

✅ Constants: UPPER_SNAKE_CASE
   - API_ENDPOINTS.js
   - STATUS_TYPES.js

✅ Pages: PascalCase + Page suffix
   - DashboardPage.jsx
   - JobsPage.jsx
```

## 🏗️ Component Architecture

### Component Types

**1. Page Components** (`/pages/`)

- Top-level route components
- Handle page-specific state management
- Coordinate multiple feature components

**2. Feature Components** (`/components/[feature]/`)

- Business logic components
- Domain-specific functionality
- Can contain their own state

**3. Common Components** (`/components/common/`)

- Reusable UI components
- No business logic
- Pure presentation components

### Props Patterns

```jsx
// ✅ Good: Destructure props, use default values
const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  ...rest
}) => {
  return (
    <ChakraButton variant={variant} size={size} isLoading={isLoading} {...rest}>
      {children}
    </ChakraButton>
  );
};

// ✅ PropTypes or TypeScript for type safety
Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
```

## 🔄 State Management

### Local State Guidelines

```jsx
// ✅ Use useState for simple local state
const [email, setEmail] = useState("");
const [isLoading, setIsLoading] = useState(false);

// ✅ Use useReducer for complex state logic
const [formState, dispatch] = useReducer(formReducer, initialState);
```

### Context Usage

```jsx
// ✅ Create focused contexts
// AuthContext - authentication only
// ThemeContext - theme settings only

// ❌ Avoid god contexts
// AppContext - everything
```

### API State Management

```jsx
// ✅ Custom hook pattern for API calls
const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobsService.getJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { jobs, isLoading, error, fetchJobs };
};
```

## 🎨 UI/UX Guidelines

### Responsive Design Patterns

```jsx
// ✅ Mobile-first responsive design
<Grid
  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
  gap={4}
>
  {items.map((item) => (
    <GridItem key={item.id}>
      <ItemCard item={item} />
    </GridItem>
  ))}
</Grid>
```

### Accessibility Standards

```jsx
// ✅ Include proper ARIA labels
<Button
  aria-label="Save job to favorites"
  aria-describedby="save-job-description"
>
  <Icon as={FiHeart} />
</Button>

// ✅ Proper heading hierarchy
<Box>
  <Heading as="h1" size="xl">Page Title</Heading>
  <Heading as="h2" size="lg">Section Title</Heading>
  <Heading as="h3" size="md">Subsection Title</Heading>
</Box>
```

### Loading States

```jsx
// ✅ Consistent loading patterns
const JobsList = () => {
  const { jobs, isLoading, error } = useJobs();

  if (isLoading) {
    return <SkeletonLoader count={3} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <VStack spacing={4}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </VStack>
  );
};
```

## 🔧 API Integration

### Service Layer Pattern

```javascript
// ✅ Centralized API service
// services/jobsService.js
import { apiClient } from "./apiClient";

export const jobsService = {
  async getJobs(params = {}) {
    const { data } = await apiClient.get("/jobs", { params });
    return data;
  },

  async saveJob(jobData) {
    const { data } = await apiClient.post("/jobs/save", jobData);
    return data;
  },

  async updateJobStatus(jobId, status) {
    const { data } = await apiClient.put(`/jobs/${jobId}`, { status });
    return data;
  },
};
```

### Error Handling

```javascript
// ✅ Consistent error handling
const handleApiCall = async (apiFunction) => {
  try {
    const result = await apiFunction();
    return { data: result, error: null };
  } catch (error) {
    console.error("API Error:", error);

    // Handle different error types
    if (error.response?.status === 401) {
      // Handle authentication error
      authService.logout();
      return { data: null, error: "Authentication required" };
    }

    if (error.response?.status >= 500) {
      return { data: null, error: "Server error. Please try again later." };
    }

    return {
      data: null,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};
```

## 🧪 Testing Strategy

### Unit Testing

```javascript
// ✅ Component testing example
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import JobCard from "../JobCard";

const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("JobCard", () => {
  const mockJob = {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Co",
    status: "saved",
  };

  test("renders job information correctly", () => {
    renderWithChakra(<JobCard job={mockJob} />);

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Tech Co")).toBeInTheDocument();
  });

  test("calls onStatusChange when status is updated", () => {
    const mockOnStatusChange = jest.fn();
    renderWithChakra(
      <JobCard job={mockJob} onStatusChange={mockOnStatusChange} />
    );

    fireEvent.click(screen.getByText("Apply"));
    expect(mockOnStatusChange).toHaveBeenCalledWith("1", "applied");
  });
});
```

### API Testing

```javascript
// ✅ Service testing with MSW
import { rest } from "msw";
import { setupServer } from "msw/node";
import { jobsService } from "../services/jobsService";

const server = setupServer(
  rest.get("/api/jobs", (req, res, ctx) => {
    return res(ctx.json([{ id: "1", title: "Frontend Developer" }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches jobs successfully", async () => {
  const jobs = await jobsService.getJobs();
  expect(jobs).toHaveLength(1);
  expect(jobs[0].title).toBe("Frontend Developer");
});
```

## 📦 Git Workflow

### Branch Naming

```bash
# ✅ Feature branches
feature/job-search-filters
feature/resume-upload
feature/dashboard-analytics

# ✅ Bug fixes
bugfix/login-validation
bugfix/mobile-layout

# ✅ Hotfixes
hotfix/security-patch
hotfix/api-timeout
```

### Commit Messages

```bash
# ✅ Good commit messages
feat: add job search filters with location and salary range
fix: resolve mobile navigation menu not closing on route change
docs: update API integration guide with error handling examples
refactor: extract common loading state logic into custom hook

# ❌ Poor commit messages
fix stuff
update code
changes
wip
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes & Commit**

   ```bash
   git add .
   git commit -m "feat: implement new feature with tests"
   ```

3. **Update Documentation**

   - Update relevant docs if needed
   - Add JSDoc comments for new functions

4. **Create Pull Request**

   - Use PR template
   - Include screenshots for UI changes
   - Reference related issues

5. **Code Review Checklist**
   - Code follows style guidelines
   - Tests are included and passing
   - Documentation is updated
   - No console.log statements
   - Accessibility considered

## 🚨 Common Pitfalls

### Performance Anti-patterns

```jsx
// ❌ Avoid: Inline object creation in render
<Component style={{ marginTop: 10 }} />;

// ✅ Better: Extract to constant
const componentStyle = { marginTop: 10 };
<Component style={componentStyle} />;

// ❌ Avoid: Missing dependency in useEffect
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Better: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### Security Considerations

```jsx
// ❌ Avoid: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Better: Sanitize or use safe alternatives
<Text>{sanitizeHTML(userInput)}</Text>

// ❌ Avoid: Exposing sensitive data
localStorage.setItem('userToken', token);

// ✅ Better: Use secure storage
secureStorage.setItem('userToken', token);
```

## 🔍 Code Review Guidelines

### Reviewer Checklist

- [ ] Code follows established patterns
- [ ] Tests cover new functionality
- [ ] No hardcoded values or magic numbers
- [ ] Error handling is appropriate
- [ ] Performance implications considered
- [ ] Accessibility standards met
- [ ] Documentation updated if needed

### Review Comments Style

```
✅ Good review comments:
"Consider using useMemo here to avoid recalculation on every render"
"This function could benefit from early return to reduce nesting"
"Great error handling! Consider adding a user-friendly message"

❌ Poor review comments:
"This is wrong"
"Fix this"
"Bad code"
```

## 📈 Performance Best Practices

### Optimization Techniques

1. **Component Optimization**

   ```jsx
   // Use React.memo for expensive components
   const ExpensiveComponent = React.memo(({ data }) => {
     return <ComplexVisualization data={data} />;
   });

   // Use useMemo for expensive calculations
   const processedData = useMemo(() => {
     return data.map((item) => expensiveTransform(item));
   }, [data]);
   ```

2. **Bundle Optimization**

   ```javascript
   // Code splitting by route
   const LazyPage = lazy(() => import("./pages/LazyPage"));

   // Dynamic imports for large libraries
   const loadChartsLibrary = () => import("recharts");
   ```

3. **API Optimization**
   ```javascript
   // Parallel API calls when possible
   const [jobs, analytics] = await Promise.all([
     jobsService.getJobs(),
     analyticsService.getStats(),
   ]);
   ```

## 📚 Learning Resources

### React Best Practices

- [React Documentation](https://react.dev/)
- [React Patterns](https://reactpatterns.com/)

### Chakra UI

- [Chakra UI Documentation](https://chakra-ui.com/)
- [Design System Examples](https://chakra-ui.com/community/showcase)

### Testing

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

## 🤝 Team Collaboration

### Communication Guidelines

- Use descriptive PR titles and descriptions
- Comment complex logic inline
- Update documentation proactively
- Share knowledge through code reviews
- Ask questions early rather than late

### Knowledge Sharing

- Document architectural decisions
- Share useful patterns and solutions
- Contribute to team knowledge base
- Mentor junior developers

Happy coding! 🚀
