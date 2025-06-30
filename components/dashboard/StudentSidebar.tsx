"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronsLeft,
    LayoutDashboard,
    BotMessageSquare,
    Settings,
    BookOpenCheck,
    BarChart3,
} from 'lucide-react';
// No more unused 'Image' or bad '@headlessui/react' import. CLEAN.

// --- DATA-DRIVEN NAVIGATION ---
const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'My Lessons', icon: BookOpenCheck, href: '#' },
    { name: 'AI Chat', icon: BotMessageSquare, href: '#' },
    { name: 'Progress', icon: BarChart3, href: '#' },
];

const bottomNavItems = [
    { name: 'Settings', icon: Settings, href: '#' },
];
// -----------------------------------------------------------------

interface StudentSidebarProps {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
}

const StudentSidebar = ({ isExpanded, setIsExpanded }: StudentSidebarProps) => {
    const [activeLink, setActiveLink] = useState('Dashboard');

    const sidebarVariants = {
        expanded: { width: '16rem' },
        compact: { width: '5rem' },
    };

    return (
        <motion.aside
            initial={false}
            animate={isExpanded ? 'expanded' : 'compact'}
            variants={sidebarVariants}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="h-full bg-zinc-900 flex flex-col border-r border-neutral-700 relative"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-7 h-14 bg-zinc-900 hover:bg-green-600/80
                   border-y-2 border-r-2 border-neutral-700 hover:border-green-500 rounded-r-lg
                   flex items-center justify-center transition-colors duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500 z-20
                   border-l-0"
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                <ChevronsLeft className={`transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-0' : 'rotate-180'}`} size={18} />
            </button>

            <div className="flex items-center justify-center h-20 px-4 flex-shrink-0">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2 } }}
                            exit={{ opacity: 0 }}
                            className="font-bold text-lg tracking-wider ml-2 whitespace-nowrap"
                        >
                            GRAMMATICA
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        isExpanded={isExpanded}
                        isActive={activeLink === item.name}
                        onClick={() => setActiveLink(item.name)}
                    />
                ))}
            </nav>

            <div className="px-4 pb-4 space-y-2 flex-shrink-0">
                {bottomNavItems.map((item) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        isExpanded={isExpanded}
                        isActive={activeLink === item.name}
                        onClick={() => setActiveLink(item.name)}
                    />
                ))}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                    {/* Placeholder */}
                </div>
            </div>
        </motion.aside>
    );
};

// --- Sub-component for Nav Items ---
interface NavItemProps {
    item: { name: string; icon: React.ElementType; href: string };
    isExpanded: boolean;
    isActive: boolean;
    onClick: () => void;
}

const NavItem = ({ item, isExpanded, isActive, onClick }: NavItemProps) => {
    const { name, icon: Icon, href } = item;

    // THE FIX: We use a wrapper with `group` and a custom CSS tooltip
    return (
        <a
            href={href}
            onClick={onClick}
            data-active={isActive}
            className="relative flex items-center p-2 rounded-lg transition-colors duration-200 group
                 text-neutral-300 hover:bg-neutral-700/50 hover:text-white
                 data-[active=true]:bg-green-600/50 data-[active=true]:text-white"
        >
            <Icon size={22} className="flex-shrink-0" />
            <AnimatePresence>
                {isExpanded && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto', transition: { duration: 0.2, delay: 0.15 } }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-4 font-medium whitespace-nowrap overflow-hidden"
                    >
                        {name}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* PURE CSS TOOLTIP: Shows up when sidebar is compact (`!isExpanded`) and on hover */}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-1.5 rounded-md text-sm font-semibold
                      bg-black text-white border border-neutral-700
                      opacity-0 group-hover:opacity-100 group-hover:delay-500 transition-opacity pointer-events-none
                      whitespace-nowrap z-50">
                    {name}
                </div>
            )}
        </a>
    );
};

export default StudentSidebar;