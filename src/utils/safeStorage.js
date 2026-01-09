/**
 * Safe Storage Utility
 *
 * Wraps localStorage with error handling to prevent crashes in:
 * - Private browsing mode
 * - When storage quota is exceeded
 * - When localStorage is disabled
 */

/**
 * Safely get an item from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or on error
 * @returns {string|null} - The stored value or defaultValue
 */
export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.warn(`[SafeStorage] Failed to get item "${key}":`, error.message);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage
 * @param {string} key - The storage key
 * @param {string} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[SafeStorage] Failed to set item "${key}":`, error.message);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param {string} key - The storage key
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[SafeStorage] Failed to remove item "${key}":`, error.message);
    return false;
  }
};

/**
 * Safely get a parsed integer from localStorage
 * @param {string} key - The storage key
 * @param {number} defaultValue - Default value if key doesn't exist or on error
 * @returns {number} - The parsed integer or defaultValue
 */
export const safeGetInt = (key, defaultValue = 0) => {
  const value = safeGetItem(key);
  if (value === null) return defaultValue;

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Safely get a parsed JSON object from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or on error
 * @returns {*} - The parsed object or defaultValue
 */
export const safeGetJSON = (key, defaultValue = null) => {
  const value = safeGetItem(key);
  if (value === null) return defaultValue;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`[SafeStorage] Failed to parse JSON for "${key}":`, error.message);
    return defaultValue;
  }
};

/**
 * Safely set a JSON object in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to stringify and store
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeSetJSON = (key, value) => {
  try {
    const stringified = JSON.stringify(value);
    return safeSetItem(key, stringified);
  } catch (error) {
    console.warn(`[SafeStorage] Failed to stringify JSON for "${key}":`, error.message);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export default {
  getItem: safeGetItem,
  setItem: safeSetItem,
  removeItem: safeRemoveItem,
  getInt: safeGetInt,
  getJSON: safeGetJSON,
  setJSON: safeSetJSON,
  isAvailable: isStorageAvailable,
};
