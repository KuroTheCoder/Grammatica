// app/components/modals/MasteryModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import MasteryLevelItem from './MasteryLevelItem';
import { Star, Sprout, Shield, Flame } from 'lucide-react'; // Our new icons!
import { getColorForMastery, getMasteryGradient, masteryLevels, MasteryLevel } from '@/lib/theme';

interface MasteryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMastery: string | null | undefined;
}

const levelDescriptions: { [key: string]: { title: string, description:string } } = {
    'A1': { title: 'Beginner', description: "You've taken your first step into a larger world." },
    'A2': { title: 'Elementary', description: 'Building the foundation, one block at a time.' },
    'B1': { title: 'Intermediate', description: 'You can now hold your own in conversation.' },
    'B2': { title: 'Upper-Intermediate', description: 'Complex topics are within your grasp.' },
    'C1': { title: 'Advanced', description: 'You navigate the language with fluency and nuance.' },
    'C2': { title: 'Mastery', description: 'The language is now a part of you. True mastery achieved.' }
};

const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
} as const;

// Helper function to get the right icon for the mastery stage. SO CLEAN.
const getMasteryIcon = (level: MasteryLevel) => {
    if (level.startsWith('A')) return Sprout;
    if (level.startsWith('B')) return Shield;
    if (level.startsWith('C')) return Flame;
    return Star;
};

const MasteryModal: React.FC<MasteryModalProps> = ({ isOpen, onClose, currentMastery }) => {
    const cleanedMastery = currentMastery?.trim().toUpperCase();
    const normalizedCurrentMastery = (cleanedMastery && masteryLevels.includes(cleanedMastery as MasteryLevel))
        ? cleanedMastery as MasteryLevel
        : 'A1';

    const currentLevelIndex = masteryLevels.indexOf(normalizedCurrentMastery);
    const [hoveredLevel, setHoveredLevel] = React.useState<string | null>(null);

    const displayKey = (hoveredLevel || normalizedCurrentMastery) as MasteryLevel;
    const displayInfo = levelDescriptions[displayKey];
    const displayColor = getColorForMastery(displayKey);
    const displayGradient = getMasteryGradient(displayKey);
    const DisplayIcon = getMasteryIcon(displayKey);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Your Mastery Journey"
            titleIcon={Star}
            headerGradient={displayGradient}
            backgroundClassName="bg-gradient-to-br from-gray-900 to-black"
        >
            <div className="flex flex-col items-center w-full p-8 gap-8">
                {/* === THE COMMAND CENTER WITH THEMATIC ICONS === */}
                <div className="w-full text-center min-h-[80px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={displayKey}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col items-center justify-center gap-3"
                        >
                            <DisplayIcon
                                className="w-10 h-10"
                                style={{ color: displayColor, filter: `drop-shadow(0 0 10px ${displayColor})` }}
                            />
                            <h3 className="text-2xl font-bold" style={{ color: displayColor }}>
                                {displayInfo.title}
                            </h3>
                            <p className="text-gray-300 -mt-2 max-w-md mx-auto">
                                {displayInfo.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* === THE Z-INDEX FIX IS HERE! === */}
                {/* By adding 'relative' and 'z-10', we lift this entire container ABOVE the progress bar */}
                <div
                    onMouseLeave={() => setHoveredLevel(null)}
                    className="relative z-10 flex justify-around items-center w-full max-w-3xl min-h-[10rem]"
                >
                    {masteryLevels.map((level, index) => {
                        const isPassed = index < currentLevelIndex;
                        const isCurrent = index === currentLevelIndex;
                        const isFuture = index > currentLevelIndex;
                        const isInitiallyExpanded = isCurrent && hoveredLevel === null;

                        return (
                            <MasteryLevelItem
                                key={level}
                                level={level}
                                isPassed={isPassed}
                                isCurrent={isCurrent}
                                isFuture={isFuture}
                                baseColor={getColorForMastery(level)}
                                isHovered={hoveredLevel === level}
                                isInitiallyExpanded={isInitiallyExpanded}
                                onHoverStart={() => setHoveredLevel(level)}
                                onHoverEnd={() => setHoveredLevel(null)}
                            />
                        );
                    })}
                </div>
                <div className="w-full max-w-3xl h-3 bg-gray-800 rounded-full relative mt-4 shadow-inner">
                    <div className="absolute -bottom-8 w-full flex justify-between px-1">
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">A1</span>
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">A2</span>
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">B1</span>
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">B2</span>
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">C1</span>
                        <span className="text-sm font-semibold text-gray-400 w-10 text-center">C2</span>
                    </div>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, #34D399, #60A5FA, #FBBF24, #A78BFA, #F472B6)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentLevelIndex / (masteryLevels.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    />
                    <motion.div
                        className="absolute top-1/2 -ml-2 w-5 h-5 rounded-full border-2 border-white bg-white shadow-lg"
                        style={{
                            background: getColorForMastery(normalizedCurrentMastery),
                            boxShadow: `0 0 10px ${getColorForMastery(normalizedCurrentMastery)}`,
                        }}
                        initial={{ left: '0%', y: '-50%' }}
                        animate={{ left: `${(currentLevelIndex / (masteryLevels.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default MasteryModal;