import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-6">
          <FaExclamationTriangle className="text-4xl text-error" />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/")}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <FaHome />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
