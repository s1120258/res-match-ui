import apiClient from "./api.js";

/**
 * Resume Management API Service
 * Based on API_INTEGRATION.md specifications
 */

/**
 * Upload a resume file
 * @param {File} file - The resume file to upload (PDF/Word)
 * @returns {Promise<Object>} Resume data with extracted text
 */
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
  try {
    const response = await apiClient.get("/resume");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // No resume found - return null instead of throwing
      return null;
    }
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
    const response = await apiClient.delete("/resume");
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
    const response = await apiClient.get("/resume/feedback");
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
    const response = await apiClient.get(`/resume/feedback/${jobId}`);
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
    const response = await apiClient.get("/resume/skills");
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
  try {
    const resume = await getResume();
    return resume !== null;
  } catch (error) {
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
