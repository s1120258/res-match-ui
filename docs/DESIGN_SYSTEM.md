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

- **Primary (#3972e6)**: Page titles, navigation titles, active states, highlights, brand actions
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

### Semantic Text Variants

We use semantic text variants for consistent typography across the application:

```jsx
// Page titles - responsive sizing
<ConsistentText variant="pageTitle" color="brand.500">
  Page Title
</ConsistentText>

// Section titles
<ConsistentText variant="sectionTitle">
  Section Heading
</ConsistentText>

// Card titles
<ConsistentText variant="cardTitle">
  Card Header
</ConsistentText>

// Body text
<ConsistentText variant="bodyText">
  Main content text
</ConsistentText>

// Supporting text
<ConsistentText variant="supportText">
  Subtitle or description
</ConsistentText>

// Captions
<ConsistentText variant="caption">
  Small details or metadata
</ConsistentText>
```

### Font Size Hierarchy

```scss
// Responsive Headings
$pageTitle: ["lg", "xl", "2xl"] // 18px → 20px → 24px
$sectionTitle: ["lg", "xl", "2xl"] // 18px → 20px → 24px
$cardTitle: ["md", "lg"] // 16px → 18px

// Body Text
$bodyText: ["sm", "md"] // 14px → 16px
$supportText: ["xs", "sm"] // 12px → 14px
$caption: ["xs"] // 12px

// Legacy sizes (for reference)
$text-6xl: 3.75rem; // 60px - Main titles
$text-4xl: 2.25rem; // 36px - Section titles
$text-2xl: 1.5rem; // 24px - Subsections
$text-xl: 1.25rem; // 20px - Card titles
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

#### Page Header Pattern

All pages should use the standardized PageHeader component:

```jsx
<PageHeader
  title="Page Title"
  subtitle="Optional description"
  icon={IconComponent}
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Current Page", href: "/current" },
  ]}
  action={<Button>Action</Button>}
/>
```

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
│             │                           │
└─────────────────────────────────────────┘
```

## 🧩 Component System

### Core Components

#### PageHeader

Standardized page header with consistent styling:

```jsx
import PageHeader from "../components/common/PageHeader";

<PageHeader
  title="Analytics Dashboard"
  subtitle="Track your job search progress"
  icon={FiBarChart2}
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Analytics", href: "/analytics" },
  ]}
  action={
    <Button colorScheme="brand" variant="outline">
      Refresh Data
    </Button>
  }
/>;
```

#### ConsistentIcon

Use for all icons to ensure consistent sizing:

```jsx
import ConsistentIcon from '../components/common/ConsistentIcon';

// Semantic sizing
<ConsistentIcon as={FiSearch} size="md" context="action" />
<ConsistentIcon as={FiUser} size="sm" context="navigation" />
<ConsistentIcon as={FiCheck} size="xs" context="success" />
```

#### ConsistentText

Use for all text to ensure consistent typography:

```jsx
import ConsistentText from '../components/common/ConsistentText';

<ConsistentText variant="pageTitle" color="brand.500">
  Page Title
</ConsistentText>
<ConsistentText variant="bodyText">
  Content text
</ConsistentText>
```

### Buttons

```jsx
// Primary Button
<Button colorScheme="brand" size="md">
  Main Action
</Button>

// Secondary Button
<Button variant="outline" colorScheme="brand">
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
    <ConsistentText variant="cardTitle">Title</ConsistentText>
  </CardHeader>
  <CardBody>
    Content
  </CardBody>
</Card>

// KPI Card
<Card bg="brand.50" borderLeft="4px solid" borderColor="brand.500">
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
    focusBorderColor="brand.500"
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
<CircularProgress value={85} color="brand.500" size="120px">
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
  color="brand.500"
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
  "2xl": "96em" // 1536px,,
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

// Responsive text
<ConsistentText variant="pageTitle">
  Automatically responsive title
</ConsistentText>
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

### Design Tokens

We use standardized icon sizes based on design tokens:

```jsx
// Icon Size Scale
const iconSizes = {
  xs: 12, // 12px - Small decorative icons, badges
  sm: 16, // 16px - List item icons, small buttons
  md: 20, // 20px - Navigation icons, card headers
  lg: 24, // 24px - Primary action icons, stat cards
  xl: 32, // 32px - Feature highlights, page headers
  "2xl": 48, // 48px - Empty states, large illustrations
};
```

### Usage Guidelines

```jsx
// Always use ConsistentIcon for proper sizing
<ConsistentIcon as={FiSearch} size="md" context="action" />
<ConsistentIcon as={FiBookmark} size="sm" context="navigation" />
<ConsistentIcon as={FiUser} size="lg" context="status" />
<ConsistentIcon as={FiTrendingUp} size="xl" context="success" />

// Context-based coloring
// action: brand.500 (blue)
// navigation: gray.600
// status: gray.500
// success: green.500
// warning: orange.500
// error: red.500
```

### Semantic Icon Usage

- **FiSearch**: Search functionality
- **FiBookmark**: Save/bookmark actions
- **FiUser**: User profile/account
- **FiTrendingUp**: Analytics, growth, positive trends
- **FiFileText**: Documents, resumes, files
- **FiBarChart2**: Analytics, dashboards
- **FiHome**: Dashboard, home navigation

## 🚀 Implementation Guidelines

### Best Practices

1. **Always use semantic components**: Prefer `ConsistentText` and `ConsistentIcon` over direct Chakra components
2. **Use design tokens**: Reference theme tokens rather than hardcoded values
3. **Maintain color hierarchy**: Primary color (brand.500) for titles and important elements
4. **Follow responsive patterns**: Use built-in responsive sizing from design tokens
5. **Consistent page structure**: Always use `PageHeader` for page layouts

### Migration Guide

When updating existing components:

```jsx
// ❌ Before - Hardcoded styling
<Text fontSize="2xl" fontWeight="bold" color="gray.800">
  Page Title
</Text>
<Icon as={FiSearch} boxSize={5} color="blue.500" />

// ✅ After - Semantic components
<ConsistentText variant="pageTitle" color="brand.500">
  Page Title
</ConsistentText>
<ConsistentIcon as={FiSearch} size="md" context="action" />
```

### Quality Checklist

- [ ] All page titles use `brand.500` color
- [ ] All icons use `ConsistentIcon` with appropriate size tokens
- [ ] All text uses `ConsistentText` with semantic variants
- [ ] Pages use standardized `PageHeader` component
- [ ] No hardcoded font sizes or icon sizes
- [ ] Responsive behavior is consistent across components
