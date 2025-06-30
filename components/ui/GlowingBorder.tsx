
// app/components/ui/GlowingBorder.tsx
"use client";

import { motion } from 'framer-motion';

interface GlowingBorderProps {
    color1: string;
    color2: string;
    animationDuration?: number;
}

const GlowingBorder: React.FC<GlowingBorderProps> = ({
                                                         color1,
                                                         color2,
                                                         animationDuration = 5,
                                                     }) => {
    return (
        <motion.div
            className="absolute -z-10"
            style={{
                inset: -2, // Make it slightly larger than the parent
                borderRadius: 'inherit', // Steal the parent's border-radius
                background: `conic-gradient(from 180deg at 50% 50%, ${color1}, ${color2} 50%, ${color1} 100%)`,
                filter: 'blur(15px)', // The soft glow effect
                opacity: 0.7,
            }}
            animate={{ rotate: '360deg' }}
            transition={{
                repeat: Infinity,
                duration: animationDuration,
                ease: 'linear',
            }}
        />
    );
};

export default GlowingBorder;