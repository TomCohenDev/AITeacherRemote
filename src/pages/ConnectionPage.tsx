import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaKeyboard } from "react-icons/fa";
import { useSessionStore } from "../store/sessionStore";
import { validateSessionCode } from "../utils/helpers";

const ConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { connect } = useSessionStore();
  const [code, setCodeState] = useState(["", "", "", "", ""]);
  const [isConnecting, setIsConnecting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle manual code input
  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value.toUpperCase().replace(/[^A-Z]/g, "");
    setCodeState(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
    const newCode = pastedData.split("").slice(0, 5);
    const paddedCode = [...newCode, ...Array(5 - newCode.length).fill("")];
    setCodeState(paddedCode);

    // Focus the last filled input or first empty input
    const lastFilledIndex = newCode.length - 1;
    const focusIndex = Math.min(lastFilledIndex, 4);
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle connection
  const handleConnect = async (sessionCode: string) => {
    if (!validateSessionCode(sessionCode)) {
      toast.error("Please enter a valid 5-letter session code.");
      return;
    }

    setIsConnecting(true);
    try {
      await connect(sessionCode);
      toast.success(`Connected to session ${sessionCode}!`);
      navigate(`/session/${sessionCode}`);
    } catch (error) {
      toast.error("Failed to connect to session. Please try again.");
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle manual code submission
  const handleManualSubmit = () => {
    const fullCode = code.join("");
    if (validateSessionCode(fullCode)) {
      handleConnect(fullCode);
    } else {
      toast.error("Please enter a complete 5-letter session code.");
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
          <p className="text-white/80">Connect to your learning session</p>
        </div>

        {/* Manual Code Entry */}
        <div className="card">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Enter Session Code
              </h2>
              <p className="text-gray-600 mb-6">
                Type the 5-letter code shown on the teacher's screen
              </p>

              {/* Code Input Boxes */}
              <div className="flex justify-center space-x-2 mb-6">
                {code.map((letter, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    value={letter}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className="code-input"
                    placeholder="A"
                    disabled={isConnecting}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleManualSubmit}
                disabled={
                  isConnecting || !code.every((letter) => letter !== "")
                }
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  "Connect to Session"
                )}
              </button>
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
