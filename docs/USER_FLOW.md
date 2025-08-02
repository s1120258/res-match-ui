# ResMatch - User Flow Design

## 🎯 Main User Journeys

### 1. First-time User Registration & Onboarding

```mermaid
graph TD
    A[Landing Page] --> B[Sign Up]
    B --> C[Email Verification]
    C --> D[Basic Info Input]
    D --> E[Resume Upload]
    E --> F[Skill Extraction Review]
    F --> G[Dashboard]
```

**Detailed Flow:**

1. **Landing** → Service introduction & registration button
2. **Sign Up** → Email & password input
3. **Email Verification** → Confirmation email sent & clicked
4. **Basic Info** → Name, job title, years of experience, etc.
5. **Resume Upload** → PDF/Word format support
6. **Skill Review** → User confirms & edits AI-extracted results
7. **Dashboard** → Navigate to main screen

### 2. Daily Job Search & Management Flow

```mermaid
graph TD
    A[Dashboard] --> B[Jobs Page]
    B --> C[Search Jobs]
    C --> D[Search Results List]
    D --> E[Quick Preview Modal]
    E --> F[AI Job Summary]
    F --> G{Interested?}
    G -->|Yes| H[Save Job]
    G -->|No| D
    H --> I[Full Job Details Page]
    I --> J[Check Match Score]
    J --> K[Skill Gap Analysis]
    K --> L{Apply?}
    L -->|Yes| M[Mark as Applied]
    L -->|No| N[Return to Saved List]
```

### 3. Resume Improvement Flow

```mermaid
graph TD
    A[Resume Management] --> B[Current Resume Display]
    B --> C[Get General Feedback]
    C --> D[Review Improvements]
    D --> E[Upload New Resume]
    E --> F[Before/After Comparison]
    F --> G[Job-specific Feedback]
```

## 📱 Screen Transition Details

### Main Screen Structure

1. **Dashboard** (`/dashboard`)

   - KPI display (saved, matched, applied job counts)
   - Recent activities
   - Quick actions

2. **Job Management** (`/jobs`)

   - Integrated search & list screen (`/jobs` with search functionality)
   - Quick preview modal (for search results)
   - Detail screen (`/jobs/:id`)
   - AI-powered job summaries
   - Match analysis (integrated in detail screen tabs)

3. **Resume Management** (`/resume`)

   - Upload screen
   - Display & edit screen
   - Feedback screen (`/resume/feedback`)

4. **Analytics Screen** (`/analytics`)

   - Statistics dashboard
   - Time series graphs
   - Skill analysis

5. **Settings** (`/settings`)
   - Profile editing
   - Notification settings
   - Account management

## 🤖 AI-Enhanced Features

### Job Summary Generation Flow

```mermaid
graph TD
    A[Job Search Results] --> B[Click Job Card]
    B --> C[Modal Opens]
    C --> D[Basic Job Info Loads ~0.3s]
    D --> E[AI Summary API Call]
    E --> F[Display AI Summary]
    F --> G[Parallel: Match Score & Skill Analysis]
```

### Performance Optimization Strategy

- **Progressive Loading**: Basic info → AI summary → detailed analysis
- **Parallel API Calls**: Independent APIs run simultaneously
- **Modal Preview**: Quick job overview before full page navigation
- **Error Handling**: Graceful fallbacks with retry mechanisms

## 🔄 State Management Flow

### Job Status Transitions

```
Search Results → Quick Preview → Saved → Applied
                      ↓              ↓
                 AI Summary      Matched
```

### Data Flow

1. **Authentication State**

   - Login status
   - User information
   - Token management

2. **Job Data**

   - Search results cache
   - Saved jobs list
   - Status updates

3. **Resume Data**
   - Upload status
   - Extracted text
   - Feedback results

## 🎨 UI/UX Guidelines

### Usability

- **One-click save**: Save jobs with single click
- **Progress bars**: Show progress for long processes (AI analysis, etc.)
- **Real-time updates**: Immediate reflection of status changes

### Visual Feedback

- **Match scores**: 0-100 score + color coding
- **Skill gaps**: Highlight missing skills
- **Application status**: Visual status badges

### Responsive Design

- **Mobile**: Touch-optimized interactions
- **Tablet**: 2-column layout
- **Desktop**: Sidebar + main content

## 📊 Key Metrics

### User Engagement

- Daily job views
- Resume feedback usage rate
- Job application rate

### System Performance

- Page load times
- API response times
- Error rates
