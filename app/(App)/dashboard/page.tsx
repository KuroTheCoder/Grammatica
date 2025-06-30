// app/dashboard/page.tsx
"use client";

import { useState } from 'react';
import { useKeyPress } from '@/hooks/useKeyPress';
import StudentSidebar from '@/components/dashboard/StudentSidebar';
import GoalsWidget from '@/components/dashboard/GoalsWidget';
import QuickAccessWidget from '@/components/dashboard/QuickAccessWidget';
import DynamicDock from '@/components/dashboard/DynamicDock';
import ProfileCard from '@/components/dashboard/ProfileCard';
import WidgetCard from '@/components/shared/WidgetCard'; // <-- WE IMPORT THE NEW CARD

const StudentDashboardPage = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);

    useKeyPress('b', () => setSidebarExpanded(prev => !prev), 'meta');
    useKeyPress('b', () => setSidebarExpanded(prev => !prev), 'ctrl');

    return (
        <main className="flex h-screen w-full bg-black text-white overflow-hidden">
            <StudentSidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setSidebarExpanded}
            />

            <div className="flex-1 flex flex-col p-8 space-y-6 transition-all duration-300 ease-in-out">
                <ProfileCard isCompact={isSidebarExpanded} />

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* WE WRAP OUR WIDGETS IN THE NEW CARD COMPONENT */}
                    <WidgetCard title="Goals and Status">
                        <GoalsWidget />
                    </WidgetCard>
                    <WidgetCard title="Quick Access">
                        <QuickAccessWidget />
                    </WidgetCard>
                </div>
                <DynamicDock />
            </div>
        </main>
    );
};

export default StudentDashboardPage;