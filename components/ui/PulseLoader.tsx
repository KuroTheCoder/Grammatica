// file: components/ui/PulseLoader.tsx

import React from 'react';
import { motion, Variants } from 'framer-motion';

// --- Animation Variants ---
// This variant perfectly replicates the CSS @keyframes
const loaderVariants: Variants = {
    animate: {
        // We animate scaleY instead of height for better performance.
        // 0.1 is like height: 0, but not quite, to avoid it disappearing completely.
        scaleY: [1, 0.2, 1],
        transition: {
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
        },
    },
};

// --- The Component ---
const PulseLoader = ({ className }: { className?: string }) => {
    return (
        <div className={`flex justify-center items-center h-8 ${className}`}>
            <motion.div
                className="w-2 h-full rounded-sm bg-current" // 'bg-current' uses the text color, just like the CSS
                style={{
                    // The CSS box-shadow trick, translated directly.
                    // The shadows will use the 'currentColor' from the text color.
                    // We use negative spread (-1px, -2px, -3px) to make the side bars slightly thinner, adding a nice depth effect.
                    boxShadow:
                        '14px 0 0 -1px, -14px 0 0 -1px, 28px 0 0 -2px, -28px 0 0 -2px, 42px 0 0 -3px, -42px 0 0 -3px',
                }}
                variants={loaderVariants}
                animate="animate"
            />
        </div>
    );
};

export default PulseLoader;