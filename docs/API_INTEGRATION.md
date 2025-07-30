# ResMatch - API Integration Guide

## 🔗 API Basic Information

### Base URL

```javascript
const API_BASE_URL = "https://your-backend-url.render.com";
// Development: 'http://localhost:8000'
```

### Authentication Method

- **JWT Bearer Token**: Required for all protected endpoints
- **Refresh Token**: Automatic token renewal

## 🔐 Authentication API

### 1. User Registration

```javascript
// POST /auth/register
const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

// Response Format
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

### 2. Login

```javascript
// POST /auth/token
const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email); // Note: field name is 'username'
  formData.append("password", password);

  const response = await axios.post("/auth/token", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};
```

### 3. Token Refresh

```javascript
// POST /auth/refresh
const refreshToken = async (refreshToken) => {
  const response = await axios.post("/auth/refresh", {
    refresh_token: refreshToken,
  });
  return response.data;
};
```

### 4. Get Current User Info

```javascript
// GET /auth/me
const getCurrentUser = async () => {
  const response = await axios.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

## 📋 Job Management API

### 1. Job Search

```javascript
// GET /jobs/search
const searchJobs = async (params) => {
  const response = await axios.get('/jobs/search', {
    params: {
      query: params.query,           // Search keywords
      location: params.location,     // Work location
      company: params.company,       // Company name
      limit: params.limit || 20,     // Number of results
      offset: params.offset || 0     // Offset
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "jobs": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "Tokyo, Japan",
      "description": "We are looking for...",
      "requirements": ["Python", "React"],
      "salary_range": "5M - 8M JPY",
      "job_type": "full-time",
      "remote_ok": true,
      "source_url": "https://example.com/job/123"
    }
  ],
  "total_count": 150,
  "has_more": true
}
```

### 2. Manual Job Save

```javascript
// POST /jobs/save
const saveJob = async (jobData) => {
  const response = await axios.post('/jobs/save', {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    description: jobData.description,
    requirements: jobData.requirements,
    salary_range: jobData.salary_range,
    job_type: jobData.job_type,
    remote_ok: jobData.remote_ok,
    source_url: jobData.source_url
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "id": 1,
  "title": "Software Engineer",
  "company": "Tech Corp",
  "status": "saved",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
  // ... other job fields
}
```

### 3. Get Saved Jobs List

```javascript
// GET /jobs
const getJobs = async (filters) => {
  const response = await axios.get("/jobs", {
    params: {
      status: filters.status, // "saved", "matched", "applied"
      company: filters.company, // Company filter
      location: filters.location, // Location filter
      limit: filters.limit || 20,
      offset: filters.offset || 0,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

### 4. Get Job Details

```javascript
// GET /jobs/{job_id}
const getJobDetail = async (jobId) => {
  const response = await axios.get(`/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

### 5. Update Job Status & Notes

```javascript
// PUT /jobs/{job_id}
const updateJob = async (jobId, updates) => {
  const response = await axios.put(
    `/jobs/${jobId}`,
    {
      status: updates.status, // "saved", "matched", "applied"
      notes: updates.notes, // User notes
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
```

### 6. Mark as Applied

```javascript
// POST /jobs/{job_id}/apply
const markJobAsApplied = async (jobId, applicationData) => {
  const response = await axios.post(
    `/jobs/${jobId}/apply`,
    {
      application_date: applicationData.application_date,
      notes: applicationData.notes,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
```

### 7. Delete Job

```javascript
// DELETE /jobs/{job_id}
const deleteJob = async (jobId) => {
  const response = await axios.delete(`/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

## 📄 Resume Management API

### 1. Resume Upload

```javascript
// POST /resume
const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/resume', formData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Response Format
{
  "id": 1,
  "filename": "resume.pdf",
  "file_size": 1048576,
  "extracted_text": "John Doe\nSoftware Engineer...",
  "uploaded_at": "2023-01-01T00:00:00Z"
}
```

### 2. Get Resume

```javascript
// GET /resume
const getResume = async () => {
  const response = await axios.get("/resume", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

### 3. Delete Resume

```javascript
// DELETE /resume
const deleteResume = async () => {
  const response = await axios.delete("/resume", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

## 🤖 AI & Matching Features API

### 1. Get Match Score

```javascript
// GET /jobs/{job_id}/match-score
const getMatchScore = async (jobId) => {
  const response = await axios.get(`/jobs/${jobId}/match-score`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "job_id": 1,
  "match_score": 85.5,
  "calculated_at": "2023-01-01T00:00:00Z",
  "factors": {
    "skills_match": 0.9,
    "experience_match": 0.8,
    "location_preference": 1.0
  }
}
```

### 2. Resume Feedback (General)

```javascript
// GET /resume/feedback
const getResumeGeneralFeedback = async () => {
  const response = await axios.get('/resume/feedback', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "overall_score": 78,
  "feedback": "Your resume shows strong technical skills...",
  "suggestions": [
    "Add more quantifiable achievements",
    "Include relevant keywords for your target roles"
  ],
  "strengths": [
    "Clear technical skills section",
    "Good educational background"
  ],
  "areas_for_improvement": [
    "Work experience descriptions",
    "Project details"
  ]
}
```

### 3. Resume Feedback (Job-specific)

```javascript
// GET /resume/feedback/{job_id}
const getResumeJobSpecificFeedback = async (jobId) => {
  const response = await axios.get(`/resume/feedback/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "job_id": 1,
  "job_title": "Senior Frontend Developer",
  "match_percentage": 82,
  "feedback": "Your resume aligns well with this Frontend role...",
  "matching_skills": ["React", "JavaScript", "CSS"],
  "missing_skills": ["TypeScript", "Next.js"],
  "suggestions": [
    "Highlight your React projects more prominently",
    "Consider adding TypeScript experience"
  ]
}
```

### 4. Skill Gap Analysis

```javascript
// GET /jobs/{job_id}/skill-gap-analysis
const getSkillGapAnalysis = async (jobId) => {
  const response = await axios.get(`/jobs/${jobId}/skill-gap-analysis`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "job_id": 1,
  "analysis": {
    "matching_skills": [
      {
        "skill": "React",
        "confidence": 0.95,
        "evidence": "3 years experience mentioned"
      }
    ],
    "missing_skills": [
      {
        "skill": "TypeScript",
        "importance": "high",
        "suggestion": "Consider taking online courses"
      }
    ],
    "skill_gaps": [
      {
        "category": "Frontend Frameworks",
        "gap_percentage": 20,
        "recommendations": ["Learn Next.js", "Practice Vue.js"]
      }
    ]
  }
}
```

### 5. Extract Skills (from Job)

```javascript
// GET /jobs/{job_id}/skills
const extractJobSkills = async (jobId) => {
  const response = await axios.get(`/jobs/${jobId}/skills`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "job_id": 1,
  "extracted_skills": [
    {
      "skill": "Python",
      "category": "Programming Language",
      "confidence": 0.98,
      "context": "3+ years of Python development experience"
    },
    {
      "skill": "Django",
      "category": "Framework",
      "confidence": 0.85,
      "context": "Experience with Django REST framework"
    }
  ]
}
```

### 6. Extract Skills (from Resume)

```javascript
// GET /resume/skills
const extractResumeSkills = async () => {
  const response = await axios.get("/resume/skills", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
```

## 📊 Analytics & Statistics API

### 1. Status Summary

```javascript
// GET /analytics/status-summary
const getStatusSummary = async () => {
  const response = await axios.get('/analytics/status-summary', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "saved_count": 25,
  "matched_count": 8,
  "applied_count": 3,
  "total_count": 36
}
```

### 2. Jobs Over Time

```javascript
// GET /analytics/jobs-over-time
const getJobsOverTime = async (params) => {
  const response = await axios.get('/analytics/jobs-over-time', {
    params: {
      period: params.period,  // "week", "month", "quarter"
      limit: params.limit || 30
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "period": "week",
  "data": [
    {
      "date": "2023-01-01",
      "saved_count": 3,
      "matched_count": 1,
      "applied_count": 0
    }
  ]
}
```

### 3. Match Score Summary

```javascript
// GET /analytics/match-score-summary
const getMatchScoreSummary = async () => {
  const response = await axios.get('/analytics/match-score-summary', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Response Format
{
  "average_score": 76.5,
  "highest_score": 95.2,
  "lowest_score": 42.1,
  "score_distribution": {
    "high": 12,      // 80-100
    "medium": 18,    // 60-79
    "low": 6         // 0-59
  }
}
```

## 🛠️ Implementation Example: Axios Instance Setup

```javascript
// services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (automatic token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

## ⚠️ Error Handling

### Common Error Responses

```javascript
// Validation error (422)
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}

// Authentication error (401)
{
  "detail": "Could not validate credentials"
}

// Authorization error (403)
{
  "detail": "Not enough permissions"
}

// Resource not found (404)
{
  "detail": "Job not found"
}
```

### Error Handling Implementation Example

```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return "Invalid request";
      case 401:
        return "Login required";
      case 403:
        return "Access denied";
      case 404:
        return "Resource not found";
      case 422:
        // Display validation error details
        const errors = data.detail.map((err) => err.msg).join(", ");
        return `Input error: ${errors}`;
      case 500:
        return "Server error occurred";
      default:
        return "Unexpected error occurred";
    }
  }

  return "Network error occurred";
};
```
