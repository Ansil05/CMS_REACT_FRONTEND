import { useState, useEffect } from 'react';

export default function useRole() {
  const [role, setRole] = useState(null);
  useEffect(() => {}, []);
  return { role, setRole };
}
