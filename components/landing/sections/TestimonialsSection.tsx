// components/landing/sections/TestimonialsSection.tsx (UPDATED - COPY THIS ENTIRE FILE)

"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Also importing helpers from our new central file!
import { AnimatedSection, itemVariants } from "@/components/landing/LandingHelpers";

// The Main Component for this file
const TestimonialsSection = () => {
    const testimonials = [{
        name: "An Khang",
        title: "Sinh viên năm 2, ĐH Bách Khoa",
        quote: "AI của Grammatica chỉ ra lỗi sai ngữ pháp mà em không bao giờ nhận ra. Thực sự thay đổi cách em viết tiếng Anh.",
        avatarUrl: "/avatars/avatar-1.jpg"
    }, {
        name: "Minh Thư",
        title: "Sinh viên năm 3, ĐH Kinh tế Quốc dân",
        quote: "Giao diện đẹp, lộ trình học rõ ràng. Em không còn cảm thấy mông lung khi học ngoại ngữ nữa. Highly recommended!",
        avatarUrl: "/avatars/avatar-2.jpg"
    }, {
        name: "Bảo Ngọc",
        title: "Sinh viên năm nhất, ĐH Ngoại thương",
        quote: "Các bài học tương tác rất thú vị, không hề nhàm chán như em nghĩ. Em tiến bộ từng ngày.",
        avatarUrl: "/avatars/avatar-3.jpg"
    }, {
        name: "Gia Huy",
        title: "Lập trình viên, FPT Software",
        quote: "Dùng Grammatica để trau dồi kỹ năng viết email và tài liệu kỹ thuật. Rất hiệu quả và chuyên nghiệp.",
        avatarUrl: "/avatars/avatar-4.jpg"
    }, {
        name: "Quỳnh Anh",
        title: "Du học sinh, Úc",
        quote: "Là công cụ không thể thiếu giúp mình tự tin hơn khi viết luận và giao tiếp hàng ngày. Cảm ơn Grammatica!",
        avatarUrl: "/avatars/avatar-5.jpg"
    },];
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="relative py-20 lg:py-28">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-slow { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .animate-marquee-slow { animation: marquee-slow 60s linear infinite; }
                .group:hover .animate-marquee-slow, .group:focus-within .animate-marquee-slow { animation-play-state: paused; }
            `
            }}/>
            <AnimatedSection className="w-full text-center relative z-10 px-4">
                <motion.h2 variants={itemVariants}
                           className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 text-transparent bg-clip-text">Hành
                    Trình Thành Công
                </motion.h2>
                <motion.p variants={itemVariants} className="text-slate-400 mb-16 max-w-2xl mx-auto">Nghe câu chuyện từ
                    những người đã thay đổi hành trình chinh phục tiếng Anh cùng Grammatica.
                </motion.p>
            </AnimatedSection>
            <div
                className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_5%,black_95%,transparent_100%)]">
                <div
                    className="flex flex-nowrap gap-8 animate-marquee-slow">
                    {duplicatedTestimonials.map((t, i) => (
                        <div key={i} className="flex-shrink-0 w-80 p-4">
                            <div
                                className="group/card w-full h-full bg-slate-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-400/50">
                                <motion.div whileHover={{scale: 1.05}} transition={{type: "spring", stiffness: 300}}>
                                    <Image
                                        src={t.avatarUrl} alt={t.name} width={64} height={64}
                                        className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-slate-600"/>
                                    <p className="text-slate-300 italic h-24">{`"${t.quote}"`}</p>
                                    <div className="mt-6 border-t border-white/10 w-1/3 mx-auto"/>
                                    <p className="mt-4 font-bold text-white">{t.name}</p>
                                    <p className="text-sm text-slate-400">{t.title}</p>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;