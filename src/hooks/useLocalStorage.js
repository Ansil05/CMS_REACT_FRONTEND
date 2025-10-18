import { useState } from 'react';

export default function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  function setValue(v) {
    setState(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {}
  }

  return [state, setValue];
}
