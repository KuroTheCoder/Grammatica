// hooks/useKeyPress.ts
"use client";

import { useEffect, useCallback } from 'react';

// THE NEW AND IMPROVED HOOK! No more 'modifier' prop needed.
// It's now smart enough to handle Ctrl OR Cmd by default.
export const useKeyPress = (targetKey: string, callback: () => void) => {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // THE SECRET SAUCE: Check for EITHER metaKey (Cmd on Mac) OR ctrlKey (Ctrl on Win/Linux).
            const isModifierPressed = event.metaKey || event.ctrlKey;

            if (isModifierPressed && event.key.toLowerCase() === targetKey.toLowerCase()) {
                event.preventDefault();
                callback();
            }
        },
        [targetKey, callback] // No more 'modifier' dependency
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
};