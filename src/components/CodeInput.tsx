import React, { useState, useRef, useEffect } from "react";

interface CodeInputProps {
  onSubmit?: (code: string) => void;
  onConnect?: (code: string) => void;
  disabled?: boolean;
  error?: string | null;
  onCodeChange?: (code: string) => void;
  showConnectButton?: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  onSubmit,
  onConnect,
  disabled = false,
  error,
  onCodeChange,
  showConnectButton = false,
}) => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-submit when all 5 letters are entered (only if not disabled and not showing connect button)
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 5 && !disabled && !showConnectButton && onSubmit) {
      onSubmit(fullCode);
    }
  }, [code, onSubmit, disabled, showConnectButton]);

  // Handle manual code input
  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value.toUpperCase().replace(/[^A-Z]/g, "");
    setCode(newCode);

    // Notify parent of code change
    if (onCodeChange) {
      onCodeChange(newCode.join(""));
    }

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
    setCode(paddedCode);

    // Notify parent of code change
    if (onCodeChange) {
      onCodeChange(paddedCode.join(""));
    }

    // Focus the last filled input or first empty input
    const lastFilledIndex = newCode.length - 1;
    const focusIndex = Math.min(lastFilledIndex, 4);
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle Enter key submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.every((letter) => letter !== "")) {
      if (showConnectButton && onConnect) {
        onConnect(code.join(""));
      } else if (onSubmit) {
        onSubmit(code.join(""));
      }
    }
  };

  // Handle Connect button click
  const handleConnectClick = () => {
    if (onConnect && code.every((letter) => letter !== "")) {
      onConnect(code.join(""));
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Input Boxes */}
      <div className="flex justify-center space-x-2">
        {code.map((letter, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            value={letter}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => {
              handleKeyDown(index, e);
              handleKeyPress(e);
            }}
            onPaste={handlePaste}
            maxLength={1}
            className={`code-input ${error ? "border-red-500" : ""}`}
            placeholder="A"
            disabled={disabled}
            autoComplete="off"
          />
        ))}
      </div>

      {/* Connect Button */}
      {showConnectButton && (
        <button
          onClick={handleConnectClick}
          disabled={disabled || !code.every((letter) => letter !== "")}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Connect to Session
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
