import { useEffect, useState } from 'react';

export function useAutosave<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Shallow merge top level, and specifically merge settings
        setStoredValue({
          ...initialValue,
          ...parsed,
          settings: {
            ...(initialValue as any).settings,
            ...(parsed.settings || {})
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsInitialized(true);
  }, [key]);

  // Save to local storage whenever value changes
  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [isInitialized ? storedValue : initialValue, setValue];
}
