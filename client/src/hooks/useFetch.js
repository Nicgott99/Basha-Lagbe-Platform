import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useFetch
 * A reusable hook for fetching data from a URL.
 * Handles loading, error, and abort-on-unmount automatically.
 *
 * @param {string|null} url        - The URL to fetch. Pass null/undefined to skip.
 * @param {RequestInit} [options]  - Optional fetch options (method, headers, body…)
 * @returns {{ data, loading, error, refetch }}
 *
 * @example
 *   const { data, loading, error } = useFetch('/server/listing/get/all');
 *
 * @example
 *   // Skip the initial fetch, then trigger manually
 *   const { data, loading, refetch } = useFetch(null);
 *   const handleSearch = () => refetch('/server/listing/search?q=dhaka');
 */
const useFetch = (url, options = {}) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(!!url); // start loading only if url given
  const [error, setError]     = useState(null);

  // Keep a stable reference to options to avoid re-triggering on every render
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async (fetchUrl, fetchOptions = {}) => {
    if (!fetchUrl) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const response = await fetch(fetchUrl, {
        ...optionsRef.current,
        ...fetchOptions,
        signal: controller.signal,
        credentials: "include", // send cookies by default
        headers: {
          "Content-Type": "application/json",
          ...(optionsRef.current?.headers ?? {}),
          ...(fetchOptions?.headers ?? {}),
        },
      });

      if (!response.ok) {
        let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        try {
          const errBody = await response.json();
          errorMessage = errBody.message || errorMessage;
        } catch {
          // non-JSON error body — keep the default message
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      // Ignore AbortError — it means the component unmounted
      if (err.name !== "AbortError") {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, []);

  // Fetch on mount / when url changes
  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    const cleanup = fetchData(url);
    return () => {
      // Abort in-flight request if url changes or component unmounts
      if (typeof cleanup === "function") cleanup();
    };
  }, [url, fetchData]);

  /**
   * refetch — call with an optional URL override to re-trigger the fetch.
   * If no url is passed, re-uses the original url.
   */
  const refetch = useCallback(
    (overrideUrl, overrideOptions) =>
      fetchData(overrideUrl ?? url, overrideOptions),
    [fetchData, url]
  );

  return { data, loading, error, refetch };
};

export default useFetch;
