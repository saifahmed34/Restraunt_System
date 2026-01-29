// JWT token utilities for authentication

export interface JWTPayload {
  role?: string;
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decode a JWT token without verification (client-side only)
 * For security, always verify tokens server-side
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Get the JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Check if the current user has admin role
 */
export function isAdmin(): boolean {
  const token = getToken();
  if (!token) return false;
  
  const payload = decodeJWT(token);
  return payload?.role === 'Admin';
}

/**
 * Check if the token is expired
 */
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get current user info from token
 */
export function getCurrentUser(): JWTPayload | null {
  const token = getToken();
  if (!token) return null;
  
  return decodeJWT(token);
}
