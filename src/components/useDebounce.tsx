import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 1000) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timeOut);
    };
  }, [value, delay]);

  return debounced;
}
