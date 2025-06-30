// components/modals/StreakModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import { Lock } from 'lucide-react';

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStreak: number;
}

// The milestones on our Path of Fire
const streakMilestones = [
    { day: 3, title: 'Spark', reward: 'Your journey begins.' },
    { day: 7, title: 'Kindling', reward: '+10 XP Boost' },
    { day: 14, title: 'Growing Flame', reward: 'Unlock a new profile border.' },
    { day: 30, title: 'Inferno', reward: '+50 XP Boost' },
    { day: 50, title: 'Wildfire', reward: 'Unlock "Flame" profile theme.' },
    { day: 100, title: 'Supernova', reward: '+200 XP Boost' },
    { day: 365, title: 'Eternal Flame', reward: 'Legendary "Phoenix" profile border.' },
];
const MAX_STREAK_DAY = 365;

// =================================================================================
// THE DYNAMIC FLAME ENGINE - Type-Safe From the Start
// =================================================================================
interface RGBColor { r: number; g: number; b: number; }
const START_COLOR: RGBColor = { r: 251, g: 146, b: 60 };  // Orange-400
const END_COLOR: RGBColor = { r: 168, g: 85, b: 247 };   // Purple-500

const interpolateColor = (color1: RGBColor, color2: RGBColor, factor: number): string => {
    const r = Math.round(color1.r + factor * (color2.r - color1.r));
    const g = Math.round(color1.g + factor * (color2.g - color1.g));
    const b = Math.round(color1.b + factor * (color2.b - color1.b));
    return `rgb(${r}, ${g}, ${b})`;
};

const getColorForStreakDay = (day: number): string => {
    // Clamp the day to the max for calculation purposes
    const clampedDay = Math.min(day, MAX_STREAK_DAY);
    const factor = clampedDay / MAX_STREAK_DAY;
    return interpolateColor(START_COLOR, END_COLOR, factor);
};
// =================================================================================


const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, currentStreak }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="The Path of Fire">
            <div className="flex flex-col items-center text-center">
                <h3 className="text-5xl font-black flex items-center gap-3" style={{ color: getColorForStreakDay(currentStreak) }}>
                    <FaFire /> {currentStreak}
                </h3>
                <p className="text-lg text-gray-200 mb-6">Day Streak! Keep the flame alive.</p>

                <div className="relative w-full flex flex-col items-center max-h-[50vh] overflow-y-auto pr-2">
                    {/* The connector "path" */}
                    <div className="absolute top-0 bottom-0 left-12 w-1 bg-white/10 rounded-full" />

                    {streakMilestones.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.day;
                        const dynamicColor = getColorForStreakDay(milestone.day);

                        return (
                            <motion.div
                                key={milestone.day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: { type: 'spring', delay: index * 0.1 } }}
                                className={`relative flex items-center w-full my-2 p-3 rounded-lg transition-all ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}
                            >
                                <div className="z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-gray-900 border-4" style={{ borderColor: isUnlocked ? dynamicColor : '#4B5563' }}>
                                    {isUnlocked ? (
                                        <FaFire size={32} style={{ color: dynamicColor }} />
                                    ) : (
                                        <Lock size={32} className="text-gray-500" />
                                    )}
                                </div>
                                <div className="ml-4 text-left">
                                    <h4 className="font-bold text-white">Day {milestone.day}: {milestone.title}</h4>
                                    <p className="text-sm text-gray-400">{milestone.reward}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default StreakModal;