import axios, { AxiosError } from "axios";

const API_BASE_URL = "https://n8n.yarden-zamir.com/webhook/ita/api";

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
