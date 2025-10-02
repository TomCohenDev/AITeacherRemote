import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { fileToCanvas, canvasToPngBase64 } from "../utils/image";
import { sendPromptToN8n } from "../services/promptApi";
import { API_INFO } from "../config/api";

type Props = {
  /** 5-letter code (uppercase A–Z). Pass from SessionPage or store. */
  sessionCode: string;
  /** Optional: show header */
  title?: string;
};

/**
 * MessageComposer
 * - Textarea for prompt (optional if image provided)
 * - Image input (camera/screenshot). Resizes client-side and sends raw base64 PNG.
 * - Posts to n8n: POST /sessions/prompt?code={CODE} with {text?, image?}
 */
export default function MessageComposer({
  sessionCode,
  title = "Send to Assistant",
}: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // validate code format
  const isValidCode = useMemo(
    () => /^[A-Z]{5}$/.test(sessionCode),
    [sessionCode]
  );

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCode) {
      toast.error("Invalid session code.");
      return;
    }
    if (!text.trim() && !file) {
      toast.error("Provide text or select an image.");
      return;
    }

    setSending(true);
    try {
      let rawBase64: string | null = null;

      if (file) {
        const canvas = await fileToCanvas(file);
        rawBase64 = await canvasToPngBase64(canvas, 1920);
      }

      const res = await sendPromptToN8n(
        sessionCode.toUpperCase(),
        text.trim() ? text : null,
        rawBase64
      );

      if (!res.success) {
        toast.error(res.error || "Failed to send");
      } else {
        toast.success("Sent!");
        setText("");
        setFile(null);
        setPreview(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-3xl mx-auto mt-6 p-4 border border-gray-200 rounded-xl bg-white"
    >
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">
          Sends to n8n → AI → Supabase → WPF overlay. Images are resized to
          ≤1920px, PNG base64.
        </p>
        <p className="text-xs text-blue-600 font-mono">
          {API_INFO.label}: {API_INFO.url}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Message (optional if image attached)
        </label>
        <textarea
          className="w-full rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 p-3 min-h-[96px]"
          placeholder="Ask anything… (solve, explain, or say 'draw an arrow to…')"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
          }}
          className="block"
        />
        <p className="text-xs text-gray-500 mt-1">
          Recommended: screenshot / camera photo of the board or screen. PNG
          base64 is sent inline.
        </p>
      </div>

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="preview"
            className="max-w-[280px] max-h-[200px] object-contain border border-dashed border-gray-300 rounded-md"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={sending || !isValidCode}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send"}
        </button>
        <span className="text-xs text-gray-500">
          Session: <span className="font-mono">{sessionCode || "-----"}</span>
        </span>
      </div>
    </form>
  );
}
