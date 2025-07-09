// lib/theme.ts

// This file is PURE. No "use client", no "import React".
// It's the architectural backbone of our app's style. LET'S GOOO!

// =================================================================================
// TYPE DEFINITIONS & HELPERS
// =================================================================================

import { IconType } from 'react-icons'; // Import IconType here

// A reusable function to mix colors. Untouched, it's perfect.
// =================================================================================
// MASTERY THEME ENGINE (THE UPGRADE!)
// =================================================================================
export const masteryLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type MasteryLevel = typeof masteryLevels[number];

// HERE'S THE NEW HOTNESS: A single source of truth for mastery styles.
const MASTERY_THEMES: Record<MasteryLevel, { color: string, gradient: string }> = {
    'A1': { color: '#34D399', gradient: 'from-emerald-400 to-teal-500' },       // Beginner's Green
    'A2': { color: '#60A5FA', gradient: 'from-sky-400 to-blue-500' },         // Elementary Blue
    'B1': { color: '#FBBF24', gradient: 'from-amber-400 to-yellow-500' },    // Intermediate Gold
    'B2': { color: '#F87171', gradient: 'from-red-400 to-rose-500' },        // Advanced Red
    'C1': { color: '#A78BFA', gradient: 'from-purple-400 to-violet-500' },   // Expert Purple
    'C2': { color: '#F472B6', gradient: 'from-pink-400 to-fuchsia-500' },     // Master's Pink
};

// ONE function to rule them all. Clean, simple, powerful.
export const getMasteryStyles = (level: string | undefined) => {
    const normalizedLevel = (level?.toUpperCase() ?? 'A1') as MasteryLevel;
    return MASTERY_THEMES[normalizedLevel] || MASTERY_THEMES['A1'];
};

// These helper functions now use the main style function. SO CLEAN.
export const getColorForMastery = (level: string | undefined): string => {
    return getMasteryStyles(level).color;
};

export const getMasteryGradient = (level: string | undefined): string => {
    return getMasteryStyles(level).gradient;
};

// =================================================================================
// STREAK THEME ENGINE
// =================================================================================

// =================================================================================
// STREAK THEME ENGINE (THE UPGRADE!)
// =================================================================================

import { FaFire, FaFireAlt, FaSun, FaStar, FaMedal, FaCrown, FaAward } from 'react-icons/fa'; // Combined imports

const STREAK_THEMES = [
    { threshold: 100, name: 'Supernova', gradient: 'from-yellow-400 via-orange-500 to-red-500', color: '#F59E0B', icon: FaStar },
    { threshold: 50, name: 'Solar Flare', gradient: 'from-orange-500 to-red-500', color: '#EF4444', icon: FaSun },
    { threshold: 25, name: 'Wildfire', gradient: 'from-amber-400 to-orange-500', color: '#F97316', icon: FaFireAlt },
    { threshold: 1, name: 'Kindling', gradient: 'from-lime-400 to-yellow-400', color: '#A3E635', icon: FaFire },
    { threshold: 0, name: 'Ember', gradient: 'from-slate-600 to-slate-700', color: '#475569', icon: FaFire },
];

export const getStreakStyle = (streak: number) => {
    return STREAK_THEMES.find(theme => streak >= theme.threshold) || STREAK_THEMES[STREAK_THEMES.length - 1];
};

// =================================================================================
// RANK THEME ENGINE
// =================================================================================

interface RankStyle {
    color: string;
    gradient: string;
    icon: IconType;
}

export const getRankStyle = (rank: number): RankStyle => {
    if (rank === 1) {
        return {
            color: '#FFD700', // Gold
            gradient: 'from-yellow-400 to-amber-500',
            icon: FaCrown,
        };
    } else if (rank === 2) {
        return {
            color: '#C0C0C0', // Silver
            gradient: 'from-gray-400 to-gray-500',
            icon: FaAward,
        };
    } else if (rank === 3) {
        return {
            color: '#CD7F32', // Bronze
            gradient: 'from-amber-700 to-orange-800',
            icon: FaMedal,
        };
    } else {
        return {
            color: '#34D399', // Default Green
            gradient: 'from-green-400 to-emerald-500',
            icon: FaMedal,
        };
    }
};

// =================================================================================
// GRADE & CLASS THEME ENGINE (THE NEW SOURCE OF TRUTH!)
// =================================================================================
const GRADE_PALETTES: { [key: string]: { bg: string, text: string, border: string }[] } = {
    '10': [{bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30'}, {bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30'}, {bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30'}],
    '11': [{bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30'}, {bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30'}, {bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30'}],
    '12': [{bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30'}, {bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30'}, {bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30'}],
    'default': [{bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50'}]
};

const simpleHash = (str: string): number => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
};

export const getGradeFromClassName = (className: string | undefined): string => {
    if (!className) return 'default';
    const upperClassName = className.toUpperCase();
    const match = upperClassName.match(/\b(10|11|12)\b/);
    if (match) return match[0];
    if (upperClassName.includes('A')) return '10';
    if (upperClassName.includes('B')) return '11';
    if (upperClassName.includes('C')) return '12';
    return 'default';
};

export const getClassBadgeStyle = (className: string | undefined) => {
    if (!className) {
        return GRADE_PALETTES['default'][0];
    }
    const grade = getGradeFromClassName(className);
    const palette = GRADE_PALETTES[grade] || GRADE_PALETTES['default'];
    const hash = simpleHash(className);
    return palette[hash % palette.length];
};