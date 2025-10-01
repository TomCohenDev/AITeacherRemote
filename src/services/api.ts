import axios from "axios";
import type { ApiResponse } from "../types";

// TODO: Replace with actual n8n backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5678";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle common errors (401, 403, 500, etc.)
    return Promise.reject(error);
  }
);

export const apiService = {
  /**
   * Connect to a session using the provided code
   * @param code - 5-letter session code
   * @returns Promise with connection result
   */
  connectToSession: async (code: string): Promise<ApiResponse> => {
    try {
      // TODO: Implement actual API call
      // const response = await api.post('/sessions/connect', { code });
      // return response.data;

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        data: { sessionId: `session_${code}`, code },
        message: "Successfully connected to session",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect to session",
      };
    }
  },

  /**
   * Disconnect from the current session
   * @returns Promise with disconnection result
   */
  disconnectFromSession: async (): Promise<ApiResponse> => {
    try {
      // TODO: Implement actual API call
      // const response = await api.post('/sessions/disconnect');
      // return response.data;

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Successfully disconnected from session",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to disconnect from session",
      };
    }
  },

  /**
   * Check if a session code is valid and exists
   * @param code - 5-letter session code
   * @returns Promise with validation result
   */
  checkSessionStatus: async (code: string): Promise<ApiResponse> => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get(`/sessions/status/${code}`);
      // return response.data;

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate validation (accept any 5-letter code)
      const isValid = /^[A-Z]{5}$/.test(code);

      return {
        success: isValid,
        data: { valid: isValid, code },
        message: isValid ? "Session code is valid" : "Invalid session code",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to validate session code",
      };
    }
  },

  /**
   * Get session information
   * @param code - 5-letter session code
   * @returns Promise with session data
   */
  getSessionInfo: async (code: string): Promise<ApiResponse> => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get(`/sessions/${code}`);
      // return response.data;

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        data: {
          code,
          teacherName: "AI Teacher",
          subject: "General",
          startTime: new Date().toISOString(),
          participants: 1,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get session information",
      };
    }
  },
};
