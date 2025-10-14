import axios from "axios";
import { API_BASE } from "../config/api";

// Create axios instance with extended timeout for long-running operations
const axiosInstance = axios.create({
  timeout: 300000, // 5 minutes default timeout
});

/**
 * Sends text and/or raw base64 image to n8n.
 * Endpoint: POST {API_BASE}/sessions/prompt?code={CODE}
 */
export async function sendPromptToN8n(
  sessionCode: string,
  text: string | null,
  imageBase64: string | null
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const url = `${API_BASE}/sessions/prompt?code=${encodeURIComponent(
    sessionCode
  )}`;
  const body: { text?: string; image?: string } = {};
  if (text && text.trim()) body.text = text.trim();
  if (imageBase64) body.image = imageBase64;

  const startTime = Date.now();
  try {
    console.log("🔧 Sending prompt with 5-minute timeout...");
    const res = await axiosInstance.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 300000, // 5 minutes timeout for annotations
    });
    return { success: true, data: res.data };
  } catch (e: unknown) {
    const duration = (Date.now() - startTime) / 1000;
    let errText = "Failed to send prompt";

    if (axios.isAxiosError(e)) {
      console.error("🔴 Axios error details:");
      console.error("- Code:", e.code);
      console.error("- Message:", e.message);
      console.error("- Response status:", e.response?.status);
      console.error("- Response data:", e.response?.data);
      console.error("- Duration:", duration.toFixed(1) + "s");

      // Check for proxy/gateway timeout (Network Error after ~60 seconds)
      if (
        e.code === "ERR_NETWORK" &&
        e.message === "Network Error" &&
        duration > 50
      ) {
        errText =
          "Server proxy timeout (60s). Annotation may still be processing. Please configure your server to allow longer requests.";
      } else {
        errText =
          e.response?.data?.error ||
          e.response?.statusText ||
          e.message ||
          errText;
      }
    } else if (e instanceof Error) {
      errText = e.message;
    }
    return { success: false, error: errText };
  }
}
