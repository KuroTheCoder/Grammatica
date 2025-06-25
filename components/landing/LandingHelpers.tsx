// components/landing/LandingHelpers.tsx (NEW FILE - COPY THIS)

"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView, Variants } from "framer-motion";

export const containerVariants: Variants = {hidden: {opacity: 0}, visible: {opacity: 1, transition: {staggerChildren: 0.2}}};
export const itemVariants: Variants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1, transition: {type: "spring", stiffness: 100}}
};

export const KeywordHighlight = ({children}: { children: React.ReactNode }) => {
    return (<motion.span className="relative inline-block text-emerald-300">
        <motion.span className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-emerald-400" variants={{
            hidden: {scaleX: 0},
            visible: {scaleX: 1, transition: {duration: 0.5, ease: 'easeOut', delay: 0.3}}
        }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.8 }}/>
        {children} </motion.span>);
};

export const AnimatedSection = ({children, className}: { children: React.ReactNode; className?: string; }) => {
    const controls = useAnimationControls();
    const ref = useRef(null);
    const inView = useInView(ref, {once: true, amount: 0.2});
    useEffect(() => {
        (async () => {
            if (inView) {
                await controls.start("visible");
            }
        })();
    }, [controls, inView]);
    return <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls}
                       className={className}>{children}</motion.div>;
};