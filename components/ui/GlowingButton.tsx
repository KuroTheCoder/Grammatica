// file: components/ui/GlowingButton.tsx

"use client";

import React from "react";
import {AnimatePresence, motion} from "framer-motion";

// <<< 1. CHANGE THE IMPORT >>>
// We import our new custom spinner instead of the old one.
import PulseLoader from "./PulseLoader";

const GlowingButton = ({
                           children,
                           icon: Icon,
                           color = "yellow",
                           onClick,
                           type,
                           disabled = false,
                           isLoading = false,
                       }: {
    children: React.ReactNode;
    icon: React.ElementType;
    color?: "yellow" | "cyan" | "emerald" | "red";
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
    isLoading?: boolean;
}) => {
    const colorClasses = {
        yellow: "text-[#FDE047] bg-[conic-gradient(from_90deg_at_50%_50%,#FDE047_0%,#073528_50%,#FDE047_100%)]",
        cyan: "text-[#67E8F9] bg-[conic-gradient(from_90deg_at_50%_50%,#67E8F9_0%,#083344_50%,#67E8F9_100%)]",
        emerald: "text-[#6EE7B7] bg-[conic-gradient(from_90deg_at_50%_50%,#6EE7B7_0%,#064E3B_50%,#6EE7B7_100%)]",
        red: "text-[#FCA5A5] bg-[conic-gradient(from_90deg_at_50%_50%,#FCA5A5_0%,#7F1D1D_50%,#FCA5A5_100%)]",
    };

    const isDisabled = disabled || isLoading;

    return (
        <motion.button
            type={type || "button"}
            onClick={onClick}
            disabled={isDisabled}
            className={`group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-full py-3 px-6 font-bold text-base transition-opacity duration-300 ${colorClasses[color]} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            whileHover={!isDisabled ? {scale: 1.02} : {}}
            whileTap={!isDisabled ? {scale: 0.98} : {}}
            transition={{type: "spring", stiffness: 300}}
        >
            <div
                className={`absolute inset-[-200%] animate-spin-slow ${colorClasses[color]} ${isDisabled ? 'hidden' : ''}`}/>
            <div className={`absolute inset-0.5 rounded-full ${isDisabled ? 'bg-slate-800' : 'bg-[#040D0A]'}`}/>
            <div className="relative z-10 flex items-center justify-center h-6">
                <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                        <motion.div
                            key="spinner" initial={{opacity: 0}}
                            animate={{opacity: 1}} exit={{opacity: 0}}
                            transition={{duration: 0.2}}
                        >
                            {/* <<< 2. SWAP THE COMPONENT >>> */}
                            {/* We use our new PulseLoader and set its height. */}
                            {/* The color is inherited automatically because PulseLoader uses 'currentColor'! So slick. */}
                            <PulseLoader className="h-5"/>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="content" initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}}
                            transition={{duration: 0.2}} className="flex items-center gap-2"
                        >
                            {children}
                            <Icon className="h-5 w-5 transition-transform group-hover:translate-x-1"/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
};

export default GlowingButton;