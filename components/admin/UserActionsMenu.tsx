// components/admin/UserActionsMenu.tsx
"use client";

import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface UserActionsButtonProps {
    // FIX: Renaming this prop to finally satisfy the linter
    onClickAction: () => void;
}

export default function UserActionsButton({ onClickAction }: UserActionsButtonProps) {
    return (
        // FIX: The button's real onClick now uses our new prop name
        <button
            onClick={onClickAction}
            className="inline-flex justify-center rounded-full p-2 text-sm font-medium text-slate-400 hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 transition-colors"
        >
            <FaEllipsisV aria-hidden="true" />
        </button>
    );
}