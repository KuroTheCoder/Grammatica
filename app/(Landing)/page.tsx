"use client";

import Link from "next/link";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useInView,
    useAnimationControls,
    Variants
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import {
    FaStar,
    FaTimes, FaBrain, FaLeaf, FaRocket, FaUserCheck, FaClipboardList, FaGraduationCap, FaGithub, FaFacebook, FaDiscord, FaBars, FaUserAlt, FaLightbulb, FaBug
} from 'react-icons/fa';
import { FiLogIn, FiMessageSquare, FiSend } from 'react-icons/fi';

// ============================================================================
// Canvas Animation Logic (Defined outside the component for type safety and clarity)
// ============================================================================

class Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    color: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.color = `hsla(160, 50%, 80%, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.y -= this.speedY;
        if (this.y < 0) {
            this.y = this.canvas.height;
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

function initParticles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[]) {
    const numberOfParticles = Math.floor(canvas.width / 30);
    particles.length = 0; // Clear the array
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(ctx, canvas));
    }
}

function animateParticles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    return requestAnimationFrame(() => animateParticles(ctx, canvas, particles));
}


// ============================================================================
// ALL HELPER COMPONENTS
// ============================================================================

const FloatingDustBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];

        initParticles(ctx, canvas, particles);
        const animationFrameId = animateParticles(ctx, canvas, particles);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(ctx, canvas, particles);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};


const GlowingButton = ({ children, icon: Icon, color = "yellow", onClick, type }: { children: React.ReactNode, icon: React.ElementType, color?: "yellow" | "cyan", onClick?: () => void, type?: "button" | "submit" }) => {
    const colorClasses = {
        yellow: "text-[#FDE047] bg-[conic-gradient(from_90deg_at_50%_50%,#FDE047_0%,#073528_50%,#FDE047_100%)]",
        cyan: "text-[#67E8F9] bg-[conic-gradient(from_90deg_at_50%_50%,#67E8F9_0%,#083344_50%,#67E8F9_100%)]",
    };

    return (
        <motion.button
            type={type || "button"}
            onClick={onClick}
            className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full py-3 px-6 font-bold text-base ${colorClasses[color]}`}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}
        >
            <div className={`absolute inset-[-200%] animate-spin-slow ${colorClasses[color]}`} />
            <div className="absolute inset-0.5 rounded-full bg-[#040D0A]" />
            <div className="relative z-10 flex items-center gap-2">{children}<Icon className="h-5 w-5 transition-transform group-hover:translate-x-1" /></div>
        </motion.button>
    );
};

const FeedbackModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'suggestion' | 'bug'>('suggestion');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !name.trim() || rating === 0) {
            formRef.current?.reportValidity();
            return;
        }
        setStatus('loading');
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, rating, message }),
            });
            if (!res.ok) {
                setStatus('error');
                return;
            }
            setStatus('success');
            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setStatus('idle');
                    setName('');
                    setType('suggestion');
                    setRating(0);
                    setMessage('');
                }, 300)
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const childVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-slate-900/80 border border-white/10 p-8 shadow-2xl">
                        <motion.button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors" variants={childVariants}><FaTimes /></motion.button>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <motion.h2 className="text-xl font-bold text-white mb-2" variants={childVariants}>Gửi Lời Nhắn</motion.h2>
                            <motion.p className="text-slate-400 mb-6" variants={childVariants}>Chúng tôi luôn lắng nghe để trở nên tốt hơn.</motion.p>
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <motion.div variants={childVariants} className="relative">
                                    <label className="text-sm font-medium text-slate-300">Tên của bạn</label>
                                    <FaUserAlt className="absolute left-3 top-10 text-slate-500"/>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn..." className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 p-3 pl-10 text-white transition-all duration-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none hover:border-emerald-400/60 hover:shadow-[0_0_10px_0px_rgba(52,211,153,0.3)]" required />
                                </motion.div>
                                <motion.div variants={childVariants}>
                                    <label className="text-sm font-medium text-slate-300">Loại phản hồi</label>
                                    <div className="group relative mt-1 flex w-full rounded-lg bg-slate-800 p-1 border border-slate-700">
                                        <div className="absolute -inset-px rounded-lg opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: `radial-gradient(circle at 10% 10%, #6EE7B7, transparent 25%), radial-gradient(circle at 90% 90%, #67E8F9, transparent 25%)` }} />

                                        {type === 'suggestion' && <motion.div layoutId="feedback-pill" className="absolute inset-1 w-1/2 rounded-md bg-emerald-500" transition={{type: "spring", stiffness: 300, damping: 30}} />}
                                        {type === 'bug' && <motion.div layoutId="feedback-pill" className="absolute inset-1 w-1/2 left-1/2 rounded-md bg-red-500" transition={{type: "spring", stiffness: 300, damping: 30}} />}

                                        <button type="button" onClick={() => setType('suggestion')} className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${type === 'suggestion' ? 'text-white' : 'text-slate-300'}`}><span className="flex items-center justify-center gap-2"><FaLightbulb/> Góp ý</span></button>
                                        <button type="button" onClick={() => setType('bug')} className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${type === 'bug' ? 'text-white' : 'text-slate-300'}`}><span className="flex items-center justify-center gap-2"><FaBug/> Báo lỗi</span></button>
                                    </div>
                                </motion.div>
                                <motion.div variants={childVariants}>
                                    <label className="text-sm font-medium text-slate-300">Bạn đánh giá trải nghiệm này?</label>
                                    <div className="mt-1 flex items-center gap-1">
                                        {[...Array(5)].map((_, index) => { const starValue = index + 1; return ( <motion.button type="button" key={starValue} onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="transition-colors"> <FaStar size={24} className={(hoverRating || rating) >= starValue ? "text-yellow-400" : "text-slate-600"} /> </motion.button> )})}
                                    </div>
                                </motion.div>
                                <motion.div variants={childVariants} className="relative">
                                    <label className="text-sm font-medium text-slate-300">Lời nhắn</label>
                                    <FiMessageSquare className="absolute left-3 top-10 text-slate-500"/>
                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..." rows={4} className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 p-3 pl-10 text-white transition-all duration-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none hover:border-emerald-400/60 hover:shadow-[0_0_10px_0px_rgba(52,211,153,0.3)]" required></textarea>
                                </motion.div>
                                <motion.div variants={childVariants} className="flex justify-center pt-2">
                                    <GlowingButton icon={FiSend} color="cyan" type="submit">
                                        {status === 'loading' ? 'Đang gửi...' : status === 'success' ? 'Đã gửi!' : status === 'error' ? 'Lỗi!' : 'Gửi Phản Hồi'}
                                    </GlowingButton>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const FeedbackButton = () => { const [isModalOpen, setIsModalOpen] = useState(false); return ( <> <motion.button onClick={() => setIsModalOpen(true)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5, ease: "easeOut" }} whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }} whileTap={{ scale: 0.95 }} className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-lg" aria-label="Gửi feedback" title="Gửi Feedback"> <VscFeedback className="h-7 w-7 text-emerald-300" /> </motion.button> <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> </> ); };
const ClientOnly = ({ children }: { children: React.ReactNode }) => { const [hasMounted, setHasMounted] = useState(false); useEffect(() => { setHasMounted(true) }, []); if (!hasMounted) return null; return <>{children}</>; };
const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };
const AnimatedSection = ({ children, className }: { children: React.ReactNode; className?: string; }) => { const controls = useAnimationControls(); const ref = useRef(null); const inView = useInView(ref, { once: true, amount: 0.2 }); useEffect(() => { (async () => { if (inView) { await controls.start("visible"); } })(); }, [controls, inView]); return <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls} className={className}>{children}</motion.div>; };
const Logo = React.memo(() => ( <Link href="/" className="flex items-center gap-3 text-white"> <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs><linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#FDE047" stopOpacity="0.9" /><stop offset="1" stopColor="#A2C5B6" /></linearGradient></defs> <path d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C19.4442 4 22.5134 5.38553 24.6644 7.53612" stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> <circle cx="24.5" cy="8.5" r="2.5" fill="url(#logo-gradient)" /> </svg> <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-stone-300 to-emerald-300 text-transparent bg-clip-text">Grammatica</span> </Link> ));
Logo.displayName = 'Logo';
const MockAppUI = React.memo(() => ( <motion.div className="bg-slate-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700" whileHover={{scale: 1.03, rotate: -2}} animate={{y: [0, -15, 0]}} transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}> <div className="aspect-[4/3] bg-slate-900 rounded-lg p-4 space-y-3"> <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-full"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div></div> <motion.div className="h-6 bg-slate-700/80 rounded-full w-full" animate={{opacity: [0.8, 1, 0.8]}} transition={{duration: 1.5, repeat: Infinity}}/> <div className="h-4 bg-slate-700 rounded-full w-1/2"></div><div className="h-4 bg-slate-700 rounded-full w-3/4"></div><div className="h-4 bg-slate-700 rounded-full w-2/3"></div> </div> </motion.div> ));
MockAppUI.displayName = 'MockAppUI';
const KeywordHighlight = ({ children }: { children: React.ReactNode }) => { return ( <motion.span className="relative inline-block text-emerald-300" whileInView={{ color: "#A2C5B6" }} viewport={{ once: true, amount: 0.8 }}> <motion.span className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-emerald-400" variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 } } }} initial="hidden" animate="visible" /> {children} </motion.span> ); };
const ApproachCard = ({ title, description, icon, titleColor }: { title: string; description: string; icon: React.ReactNode; titleColor: string; }) => { const [hovered, setHovered] = useState(false); return ( <motion.div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} whileHover={{ y: -8, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-full h-56 max-w-sm mx-auto p-4 relative rounded-3xl border border-white/10 bg-slate-900/50 flex items-center justify-center overflow-hidden"> <AnimatePresence> {!hovered ? ( <motion.div key="icon" className="absolute" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}>{icon}</motion.div> ) : ( <motion.div key="text" className="absolute text-center px-4" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}}> <h2 className="text-2xl font-bold" style={{ color: titleColor }}>{title}</h2> <p className="text-base mt-1 text-slate-300">{description}</p> </motion.div> )} </AnimatePresence> </motion.div> ); };
const HowItWorksSection = () => { const steps = [ { title: "Đăng nhập", description: "Sử dụng tài khoản được nhà trường cung cấp.", icon: <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-emerald-900/50 border border-emerald-500/30 text-emerald-400`}><FaUserCheck size={40}/></div>, color: "#6EE7B7" }, { title: "Kiểm tra Năng lực", description: "Hoàn thành bài test để AI xây dựng lộ trình.", icon: <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-yellow-900/50 border border-yellow-500/30 text-yellow-400`}><FaClipboardList size={40}/></div>, color: "#FDE047" }, { title: "Chinh phục Lộ trình", description: "Theo lộ trình cá nhân hóa và nhận phản hồi.", icon: <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-sky-900/50 border border-sky-500/30 text-sky-400`}><FaGraduationCap size={40}/></div>, color: "#7DD3FC" } ]; return ( <section id="how-it-works" className="relative py-20 lg:py-28 px-4"> <AnimatedSection className="w-full relative z-10"> <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-sky-300 via-purple-300 to-red-300 text-transparent bg-clip-text">Học thật dễ dàng</motion.h2> <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-300 max-w-2xl text-center mx-auto">Chỉ với 3 bước đơn giản, AI sẽ xây dựng một lộ trình học tập <KeywordHighlight>dành riêng cho bạn</KeywordHighlight>.</motion.p> <div className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"> {steps.map((step, index) => ( <div key={index}><ApproachCard title={step.title} icon={step.icon} description={step.description} titleColor={step.color} /></div> ))} </div> </AnimatedSection> </section> ); };
const Testimonials = () => { const testimonials = [ { name: "An Khang", title: "Sinh viên năm 2, ĐH Bách Khoa", quote: "AI của Grammatica chỉ ra lỗi sai ngữ pháp mà em không bao giờ nhận ra. Thực sự thay đổi cách em viết tiếng Anh.", avatarUrl: "/avatars/avatar-1.jpg" }, { name: "Minh Thư", title: "Sinh viên năm 3, ĐH Kinh tế Quốc dân", quote: "Giao diện đẹp, lộ trình học rõ ràng. Em không còn cảm thấy mông lung khi học ngoại ngữ nữa. Highly recommended!", avatarUrl: "/avatars/avatar-2.jpg" }, { name: "Bảo Ngọc", title: "Sinh viên năm nhất, ĐH Ngoại thương", quote: "Các bài học tương tác rất thú vị, không hề nhàm chán như em nghĩ. Em tiến bộ từng ngày.", avatarUrl: "/avatars/avatar-3.jpg" }, { name: "Gia Huy", title: "Lập trình viên, FPT Software", quote: "Dùng Grammatica để trau dồi kỹ năng viết email và tài liệu kỹ thuật. Rất hiệu quả và chuyên nghiệp.", avatarUrl: "/avatars/avatar-4.jpg" }, { name: "Quỳnh Anh", title: "Du học sinh, Úc", quote: "Là công cụ không thể thiếu giúp mình tự tin hơn khi viết luận và giao tiếp hàng ngày. Cảm ơn Grammatica!", avatarUrl: "/avatars/avatar-5.jpg" }, ]; const duplicatedTestimonials = [...testimonials, ...testimonials]; return ( <section className="relative py-20 lg:py-28"> <AnimatedSection className="w-full text-center relative z-10 px-4">
    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 text-transparent bg-clip-text">Hành Trình Thành Công</motion.h2>
    <motion.p variants={itemVariants} className="text-slate-400 mb-16 max-w-2xl mx-auto">Nghe câu chuyện từ những người đã thay đổi hành trình chinh phục tiếng Anh cùng Grammatica.</motion.p> </AnimatedSection> <div className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_5%,black_95%,transparent_100%)]"> <div className="flex flex-nowrap gap-8 animate-marquee-slow group-hover:pause"> {duplicatedTestimonials.map((t, i) => ( <div key={i} className="flex-shrink-0 w-80 p-4"> <div className="group/card w-full h-full bg-slate-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-400/50"> <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}> <Image src={t.avatarUrl} alt={t.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-slate-600" />
    <p className="text-slate-300 italic h-24">{`"${t.quote}"`}</p>
    <div className="mt-6 border-t border-white/10 w-1/3 mx-auto" /> <p className="mt-4 font-bold text-white">{t.name}</p> <p className="text-sm text-slate-400">{t.title}</p> </motion.div> </div> </div> ))} </div> </div> </section> ); };


// === COMPONENT CHÍNH CỦA TRANG ===
export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [{ id: 'features', label: 'Tính năng', href: '#features' }, { id: 'how-it-works', label: 'Cách hoạt động', href: '#how-it-works' }];
    const features = [ { icon: <FaLeaf size={32} className="text-emerald-500"/>, title: "Bài học Tự nhiên", description: "Tiếp cận kiến thức một cách tự nhiên và sinh động, không còn nhàm chán như sách vở." }, { icon: <FaBrain size={32} className="text-emerald-500"/>, title: "Phản hồi Thông minh", description: "AI phân tích và chỉ ra lỗi sai một cách chi tiết, giúp bạn hiểu sâu và nhớ lâu." }, { icon: <FaRocket size={32} className="text-emerald-500"/>, title: "Tăng tốc Lộ trình", description: "Lộ trình học được cá nhân hóa, tập trung vào điểm yếu và giúp bạn tiến bộ vượt bậc." } ];

    return (
        <div className="w-full bg-[#040D0A] text-white relative isolate overflow-x-hidden">
            <ClientOnly><FloatingDustBackground /></ClientOnly>
            <ClientOnly><FeedbackButton /></ClientOnly>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow { to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 4s linear infinite; }
                @keyframes marquee-slow { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .animate-marquee-slow { animation: marquee-slow 60s linear infinite; }
                .group:hover .animate-marquee-slow, .group:focus-within .animate-marquee-slow { animation-play-state: paused; }
            `}} />

            <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Logo />
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <motion.div key={link.id} className="relative" onHoverStart={() => setHoveredLink(link.id)} onHoverEnd={() => setHoveredLink('')}>
                                    <motion.a href={link.href} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative block px-3 py-2 rounded-full text-sm font-medium">
                                        <AnimatePresence>
                                            {hoveredLink === link.id && <motion.span className="absolute inset-0 bg-white/10 rounded-full -z-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}/>}
                                        </AnimatePresence>
                                        <span className={`relative transition-colors duration-200 ${hoveredLink === link.id ? 'text-white' : 'text-slate-300'}`}>{link.label}</span>
                                    </motion.a>
                                </motion.div>
                            ))}
                            <Link href="/Login" className="bg-[#FDE047] text-[#040D0A] font-semibold py-2 px-4 rounded-lg ml-4 transition-transform hover:scale-105">Đăng nhập</Link>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-md focus:outline-none"><AnimatePresence initial={false} mode="wait">{isMenuOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><FaTimes size={24}/></motion.div> : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><FaBars size={24}/></motion.div> }</AnimatePresence></button>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-900/95 backdrop-blur-sm overflow-hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                {navLinks.map(link => (<Link key={link.id} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{link.label}</Link>))}
                                <Link href="/Login" onClick={() => setIsMenuOpen(false)} className="bg-[#FDE047] text-[#040D0A] font-semibold py-2 px-4 rounded-lg mt-2 inline-block">Đăng nhập</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <header className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-4 md:px-8 max-w-7xl mx-auto pt-16">
                <motion.div className="text-center lg:text-left text-white max-w-2xl lg:max-w-xl" variants={containerVariants} initial="hidden" animate="visible">
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight" style={{textShadow: '0 2px 20px rgba(0,0,0,0.7)'}}>Chinh phục Tiếng Anh cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-emerald-300 to-stone-300">Grammatica</span></motion.h1>
                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/80 mb-8" style={{textShadow: '0 1px 10px rgba(0,0,0,0.7)'}}>
                        Nền tảng học tập hiện đại dành riêng cho sinh viên, kết hợp <KeywordHighlight>bài học tương tác</KeywordHighlight> và <KeywordHighlight>công nghệ AI đột phá</KeywordHighlight>.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        {/* FIX: Removed legacyBehavior prop */}
                        <Link href="/Login">
                            <motion.div className="group bg-[#FDE047] text-[#040D0A] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#ffe97a] inline-flex items-center justify-center gap-2 text-lg cursor-pointer" whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(253, 224, 71, 0.4)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                                Bắt đầu học ngay
                                <FiLogIn className="h-5 w-5 transition-transform group-hover:translate-x-1"/>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.div className="w-full max-w-sm lg:max-w-md mt-8 lg:mt-0" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6, type: "spring" }}><MockAppUI/></motion.div>
            </header>

            <main>
                <section id="features" className="relative py-20 lg:py-28 px-4">
                    <AnimatedSection className="max-w-6xl mx-auto text-center relative z-10">
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 text-transparent bg-clip-text">Vì sao nên chọn Grammatica?</motion.h2>
                        <motion.p variants={itemVariants} className="text-slate-400 mb-16 max-w-2xl mx-auto">Chúng tôi xây dựng một nền tảng <KeywordHighlight>thích ứng với bạn</KeywordHighlight>, chứ không phải ngược lại.</motion.p>
                        <div className="grid md:grid-cols-3 gap-8">{features.map((feature) => (
                            <motion.div key={feature.title} variants={itemVariants} whileHover={{ y: -8, scale: 1.02, boxShadow: "0px 10px 30px rgba(17, 77, 60, 0.4)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative bg-slate-900/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
                                <div className="relative z-10">
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold my-4 text-white">{feature.title}</h3>
                                    <p className="text-slate-400">
                                        {feature.title === "Bài học Tự nhiên" ? <>Tiếp cận kiến thức một cách <KeywordHighlight>tự nhiên và sinh động</KeywordHighlight>, không còn nhàm chán như sách vở.</> :
                                            feature.title === "Phản hồi Thông minh" ? <>AI phân tích và chỉ ra lỗi sai một cách <KeywordHighlight>chi tiết</KeywordHighlight>, giúp bạn hiểu sâu và nhớ lâu.</> :
                                                <>Lộ trình học được <KeywordHighlight>cá nhân hóa</KeywordHighlight>, tập trung vào điểm yếu và giúp bạn tiến bộ vượt bậc.</>}
                                    </p>
                                </div>
                            </motion.div>))}</div>
                    </AnimatedSection>
                </section>
                <ClientOnly><HowItWorksSection/></ClientOnly>
                <Testimonials />
                <section className="py-20 lg:py-28 px-4">
                    <AnimatedSection className="max-w-4xl mx-auto text-center">
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-emerald-300 to-sky-300 text-transparent bg-clip-text">Sẵn sàng để nâng trình?</motion.h2>
                        <motion.p variants={itemVariants} className="text-slate-400 mb-8 max-w-xl mx-auto">Đăng nhập ngay để bắt đầu hành trình chinh phục ngoại ngữ của mình.</motion.p>
                        <motion.div variants={itemVariants}>
                            {/* FIX: Removed legacyBehavior prop */}
                            <Link href="/Login">
                                <GlowingButton icon={FiLogIn} color="yellow">Đăng nhập ngay</GlowingButton>
                            </Link>
                        </motion.div>
                    </AnimatedSection>
                </section>
            </main>
            <footer className="text-slate-400 py-8 px-4 border-t border-slate-800/50 bg-black/20">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="mb-4">© {new Date().getFullYear()} Grammatica. All rights reserved.</p>
                    <div className="flex justify-center gap-6">{[{ href: "#", icon: <FaGithub/>, label: "GitHub" }, {href: "#", icon: <FaFacebook/>, label: "Facebook"}, { href: "#", icon: <FaDiscord/>, label: "Discord" }].map(item => (<motion.a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="hover:text-emerald-400 transition-colors text-2xl" whileHover={{y: -3}}>{item.icon}</motion.a>))}</div>
                </div>
            </footer>
        </div>
    );
}