// app/components/dashboard/DynamicDock.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DockIcon from './DockIcon';
import { LayoutDashboard, BookOpen, Sparkles, Swords, Users } from 'lucide-react';

export type ActiveView = 'dashboard' | 'learn' | 'ai_tutor' | 'practice' | 'community';

interface DynamicDockProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const dockItems: { id: ActiveView; label: string; icon: typeof LayoutDashboard; color: string; isCentral?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#34D399' },
    { id: 'learn', label: 'Learning Center', icon: BookOpen, color: '#60A5FA' },
    { id: 'ai_tutor', label: 'AI Tutor', icon: Sparkles, color: '#FBBF24', isCentral: true },
    { id: 'practice', label: 'Practice Arena', icon: Swords, color: '#F87171' },
    { id: 'community', label: 'Community', icon: Users, color: '#A78BFA' },
];

const DynamicDock: React.FC<DynamicDockProps> = ({ activeView, setActiveView }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getMagnifiedScale = (index: number) => {
        if (hoveredIndex === null) return 1; // No hover, no magnification

        const distance = Math.abs(index - hoveredIndex);
        // Adjust these values to control the magnification curve
        if (distance === 0) return 1.5; // Hovered item
        if (distance === 1) return 1.2; // Immediate neighbors
        if (distance === 2) return 1.1; // Next neighbors
        return 1; // Further items
    };

    return (
        <motion.div
            layout
            onMouseLeave={() => setHoveredIndex(null)} // Reset on leaving the dock area
            className="w-auto h-28 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center gap-4 px-6 shadow-2xl"
        >
            {dockItems.map((item, index) => (
                <DockIcon
                    key={item.id}
                    Icon={item.icon}
                    label={item.label}
                    color={item.color}
                    isActive={activeView === item.id}
                    isCentral={item.isCentral}
                    onClick={() => setActiveView(item.id)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    magnifiedScale={getMagnifiedScale(index)}
                />
            ))}
        </motion.div>
    );
};

export default DynamicDock;