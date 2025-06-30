
// app/components/shared/EdgeGlowContainer.tsx
"use client";
import React from 'react';

interface EdgeGlowContainerProps {
    children: React.ReactNode;
}

const EdgeGlowContainer: React.FC<EdgeGlowContainerProps> = ({ children }) => {
    return (
        <div className="relative w-full h-full">
            <div
                className="absolute top-0 left-0 w-full h-full -z-10"
                style={{
                    // A massive radial gradient positioned ABOVE the viewport, creating a soft downward glow.
                    background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.2), #05050500)',
                }}
            />
            {children}
        </div>
    );
};

export default EdgeGlowContainer;