// components/landing/sections/HowItWorksSection.tsx (UPDATED - COPY THIS ENTIRE FILE)

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCheck, FaClipboardList, FaGraduationCap } from "react-icons/fa6";

// We now import the helpers instead of defining them here! So much cleaner.
import { AnimatedSection, KeywordHighlight, itemVariants } from "@/components/landing/LandingHelpers";

// This helper is ONLY used in this file, so it can stay.
const ApproachCard = ({title, description, icon, titleColor}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    titleColor: string;
}) => {
    const [hovered, setHovered] = useState(false);
    return (<motion.div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                        whileHover={{y: -8, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)"}}
                        transition={{type: "spring", stiffness: 300, damping: 20}}
                        className="w-full h-56 max-w-sm mx-auto p-4 relative rounded-3xl border border-white/10 bg-slate-900/50 flex items-center justify-center overflow-hidden">
        <AnimatePresence> {!hovered ? (<motion.div key="icon" className="absolute" initial={{opacity: 0, scale: 0.8}}
                                                   animate={{opacity: 1, scale: 1}}
                                                   exit={{opacity: 0, scale: 0.8}}>{icon}</motion.div>) : (
            <motion.div key="text" className="absolute text-center px-4" initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}}><h2 className="text-2xl font-bold"
                                                                                    style={{color: titleColor}}>{title}</h2>
                <p className="text-base mt-1 text-slate-300">{description}</p></motion.div>)} </AnimatePresence>
    </motion.div>);
};


// The Main Component for this file
const HowItWorksSection = () => {
    const steps = [{
        title: "Đăng nhập",
        description: "Sử dụng tài khoản được nhà trường cung cấp.",
        icon: <div
            className={`w-24 h-24 rounded-full flex items-center justify-center bg-emerald-900/50 border border-emerald-500/30 text-emerald-400`}>
            <FaUserCheck size={40}/></div>,
        color: "#6EE7B7"
    }, {
        title: "Kiểm tra Năng lực",
        description: "Hoàn thành bài test để AI xây dựng lộ trình.",
        icon: <div
            className={`w-24 h-24 rounded-full flex items-center justify-center bg-yellow-900/50 border border-yellow-500/30 text-yellow-400`}>
            <FaClipboardList size={40}/></div>,
        color: "#FDE047"
    }, {
        title: "Chinh phục Lộ trình",
        description: "Theo lộ trình cá nhân hóa và nhận phản hồi.",
        icon: <div
            className={`w-24 h-24 rounded-full flex items-center justify-center bg-sky-900/50 border border-sky-500/30 text-sky-400`}>
            <FaGraduationCap size={40}/></div>,
        color: "#7DD3FC"
    }];
    return (<section id="how-it-works" className="relative py-20 lg:py-28 px-4"><AnimatedSection
        className="w-full relative z-10">
        <motion.h2 variants={itemVariants}
                   className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-sky-300 via-purple-300 to-red-300 text-transparent bg-clip-text">Học
            thật dễ dàng
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-300 max-w-2xl text-center mx-auto">Chỉ với
            3 bước đơn giản, AI sẽ xây dựng một lộ trình học tập <KeywordHighlight>dành riêng cho bạn</KeywordHighlight>.
        </motion.p>
        <div
            className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"> {steps.map((step, index) => (
            <div key={index}><ApproachCard title={step.title} icon={step.icon} description={step.description}
                                           titleColor={step.color}/></div>))} </div>
    </AnimatedSection></section>);
};

export default HowItWorksSection;