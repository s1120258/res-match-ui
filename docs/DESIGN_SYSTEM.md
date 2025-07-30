# ResMatch - Design System

## 🎨 Brand Identity

### Concept

- **Professional**: Reliable career support
- **Modern**: Leveraging cutting-edge AI technology
- **Approachable**: User-friendly and intuitive interface

## 🌈 Color Palette

### Primary Colors

```scss
// Primary - Professional & Trustworthy
$primary-50: #ebf4ff;
$primary-100: #c3dafe;
$primary-500: #3972e6; // Main Color (Professional Blue)
$primary-600: #2b69d6;
$primary-900: #1a365d;

// Secondary - Neutral & Readable
$gray-50: #f7fafc;
$gray-100: #edf2f7;
$gray-500: #a0aec0;
$gray-700: #4a5568; // Main secondary color
$gray-900: #1a202c;
```

### Semantic Colors

```scss
// Accent - Success & Positive Actions
$green-100: #f0fff4;
$green-500: #38a169; // Chakra Green 500

// Warning - Skill Gaps & Alerts
$orange-100: #fffaf0;
$orange-500: #dd6b20; // Chakra Orange 500

// Error - Critical & Failed Actions
$red-100: #fed7d7;
$red-500: #e53e3e; // Chakra Red 500

// Info - Information & Help
$blue-100: #ebf8ff;
$blue-500: #4299e1;
```

### Usage Examples

- **Primary (#3972e6)**: Main buttons, active states, highlights, brand actions
- **Secondary (#4A5568)**: Text, borders, backgrounds, neutral emphasis
- **Accent (#38A169)**: Match success, save complete, positive scores, success states
- **Warning (#DD6B20)**: Skill gaps, improvement suggestions, alerts
- **Error (#E53E3E)**: Errors, delete actions, authentication failures, API errors

## 📝 Typography

### Font Families

```scss
// Main font
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;

// Numbers & data display
font-family: "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", monospace;
```

### Font Size Hierarchy

```scss
// Headings
$text-6xl: 3.75rem; // 60px - Main titles
$text-4xl: 2.25rem; // 36px - Section titles
$text-2xl: 1.5rem; // 24px - Subsections
$text-xl: 1.25rem; // 20px - Card titles

// Body Text
$text-lg: 1.125rem; // 18px - Important text
$text-base: 1rem; // 16px - Standard text
$text-sm: 0.875rem; // 14px - Supporting text
$text-xs: 0.75rem; // 12px - Captions
```

## 🔲 Layout & Spacing

### Grid System

```scss
// Container sizes
$container-sm: 640px;
$container-md: 768px;
$container-lg: 1024px;
$container-xl: 1280px;

// Spacing (8px base)
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-4: 1rem; // 16px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-12: 3rem; // 48px
```

### Layout Patterns

#### Dashboard Grid

```
┌─────────────────────────────────────────┐
│ Sidebar     │ Main Content              │
│ 280px       │ flex-1                    │
│             │ ┌─────┐ ┌─────┐ ┌─────┐   │
│             │ │ KPI │ │ KPI │ │ KPI │   │
│             │ │Card │ │Card │ │Card │   │
│             │ └─────┘ └─────┘ └─────┘   │
│             │                           │
│             │ ┌─────────────────────────┐ │
│             │ │ Activity Feed           │ │
│             │ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🧩 Component Definitions

### Buttons

```jsx
// Primary Button
<Button colorScheme="blue" size="md">
  Main Action
</Button>

// Secondary Button
<Button variant="outline" colorScheme="blue">
  Secondary Action
</Button>

// Ghost Button
<Button variant="ghost" size="sm">
  Light Action
</Button>
```

### Cards

```jsx
// Standard Card
<Card p={6} shadow="md" borderRadius="lg">
  <CardHeader>
    <Heading size="md">Title</Heading>
  </CardHeader>
  <CardBody>
    Content
  </CardBody>
</Card>

// KPI Card
<Card bg="blue.50" borderLeft="4px solid" borderColor="blue.500">
  <Stat>
    <StatNumber fontSize="2xl">128</StatNumber>
    <StatLabel>Saved Jobs</StatLabel>
  </Stat>
</Card>
```

### Form Elements

```jsx
// Input Field
<FormControl>
  <FormLabel>Label</FormLabel>
  <Input
    placeholder="Enter text here"
    focusBorderColor="blue.500"
  />
  <FormHelperText>Help text</FormHelperText>
</FormControl>

// Select Box
<Select placeholder="Select option">
  <option value="option1">Option 1</option>
</Select>
```

## 📊 Data Visualization

### Match Score Display

```jsx
// Circular Progress
<CircularProgress value={85} color="blue.500" size="120px">
  <CircularProgressLabel>85%</CircularProgressLabel>
</CircularProgress>

// Score Badge
<Badge
  colorScheme={score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'}
  variant="solid"
>
  {score}%
</Badge>
```

### Status Display

```jsx
// Job Status
const statusConfig = {
  saved: { color: "blue", label: "Saved" },
  matched: { color: "green", label: "Matched" },
  applied: { color: "purple", label: "Applied" },
};

<Badge colorScheme={statusConfig[status].color}>
  {statusConfig[status].label}
</Badge>;
```

## 🎭 Interactions & Animations

### Hover Effects

```scss
// Card hover
.card-hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
}

// Button hover
.button-hover {
  transition: all 0.15s ease-in-out;

  &:hover {
    transform: translateY(-1px);
  }
}
```

### Loading States

```jsx
// Skeleton loading
<VStack spacing={4}>
  <Skeleton height="20px" />
  <Skeleton height="20px" />
  <Skeleton height="40px" />
</VStack>

// Spinner
<Spinner
  thickness="4px"
  speed="0.65s"
  emptyColor="gray.200"
  color="blue.500"
  size="xl"
/>
```

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoints: (
  sm: "30em",
  // 480px
  md: "48em",
  // 768px
  lg: "62em",
  // 992px
  xl: "80em",
  // 1280px
  "2xl": "96em" // 1536px,
);
```

### Responsive Patterns

```jsx
// Mobile-first approach
<Box
  w="full"           // Mobile: full width
  md={{ w: "50%" }}  // Tablet: 50%
  lg={{ w: "33%" }}  // Desktop: 33%
/>

// Responsive stack
<Stack
  direction={{ base: 'column', md: 'row' }}
  spacing={{ base: 4, md: 8 }}
>
```

## 🎯 Accessibility

### Color Contrast

- **AA Compliance**: 4.5:1+ contrast ratio
- **AAA Compliance**: 7:1+ (for important information)

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Escape key to close modals & drawers

### Screen Reader Support

```jsx
// Proper Aria attributes
<Button
  aria-label="Save job"
  aria-describedby="save-help"
>
  Save
</Button>

// State description
<Text id="save-help" sr-only>
  Save this job for later review
</Text>
```

## 📏 Icon System

### Icon Libraries

- **React Icons**: Rich icon set
- **Chakra UI Icons**: Basic icons

### Usage Guidelines

```jsx
// Consistent sizing
const iconSizes = {
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px'
};

// Semantic usage
<Icon as={FiSearch} />      // Search
<Icon as={FiBookmark} />    // Save
<Icon as={FiUser} />        // User
<Icon as={FiTrendingUp} />  // Analytics & growth
```
