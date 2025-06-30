// app/components/shared/InteractiveSpotlightBackground.tsx
"use client";

import React, { FC, useEffect } from 'react';

// Define the "themes" our spotlight can have
type SpotlightVariant = 'student' | 'teacher' | 'landing';

type SpotlightProps = {
    variant: SpotlightVariant;
    dynamicColor?: string; // An optional color to blend in
};

const THEMES = {
    student: {
        color1: '#34D399', // Green
        color2: '#60A5FA', // Blue
    },
    teacher: {
        color1: '#60A5FA', // Blue
        color2: '#A78BFA', // Purple
    },
    landing: {
        color1: '#FDE047', // Yellow
        color2: '#A2C5B6', // Muted Green
    },
};

const InteractiveSpotlightBackground: FC<SpotlightProps> = ({ variant, dynamicColor }) => {

    useEffect(() => {
        const theme = THEMES[variant];
        // If a dynamic color is passed, it becomes the "hot core" of the spotlight.
        // Otherwise, we just use the default theme colors.
        const color1 = dynamicColor || theme.color1;
        const color2 = theme.color2;

        // This is YOUR brilliant, high-performance mouse tracking. It's the core of the engine.
        const handleMouseMove = (event: MouseEvent) => {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
                document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // We set the color variables for our CSS to use.
        document.documentElement.style.setProperty('--spotlight-color-1', `${color1}30`);
        document.documentElement.style.setProperty('--spotlight-color-2', `${color2}10`);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [variant, dynamicColor]); // Re-run if the variant or dynamic color changes

    return <div className="dynamic-spotlight-background" />;
};

export default InteractiveSpotlightBackground;