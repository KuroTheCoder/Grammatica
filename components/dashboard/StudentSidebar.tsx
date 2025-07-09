"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Import Image for Icons8 icons
// No more ChevronsLeft import

// --- DATA-DRIVEN NAVIGATION ---
// Sidebar for rarely accessed items
const navItems: NavItemType[] = []; // No top navigation items for rarely accessed sidebar

const bottomNavItems: NavItemType[] = [
    { name: 'Profile', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/user-male-circle.png', href: '/profile' },
    { name: 'Goals', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/goal.png', href: '/goals' },
    { name: 'Settings', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/settings.png', href: '#' },
    { name: 'Help & Support', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/help.png', href: '#' },
    { name: 'About', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/info.png', href: '#' },
    { name: 'Logout', iconUrl: 'https://img.icons8.com/ios-filled/50/FFFFFF/logout-rounded.png', href: '#' },
];
// -----------------------------------------------------------------

interface StudentSidebarProps {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
}

const StudentSidebar = ({ isExpanded, setIsExpanded }: StudentSidebarProps) => {
    const [activeLink, setActiveLink] = useState(''); // No default active link for rarely used sidebar

    const sidebarVariants = {
        expanded: { width: '16rem' },
        compact: { width: '5rem' },
    };

    return (
        <motion.aside
            initial={false}
            animate={isExpanded ? 'expanded' : 'compact'}
            variants={sidebarVariants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full bg-black/20 backdrop-blur-xl flex flex-col border-r border-white/10 relative shadow-lg"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >

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
                <div className="border-t border-neutral-700 pt-4 mt-4 text-xs text-neutral-500 text-center">
                    Icons by <a href="https://icons8.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Icons8</a>
                </div>
            </div>
        </motion.aside>
    );
};

// --- Sub-component for Nav Items ---
interface NavItemType {
    name: string;
    iconUrl: string; // Changed to iconUrl for Icons8
    href: string;
}

interface NavItemProps {
    item: NavItemType;
    isExpanded: boolean;
    isActive: boolean;
    onClick: () => void;
}

const NavItem = ({ item, isExpanded, isActive, onClick }: NavItemProps) => {
    const { name, iconUrl, href } = item;

    return (
        <a
            href={href}
            onClick={onClick}
            data-active={isActive}
            className="relative flex items-center p-2 rounded-lg transition-all duration-300 group
                 text-neutral-300 hover:bg-white/10 hover:text-white
                 data-[active=true]:bg-white/15 data-[active=true]:text-white"
        >
            <Image src={iconUrl} alt={name} width={22} height={22} className="flex-shrink-0" />
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