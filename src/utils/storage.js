export function readStorageItem(key, defaultValue = null) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Failed to read localStorage item ${key}:`, error);
    return defaultValue;
  }
}

export function writeStorageItem(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage item ${key}:`, error);
  }
}

export function deleteStorageItem(key) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to delete localStorage item ${key}:`, error);
  }
}
