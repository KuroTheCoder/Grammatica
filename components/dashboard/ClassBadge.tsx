// app/components/ui/ClassBadge.tsx
"use client";

import React from 'react';
import { getClassBadgeStyle } from '@/lib/theme';
import { FaUsers } from 'react-icons/fa';

interface ClassBadgeProps {
    classNameProp: string | undefined;
}

const ClassBadge: React.FC<ClassBadgeProps> = ({ classNameProp = "N/A" }) => {
    // We call our theme engine to get the dynamic styles!
    const styles = getClassBadgeStyle(classNameProp);

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm transition-all duration-300 ${styles.bg} ${styles.text} ${styles.border}`}
        >
            <FaUsers />
            <span>{classNameProp}</span>
        </div>
    );
};

export default ClassBadge;