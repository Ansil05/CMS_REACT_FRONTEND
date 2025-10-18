import { useState, useEffect } from 'react';

export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let mounted = true;
    setLoading(true);
    fetch(url, options)
      .then((r) => r.json())
      .then((json) => mounted && setData(json))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
