// app/components/modals/MasteryLevelItem.tsx
"use client";

import React from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Lock } from 'lucide-react';

interface MasteryLevelItemProps {
    level: string;
    isPassed: boolean;
    isCurrent: boolean;
    isFuture: boolean;
    isHovered: boolean;
    isInitiallyExpanded: boolean;
    baseColor: string;
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

const MasteryLevelItem: React.FC<MasteryLevelItemProps> = ({
                                                               level,
                                                               isPassed,
                                                               isCurrent,
                                                               isFuture,
                                                               isHovered,
                                                               isInitiallyExpanded,
                                                               baseColor,
                                                               onHoverStart,
                                                               onHoverEnd,
                                                           }) => {
    const scale = useSpring(1, { stiffness: 250, damping: 20 });
    const y = useSpring(0, { stiffness: 250, damping: 20 });

    React.useEffect(() => {
        if (isHovered) {
            scale.set(1.5);
            y.set(-20);
        } else if (isInitiallyExpanded) {
            scale.set(1.2);
            y.set(-10);
        } else {
            scale.set(1);
            y.set(0);
        }
    }, [isHovered, isInitiallyExpanded, scale, y]);

    const showDetails = isHovered;
    const itemOpacity = isFuture ? 0.5 : 1;
    const Icon = isPassed ? CheckCircle : isFuture ? Lock : Star;
    const iconColor = isPassed ? '#22c55e' : isFuture ? '#6b7280' : baseColor;

    return (
        <motion.div
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="relative flex flex-col items-center cursor-pointer"
            style={{ scale, y }}
            animate={{ opacity: itemOpacity }}
        >
            {isCurrent && (
                <motion.div
                    layoutId="here-indicator"
                    className="absolute -top-7 flex items-center gap-2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10"
                    style={{ filter: `drop-shadow(0 0 8px #6366f1)` }}
                >
                    <span className="font-black text-sm">{level}</span>
                    <span>You are here</span>
                </motion.div>
            )}

            <div className="relative w-16 h-16 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${baseColor}99, ${baseColor}00)` }}
                    animate={{
                        scale: isHovered || isInitiallyExpanded ? 1.5 : 0,
                        opacity: isHovered || isInitiallyExpanded ? 1 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors duration-300"
                    style={{
                        borderColor: isCurrent ? baseColor : 'rgba(107, 114, 128, 0.5)',
                        background: `linear-gradient(145deg, #2e3b4e, #1f2937)`,
                    }}
                >
                    <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: iconColor }} />
                </div>
            </div>

            {/* THE NEW HOVER CARD WITH A SICK ICON! */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute top-full mt-4 flex flex-col items-center gap-2 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg shadow-2xl border border-white/10 z-20"
                    >
                        {/* We're re-using the Icon component from the main circle for consistency */}
                        <Icon className="w-8 h-8" style={{ color: baseColor }} />
                        <h4 className="font-black text-xl tracking-wider" style={{ color: baseColor }}>
                            {level}
                        </h4>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MasteryLevelItem;