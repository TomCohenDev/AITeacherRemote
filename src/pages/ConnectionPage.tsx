import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaKeyboard } from "react-icons/fa";
import { useSessionStore } from "../store/sessionStore";
import { validateSessionCode } from "../utils/helpers";
import apiService from "../services/api";
import CodeInput from "../components/CodeInput";

const ConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSessionCode, setSessionId, setConnectionStatus } =
    useSessionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasShownError, setHasShownError] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const currentSessionCode = useRef<string | null>(null);

  // Handle code change (reset state when user types new code)
  const handleCodeChange = (code: string) => {
    if (currentSessionCode.current !== code) {
      setHasShownError(false);
      setHasShownSuccess(false);
      setError(null);
    }
  };

  // Handle Connect button click
  const handleConnectClick = async (code: string) => {
    if (!validateSessionCode(code)) {
      const errorMessage = "Please enter a complete 5-letter session code.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Reset state for new code
    if (currentSessionCode.current !== code) {
      setHasShownError(false);
      setHasShownSuccess(false);
      currentSessionCode.current = code;
    }

    await handleConnect(code);
  };

  // Handle connection to API (single attempt, no auto-retry)
  const handleConnect = async (sessionCode: string) => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus("connecting");

      // Validate format
      if (!/^[A-Z]{5}$/.test(sessionCode)) {
        throw new Error("Code must be 5 uppercase letters");
      }

      // Connect to session via API
      const response = await apiService.connectToSession(sessionCode);

      if (response.success) {
        // Store session info
        setSessionCode(sessionCode);
        setConnectionStatus("connected");

        if (response.sessionId) {
          setSessionId(response.sessionId);
        }

        // Show success message only once
        if (!hasShownSuccess) {
          setHasShownSuccess(true);
          toast.success("Connected successfully!");
        }

        // Navigate to session page
        navigate(`/session/${sessionCode}`);
      } else {
        throw new Error(response.message || "Failed to connect");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect";
      setError(errorMessage);
      setConnectionStatus("disconnected");

      // Only show error toast once
      if (!hasShownError) {
        setHasShownError(true);

        // Show user-friendly error messages
        if (errorMessage.includes("Session not found")) {
          toast.error("Invalid session code. Please check and try again.");
        } else if (errorMessage.includes("already connected")) {
          toast.error("This session is already in use.");
        } else if (
          errorMessage.includes("Network error") ||
          errorMessage.includes("Failed to connect to server")
        ) {
          toast.error("Connection failed. Please check your internet.");
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <FaKeyboard className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Teacher Assistant
          </h1>
          <p className="text-white/80">Connect to your ITA session</p>
        </div>

        {/* Manual Code Entry */}
        <div className="card">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Enter Session Code
              </h2>
              <p className="text-gray-600 mb-6">
                Type the 5-letter code shown on the screen
              </p>

              {/* Code Input Component */}
              <div className="mb-6">
                <CodeInput
                  onConnect={handleConnectClick}
                  disabled={loading}
                  error={error}
                  onCodeChange={handleCodeChange}
                  showConnectButton={true}
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mr-2"></div>
                  <span className="text-gray-600">
                    Connecting to session...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Need help? Contact your teacher for the session code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;
