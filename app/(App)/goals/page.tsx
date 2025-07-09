// app/(App)/goals/page.tsx
"use client";

import React from 'react';
import StudentSidebar from '@/components/dashboard/StudentSidebar';
import { useState } from 'react';

const GoalsPage = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);

    return (
        <main className="flex h-screen w-full bg-transparent text-white overflow-hidden">
            <StudentSidebar isExpanded={isSidebarExpanded} setIsExpanded={setSidebarExpanded} />
            <div className="flex-1 flex items-center justify-center p-6">
                <h1 className="text-4xl font-bold">Goals Page (Coming Soon!)</h1>
            </div>
        </main>
    );
};

export default GoalsPage;
