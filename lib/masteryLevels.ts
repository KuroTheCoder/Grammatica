// lib/masteryLevels.ts

import { Shield, Zap, Award, Sparkles, Star, Rocket } from 'lucide-react';
import { ElementType } from 'react';

export type MasteryLevelKey = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// THE FIX IS HERE: We are adding 'gradientClass' to the blueprint.
export interface MasteryLevel {
    level: MasteryLevelKey;
    name: string;
    description: string;
    Icon: ElementType;
    colorClass: string;
    glowClass: string;
    gradientClass: string; // <-- This is the new property the compiler was looking for.
}

export const MASTERY_LEVELS: MasteryLevel[] = [
    {
        level: 'A1',
        name: 'Beginner',
        description: "You're starting your journey, building foundational skills.",
        Icon: Shield,
        colorClass: 'text-green-400',
        glowClass: 'shadow-green-400/30',
        gradientClass: 'from-green-500 to-emerald-600',
    },
    {
        level: 'A2',
        name: 'Elementary',
        description: 'You can handle simple, routine interactions.',
        Icon: Star,
        colorClass: 'text-sky-400',
        glowClass: 'shadow-sky-400/30',
        gradientClass: 'from-sky-500 to-blue-600',
    },
    {
        level: 'B1',
        name: 'Intermediate',
        description: 'You can deal with most situations while traveling.',
        Icon: Zap,
        colorClass: 'text-yellow-400',
        glowClass: 'shadow-yellow-400/30',
        gradientClass: 'from-yellow-500 to-amber-600',
    },
    {
        level: 'B2',
        name: 'Upper-Intermediate',
        description: 'Complex topics are within your grasp.',
        Icon: Rocket,
        colorClass: 'text-teal-400',
        glowClass: 'shadow-teal-400/40',
        gradientClass: 'from-teal-500 to-cyan-600',
    },
    {
        level: 'C1',
        name: 'Advanced',
        description: 'You can express yourself fluently and spontaneously.',
        Icon: Award,
        colorClass: 'text-indigo-400',
        glowClass: 'shadow-indigo-400/40',
        gradientClass: 'from-indigo-500 to-violet-600',
    },
    {
        level: 'C2',
        name: 'Proficient',
        description: 'You have achieved mastery of the language.',
        Icon: Sparkles,
        colorClass: 'text-rose-400',
        glowClass: 'shadow-rose-400/40',
        gradientClass: 'from-rose-500 to-pink-600',
    },
];

const levelKeys = MASTERY_LEVELS.map(l => l.level);

// This type guard is our runtime security check. Clean AF.
export function isMasteryLevelKey(level: string): level is MasteryLevelKey {
    return (levelKeys as string[]).includes(level);
}

// This helper gives us the full data object for any level.
export const getMasteryLevelData = (level: MasteryLevelKey): MasteryLevel => {
    return MASTERY_LEVELS.find((l) => l.level === level) || MASTERY_LEVELS[0];
};