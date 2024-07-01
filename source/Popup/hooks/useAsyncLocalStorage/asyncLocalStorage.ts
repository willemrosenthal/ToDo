export const asyncLocalStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem(key, value);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  getItem: (key: string): Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) => {
      try {
        const value = localStorage.getItem(key);
        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  },
  removeItem: (key: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  clear: (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.clear();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};
