"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/shared/Modal';
import Clickable from '@/components/ui/Clickable';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const handleComplete = () => {
        onComplete();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Grammatica!" hideCloseButton>
            <div className="relative p-6 text-center flex flex-col items-center justify-center">
                {/* Khanh Hoa Visual Accent Placeholder */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    {/* 
                        TODO: Replace this with a subtle background image or drawing 
                        related to Khanh Hoa, e.g., a stylized drawing of Ponagar Tower or a local pattern.
                        Example: <Image src="/images/khanh-hoa-drawing.png" alt="Khanh Hoa" layout="fill" objectFit="cover" />
                    */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-lg" />
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-white mb-6 z-10"
                >
                    Welcome to Grammatica!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-neutral-300 mb-8 z-10"
                >
                    Let&apos;s get you started with some essential shortcuts:
                </motion.p>

                <div className="flex flex-col gap-4 mb-10 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-between"
                    >
                        <span className="text-xl font-semibold text-green-400">Ctrl + D</span>
                        <span className="text-neutral-200">to show/hide the Dock</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-between"
                    >
                        <span className="text-xl font-semibold text-green-400">Ctrl + B</span>
                        <span className="text-neutral-200">to expand/collapse the Sidebar</span>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="text-sm text-neutral-400 mb-6 z-10"
                >
                    Grammatica is proudly made by students from Khanh Hoa. Enjoy your learning journey!
                </motion.p>

                <Clickable onClick={handleComplete} particlePreset="confetti" clickAnimation="pop">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-colors duration-300 z-10"
                    >
                        Got It! Let&apos;s Learn!
                    </motion.button>
                </Clickable>
            </div>
        </Modal>
    );
};

export default OnboardingModal;
