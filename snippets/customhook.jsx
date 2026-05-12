import { useState, useEffect } from "react";

// This is a "must-have" for persisting state in the browser.
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage: const [theme, setTheme] = useLocalStorage('theme', 'light');
export default useLocalStorage;