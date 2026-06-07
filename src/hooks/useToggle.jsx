import { useCallback, useState } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggleValue = useCallback(() => {
    setValue((current) => !current);
  }, []);

  return [value, toggleValue, setValue];
}
