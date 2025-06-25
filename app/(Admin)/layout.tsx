// app/(admin)/layout.tsx (Time to plug in YOUR engine)

import React from 'react';
// We're importing YOUR default exported Sidebar. This is it!
import Sidebar from '@/components/admin/Sidebar';

// This layout is the shell for our entire admin experience.
export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        // Flexbox creates the two-column layout
        <div className="flex h-screen bg-slate-800 font-sans">
            {/*
        YOUR animated, high-performance Sidebar component.
        It will be here, persistent, on every admin page.
        LEGENDARY.
      */}
            <Sidebar />

            {/* Main content area that will hold all our pages */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <main className="p-8">
                    {/* All our admin pages will be rendered here */}
                    {children}
                </main>
            </div>
        </div>
    );
}