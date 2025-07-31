import apiClient from "./api";

// Job Management API functions
export const jobsAPI = {
  // Search jobs from external job boards
  searchJobs: async (searchParams = {}) => {
    try {
      const params = new URLSearchParams();

      if (searchParams.keyword) params.append("keyword", searchParams.keyword);
      if (searchParams.location)
        params.append("location", searchParams.location);
      if (searchParams.source) params.append("source", searchParams.source);
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.limit) params.append("limit", searchParams.limit);
      if (searchParams.fetch_full_description !== undefined) {
        params.append(
          "fetch_full_description",
          searchParams.fetch_full_description
        );
      }

      const fullUrl = `/api/v1/jobs/search?${params.toString()}`;
      const response = await apiClient.get(fullUrl);
      return response.data;
    } catch (error) {
      // More specific error handling
      if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
        throw new Error(
          "Network connection failed. Please check your internet connection."
        );
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("timeout")
      ) {
        throw new Error(
          "Search timeout - External job sources are taking longer than expected. Please try again in a moment."
        );
      } else if (error.message.includes("CORS")) {
        throw new Error(
          "CORS error. The server may not allow requests from this domain."
        );
      } else if (!error.response) {
        throw new Error(
          "Request failed - no response received. The server may be down."
        );
      }

      throw new Error(error.response?.data?.detail || "Failed to search jobs");
    }
  },

  // Get saved/applied jobs
  getJobs: async (status = null) => {
    try {
      const params = status ? `?status=${status}` : "";
      const response = await apiClient.get(`/api/v1/jobs${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to get jobs");
    }
  },

  // Get specific job details
  getJob: async (jobId) => {
    try {
      const response = await apiClient.get(`/api/v1/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to get job details"
      );
    }
  },

  // Save a job
  saveJob: async (jobData) => {
    try {
      const response = await apiClient.post("/api/v1/jobs/save", jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to save job");
    }
  },

  // Update job status or notes
  updateJob: async (jobId, updates) => {
    try {
      const response = await apiClient.put(`/api/v1/jobs/${jobId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to update job");
    }
  },

  // Apply to job
  applyToJob: async (jobId, applicationData) => {
    try {
      const response = await apiClient.post(
        `/api/v1/jobs/${jobId}/apply`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to apply to job");
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      await apiClient.delete(`/api/v1/jobs/${jobId}`);
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to delete job");
    }
  },

  // Get or calculate match score
  getMatchScore: async (jobId, forceRecalculate = false) => {
    try {
      const params = forceRecalculate ? "?force_recalculate=true" : "";
      const response = await apiClient.get(
        `/api/v1/jobs/${jobId}/match-score${params}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to get match score"
      );
    }
  },

  // Get skill gap analysis
  getSkillGapAnalysis: async (jobId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.resume_id) queryParams.append("resume_id", params.resume_id);
      if (params.include_learning_recommendations !== undefined) {
        queryParams.append(
          "include_learning_recommendations",
          params.include_learning_recommendations
        );
      }
      if (params.include_experience_analysis !== undefined) {
        queryParams.append(
          "include_experience_analysis",
          params.include_experience_analysis
        );
      }
      if (params.include_education_analysis !== undefined) {
        queryParams.append(
          "include_education_analysis",
          params.include_education_analysis
        );
      }

      const response = await apiClient.get(
        `/api/v1/jobs/${jobId}/skill-gap-analysis?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to get skill gap analysis"
      );
    }
  },

  // Extract job skills
  extractJobSkills: async (jobId) => {
    try {
      const response = await apiClient.get(`/api/v1/jobs/${jobId}/skills`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to extract job skills"
      );
    }
  },
};

// Job status constants
export const JOB_STATUS = {
  NEW: "new",
  SAVED: "saved",
  MATCHED: "matched",
  APPLIED: "applied",
  REJECTED: "rejected",
};

// Job board sources
export const JOB_SOURCES = {
  REMOTEOK: "remoteok",
};

// Sort options
export const SORT_OPTIONS = {
  DATE: "date",
  MATCH_SCORE: "match_score",
};
