// app/components/dashboard/SkillBar.tsx
"use client";

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface SkillBarProps {
    label: string;
    percentage: number;
    color: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ label, percentage, color }) => {
    // Use a spring for that smooth, organic fill animation
    const springValue = useSpring(0, { stiffness: 100, damping: 25 });
    const width = useTransform(springValue, (v) => `${v}%`);
    const roundedValue = useTransform(springValue, v => v.toFixed(0));

    React.useEffect(() => {
        springValue.set(percentage);
    }, [springValue, percentage]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold uppercase" style={{ color }}>{label}</p>
                <div className="flex items-baseline">
                    <motion.p className="text-sm font-bold text-white">{roundedValue}</motion.p>
                    <p className="text-sm font-bold text-white">%</p>
                </div>
            </div>
            <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        width,
                        background: `linear-gradient(90deg, ${color} 0%, ${color}A0 100%)`,
                        boxShadow: `0 0 8px ${color}`,
                    }}
                />
            </div>
        </div>
    );
};

export default SkillBar;