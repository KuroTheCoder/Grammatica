
// app/components/ui/InteractiveGlowCard.tsx
"use client";

import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

interface InteractiveGlowCardProps {
    children: React.ReactNode;
    glowColor: string;
}

const InteractiveGlowCard: React.FC<InteractiveGlowCardProps> = ({ children, glowColor }) => {
    // These are like live wires, constantly holding the mouse's X and Y coordinates.
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // This creates a dynamic CSS style string that Framer Motion can update on the fly.
    const motionBackground = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      ${glowColor}20,
      transparent 80%
    )
  `;

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            className="relative w-full h-full"
            onMouseMove={handleMouseMove}
        >
            {children}
            {/* This is the glow itself, positioned behind the children. */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{ background: motionBackground }}
            />
        </div>
    );
};

export default InteractiveGlowCard;