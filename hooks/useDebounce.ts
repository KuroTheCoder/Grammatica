// hooks/useDebounce.ts (The complete, copy-pasteable hook)

import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value.
 * This is perfect for inputs like search bars where you want to wait
 * for the user to stop typing before performing an action (like an API call or heavy filtering).
 *
 * @param value The value to debounce (e.g., the search term from an input).
 * @param delay The debounce delay in milliseconds (e.g., 500).
 * @returns The debounced value, which only updates after the delay has passed.
 */
export function useDebounce<T>(value: T, delay: number): T {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(
        () => {
            // Set up a timer that will update the debounced value after the specified delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // This is the cleanup function.
            // It runs every time the `value` or `delay` changes, OR when the component unmounts.
            // It clears the previous timer, effectively resetting it.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-run the effect if the value or delay changes
    );

    return debouncedValue;
}