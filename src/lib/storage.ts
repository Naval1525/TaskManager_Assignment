/**
 * Storage helpers for localStorage operations
 * Handles JSON serialization/deserialization with fallback values
 */

const STORAGE_KEYS = {
  USERS: "tm_users",
  PROJECTS: "tm_projects",
  CURRENT_USER: "tm_current_user",
} as const;

export { STORAGE_KEYS };

/**
 * Get item from localStorage with fallback
 */
export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return fallback;
  }
}

/**
 * Set item in localStorage
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}
