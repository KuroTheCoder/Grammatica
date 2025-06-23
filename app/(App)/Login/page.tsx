"use client";

import Link from "next/link";
import React, {FC, FormEvent, InputHTMLAttributes, useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion, Variants} from 'framer-motion';
import {
    FaBullhorn,
    FaChalkboardTeacher,
    FaGraduationCap,
    FaInfoCircle,
    FaLock,
    FaSyncAlt,
    FaUserAlt,
    FaUserGraduate,
    FaWrench
} from 'react-icons/fa';
import {FiLogIn} from "react-icons/fi";
import Cookies from 'js-cookie';
import {auth, db} from '@/lib/firebase';
import {sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {collection, doc, getDoc, limit, orderBy, query} from "firebase/firestore";
import {useCollection} from 'react-firebase-hooks/firestore';

// ============================================================================
// CÁC COMPONENT CON (Giữ nguyên, không thay đổi)
// Tôi đã copy lại toàn bộ các component con xịn sò của bro vào đây
// ============================================================================

// --- Interactive Spotlight Background ---
const InteractiveSpotlightBackground: FC<{ isTeacher: boolean }> = ({isTeacher}) => {
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-1] transition-all duration-500"
            style={{
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${isTeacher ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)'}, transparent 80%)`
            }}
        />
    );
};
InteractiveSpotlightBackground.displayName = 'InteractiveSpotlightBackground';

// --- Logo ---
const Logo = React.memo(() => (<Link href="/" className="flex items-center gap-3 text-white">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#FDE047" stopOpacity="0.9"/>
                <stop offset="1" stopColor="#A2C5B6"/>
            </linearGradient>
        </defs>
        <path
            d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C19.4442 4 22.5134 5.38553 24.6644 7.53612"
            stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24.5" cy="8.5" r="2.5" fill="url(#logo-gradient)"/>
    </svg>
    <span
        className="text-2xl font-bold tracking-wider bg-gradient-to-r from-stone-300 to-emerald-300 text-transparent bg-clip-text">Grammatica</span>
</Link>));
Logo.displayName = 'Logo';

// --- GlowingButton ---
const GlowingButton: FC<{
    children: React.ReactNode,
    icon: React.ElementType,
    color?: "yellow" | "cyan",
    onClick?: () => void,
    type?: "button" | "submit",
    disabled?: boolean,
    isTeacher?: boolean
}> = ({children, icon: Icon, color = "yellow", onClick, type, disabled, isTeacher}) => {
    const finalColor = isTeacher ? "cyan" : "yellow";
    const colorClasses = {
        yellow: "text-[#FDE047] bg-[conic-gradient(from_90deg_at_50%_50%,#FDE047_0%,#073528_50%,#FDE047_100%)]",
        cyan: "text-[#67E8F9] bg-[conic-gradient(from_90deg_at_50%_50%,#67E8F9_0%,#083344_50%,#67E8F9_100%)]",
    };
    return (<motion.button type={type || "button"} onClick={onClick} disabled={disabled}
                           className={`group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-full py-3 px-6 font-bold text-base ${colorClasses[finalColor]} disabled:opacity-50 disabled:cursor-not-allowed`}
                           whileHover={!disabled ? {scale: 1.02} : {}} whileTap={!disabled ? {scale: 0.98} : {}}
                           transition={{type: "spring", stiffness: 300}}>
        <div
            className={`absolute inset-[-200%] animate-spin-slow ${colorClasses[finalColor]} ${disabled ? 'hidden' : ''}`}/>
        <div className={`absolute inset-0.5 rounded-full ${disabled ? 'bg-slate-800' : 'bg-[#040D0A]'}`}/>
        <div className="relative z-10 flex items-center gap-2">{children}{!disabled &&
            <Icon className="h-5 w-5 transition-transform group-hover:translate-x-1"/>}</div>
    </motion.button>);
};
GlowingButton.displayName = 'GlowingButton';

// --- MockAppUI ---
const MockAppUI = React.memo(({isTeacher}: { isTeacher: boolean }) => (
    <motion.div className="bg-slate-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700"
                whileHover={{scale: 1.03, rotate: -1}} animate={{y: [0, -10, 0]}}
                transition={{duration: 5, repeat: Infinity, ease: "easeInOut"}}>
        <div className="aspect-[4/3] bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
                <div
                    className={`w-8 h-8 rounded-full transition-colors duration-300 ${isTeacher ? 'bg-sky-500' : 'bg-emerald-500'}`}></div>
                <div className="h-4 bg-slate-700 rounded-full w-2/3"></div>
            </div>
            <motion.div className="h-6 bg-slate-700/80 rounded-full w-full" animate={{opacity: [0.8, 1, 0.8]}}
                        transition={{duration: 1.5, repeat: Infinity}}/>
            <div className="h-4 bg-slate-700 rounded-full w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded-full w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded-full w-2/3"></div>
        </div>
    </motion.div>));
MockAppUI.displayName = 'MockAppUI';

// --- ThemedInput ---
interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
    isTeacher: boolean;
}

const ThemedInput: FC<ThemedInputProps> = ({icon: Icon, isTeacher, ...props}) => {
    const focusColor = isTeacher ? 'focus:ring-sky-400' : 'focus:ring-emerald-400';
    const hoverColor = isTeacher ? 'hover:border-sky-400/60' : 'hover:border-emerald-400/60';
    const hoverShadow = isTeacher ? 'hover:shadow-[0_0_10px_0px_rgba(56,189,248,0.3)]' : 'hover:shadow-[0_0_10px_0px_rgba(52,211,153,0.3)]';
    return (<div className="relative"><Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
        <input {...props}
               className={`w-full rounded-lg bg-slate-800 border border-slate-700 p-3 pl-10 text-white transition-all duration-300 focus:outline-none ${focusColor} ${hoverColor} ${hoverShadow}`}/>
    </div>);
};
ThemedInput.displayName = 'ThemedInput';

// --- Captcha ---
const Captcha: FC<{
    code: string;
    input: string;
    onInputChange: (v: string) => void;
    onRefresh: () => void;
    isTeacher: boolean;
}> = ({code, input, onInputChange, onRefresh, isTeacher}) => (
    <div className="space-y-3"><label className="text-sm font-medium text-slate-300">Xác minh</label>
        <div className="flex items-center gap-3">
            <div
                className="flex-1 flex items-center justify-center bg-slate-900 border border-slate-700 rounded-lg h-12 select-none">
                <span className="text-white text-2xl font-mono tracking-[0.3em]" style={{
                    textDecoration: 'line-through',
                    textDecorationColor: '#475569',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}>{code}</span></div>
            <motion.button type="button" onClick={onRefresh}
                           className="p-3 h-12 aspect-square bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                           whileHover={{scale: 1.1, rotate: 45}} whileTap={{scale: 0.9}}><FaSyncAlt
                className="w-full h-full"/></motion.button>
        </div>
        <ThemedInput isTeacher={isTeacher} type="text" placeholder="Nhập mã xác nhận..." value={input}
                     onChange={(e) => onInputChange(e.target.value)} maxLength={5} icon={() => <></>}/></div>);
Captcha.displayName = 'Captcha';

// --- RoleSlider ---
const RoleSlider: FC<{ isTeacher: boolean; onRoleChange: (v: boolean) => void; }> = ({isTeacher, onRoleChange}) => (
    <div className="relative mt-1 flex w-full rounded-lg bg-slate-800 p-1 border border-slate-700 overflow-hidden">
        <motion.div layoutId="role-pill" className="absolute inset-1 w-1/2 rounded-md"
                    animate={{x: isTeacher ? '100%' : '0%', backgroundColor: isTeacher ? '#0ea5e9' : '#10b981'}}
                    transition={{type: "spring", stiffness: 300, damping: 30}}/>
        <button type="button" onClick={() => onRoleChange(false)}
                className={`relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${!isTeacher ? 'text-white' : 'text-slate-300'}`}>
            <FaUserGraduate/>Học sinh
        </button>
        <button type="button" onClick={() => onRoleChange(true)}
                className={`relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${isTeacher ? 'text-white' : 'text-slate-300'}`}>
            <FaChalkboardTeacher/>Giáo viên
        </button>
    </div>);
RoleSlider.displayName = 'RoleSlider';

// --- NoticeBoard & NoticeItem ---
const NoticeItem: FC<{ icon: React.ReactNode; title: string; date: string; }> = ({icon, title, date}) => (<motion.div
    whileHover={{
        scale: 1.02,
        y: -4,
        backgroundColor: "rgba(30, 41, 59, 0.5)",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
    }} transition={{type: "spring", stiffness: 300, damping: 20}}
    className="bg-slate-900/40 rounded-lg border border-white/10 p-4 flex items-start space-x-4 cursor-pointer">
    <div className="text-2xl mt-1 text-slate-400">{icon}</div>
    <div><h4 className="font-semibold text-white">{title}</h4><p className="text-sm text-slate-500">{date}</p></div>
</motion.div>);
NoticeItem.displayName = 'NoticeItem';

const NoticeBoard: FC<{ isTeacher: boolean }> = ({isTeacher}) => {
    const announcementsQuery = query(collection(db, 'announcements'), orderBy('date', 'desc'), limit(3));
    const [announcements, loading, error] = useCollection(announcementsQuery);
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'FaWrench':
                return <FaWrench className="text-cyan-400"/>;
            case 'FaInfoCircle':
                return <FaInfoCircle className="text-green-400"/>;
            case 'FaGraduationCap':
                return <FaGraduationCap className="text-sky-400"/>;
            default:
                return <FaBullhorn className="text-yellow-400"/>;
        }
    };
    return (
        <div>
            <h3 className={`text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r transition-all duration-300 ${isTeacher ? 'from-sky-400 to-cyan-400' : 'from-emerald-400 to-teal-400'}`}>Bảng
                Tin</h3>
            <div className="space-y-4">
                {loading && <p className="text-sm text-slate-400">Đang tải tin tức...</p>}
                {error && <p className="text-sm text-red-400">Không thể tải tin tức.</p>}
                {announcements?.docs.map(doc => {
                    const data = doc.data();
                    return (<NoticeItem key={doc.id} icon={getIconComponent(data.icon)} title={data.title}
                                        date={data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'Vừa xong'}/>);
                })}
            </div>
        </div>
    );
};
NoticeBoard.displayName = 'NoticeBoard';


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const generateCaptcha = useCallback(() => {
        const chars = 'ABCDEGHJKMNPQR23456789';
        let r = '';
        for (let i = 0; i < 5; i++) r += chars[Math.floor(Math.random() * chars.length)];
        setCaptchaCode(r);
    }, []);
    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    const handlePasswordReset = async () => {
        if (!email) {
            setFormError("Vui lòng nhập email của bạn.");
            return;
        }
        setLoading(true);
        setFormError('');
        setResetMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage("Đã gửi email hướng dẫn.");
        } catch {
            setFormError("Không thể gửi email.");
        } finally {
            setLoading(false);
        }
    };

    // HÀM LOGIN ĐÃ CẬP NHẬT ĐỂ GỬI THÔNG BÁO
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setFormError('');
        setResetMessage('');
        if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
            setFormError('Mã xác nhận không chính xác.');
            generateCaptcha();
            setCaptchaInput('');
            return;
        }
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const data = userDoc.data();
                const selectedRole = isTeacher ? 'teacher' : 'student';
                if (Array.isArray(data.role) && data.role.includes(selectedRole)) {
                    const token = await user.getIdToken();
                    Cookies.set('auth-token', token, {expires: 1, path: '/'});

                    // DÒNG NÀY ĐƯỢC THÊM VÀO: Gửi thông báo đăng nhập ở chế độ "bắn và quên"
                    // Nó sẽ không làm chậm quá trình đăng nhập của người dùng.
                    fetch('/api/auth/send-login-notification', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({userId: user.uid, email: user.email}),
                    });

                    router.replace('/Home');
                } else {
                    await auth.signOut();
                    throw new Error('wrong-role');
                }
            } else {
                await auth.signOut();
                throw new Error('no-firestore-profile');
            }
        } catch (error) {
            const getErrorCode = (err: unknown): string => {
                if (err instanceof Error) return err.message;
                if (typeof err === 'object' && err !== null && 'code' in err) return String((err as {
                    code: string
                }).code);
                return 'unknown';
            };
            const code = getErrorCode(error);
            switch (code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setFormError('Thông tin đăng nhập không chính xác.');
                    break;
                case 'wrong-role':
                    setFormError('Vai trò bạn chọn không khớp.');
                    break;
                case 'no-firestore-profile':
                    setFormError('Tài khoản không tồn tại.');
                    break;
                default:
                    setFormError('Đã có lỗi xảy ra.');
                    break;
            }
            generateCaptcha();
            setCaptchaInput('');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants: Variants = {hidden: {opacity: 0}, show: {opacity: 1, transition: {staggerChildren: 0.07}}};
    const itemVariants: Variants = {
        hidden: {y: 20, opacity: 0},
        show: {y: 0, opacity: 1, transition: {type: "spring", stiffness: 100}}
    };

    return (
        <main
            className="relative min-h-screen w-full text-slate-200 flex flex-col items-center justify-center p-4 overflow-hidden bg-[#040D0A]">
            <InteractiveSpotlightBackground isTeacher={isTeacher}/>
            <style
                dangerouslySetInnerHTML={{__html: `@keyframes spin-slow { to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 4s linear infinite; }`}}/>
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl shadow-emerald-900/50 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.div variants={itemVariants} className="mb-8"><Logo/></motion.div>
                            <form onSubmit={handleLogin} noValidate className="space-y-5">
                                <motion.div variants={itemVariants}><RoleSlider isTeacher={isTeacher}
                                                                                onRoleChange={setIsTeacher}/>
                                </motion.div>
                                <motion.div variants={itemVariants}><ThemedInput isTeacher={isTeacher} type="email"
                                                                                 placeholder="Email" value={email}
                                                                                 onChange={(e) => setEmail(e.target.value)}
                                                                                 icon={FaUserAlt} required/>
                                </motion.div>
                                <motion.div variants={itemVariants}><ThemedInput isTeacher={isTeacher} type="password"
                                                                                 placeholder="Mật khẩu" value={password}
                                                                                 onChange={(e) => setPassword(e.target.value)}
                                                                                 icon={FaLock} required/></motion.div>
                                <motion.div variants={itemVariants}><Captcha isTeacher={isTeacher} code={captchaCode}
                                                                             input={captchaInput}
                                                                             onInputChange={setCaptchaInput}
                                                                             onRefresh={() => {
                                                                                 generateCaptcha();
                                                                                 setCaptchaInput('');
                                                                             }}/></motion.div>
                                <motion.div variants={itemVariants} className="flex justify-end pt-1">
                                    <button type="button" onClick={handlePasswordReset} disabled={loading}
                                            className={`text-sm hover:underline transition-colors disabled:opacity-50 ${isTeacher ? 'text-sky-400 hover:text-sky-300' : 'text-emerald-400 hover:text-emerald-300'}`}>Quên
                                        mật khẩu?
                                    </button>
                                </motion.div>
                                <AnimatePresence mode="wait">
                                    {formError && (
                                        <motion.p key="formError" initial={{opacity: 0}} animate={{opacity: 1}}
                                                  exit={{opacity: 0}}
                                                  className="text-red-400 text-center text-sm">{formError}</motion.p>)}
                                    {resetMessage && (
                                        <motion.p key="resetMsg" initial={{opacity: 0}} animate={{opacity: 1}}
                                                  exit={{opacity: 0}}
                                                  className={`text-center text-sm ${isTeacher ? 'text-sky-400' : 'text-green-400'}`}>{resetMessage}</motion.p>)}
                                </AnimatePresence>
                                <motion.div variants={itemVariants} className="pt-2">
                                    <GlowingButton type="submit"
                                                   disabled={!email || !password || !captchaInput || loading}
                                                   icon={FiLogIn} isTeacher={isTeacher}>
                                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                                    </GlowingButton>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                    <div className="flex flex-col bg-black/20 p-8 space-y-6 lg:space-y-8 lg:border-l border-slate-800">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.div variants={itemVariants} className="hidden lg:block flex-grow"><MockAppUI
                                isTeacher={isTeacher}/></motion.div>
                            <motion.div variants={itemVariants} className="hidden lg:block">
                                <div
                                    className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent my-6"></div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="mt-6 lg:mt-0"><NoticeBoard
                                isTeacher={isTeacher}/></motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <motion.footer initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.8}}
                           className="text-center text-slate-500 text-sm mt-8">
                <p>© {new Date().getFullYear()} Grammatica. Mọi quyền được bảo lưu.</p>
            </motion.footer>
        </main>
    );
};

export default LoginPage;