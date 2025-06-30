// app/components/dashboard/DynamicDock.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import DockIcon from './DockIcon';
import { Award, Target, Swords, BrainCircuit, Users } from 'lucide-react';

export type ActiveView = 'quests' | 'practice' | 'review' | 'leaderboard' | 'community';

interface DynamicDockProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const dockItems: { id: ActiveView; label: string; icon: typeof Award; color: string; }[] = [
    { id: 'quests', label: 'Daily Quests', icon: Target, color: '#34D399' },
    { id: 'practice', label: 'Practice Arena', icon: Swords, color: '#60A5FA' },
    { id: 'review', label: 'Review Hub', icon: BrainCircuit, color: '#FBBF24' },
    { id: 'leaderboard', label: 'Leaderboards', icon: Award, color: '#F87171' },
    { id: 'community', label: 'Community', icon: Users, color: '#A78BFA' },
];

const DynamicDock: React.FC<DynamicDockProps> = ({ activeView, setActiveView }) => {
    return (
        // THE GHOST DOCK UPGRADE!
        // We're using a darker, more transparent background for a sleeker glass effect.
        <motion.div
            layout
            className="w-auto h-28 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center gap-4 px-6 shadow-2xl"
        >
            {dockItems.map((item) => (
                <DockIcon
                    key={item.id}
                    Icon={item.icon}
                    label={item.label}
                    color={item.color}
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                />
            ))}
        </motion.div>
    );
};

export default DynamicDock;