/**
 * API Utility Functions
 * Centralized fetch wrapper with authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Get API key from environment
 * In production, this should be stored securely (not in frontend code)
 * Consider using a backend-for-frontend (BFF) pattern for better security
 */
const getApiKey = (): string | null => {
  return import.meta.env.VITE_ADMIN_API_KEY || null;
};

/**
 * Authenticated fetch wrapper
 * Automatically adds X-API-Key header to all requests
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
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

  return fetch(fullUrl, {
    ...options,
    headers,
  });
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
