import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaWifi } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSessionStore } from "../store/sessionStore";
import type { BoundingBox } from "../types";
import api from "../services/api";
import { supabase } from "../services/supabase";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import AreaSelectionModal from "../components/AreaSelectionModal";

const SessionPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { connectionStatus, sessionId, clearSession } = useSessionStore();

  // State for annotation controls
  const [prompt, setPrompt] = useState("");
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotDimensions, setScreenshotDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingScreenshot, setIsFetchingScreenshot] = useState(false);
  const [showScreenshotPreview, setShowScreenshotPreview] = useState(false);

  useEffect(() => {
    if (!code || !validateSessionCode(code)) {
      toast.error("Invalid session code");
      navigate("/");
      return;
    }
  }, [code, navigate]);

  // Debug logging on mount
  useEffect(() => {
    console.log("📱 SessionPage loaded");
    console.log("Session Code:", code);
    console.log("Session ID:", sessionId);

    if (!sessionId) {
      console.warn(
        "⚠️ No session ID available - realtime subscription will not work"
      );
    } else {
      console.log("✅ Session ID found - realtime subscription will activate");
    }
  }, [code, sessionId]);

  // Supabase realtime subscription for screenshot requests
  useEffect(() => {
    if (!sessionId) {
      console.warn("⚠️ Cannot subscribe to screenshots - no session ID");
      return;
    }

    console.log("🔌 Setting up Supabase realtime subscription...");
    console.log("Channel:", `screenshot-${sessionId}`);

    // Subscribe to screenshot_requests table for this session
    const channel = supabase
      .channel(`screenshot-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "screenshot_requests",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          console.log("📸 Screenshot update received:", payload);

          if (payload.new.status === "ready" && payload.new.image_url) {
            console.log("✅ Screenshot ready!");
            console.log("Image URL:", payload.new.image_url);
            console.log(
              "Dimensions:",
              payload.new.width,
              "×",
              payload.new.height
            );

            setScreenshot(payload.new.image_url);
            setScreenshotDimensions({
              width: payload.new.width,
              height: payload.new.height,
            });
            setIsFetchingScreenshot(false);
            setShowScreenshotPreview(true);
            toast.success("Screenshot ready!");
          } else if (payload.new.status === "failed") {
            console.error("❌ Screenshot capture failed:", payload.new.error);
            toast.error("Screenshot capture failed");
            setIsFetchingScreenshot(false);
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    console.log("✅ Realtime subscription active");

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleDisconnect = () => {
    clearSession();
    toast.success("Disconnected from session");
    navigate("/");
  };

  const validateSessionCode = (code: string): boolean => {
    return /^[A-Z]{5}$/.test(code);
  };

  // Request screenshot from Windows app via n8n
  const fetchScreenshot = async () => {
    if (!code) return;

    console.log("📸 Requesting screenshot for session:", code);
    setIsFetchingScreenshot(true);

    try {
      const response = await api.requestScreenshot(code);
      console.log("Screenshot request response:", response);

      if (!response.success) {
        console.error("❌ Screenshot request failed");
        toast.error("Failed to request screenshot");
        setIsFetchingScreenshot(false);
        return;
      }

      console.log("✅ Screenshot request sent successfully");
      if (response.requestId) {
        console.log("Request ID:", response.requestId);
      }

      toast.success("Requesting screenshot from Windows app...");
      // Screenshot will arrive via realtime subscription
      // Loading state will be cleared in the realtime handler
    } catch (error) {
      console.error("❌ Screenshot request error:", error);
      toast.error("Failed to request screenshot");
      setIsFetchingScreenshot(false);
    }
  };

  // Handle annotation submission
  const handleSubmitAnnotation = async () => {
    if (!code) return;

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        text: prompt,
        image: includeScreenshot ? screenshot || undefined : undefined,
        boundingBox: includeScreenshot ? boundingBox || undefined : undefined,
      };

      await api.sendAnnotationRequest(code, payload);
      toast.success("Annotation request sent!");
      setPrompt("");
      setBoundingBox(null);
      setScreenshot(null);
    } catch (error) {
      toast.error("Failed to send annotation request");
      console.error("Annotation submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle area selection confirmation
  const handleAreaConfirm = (box: BoundingBox) => {
    setBoundingBox(box);
    setIsSelectingArea(false);
  };

  // Handle area selection cancellation
  const handleAreaCancel = () => {
    setIsSelectingArea(false);
    // Don't clear screenshot - user might want to try selecting again
  };

  if (!code || !validateSessionCode(code)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Teacher Control
              </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {connectionStatus === "connected" ? (
                  <>
                    <FaWifi className="text-green-500 text-base sm:text-lg" />
                    <span className="hidden sm:inline text-sm text-gray-600">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <FaWifi className="text-red-500 text-base sm:text-lg" />
                    <span className="hidden sm:inline text-sm text-gray-600">
                      Disconnected
                    </span>
                  </>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Session Info Banner */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Session Code</p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-purple-600">
                {code}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                connectionStatus === "connected"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {connectionStatus.charAt(0).toUpperCase() +
                connectionStatus.slice(1)}
            </div>
          </div>
        </div>

        {/* Annotation Control Panel */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            AI Annotation
          </h2>

          {/* Prompt Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to annotate?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Solve this equation' or 'Draw an arrow pointing to the answer'"
              className="w-full min-h-[120px] px-4 py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-y transition-colors"
              style={{ fontSize: "16px" }} // Prevent zoom on iOS
            />
          </div>

          {/* Screenshot Toggle */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => {
                setIncludeScreenshot(!includeScreenshot);
                // Clear screenshot data when toggling off
                if (includeScreenshot) {
                  setScreenshot(null);
                  setBoundingBox(null);
                }
              }}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border-2 border-gray-200"
            >
              <div className="text-left">
                <p className="font-medium text-gray-900 text-base">
                  Include Screenshot
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Send current screen view to AI
                </p>
              </div>
              <div
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  includeScreenshot ? "bg-purple-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                    includeScreenshot ? "transform translate-x-6" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Screenshot Request Button */}
          {includeScreenshot && (
            <div className="mb-4 sm:mb-6">
              <Button
                onClick={fetchScreenshot}
                variant="outline"
                className="w-full h-14 sm:h-16 text-base font-medium flex items-center justify-center"
                isLoading={isFetchingScreenshot}
              >
                {isFetchingScreenshot ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Waiting for screenshot...
                  </span>
                ) : (
                  "📸 Get Current Screen"
                )}
              </Button>
              {screenshotDimensions && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Screen: {screenshotDimensions.width} ×{" "}
                  {screenshotDimensions.height}px
                </p>
              )}
            </div>
          )}

          {/* Screenshot Actions */}
          {includeScreenshot && screenshot && (
            <div className="mb-4 sm:mb-6 flex gap-2">
              <Button
                onClick={() => setShowScreenshotPreview(true)}
                variant="outline"
                className="flex-1 h-12"
              >
                👁️ Preview
              </Button>
              <Button
                onClick={() => setIsSelectingArea(true)}
                variant="outline"
                className="flex-1 h-12"
              >
                {boundingBox ? "✏️ Change Area" : "🎯 Select Area"}
              </Button>
            </div>
          )}

          {boundingBox && (
            <div className="mb-4 sm:mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                ✓ Area selected: {Math.round(boundingBox.width)} ×{" "}
                {Math.round(boundingBox.height)}px
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmitAnnotation}
            disabled={!prompt.trim() || isSubmitting}
            className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Annotation"}
          </Button>

          {/* Help Text */}
          <div className="mt-4 sm:mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Describe what you want the AI to annotate on
              your screen. Include a screenshot and select a specific area for
              more precise annotations.
            </p>
          </div>
        </Card>
      </main>

      {/* Screenshot Preview Modal */}
      {showScreenshotPreview && screenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Screenshot Preview
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Current screen from Windows app
                    {screenshotDimensions && (
                      <span className="ml-2 font-mono">
                        ({screenshotDimensions.width} ×{" "}
                        {screenshotDimensions.height}px)
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowScreenshotPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50">
              <img
                src={screenshot}
                alt="Screen capture"
                className="w-full h-auto border-2 border-gray-300 rounded shadow-lg"
              />
            </div>

            <div className="p-4 sm:p-6 border-t bg-gray-50">
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowScreenshotPreview(false);
                    setIsSelectingArea(true);
                  }}
                  className="flex-1"
                >
                  Select Area for Annotation
                </Button>
                <Button
                  onClick={() => setShowScreenshotPreview(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Area Selection Modal */}
      {isSelectingArea && screenshot && (
        <AreaSelectionModal
          screenshot={screenshot}
          onConfirm={handleAreaConfirm}
          onCancel={handleAreaCancel}
        />
      )}
    </div>
  );
};

export default SessionPage;
