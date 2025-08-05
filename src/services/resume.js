import apiClient from "./api.js";

/**
 * Resume Management API Service
 * Based on API_INTEGRATION.md specifications
 */

// Cache for resume data to avoid repeated API calls
let resumeCache = {
  data: null,
  timestamp: null,
  isChecked: false,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clear resume cache (useful after upload/delete operations)
 */
export const clearResumeCache = () => {
  resumeCache = {
    data: null,
    timestamp: null,
    isChecked: false,
  };
};

/**
 * Check if cache is valid
 */
const isCacheValid = () => {
  if (!resumeCache.isChecked) return false;
  if (!resumeCache.timestamp) return false;
  return Date.now() - resumeCache.timestamp < CACHE_DURATION;
};

/**
 * Upload a resume file
 * @param {File} file - The resume file to upload (PDF/Word)
 * @returns {Promise<Object>} Resume data with extracted text
 */
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/v1/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Clear cache after successful upload
    clearResumeCache();

    return response.data;
  } catch (error) {
    console.error("Resume upload failed:", error);
    throw error;
  }
};

/**
 * Get current user's resume
 * @returns {Promise<Object>} Resume data
 */
export const getResume = async () => {
  // Check cache first
  if (isCacheValid()) {
    return resumeCache.data;
  }

  try {
    const response = await apiClient.get("/api/v1/resume");

    // api.js interceptor handles 404 errors and returns status: 404, data: null
    if (response.status === 404) {
      // Cache the fact that no resume exists
      resumeCache = {
        data: null,
        timestamp: Date.now(),
        isChecked: true,
      };
      return null;
    }

    // Cache the resume data
    resumeCache = {
      data: response.data,
      timestamp: Date.now(),
      isChecked: true,
    };

    return response.data;
  } catch (error) {
    // Only log unexpected errors (non-404)
    console.error("Failed to get resume:", error);
    throw error;
  }
};

/**
 * Delete current user's resume
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteResume = async () => {
  try {
    const response = await apiClient.delete("/api/v1/resume");

    // Clear cache after successful deletion
    clearResumeCache();

    return response.data;
  } catch (error) {
    console.error("Resume deletion failed:", error);
    throw error;
  }
};

/**
 * Get general resume feedback
 * @returns {Promise<Object>} General feedback and suggestions
 */
export const getResumeGeneralFeedback = async () => {
  try {
    const response = await apiClient.get("/api/v1/resume/feedback");
    return response.data;
  } catch (error) {
    console.error("Failed to get resume feedback:", error);
    throw error;
  }
};

/**
 * Get job-specific resume feedback
 * @param {number} jobId - The job ID to get specific feedback for
 * @returns {Promise<Object>} Job-specific feedback with matching/missing skills
 */
export const getResumeJobSpecificFeedback = async (jobId) => {
  try {
    const response = await apiClient.get(`/api/v1/resume/feedback/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get job-specific resume feedback:", error);
    throw error;
  }
};

/**
 * Extract skills from current user's resume
 * @returns {Promise<Object>} Extracted skills with categories and confidence
 */
export const extractResumeSkills = async () => {
  try {
    const response = await apiClient.get("/api/v1/resume/skills");
    return response.data;
  } catch (error) {
    console.error("Failed to extract resume skills:", error);
    throw error;
  }
};

/**
 * Check if user has a resume uploaded
 * @returns {Promise<boolean>} True if resume exists
 */
export const hasResume = async () => {
  // Use getResume which already has caching implemented
  try {
    const resume = await getResume();
    return resume !== null;
  } catch (error) {
    // Only log unexpected errors (non-404)
    console.error("Failed to check resume status:", error);
    return false;
  }
};

/**
 * Get resume file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateResumeFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 10MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Only PDF and Word documents are allowed" };
  }

  return { isValid: true };
};
