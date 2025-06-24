// components/shared/InteractiveSpotlightBackground.tsx

"use client";

import React, { FC, useEffect } from 'react';

// The new "rulebook": It now expects 'isTeacher'
type SpotlightProps = {
    isTeacher: boolean;
};

const InteractiveSpotlightBackground: FC<SpotlightProps> = ({ isTeacher }) => {

    // Logic to decide the color based on the role
    const color = isTeacher
        ? 'rgba(56, 189, 248, 0.15)' // Teacher blue/cyan
        : 'rgba(52, 211, 153, 0.15)'; // Student green

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Your brilliant requestAnimationFrame optimization stays!
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
                document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-2] transition-all duration-500"
            style={{
                // It now uses the dynamic color determined above
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${color}, transparent 80%)`
            }}
        />
    );
};

export default InteractiveSpotlightBackground;