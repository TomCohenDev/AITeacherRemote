// Session related types
export interface SessionState {
  sessionCode: string | null;
  sessionId: string | null;
  connectionStatus: "disconnected" | "connecting" | "connected";
}

// Session information
export interface Session {
  sessionId: string;
  code: string;
  status: "waiting" | "connected" | "disconnected";
  createdAt: string;
  expiresAt: string;
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

// Connect response from n8n API
export interface ConnectResponse {
  success: boolean;
  message?: string;
  error?: string;
  sessionId?: string;
  code?: string;
  status?: string;
}

// QR Code data format
export interface QRCodeData {
  type: "session";
  code: string;
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

// Bounding box for screen area selection
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Annotation request payload
export interface AnnotationRequest {
  text: string;
  image?: string;
  boundingBox?: BoundingBox;
  screenResolution?: {
    width: number;
    height: number;
  };
}

// Screenshot response from Windows app
export interface ScreenshotResponse {
  image: string;
  width: number;
  height: number;
}

// Screenshot request from Supabase
export interface ScreenshotRequest {
  id: string;
  session_id: string;
  status: "pending" | "ready" | "failed";
  image_url?: string;
  width?: number;
  height?: number;
  requested_at: string;
  completed_at?: string;
  error?: string;
}
