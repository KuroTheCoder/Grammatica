// app/components/dashboard/DockIcon.tsx
"use client";

import React from 'react';
import {motion, useSpring, AnimatePresence} from 'framer-motion';
import {type LucideIcon} from 'lucide-react';

interface DockIconProps {
    Icon: LucideIcon,
    label: string,
    color: string,
    isActive: boolean,
    isCentral?: boolean,
    onClick: () => void,
    magnifiedScale?: number,
    onMouseEnter?: () => void
}

const DockIcon: React.FC<DockIconProps> = ({
                                               Icon,
                                               label,
                                               color,
                                               isActive,
                                               isCentral,
                                               onClick,
                                               magnifiedScale
                                           }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Use internal spring only if no external magnifiedScale is provided
    const internalScale = useSpring(1, {stiffness: 150, damping: 12});
    const y = useSpring(0, {stiffness: 150, damping: 12});

    React.useEffect(() => {
        if (magnifiedScale === undefined) { // Only update internal scale if not externally controlled
            internalScale.set(isHovered ? 1.3 : 1);
        }
        y.set(isHovered ? -12 : 0);
    }, [isHovered, internalScale, y, magnifiedScale]);

    // Determine the effective scale: external if provided, else internal
    const effectiveScale = magnifiedScale !== undefined ? magnifiedScale : internalScale;

    const iconSize = isCentral ? 'w-12 h-12' : 'w-9 h-9';
    const buttonSize = isCentral ? 'w-20 h-20' : 'w-16 h-16';

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative flex flex-col items-center gap-2 outline-none"
            style={{scale: effectiveScale, y, zIndex: isCentral ? 10 : 1}}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        className="absolute -top-8 px-3 py-1 bg-gray-900 text-white text-sm font-bold rounded-md shadow-lg"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
            <div
                className={`${buttonSize} rounded-2xl flex items-center justify-center transition-all duration-300 relative`}
                style={{
                    background: isActive ? `radial-gradient(circle, ${color}30, #11182700)` : 'transparent',
                    filter: isHovered || isActive ? `drop-shadow(0 0 20px ${color})` : 'none',
                    transform: isCentral ? 'translateY(-10px)' : 'none',
                }}
            >
                <Icon className={`${iconSize} transition-colors duration-300`} style={{color}}/>
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            layoutId="active-dock-indicator"
                            className="absolute bottom-[-10px] w-6 h-1 rounded-full"
                            style={{backgroundColor: color}}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
};

export default DockIcon;