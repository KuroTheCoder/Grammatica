// File: components/landing/LandingPageClient.tsx (THE FINAL, CORRECTED VERSION)

'use client';

import dynamic from "next/dynamic";
import {motion} from "framer-motion";
import React from "react";
import { FaBrain, FaLeaf, FaRocket } from 'react-icons/fa6';
import { AnimatedSection, KeywordHighlight, itemVariants } from "@/components/landing/LandingHelpers";

// --- THE FIX IS HERE ---
// 1. Import our new legendary button
import AuroraButton from "../ui/AuroraButton";

// DYNAMIC IMPORTS
const HowItWorksSection = dynamic(() => import('@/components/landing/sections/HowItWorksSection'));
const Testimonials = dynamic(() => import('@/components/landing/sections/TestimonialsSection'));

// This component renders all the content BELOW the hero section
export default function LandingPageClient() {

    const features = [{icon: <FaLeaf size={32} className="text-emerald-500"/>, title: "Bài học Tự nhiên"}, {icon: <FaBrain size={32} className="text-emerald-500"/>, title: "Phản hồi Thông minh"}, {icon: <FaRocket size={32} className="text-emerald-500"/>, title: "Tăng tốc Lộ trình"}];

    return (
        <main>
            <section id="features" className="relative py-20 lg:py-28 px-4">
                <AnimatedSection className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 text-transparent bg-clip-text">Vì sao nên chọn Grammatica?</motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-400 mb-16 max-w-2xl mx-auto">Chúng tôi xây dựng một nền tảng <KeywordHighlight>thích ứng với bạn</KeywordHighlight>, chứ không phải ngược lại.</motion.p>
                    <div className="grid md:grid-cols-3 gap-8">{features.map((feature) => (<motion.div key={feature.title} variants={itemVariants} whileHover={{y: -8, scale: 1.02, boxShadow: "0px 10px 30px rgba(17, 77, 60, 0.4)"}} transition={{type: "spring", stiffness: 300, damping: 20}} className="relative bg-slate-900/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700"><div className="relative z-10"><div className="flex justify-center mb-4">{feature.icon}</div><h3 className="text-xl font-semibold my-4 text-white">{feature.title}</h3><p className="text-slate-400">{feature.title === "Bài học Tự nhiên" ? <>Tiếp cận kiến thức một cách <KeywordHighlight>tự nhiên và sinh động</KeywordHighlight>, không còn nhàm chán như sách vở.</> : feature.title === "Phản hồi Thông minh" ? <>AI phân tích và chỉ ra lỗi sai một cách <KeywordHighlight>chi tiết</KeywordHighlight>, giúp bạn hiểu sâu và nhớ lâu.</> : <>Lộ trình học được <KeywordHighlight>cá nhân hóa</KeywordHighlight>, tập trung vào điểm yếu và giúp bạn tiến bộ vượt bậc.</>}</p></div></motion.div>))}</div>
                </AnimatedSection>
            </section>
            <HowItWorksSection/>
            <Testimonials/>

            {/* THIS IS THE SECTION THAT WAS DUPLICATED BEFORE */}
            <section className="py-20 lg:py-28 px-4">
                <AnimatedSection className="max-w-4xl mx-auto text-center">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-emerald-300 to-sky-300 text-transparent bg-clip-text">
                        Sẵn sàng để nâng trình?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Đăng nhập ngay để bắt đầu hành trình chinh phục ngoại ngữ của mình.
                    </motion.p>
                    {/* 2. Replace the old ugly button with our new hotness */}
                    <motion.div variants={itemVariants}>
                        <AuroraButton />
                    </motion.div>
                </AnimatedSection>
            </section>
        </main>
    );
}