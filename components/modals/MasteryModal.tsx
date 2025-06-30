// components/modals/MasteryModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import {motion} from 'framer-motion';
import {CheckCircle, GitCommitHorizontal} from 'lucide-react';
// IMPORTING our new color engine and level data!
import {getColorForMastery, masteryLevels} from '@/lib/theme';

interface MasteryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMastery: string;
}

const levelDescriptions: { [key: string]: string } = {
    'A1': 'Beginner',
    'A2': 'Elementary',
    'B1': 'Intermediate',
    'B2': 'Upper-Intermediate',
    'C1': 'Advanced',
    'C2': 'Mastery'
};

const MasteryModal: React.FC<MasteryModalProps> = ({isOpen, onClose, currentMastery}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="The Mastery Tree">
            <div className="flex flex-col items-center text-center">
                <p className="mb-6 text-gray-300">Your journey through the forest of knowledge. Each level unlocks new
                    abilities.</p>

                <div className="w-full flex flex-col">
                    {masteryLevels.slice().reverse().map((level, index) => { // Reverse to show C2 at the top
                        const isCurrent = level === currentMastery;
                        const isPassed = masteryLevels.indexOf(currentMastery) >= masteryLevels.indexOf(level);
                        const dynamicColor = getColorForMastery(level);

                        return (
                            <motion.div
                                key={level}
                                initial={{opacity: 0, x: -20}}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: {type: 'spring', delay: index * 0.1, stiffness: 300, damping: 20}
                                }}
                                className="relative flex items-center my-2 pl-8" // Indentation for the tree structure
                            >
                                {/* Connector Line & Node */}
                                <div className="absolute left-0 top-0 h-full flex items-center">
                                    <div className="h-full w-1"
                                         style={{background: isPassed ? dynamicColor : '#4B5563'}}/>
                                    <GitCommitHorizontal size={24}
                                                         className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-gray-900 rounded-full"
                                                         style={{color: dynamicColor}}/>
                                </div>

                                <div
                                    className={`flex items-center p-3 rounded-lg border w-full transition-all duration-300 ${isPassed ? 'opacity-100' : 'opacity-40'}`}
                                    style={{
                                        borderColor: isCurrent ? dynamicColor : 'transparent',
                                        background: isCurrent ? `rgba(255, 255, 255, 0.1)` : 'transparent'
                                    }}
                                >
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center"
                                        style={{borderColor: dynamicColor}}>
                                        <span className="font-black text-xl"
                                              style={{color: dynamicColor}}>{level}</span>
                                    </div>
                                    <div className="ml-4 text-left">
                                        <h3 className="font-bold text-lg text-white">{levelDescriptions[level]}</h3>
                                    </div>
                                    {isPassed && <CheckCircle size={20} className="ml-auto text-green-400"/>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default MasteryModal;