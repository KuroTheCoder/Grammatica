// app/components/dashboard/DockIcon.tsx
"use client";

import React from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface DockIconProps {
    Icon: LucideIcon;
    label: string;
    color: string;
    isActive: boolean;
    onClick: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({ Icon, label, color, isActive, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const scale = useSpring(1, { stiffness: 300, damping: 20 });
    const y = useSpring(0, { stiffness: 300, damping: 20 });

    React.useEffect(() => {
        scale.set(isHovered ? 1.3 : 1);
        y.set(isHovered ? -12 : 0);
    }, [isHovered, scale, y]);

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative flex flex-col items-center gap-2 outline-none"
            style={{ scale, y }}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-8 px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded-md shadow-lg"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative"
                style={{
                    background: isActive ? `radial-gradient(circle, ${color}30, #11182700)` : 'transparent',
                    filter: isHovered || isActive ? `drop-shadow(0 0 20px ${color})` : 'none',
                }}
            >
                <Icon className="w-9 h-9 transition-colors duration-300" style={{ color }} />
                {isActive && (
                    <motion.div
                        layoutId="active-dock-indicator"
                        className="absolute bottom-[-10px] w-6 h-1 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                )}
            </div>
        </motion.button>
    );
};

export default DockIcon;