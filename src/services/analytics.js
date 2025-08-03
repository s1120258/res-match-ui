import apiClient from "./api";

// Analytics API functions
export const analyticsAPI = {
  // Get job status summary
  getStatusSummary: async () => {
    try {
      const response = await apiClient.get("/api/v1/analytics/status-summary");
      return response.data;
    } catch (error) {
      console.error("Failed to get status summary:", error);
      throw new Error(
        error.response?.data?.detail || "Failed to load status summary"
      );
    }
  },

  // Get jobs over time with period filter
  getJobsOverTime: async (period = "weekly") => {
    try {
      const params = new URLSearchParams();
      params.append("period", period);

      const response = await apiClient.get(
        `/api/v1/analytics/jobs-over-time?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get jobs over time:", error);
      throw new Error(
        error.response?.data?.detail || "Failed to load jobs over time data"
      );
    }
  },

  // Get match score summary and distribution
  getMatchScoreSummary: async () => {
    try {
      const response = await apiClient.get(
        "/api/v1/analytics/match-score-summary"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get match score summary:", error);
      throw new Error(
        error.response?.data?.detail || "Failed to load match score summary"
      );
    }
  },
};

// Data transformation utilities
export const analyticsUtils = {
  // Transform status summary for charts
  transformStatusSummary: (data) => {
    if (!data?.status_summary) return [];

    const { status_summary } = data;
    return Object.entries(status_summary)
      .filter(([_, count]) => count > 0) // Only show non-zero values
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        status: status,
      }));
  },

  // Transform jobs over time for charts
  transformJobsOverTime: (data) => {
    if (!data?.jobs_over_time) return [];

    return data.jobs_over_time.map((item) => ({
      period: item.period,
      count: item.count,
      // Format period for display
      displayPeriod: formatPeriod(item.period, data.period),
    }));
  },

  // Transform match score summary for display
  transformMatchScoreSummary: (data) => {
    if (!data) return null;

    return {
      averageScore: Math.round(data.average_score * 100),
      minScore: Math.round(data.min_score * 100),
      maxScore: Math.round(data.max_score * 100),
      totalScores: data.total_scores,
      distribution: Object.entries(data.score_distribution || {}).map(
        ([category, count]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count: count,
          percentage:
            data.total_scores > 0
              ? Math.round((count / data.total_scores) * 100)
              : 0,
        })
      ),
    };
  },

  // Get color for job status
  getStatusColor: (status) => {
    const colors = {
      new: "#4A5568", // gray
      saved: "#3182CE", // blue
      matched: "#38A169", // green
      applied: "#D69E2E", // yellow
      rejected: "#E53E3E", // red
    };
    return colors[status] || "#4A5568";
  },

  // Get color for match score category
  getScoreColor: (category) => {
    const colors = {
      excellent: "#38A169", // green
      good: "#3182CE", // blue
      fair: "#D69E2E", // yellow
      poor: "#E53E3E", // red
    };
    return colors[category.toLowerCase()] || "#4A5568";
  },
};

// Helper function to format period display
const formatPeriod = (period, periodType) => {
  if (periodType === "weekly") {
    // Format "2025-W31" to "Week 31, 2025"
    const [year, week] = period.split("-W");
    return `Week ${week}, ${year}`;
  } else if (periodType === "monthly") {
    // Format "2025-01" to "Jan 2025"
    const [year, month] = period.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
  return period;
};

export default analyticsAPI;
