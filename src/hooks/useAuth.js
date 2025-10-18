import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: initialize auth from context/localStorage
  }, []);

  return { user, setUser };
}
