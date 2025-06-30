
// /components/ui/EnergyCore.tsx
"use client";

import React from 'react';

// A simple utility to convert hex to HSL's Hue value.
// We only need the Hue for the hsla() function in our CSS.
const hexToHue = (hex: string): number => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
        const d = max - min;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return Math.round(h * 360);
};


interface EnergyCoreProps {
    color1: string;
    color2: string;
}

const EnergyCore: React.FC<EnergyCoreProps> = ({ color1, color2 }) => {
    // We convert our hex colors to HSL Hue values
    const hue1 = hexToHue(color1);
    const hue2 = hexToHue(color2);

    return (
        <div
            className="noise-container"
            style={{
                // We dynamically set the CSS variables that our globals.css file is waiting for.
                // This is a pro-gamer move for dynamic theming.
                '--color-a': hue1,
                '--color-b': hue2,
            } as React.CSSProperties}
        />
    );
};

export default EnergyCore;