"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaFire, FaLock, FaFireAlt, FaSun, FaStar } from 'react-icons/fa'; // Import FaLock
import { getStreakStyle } from '@/lib/theme'; // Import our new style function

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStreak: number;
}

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

// This color logic is only for the milestone path, so it can stay.
interface RGBColor { r: number; g: number; b: number; }
const GRADIENT_COLORS: RGBColor[] = [
    { r: 251, g: 146, b: 60 }, // Orange
    { r: 236, g: 72, b: 153 }, // Pink
    { r: 168, g: 85, b: 247 }, // Purple
    { r: 59, g: 130, b: 246 }  // Blue
];

const interpolateColor = (colors: RGBColor[], factor: number): string => {
    const scaledFactor = factor * (colors.length - 1);
    const colorIndex = Math.floor(scaledFactor);
    const segmentFactor = scaledFactor - colorIndex;

    const color1 = colors[colorIndex];
    const color2 = colors[Math.min(colorIndex + 1, colors.length - 1)];

    const r = Math.round(color1.r + segmentFactor * (color2.r - color1.r));
    const g = Math.round(color1.g + segmentFactor * (color2.g - color1.g));
    const b = Math.round(color1.b + segmentFactor * (color2.b - color1.b));
    return `rgb(${r}, ${g}, ${b})`;
};

const getColorForStreakDay = (day: number): string => {
    const clampedDay = Math.min(day, MAX_STREAK_DAY);
    const factor = clampedDay / MAX_STREAK_DAY;
    return interpolateColor(GRADIENT_COLORS, factor);
};


const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, currentStreak = 0 }) => {
    const streakTheme = getStreakStyle(currentStreak);
    const StreakIcon = streakTheme.icon; // Get the dynamic icon

    return (
        // Use the dynamic icon for the modal title
        <Modal isOpen={isOpen} onClose={onClose} title="The Path of Fire" titleIcon={StreakIcon}>
            <div className="flex flex-col items-center text-center p-4">
                {/* Animate the header */}
                <motion.h3
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                    className="text-4xl md:text-5xl font-black flex items-center gap-3"
                >
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
                        style={{ color: streakTheme.color, filter: `drop-shadow(0 0 10px ${streakTheme.color})` }}
                    >
                        <StreakIcon size={40}/>
                    </motion.div>
                    <span className={`bg-gradient-to-r ${streakTheme.gradient} text-transparent bg-clip-text`}>
                        {currentStreak}
                    </span>
                </motion.h3>
                <p className="text-md md:text-lg text-gray-200 mb-6">Day Streak! Keep the flame alive.</p>

                <div className="relative w-full flex flex-col items-start max-h-[50vh] overflow-y-auto py-8 pl-10 pr-8 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">

                    {streakMilestones.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.day;
                        const dynamicColor = getColorForStreakDay(milestone.day);

                        return (
                            <motion.div
                                key={milestone.day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: { type: 'spring', delay: index * 0.1 } }}
                                // Enhanced hover effect
                                whileHover={{ scale: 1.05, y: -5, boxShadow: `0 0 25px ${dynamicColor}` }}
                                className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full my-3 p-4 rounded-xl transition-all ${isUnlocked ? 'opacity-100 bg-white/5' : 'opacity-50'}`}
                            >
                                <div className="z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gray-900 border-4 transition-all" style={{ borderColor: isUnlocked ? dynamicColor : '#4B5563' }}>
                                    {isUnlocked ? (
                                        <FaFire className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: dynamicColor }} />
                                    ) : (
                                        // Use FaLock and fix the typo
                                        <FaLock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                                    )}
                                </div>
                                <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-left">
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
