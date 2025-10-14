import axios, { AxiosError } from "axios";
import { API_BASE } from "../config/api";
import type { AnnotationRequest, ScreenshotResponse } from "../types";

const API_BASE_URL = API_BASE;

// Create axios instance with extended timeout for long-running operations
const axiosInstance = axios.create({
  timeout: 300000, // 5 minutes default timeout
});

export interface ConnectResponse {
  success: boolean;
  message?: string;
  error?: string;
  sessionId?: string;
  code?: string;
  status?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

class ApiService {
  /**
   * Connect to a teaching session using session code
   */
  async connectToSession(code: string): Promise<ConnectResponse> {
    try {
      const response = await axios.post<ConnectResponse>(
        `${API_BASE_URL}/sessions/connect`,
        { deviceType: this.getDeviceType() },
        { params: { code } }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get current session status
   */
  async getSessionStatus(code: string): Promise<ConnectResponse> {
    try {
      const response = await axios.get<ConnectResponse>(
        `${API_BASE_URL}/sessions/status`,
        { params: { code } }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get screenshot from Windows app
   */
  async getScreenshot(code: string): Promise<ScreenshotResponse> {
    try {
      const response = await axios.get<ScreenshotResponse>(
        `${API_BASE_URL}/sessions/screenshot`,
        { params: { code } }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Send annotation request to n8n
   */
  async sendAnnotationRequest(
    code: string,
    payload: AnnotationRequest
  ): Promise<ConnectResponse> {
    try {
      console.log("🔧 Sending annotation with 5-minute timeout...");
      const response = await axiosInstance.post<ConnectResponse>(
        `${API_BASE_URL}/sessions/prompt`,
        payload,
        {
          params: { code },
          timeout: 300000, // 5 minutes timeout for annotations
        }
      );

      return response.data;
    } catch (error) {
      console.error("🔴 Annotation request failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Response status:", error.response?.status);
      }
      throw this.handleError(error);
    }
  }

  /**
   * Request screenshot from Windows app
   */
  async requestScreenshot(
    code: string
  ): Promise<{ success: boolean; requestId?: string }> {
    try {
      const response = await axios.post<{
        success: boolean;
        requestId?: string;
      }>(`${API_BASE_URL}/sessions/screenshot-request`, null, {
        params: { code },
      });

      return response.data;
    } catch (error) {
      console.error("Screenshot request failed:", error);
      return { success: false };
    }
  }

  /**
   * Detect device type (mobile/desktop)
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
    return isMobile ? "mobile" : "desktop";
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
      return {
        success: false,
        error: "Network error",
        message: axiosError.message || "Failed to connect to server",
      };
    }

    return {
      success: false,
      error: "Unknown error",
      message: "An unexpected error occurred",
    };
  }
}

export default new ApiService();
