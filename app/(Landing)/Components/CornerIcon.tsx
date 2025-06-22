// File: app/(Landing)/components/CornerIcon.tsx

import React from "react";

// Dùng React.SVGProps để có đầy đủ type checking cho thẻ SVG
export const CornerIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};