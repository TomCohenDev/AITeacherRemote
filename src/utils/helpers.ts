/**
 * Utility functions for the AI Teacher Assistant app
 */

/**
 * Validates a session code (must be exactly 5 uppercase letters)
 * @param code - The code to validate
 * @returns boolean indicating if the code is valid
 */
export const validateSessionCode = (code: string): boolean => {
  return /^[A-Z]{5}$/.test(code);
};

/**
 * Formats a session code to uppercase and removes non-alphabetic characters
 * @param code - The code to format
 * @returns Formatted code
 */
export const formatSessionCode = (code: string): string => {
  return code
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 5);
};

/**
 * Generates a random session code for testing
 * @returns A random 5-letter code
 */
export const generateRandomCode = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

/**
 * Debounce function to limit the rate of function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Checks if the device has camera capabilities
 * @returns Promise that resolves to boolean
 */
export const hasCamera = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch (error) {
    console.error("Error checking camera availability:", error);
    return false;
  }
};

/**
 * Requests camera permission
 * @returns Promise that resolves to boolean
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately as we just needed permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Camera permission denied:", error);
    return false;
  }
};

/**
 * Formats error messages for display
 * @param error - Error object or string
 * @returns Formatted error message
 */
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
};

/**
 * Checks if the current device is mobile
 * @returns boolean indicating if device is mobile
 */
export const isMobile = (): boolean => {
  return window.innerWidth <= 768;
};

/**
 * Generates a unique ID
 * @returns Unique string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
