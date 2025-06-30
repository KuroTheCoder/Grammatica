"use client";

import { useEffect, useCallback } from 'react';

// This is our new power tool. A custom hook to detect key presses.
export const useKeyPress = (targetKey: string, callback: () => void, modifier?: 'ctrl' | 'meta' | 'alt') => {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            const isModifierPressed = modifier ? (modifier === 'meta' ? event.metaKey : event.ctrlKey) : true;
            if (event.key.toLowerCase() === targetKey.toLowerCase() && isModifierPressed) {
                event.preventDefault();
                callback();
            }
        },
        [targetKey, callback, modifier]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
};