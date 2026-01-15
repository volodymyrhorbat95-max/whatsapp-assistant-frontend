/**
 * API Utility Functions
 * Centralized fetch wrapper with authentication, timeout, and retry
 * Ensures consistent response time and reliability for 24/7 operation
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Timeout and retry configuration for reliability
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 2; // 2 retries = 3 total attempts
const RETRY_DELAY_MS = 1000; // 1 second initial delay
const RETRY_BACKOFF_MULTIPLIER = 2; // Exponential backoff

/**
 * Get API key from environment
 * In production, this should be stored securely (not in frontend code)
 * Consider using a backend-for-frontend (BFF) pattern for better security
 */
const getApiKey = (): string | null => {
  return import.meta.env.VITE_ADMIN_API_KEY || null;
};

/**
 * Delay utility for retry backoff
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if error is retryable (network issues, server errors)
 */
const isRetryableError = (error: any): boolean => {
  // Network errors are retryable
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return true;
  }

  // Timeout errors are retryable
  if (error.name === 'AbortError') {
    return true;
  }

  return false;
};

/**
 * Check if HTTP response status is retryable
 */
const isRetryableStatus = (status: number): boolean => {
  // 429 (rate limit), 500, 502, 503, 504 are retryable
  return status === 429 || status >= 500;
};

/**
 * Fetch with timeout using AbortController
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Authenticated fetch wrapper with timeout and retry
 * Automatically adds X-API-Key header to all requests
 * Retries on network errors and server errors with exponential backoff
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> => {
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add API key if available
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        fullUrl,
        { ...options, headers },
        timeoutMs
      );

      // Check if response status is retryable
      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        console.warn(`API request failed with status ${response.status}, retrying (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
        const waitTime = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt);
        await delay(waitTime);
        continue;
      }

      return response;
    } catch (error: any) {
      lastError = error;

      // Log timeout specifically
      if (error.name === 'AbortError') {
        console.warn(`API request timed out after ${timeoutMs}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
      } else {
        console.warn(`API request failed: ${error.message} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
      }

      // Only retry on retryable errors
      if (!isRetryableError(error) || attempt >= MAX_RETRIES) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt);
      await delay(waitTime);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Request failed after all retries');
};

/**
 * Helper for GET requests
 */
export const apiGet = async (endpoint: string): Promise<Response> => {
  return authenticatedFetch(endpoint, { method: 'GET' });
};

/**
 * Helper for POST requests
 */
export const apiPost = async (endpoint: string, data: any): Promise<Response> => {
  return authenticatedFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Helper for PUT requests
 */
export const apiPut = async (endpoint: string, data: any): Promise<Response> => {
  return authenticatedFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Helper for DELETE requests
 */
export const apiDelete = async (endpoint: string): Promise<Response> => {
  return authenticatedFetch(endpoint, { method: 'DELETE' });
};

export { API_BASE_URL };
