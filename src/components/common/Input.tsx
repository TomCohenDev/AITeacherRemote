import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "code";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, variant = "default", className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20";

    const variantClasses = {
      default: "border-gray-300 focus:border-primary",
      code: "border-gray-300 focus:border-primary text-center text-xl font-bold uppercase",
    };

    const errorClasses = error
      ? "border-error focus:border-error focus:ring-error/20"
      : "";

    const classes = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <input ref={ref} className={classes} {...props} />

        {error && <p className="mt-1 text-sm text-error">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
