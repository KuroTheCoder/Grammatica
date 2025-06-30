// components/ui/ClassBadge.tsx
"use client";

import React from 'react';
import { getClassBadgeStyle } from '@/lib/theme'; // <-- Imports the PURE logic

interface ClassBadgeProps {
    className?: string; // The component takes a className string as a prop
}

const ClassBadge: React.FC<ClassBadgeProps> = ({ className }) => {
    if (!className || className === "Unassigned" || className === "N/A") {
        return <span className="flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">N/A</span>;
    }

    // Get the style classes from our new pure function
    const color = getClassBadgeStyle(className);

    // Return the JSX
    return (
        <span className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${color.bg} ${color.text} ${color.border}`}>
            {className}
        </span>
    );
};

export default ClassBadge;