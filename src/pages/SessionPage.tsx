import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaDesktop, FaWifi } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSessionStore } from "../store/sessionStore";
import MessageComposer from "../components/MessageComposer";

const SessionPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { connectionStatus, clearSession } = useSessionStore();

  useEffect(() => {
    if (!code || !validateSessionCode(code)) {
      toast.error("Invalid session code");
      navigate("/");
      return;
    }
  }, [code, navigate]);

  const handleDisconnect = () => {
    clearSession();
    toast.success("Disconnected from session");
    navigate("/");
  };

  const validateSessionCode = (code: string): boolean => {
    return /^[A-Z]{5}$/.test(code);
  };

  if (!code || !validateSessionCode(code)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gradient">
                  AI Teacher Assistant
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {connectionStatus === "connected" ? (
                  <>
                    <FaWifi className="text-success text-lg" />
                    <span className="text-sm text-gray-600">Connected</span>
                  </>
                ) : (
                  <>
                    <FaWifi className="text-error text-lg" />
                    <span className="text-sm text-gray-600">Disconnected</span>
                  </>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="btn-danger flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Info Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Session Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Session Code:</span>
                  <span className="font-mono text-lg font-bold text-primary bg-gray-100 px-3 py-1 rounded">
                    {code}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      connectionStatus === "connected"
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {connectionStatus.charAt(0).toUpperCase() +
                      connectionStatus.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Device:</span>
                  <span className="text-gray-900 font-medium">
                    {navigator.userAgent.includes("Mobile")
                      ? "Mobile"
                      : "Desktop"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Profile
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Student</p>
                  <p className="text-sm text-gray-600">
                    {navigator.userAgent.includes("Mobile")
                      ? "Mobile Device"
                      : "Desktop Device"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher's Screen Area */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Teacher's Screen
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaDesktop />
                  <span>Live View</span>
                </div>
              </div>

              {/* Placeholder for teacher's screen */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FaDesktop className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Teacher's screen will appear here
                  </p>
                  <p className="text-sm text-gray-500">
                    This feature will be available when the teacher starts
                    sharing their screen
                  </p>
                </div>
              </div>

              {/* Screen Controls */}
              <div className="mt-4 flex justify-center space-x-4">
                <button className="btn-secondary">Full Screen</button>
                <button className="btn-secondary">Adjust Quality</button>
              </div>
            </div>

            {/* Session Controls */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Session Controls
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="btn-secondary">Raise Hand</button>
                <button className="btn-secondary">Ask Question</button>
                <button className="btn-secondary">Mute/Unmute</button>
                <button className="btn-secondary">Settings</button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Composer */}
        <MessageComposer sessionCode={code} />
      </main>
    </div>
  );
};

export default SessionPage;
