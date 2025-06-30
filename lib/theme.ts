// lib/theme.ts
"use client";

// The blueprint for our color objects
interface RGBColor {
    r: number;
    g: number;
    b: number;
}

// A reusable function to mix colors
const interpolateColor = (color1: RGBColor, color2: RGBColor, factor: number): string => {
    const r = Math.round(color1.r + factor * (color2.r - color1.r));
    const g = Math.round(color1.g + factor * (color2.g - color1.g));
    const b = Math.round(color1.b + factor * (color2.b - color1.b));
    return `rgb(${r}, ${g}, ${b})`;
};

// =================================================================================
// MASTERY THEME ENGINE
// =================================================================================
export const masteryLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const MASTERY_START_COLOR: RGBColor = { r: 16, g: 185, b: 129 }; // Emerald-500
const MASTERY_END_COLOR: RGBColor = { r: 251, g: 191, b: 36 };  // Amber-400

export const getColorForMastery = (level: string): string => {
    const index = masteryLevels.indexOf(level.toUpperCase());
    if (index === -1) return '#FFFFFF';
    const factor = index / (masteryLevels.length - 1);
    return interpolateColor(MASTERY_START_COLOR, MASTERY_END_COLOR, factor);
};

export const getMasteryGradient = (level: string): string => {
    const l = level.toUpperCase();
    if (l.startsWith('C')) return 'from-amber-400 to-yellow-500';
    if (l.startsWith('B')) return 'from-sky-400 to-cyan-500';
    return 'from-green-500 to-emerald-600';
};

// =================================================================================
// STREAK THEME ENGINE
// =================================================================================
export const getStreakStyle = (streak: number): string => {
    if (streak > 100) return 'from-indigo-400 to-purple-500';
    if (streak > 50) return 'from-red-500 to-orange-500';
    if (streak > 10) return 'from-amber-500 to-orange-400';
    return 'from-gray-400 to-gray-500';
};