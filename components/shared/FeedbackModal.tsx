// file: components/shared/FeedbackModal.tsx (UPGRADED WITH "THANK YOU" SCREEN)

"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaUserAlt, FaLightbulb, FaBug, FaStar, FaCheckCircle } from "react-icons/fa";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import GlowingButton from "../ui/GlowingButton";

// Style object remains the same, great for dynamic theming!
const typeStyles = {
    suggestion: {
        focusRing: 'focus:ring-emerald-400',
        hoverBorder: 'hover:border-emerald-400/60',
        hoverShadow: 'hover:shadow-[0_0_10px_0px_rgba(52,211,153,0.3)]',
        buttonColor: 'emerald' as const,
    },
    bug: {
        focusRing: 'focus:ring-red-400',
        hoverBorder: 'hover:border-red-400/60',
        hoverShadow: 'hover:shadow-[0_0_10px_0px_rgba(239,68,68,0.3)]',
        buttonColor: 'red' as const,
    }
}

const FeedbackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'suggestion' | 'bug'>('suggestion');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    const currentStyles = typeStyles[type];

    // <<< NEW: This effect resets the form when the modal is closed >>>
    // This is much cleaner than using setTimeout.
    useEffect(() => {
        if (!isOpen) {
            // Wait for the exit animation to finish before resetting state
            setTimeout(() => {
                setStatus('idle');
                setName('');
                setType('suggestion');
                setRating(0);
                setMessage('');
            }, 300);
        }
    }, [isOpen]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !name.trim() || rating === 0) {
            // This is a nice touch to show native validation errors
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
            if (!res.ok) throw new Error('Failed to send feedback');
            // <<< CHANGE: On success, just set the status. Don't close. >>>
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
            // Reset to idle after a moment so the user can try again
            setTimeout(() => setStatus('idle'), 2500);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const childVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

    // <<< NEW: A dedicated component for the success message >>>
    const ThankYouMessage = () => (
        <motion.div
            key="thank-you"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-10 px-6 flex flex-col items-center justify-center"
        >
            <FaCheckCircle className="text-5xl text-emerald-400 mb-5" />
            <h2 className="text-2xl font-bold text-white mb-2">Cảm ơn bạn!</h2>
            <p className="text-slate-400 max-w-xs">
                {type === 'suggestion'
                    ? "Góp ý của bạn là động lực để chúng tôi phát triển."
                    : "Chúng tôi sẽ xem xét báo lỗi và khắc phục sớm nhất."}
            </p>
            <motion.button
                onClick={onClose}
                className="mt-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 px-8 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Đóng
            </motion.button>
        </motion.div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl overflow-hidden">

                        {/* <<< NEW: This AnimatePresence handles the switch between form and thank you message >>> */}
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <ThankYouMessage />
                            ) : (
                                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                                    <div className="p-8">
                                        <motion.button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><FaTimes /></motion.button>
                                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                            <motion.h2 className="text-xl font-bold text-white mb-2" variants={childVariants}>Gửi Lời Nhắn</motion.h2>
                                            <motion.p className="text-slate-400 mb-6" variants={childVariants}>Chúng tôi luôn lắng nghe để trở nên tốt hơn.</motion.p>
                                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                                                {/* Your form fields remain exactly the same, they're perfect. */}
                                                <motion.div variants={childVariants} className="relative">
                                                    <label className="text-sm font-medium text-slate-300">Tên của bạn</label>
                                                    <FaUserAlt className="absolute left-3 top-10 text-slate-500"/>
                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn..." className={`mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 p-3 pl-10 text-white transition-all duration-300 focus:ring-2 focus:outline-none ${currentStyles.focusRing} ${currentStyles.hoverBorder} ${currentStyles.hoverShadow}`} required />
                                                </motion.div>
                                                <motion.div variants={childVariants}>
                                                    <label className="text-sm font-medium text-slate-300">Loại phản hồi</label>
                                                    <div className="group relative mt-1 flex w-full rounded-lg bg-slate-800 p-1 border border-slate-700">
                                                        <div className="absolute -inset-px rounded-lg opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: `radial-gradient(circle at 10% 10%, ${type === 'suggestion' ? '#6EE7B7' : '#F87171'}, transparent 25%), radial-gradient(circle at 90% 90%, ${type === 'suggestion' ? '#67E8F9' : '#FCA5A5'}, transparent 25%)` }} />
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
                                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..." rows={4} className={`mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 p-3 pl-10 text-white transition-all duration-300 focus:ring-2 focus:outline-none ${currentStyles.focusRing} ${currentStyles.hoverBorder} ${currentStyles.hoverShadow}`} required></textarea>
                                                </motion.div>
                                                <motion.div variants={childVariants} className="flex justify-center pt-2">
                                                    <GlowingButton
                                                        icon={FiSend}
                                                        color={currentStyles.buttonColor}
                                                        type="submit"
                                                        isLoading={status === 'loading'}
                                                        disabled={status === 'error'}
                                                    >
                                                        {status === 'error' ? 'Thử lại sau' : 'Gửi Phản Hồi'}
                                                    </GlowingButton>
                                                </motion.div>
                                            </form>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default FeedbackModal;