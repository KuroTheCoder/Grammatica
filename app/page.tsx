// File: HomePage.jsx

"use client";

import { motion, useAnimation, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from "react";
// NEW: Thêm các icon mới
import {
    FaLeaf, FaBrain, FaRocket, FaGithub, FaFacebook, FaDiscord, FaBars, FaTimes,
    FaUserCheck, FaClipboardList, FaGraduationCap
} from 'react-icons/fa';
import { FiArrowRight, FiLogIn } from 'react-icons/fi';

// === ĐỊNH NGHĨA ANIMATION VARIANTS (Không đổi) ===
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

// === CUSTOM HOOK ĐỂ KIỂM TRA MEDIA QUERY (Không đổi) ===
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);
    return matches;
};

// === COMPONENT TIỆN ÍCH CHO ANIMATION KHI CUỘN (Không đổi) ===
const AnimatedSection = ({ children, className }) => {
    const controls = useAnimation();
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    useEffect(() => { if (inView) controls.start("visible"); }, [controls, inView]);
    return <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls} className={className}>{children}</motion.div>;
};

// === NEW: COMPONENT LOGO CHO DỰ ÁN ===
const Logo = () => (
    <a href="#" className="flex items-center gap-2 text-white">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield shape */}
            <path d="M20 38C20 38 36 31 36 20V8L20 2L4 8V20C4 31 20 38 20 38Z" className="fill-emerald-600/80" />
            {/* Book icon inside */}
            <path d="M25 13H15C13.8954 13 13 13.8954 13 15V25C13 26.1046 13.8954 27 15 27H25C26.1046 27 27 26.1046 27 25V15C27 13.8954 26.1046 13 25 13Z" stroke="#fde047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 13V27" stroke="#fde047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-2xl font-bold tracking-wider">Grammatica</span>
    </a>
);


// === COMPONENT MOCKUP UI CHO HERO SECTION (Không đổi) ===
const MockAppUI = () => (
    <motion.div className="bg-slate-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700" whileHover={{ scale: 1.03, rotate: -2 }} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <div className="aspect-[4/3] bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-full"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div></div>
            <motion.div className="h-6 bg-slate-700/80 rounded-full w-full" animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <div className="h-4 bg-slate-700 rounded-full w-1/2"></div><div className="h-4 bg-slate-700 rounded-full w-3/4"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div>
        </div>
    </motion.div>
);

// === UPDATED: COMPONENT "HOW IT WORKS" VỚI ICON ===
const HowItWorksSection = () => {
    // NEW: Thêm icon vào từng bước
    const steps = [
        { icon: <FaUserCheck size={28} />, title: "Đăng nhập", description: "Sử dụng tài khoản được nhà trường cung cấp để truy cập." },
        { icon: <FaClipboardList size={28} />, title: "Kiểm tra đầu vào", description: "Làm một bài kiểm tra ngắn để hệ thống hiểu rõ trình độ của bạn." },
        { icon: <FaGraduationCap size={28} />, title: "Bắt đầu học", description: "Đi theo lộ trình được cá nhân hóa và chinh phục các thử thách." }
    ];

    const targetRef = useRef(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start center", "end center"] });
    const stepControls = [useAnimation(), useAnimation(), useAnimation()];
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > (isMobile ? 0.15 : 0.1)) stepControls[0].start("visible");
        if (latest > 0.5) stepControls[1].start("visible");
        if (latest > (isMobile ? 0.85 : 0.9)) stepControls[2].start("visible");
    });
    const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const stepVariants = {
        hidden: { opacity: 0.3, y: 20, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } }
    };

    return (
        <section id="how-it-works" className="relative overflow-hidden py-20 lg:py-28 px-4 bg-slate-900" ref={targetRef}>
            {/* NEW: Thêm blob trang trí */}
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-emerald-900/40 rounded-full blur-3xl" />
            <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold">Học thật dễ dàng chỉ với 3 bước</h2>
            </div>
            <div className="relative max-w-4xl mx-auto z-10">
                {isMobile ? (
                    <div className="relative flex flex-col items-center gap-20">
                        <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-full bg-emerald-800/50" style={{ scaleY: lineScale, transformOrigin: 'top' }} />
                        {steps.map((step, index) => (
                            <motion.div key={step.title} variants={stepVariants} initial="hidden" animate={stepControls[index]} className="relative z-10 text-center flex flex-col items-center w-full">
                                <motion.div className="bg-emerald-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4 ring-8 ring-slate-900">{step.icon}</motion.div>
                                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                                <p className="text-slate-400 max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="relative flex justify-between items-start">
                        <motion.div className="absolute top-10 left-0 w-full h-1 bg-emerald-800/50" style={{ scaleX: lineScale, transformOrigin: 'left' }} />
                        {steps.map((step, index) => (
                            <motion.div key={step.title} variants={stepVariants} initial="hidden" animate={stepControls[index]} className="relative z-10 text-center flex flex-col items-center w-1/3">
                                <motion.div className="bg-emerald-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-6 ring-8 ring-slate-900">{step.icon}</motion.div>
                                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};


// === COMPONENT CHÍNH CỦA TRANG ===
export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        { icon: <FaLeaf size={32} className="text-emerald-500" />, title: "Bài học Tự nhiên", description: "Tiếp cận kiến thức một cách tự nhiên và sinh động, không còn nhàm chán như sách vở." },
        { icon: <FaBrain size={32} className="text-emerald-500" />, title: "Phản hồi Thông minh", description: "AI phân tích và chỉ ra lỗi sai một cách chi tiết, giúp bạn hiểu sâu và nhớ lâu." },
        { icon: <FaRocket size={32} className="text-emerald-500" />, title: "Tăng tốc Lộ trình", description: "Lộ trình học được cá nhân hóa, tập trung vào điểm yếu và giúp bạn tiến bộ vượt bậc." }
    ];

    return (
        <div className="bg-slate-900 text-slate-200 antialiased">
            <style jsx global>{`html { scroll-behavior: smooth; }`}</style>

            {/* ========== HERO SECTION with NAVBAR ========== */}
            <header className="relative w-full overflow-hidden bg-gradient-to-br from-green-900/80 via-emerald-800/80 to-yellow-600/60">
                {/* NEW: Thêm các blob trang trí để lấp khoảng trống */}
                <div aria-hidden="true" className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div aria-hidden="true" className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* UPDATED: Sử dụng component Logo */}
                            <Logo />

                            <div className="hidden md:flex items-center space-x-2">
                                <a href="#features" className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Tính năng</a>
                                <a href="#how-it-works" className="text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Cách hoạt động</a>
                                <motion.a href="/login" className="bg-yellow-400 text-green-900 font-semibold py-2 px-4 rounded-lg ml-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    Đăng nhập
                                </motion.a>
                            </div>

                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-md hover:bg-white/10">
                                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {isMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-slate-800/90">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Tính năng</a>
                                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Cách hoạt động</a>
                                <a href="/login" className="bg-yellow-400 text-green-900 font-semibold py-2 px-4 rounded-lg mt-2 inline-block">Đăng nhập</a>
                            </div>
                        </motion.div>
                    )}
                </motion.nav>

                <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-4 md:px-8 max-w-7xl mx-auto pt-16 relative z-10">
                    <motion.div className="text-center lg:text-left text-white max-w-2xl lg:max-w-xl" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                            Chinh phục Tiếng Anh cùng <span className="text-yellow-300">Grammatica</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/80 mb-8">
                            Nền tảng học tập hiện đại dành riêng cho sinh viên, kết hợp bài học tương tác và công nghệ AI đột phá.
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <motion.a href="/login" className="group bg-yellow-400 text-green-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-500 inline-flex items-center justify-center gap-2 text-lg" whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(250, 204, 21, 0.5)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                                Bắt đầu học ngay
                                <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                    <motion.div className="w-full max-w-sm lg:max-w-md mt-8 lg:mt-0" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6, type: "spring" }}>
                        <MockAppUI />
                    </motion.div>
                </div>
            </header>

            {/* ========== FEATURES SECTION ========== */}
            <section id="features" className="relative overflow-hidden py-20 lg:py-28 px-4 bg-slate-800">
                {/* NEW: Thêm blob trang trí */}
                <div aria-hidden="true" className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-900/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <AnimatedSection className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">Vì sao nên chọn <span className="text-emerald-400">Grammatica</span>?</motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-400 mb-16 max-w-2xl mx-auto">Chúng tôi xây dựng một nền tảng thích ứng với bạn, chứ không phải ngược lại.</motion.p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <motion.div key={feature.title} variants={itemVariants} className="bg-slate-700/50 p-8 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors duration-300">
                                <div className="flex justify-center mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold my-4 text-white">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ========== HOW IT WORKS SECTION ========== */}
            <HowItWorksSection />

            {/* ========== FINAL CTA SECTION ========== */}
            <section className="bg-slate-800">
                <AnimatedSection className="max-w-4xl mx-auto text-center py-20 lg:py-28 px-4">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-white">Sẵn sàng để nâng trình?</motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-400 mb-8 max-w-xl mx-auto">Đăng nhập ngay để bắt đầu hành trình chinh phục ngoại ngữ của mình.</motion.p>
                    <motion.a variants={itemVariants} href="/login" className="group bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-emerald-600 inline-flex items-center justify-center gap-2 text-lg" whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(16, 185, 129, 0.5)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                        Đăng nhập ngay
                        <FiLogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </motion.a>
                </AnimatedSection>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="bg-slate-900 text-slate-400 py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="mb-4">© {new Date().getFullYear()} Grammatica. All rights reserved.</p>
                    <div className="flex justify-center gap-6">
                        {[ { href: "#", icon: <FaGithub />, label: "GitHub" }, { href: "#", icon: <FaFacebook />, label: "Facebook" }, { href: "#", icon: <FaDiscord />, label: "Discord" } ].map(item => (
                            <motion.a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="hover:text-emerald-400 transition-colors text-2xl" whileHover={{ y: -3 }}>
                                {item.icon}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}