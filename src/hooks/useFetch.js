import { useState, useEffect, useCallback } from "react";

const useFetch = (url, { auth = false } = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        credentials: auth ? "include" : "same-origin",
      });
      const result = await res.json();

      if (!res.ok) {
        setData(null);
        setError(result.message || "Failed to fetch");
        return;
      }

      setData(result.data ?? null);
    } catch (err) {
      setData(null);
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [url, auth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
};

export default useFetch;
