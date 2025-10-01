// Session related types
export interface SessionState {
  code: string;
  status: "disconnected" | "connecting" | "connected";
  userInfo?: UserInfo;
}

// User information
export interface UserInfo {
  id: string;
  name: string;
  email?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Connection methods
export type ConnectionMethod = "qr" | "manual";

// QR Scanner props
export interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  isActive: boolean;
}

// Code input props
export interface CodeInputProps {
  onCodeChange: (code: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

// Session page props
export interface SessionPageProps {
  sessionCode: string;
}
