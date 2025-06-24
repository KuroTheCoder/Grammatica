// components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaBullhorn, FaUsers, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { href: '/admin/announcements', label: 'Announcements', icon: FaBullhorn },
    { href: '/admin/users', label: 'Users', icon: FaUsers },
    // { href: '/admin/content', label: 'Content', icon: FaBookOpen },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);

    return (
        <aside className="w-64 bg-slate-900 p-4 border-r border-slate-800 flex flex-col">
            <div className="text-2xl font-bold text-white mb-10 text-center">
                Grammatica <span className="text-emerald-400">AI</span>
            </div>
            <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-slate-300 hover:text-white"
                            onMouseEnter={() => setHoveredPath(item.href)}
                            onMouseLeave={() => setHoveredPath(null)}
                        >
                            {/* The magical animated pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-sidebar-pill"
                                    className="absolute inset-0 bg-emerald-600 rounded-lg"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* The hover effect pill */}
                            <AnimatePresence>
                                {hoveredPath === item.href && !isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-slate-700/50 rounded-lg"
                                    />
                                )}
                            </AnimatePresence>

                            {/* The content */}
                            <div className="relative z-10 flex items-center gap-3">
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                                <span className={`${isActive ? 'font-semibold text-white' : ''}`}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;