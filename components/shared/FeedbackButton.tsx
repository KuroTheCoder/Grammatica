// file: components/shared/FeedbackButton.tsx (The 100% FLAWLESS Version)

"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscFeedback } from 'react-icons/vsc';

interface FeedbackButtonProps {
    onClick: () => void; // Add onClick prop
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Responsive hover handlers
    const handleHoverStart = () => {
        if (window.innerWidth >= 768) {
            setIsHovered(true);
        }
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
    };

    return (
        <>
            <motion.button
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onClick={onClick} // Use the passed onClick prop

                initial={{ opacity: 0, y: 20 }}

                animate={{
                    opacity: 1,
                    y: 0,
                    width: isHovered ? '190px' : '56px',
                }}

                transition={{
                    opacity: { delay: 1, duration: 0.4 },
                    y:       { delay: 1, type: 'spring', stiffness: 300, damping: 30 },
                    width:   { type: 'spring', stiffness: 400, damping: 25 }
                }}

                whileTap={{ scale: 0.95 }}

                // <<< THE FINAL FIX IS RIGHT HERE >>>
                // Adding `overflow-hidden` clips any content that pokes out during the animation.
                className="fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full bg-slate-800/60 backdrop-blur-md border border-white/10 h-14 p-4 shadow-lg md:hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] overflow-hidden"
                aria-label="Gửi feedback"
            >
                {/* This layout wrapper smoothly animates the icon's position */}
                <motion.div layout className="flex items-center justify-center gap-3">
                    <VscFeedback className="h-7 w-7 text-emerald-300 flex-shrink-0" />

                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                exit={{ opacity: 0 }}
                                className="text-base font-semibold text-white whitespace-nowrap"
                            >
                                Gửi Feedback
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.button>
        </>
    );
};

export default FeedbackButton;