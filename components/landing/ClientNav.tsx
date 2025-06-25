// File: components/landing/ClientNav.tsx (UPDATED TO USE THE NEW BUTTON)

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaXmark } from 'react-icons/fa6';
import PrimaryCTAButton from '../ui/PrimaryCTAButton'; // Import our beautiful button

export default function ClientNav({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {id: 'features', label: 'Tính năng', href: '#features'},
        {id: 'how-it-works', label: 'Cách hoạt động', href: '#how-it-works'}
    ];

    return(
        <motion.nav initial={{y: -100}} animate={{y: 0}} transition={{duration: 0.5, ease: "easeOut"}} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {children}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <motion.div key={link.id} className="relative" onHoverStart={() => setHoveredLink(link.id)} onHoverEnd={() => setHoveredLink('')}>
                                <motion.a href={link.href} whileHover={{scale: 1.05}} transition={{type: 'spring', stiffness: 300, damping: 20}} className="relative block px-3 py-2 rounded-full text-sm font-medium">
                                    <AnimatePresence>{hoveredLink === link.id && <motion.span className="absolute inset-0 bg-white/10 rounded-full -z-10" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.9}}/>}</AnimatePresence>
                                    <span className={`relative transition-colors duration-200 ${hoveredLink === link.id ? 'text-white' : 'text-slate-300'}`}>{link.label}</span>
                                </motion.a>
                            </motion.div>
                        ))}
                        {/* THE FIX IS HERE: We replace the old link with our new button component */}
                        <PrimaryCTAButton href="/Login" className="ml-4" >
                            Đăng nhập
                        </PrimaryCTAButton>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-md focus:outline-none">
                            <AnimatePresence initial={false} mode="wait">
                                {isMenuOpen ?
                                    <motion.div key="close" initial={{rotate: -90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: 90, opacity: 0}}><FaXmark size={24}/></motion.div> :
                                    <motion.div key="open" initial={{rotate: 90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: -90, opacity: 0}}><FaBars size={24}/></motion.div>
                                }
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="md:hidden bg-slate-900/95 backdrop-blur-sm overflow-hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                            {navLinks.map(link => (
                                <Link key={link.id} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{link.label}</Link>
                            ))}
                            {/* AND THE FIX IS ALSO HERE for the mobile menu */}
                            <div className="mt-4 inline-block">
                                <PrimaryCTAButton href="/Login">Đăng nhập</PrimaryCTAButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}