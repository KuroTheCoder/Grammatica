// File: components/landing/HeroAnimation.tsx (THE FINAL, CLEANED-UP VERSION)

"use client";

// We only need React and motion for this component now.
import React from "react";
import { motion } from "framer-motion";

const MockAppUI = React.memo(() => (
    <motion.div className="bg-slate-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700"
                whileHover={{scale: 1.03, rotate: -2}} animate={{y: [0, -15, 0]}}
                transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}>
        <div className="aspect-[4/3] bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-full"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div></div>
            <motion.div className="h-6 bg-slate-700/80 rounded-full w-full" animate={{opacity: [0.8, 1, 0.8]}} transition={{duration: 1.5, repeat: Infinity}}/>
            <div className="h-4 bg-slate-700 rounded-full w-1/2"></div><div className="h-4 bg-slate-700 rounded-full w-3/4"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div>
        </div>
    </motion.div>));
MockAppUI.displayName = 'MockAppUI';

export default function HeroAnimation() {
    return (
        // The container div was also unnecessary, we can just return the animated mock UI.
        <motion.div className="w-full max-w-sm lg:max-w-md mt-8 lg:mt-0" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.8, delay: 0.6, type: "spring"}}>
            <MockAppUI/>
        </motion.div>
    );
}