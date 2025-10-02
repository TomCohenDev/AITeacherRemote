import axios from "axios";
import { API_BASE } from "../config/api";

/**
 * Sends text and/or raw base64 image to n8n.
 * Endpoint: POST {API_BASE}/sessions/prompt?code={CODE}
 */
export async function sendPromptToN8n(
  sessionCode: string,
  text: string | null,
  imageBase64: string | null
): Promise<{ success: boolean; data?: any; error?: string }> {
  const url = `${API_BASE}/sessions/prompt?code=${encodeURIComponent(
    sessionCode
  )}`;
  const body: Record<string, any> = {};
  if (text && text.trim()) body.text = text.trim();
  if (imageBase64) body.image = imageBase64;

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });
    return { success: true, data: res.data };
  } catch (e: any) {
    const errText =
      e?.response?.data?.error ||
      e?.response?.statusText ||
      e?.message ||
      "Failed to send prompt";
    return { success: false, error: errText };
  }
}
