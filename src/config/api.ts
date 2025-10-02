// 🧪 API Configuration - Change this to switch between production and test APIs
export const USE_TEST_API = false; // Set to true for test API, false for production

// Hardcoded API URLs
export const PRODUCTION_API = "https://n8n.yarden-zamir.com/webhook/ita/api";
export const TEST_API = "https://n8n.yarden-zamir.com/webhook-test/ita/api";

export const API_BASE = USE_TEST_API ? TEST_API : PRODUCTION_API;

// Display info
export const API_INFO = {
  isTest: USE_TEST_API,
  url: API_BASE,
  label: USE_TEST_API ? "TEST API" : "PRODUCTION API",
};
