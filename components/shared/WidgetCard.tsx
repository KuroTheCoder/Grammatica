// app/components/shared/WidgetCard.tsx
import React from 'react';

interface WidgetCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`
      bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl
      p-6 flex flex-col h-full ${className}
    `}>
            <h3 className="text-lg font-semibold text-gray-200 mb-4 tracking-wider uppercase">{title}</h3>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default WidgetCard;