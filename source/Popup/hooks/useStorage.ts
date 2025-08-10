import { useState, useEffect } from 'react';

const getItem = <T>(key: string, initialValue: T, sessionStore: boolean): T => {
  const store = sessionStore ? sessionStorage : localStorage;
  const val = store.getItem(key);
  if (val != null) {
    try {
      const parsedVal = JSON.parse(val);
      return parsedVal;
    } catch {
      console.warn(
        `Data from KEY: ${key} in ${
          sessionStore ? 'sessionStorage' : 'localStorage'
        } failed to parse correctly.`,
      );
    }
  }
  return initialValue;
};

const useStorage = <T>(key: string, initialValue: T, sessionStore: boolean) => {
  const [value, setValue] = useState(() => {
    const fromStore = getItem(key, initialValue, sessionStore);
    return fromStore;
  });

  useEffect(() => {
    const store = sessionStore ? sessionStorage : localStorage;
    store.setItem(key, JSON.stringify(value));
  }, [key, value, sessionStore]);

  return [value, setValue] as const;
};

export const useLocalStorage = <T>(key: string, initialValue: T) =>
  useStorage(key, initialValue, false);

export const useSessionStorage = <T>(key: string, initialValue: T) =>
  useStorage(key, initialValue, true);
