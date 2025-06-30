// app/components/shared/GridBackground.tsx
"use client";
import React from 'react';

const GridBackground = () => {
    return (
        <div className="absolute inset-0 h-full w-full bg-transparent -z-20"
             style={{
                 backgroundImage: 'linear-gradient(to right, #ffffff09 1px, transparent 1px), linear-gradient(to bottom, #ffffff09 1px, transparent 1px)',
                 backgroundSize: '3rem 3rem',
             }}
        />
    );
};
export default GridBackground;