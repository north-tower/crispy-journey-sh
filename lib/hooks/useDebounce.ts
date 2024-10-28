// lib/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Advanced version with more features
interface DebounceOptions {
  delay?: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useAdvancedDebounce<T>(
  value: T,
  options: DebounceOptions = {}
): {
  debouncedValue: T;
  isWaiting: boolean;
  cancel: () => void;
  flush: () => void;
} {
  const { delay = 500, maxWait, leading = false, trailing = true } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [maxWaitTimeoutId, setMaxWaitTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    if (maxWaitTimeoutId) {
      clearTimeout(maxWaitTimeoutId);
      setMaxWaitTimeoutId(null);
    }
    setIsWaiting(false);
  };

  const flush = () => {
    if (timeoutId || maxWaitTimeoutId) {
      setDebouncedValue(value);
      cancel();
    }
  };

  useEffect(() => {
    let shouldUpdate = true;

    // Handle leading edge
    if (leading && !timeoutId) {
      setDebouncedValue(value);
      shouldUpdate = false;
    }

    // Set up the timeout
    if (shouldUpdate && trailing) {
      setIsWaiting(true);
      const newTimeoutId = setTimeout(() => {
        setDebouncedValue(value);
        setTimeoutId(null);
        setIsWaiting(false);
      }, delay);
      setTimeoutId(newTimeoutId);

      // Set up maxWait timeout if specified
      if (maxWait) {
        const newMaxWaitTimeoutId = setTimeout(() => {
          if (timeoutId) {
            setDebouncedValue(value);
            cancel();
          }
        }, maxWait);
        setMaxWaitTimeoutId(newMaxWaitTimeoutId);
      }
    }

    // Clean up
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (maxWaitTimeoutId) clearTimeout(maxWaitTimeoutId);
    };
  }, [value, delay, maxWait, leading, trailing]);

  return { debouncedValue, isWaiting, cancel, flush };
}
