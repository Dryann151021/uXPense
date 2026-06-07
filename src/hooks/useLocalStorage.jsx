import { useCallback, useState } from 'react';
import { readStorageItem, writeStorageItem } from '../utils/storage.js';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() =>
    readStorageItem(key, initialValue),
  );

  const setValue = useCallback(
    (valueOrUpdater) => {
      setStoredValue((currentValue) => {
        const nextValue =
          typeof valueOrUpdater === 'function'
            ? valueOrUpdater(currentValue)
            : valueOrUpdater;

        writeStorageItem(key, nextValue);
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
