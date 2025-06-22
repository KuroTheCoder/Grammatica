// app/(App)/Login/page.tsx
"use client";

import React, {FC, FormEvent, InputHTMLAttributes, useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion, Variants} from 'framer-motion';
import {
    FaBullhorn,
    FaChalkboardTeacher,
    FaInfoCircle,
    FaReact,
    FaSyncAlt,
    FaUserGraduate,
    FaWrench
} from 'react-icons/fa';
import Cookies from 'js-cookie';
import {auth, db} from '@/lib/firebase';
import {sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";

// ===== CÁC COMPONENT UI VỚI THEME "FOREST" =====

const GlowingInput: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <motion.div whileHover={{y: -2, scale: 1.01}} transition={{type: "spring", stiffness: 400, damping: 15}}
                className="glowing-input-container p-px rounded-lg">
        <input {...props} className="w-full bg-gray-800 text-gray-200 rounded-[7px] p-3 outline-none"/>
    </motion.div>
);

const Captcha: FC<{ code: string; input: string; onInputChange: (v: string) => void; onRefresh: () => void }> = ({
                                                                                                                     code,
                                                                                                                     input,
                                                                                                                     onInputChange,
                                                                                                                     onRefresh
                                                                                                                 }) => (
    <div className="space-y-3"><label className="text-sm text-gray-400">Xác minh bạn là người</label>
        <div className="flex items-center gap-4">
            <div
                className="flex-1 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-lg h-12 select-none">
                <span className="text-white text-2xl font-mono tracking-[0.3em]"
                      style={{textDecoration: 'line-through', textDecorationColor: '#4b5563'}}>{code}</span></div>
            <motion.button type="button" onClick={onRefresh}
                           className="p-3 h-12 aspect-square bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                           whileHover={{scale: 1.1, rotate: 45}} whileTap={{scale: 0.9}}><FaSyncAlt
                className="w-full h-full"/></motion.button>
        </div>
        <GlowingInput type="text" placeholder="Nhập mã xác nhận..." value={input}
                      onChange={(e) => onInputChange(e.target.value)} maxLength={5}/>
    </div>
);

const NoticeItem: FC<{ icon: React.ReactNode; title: string; date: string }> = ({icon, title, date}) => (
    <motion.div whileHover={{
        scale: 1.03,
        y: -4,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
    }} transition={{type: "spring", stiffness: 300, damping: 20}}
                className="bg-white/5 rounded-lg border border-white/10 p-4 flex items-start space-x-4 cursor-pointer">
        <div className="text-2xl mt-1 text-gray-400">{icon}</div>
        <div><h4 className="font-bold text-white">{title}</h4><p className="text-sm text-gray-500">{date}</p></div>
    </motion.div>
);

const RoleSlider: FC<{ isTeacher: boolean; onRoleChange: (v: boolean) => void }> = ({isTeacher, onRoleChange}) => (
    <div className="relative flex w-full p-1 bg-white/5 rounded-lg border border-white/10">
        <motion.div
            className="absolute top-1 bottom-1 w-1/2 rounded-md bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg"
            animate={{x: isTeacher ? '100%' : '0%'}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        />
        <button type="button" onClick={() => onRoleChange(false)}
                className="relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2">
            <FaUserGraduate className={!isTeacher ? 'text-white' : 'text-gray-400'}/><span
            className={!isTeacher ? 'text-white' : 'text-gray-400'}>Học sinh</span></button>
        <button type="button" onClick={() => onRoleChange(true)}
                className="relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2">
            <FaChalkboardTeacher className={isTeacher ? 'text-white' : 'text-gray-400'}/><span
            className={isTeacher ? 'text-white' : 'text-gray-400'}>Giáo viên</span></button>
    </div>
);

// ===== COMPONENT CHÍNH =====
const FinalLoginPage = () => {
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
            setFormError("Vui lòng nhập email của bạn để đặt lại mật khẩu.");
            setResetMessage('');
            return;
        }
        setLoading(true);
        setFormError('');
        setResetMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage("Đã gửi email hướng dẫn. Vui lòng kiểm tra hộp thư của bạn.");
        } catch { // SỬA: Dùng `_` để báo linter biết là không dùng đến biến error
            setFormError("Không thể gửi email. Email có thể không tồn tại.");
        } finally {
            setLoading(false);
        }
    };

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
                const {role} = userDoc.data();
                if (role === (isTeacher ? 'teacher' : 'student')) {
                    const token = await user.getIdToken();
                    Cookies.set('auth-token', token, {expires: 1, path: '/'});
                    router.replace('/dashboard');
                } else {
                    throw new Error('wrong-role');
                }
            } else {
                throw new Error('no-firestore-profile');
            }
        } catch (error) {
            // SỬA: Hàm helper để lấy mã lỗi an toàn về type
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
        <div
            className="min-h-screen w-full text-gray-200 flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900"/>
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="w-full max-w-4xl bg-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl shadow-emerald-500/10 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2"><FaReact
                                className="text-emerald-400 text-4xl animate-spin-slow"/><h2
                                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">Grammatica</h2>
                            </motion.div>
                            <motion.p variants={itemVariants} className="text-gray-400 mb-8">Chào mừng quay trở lại.
                            </motion.p>
                            <form onSubmit={handleLogin} noValidate className="space-y-5">
                                <motion.div variants={itemVariants}><RoleSlider isTeacher={isTeacher}
                                                                                onRoleChange={setIsTeacher}/>
                                </motion.div>
                                <motion.div variants={itemVariants}><GlowingInput type="email" placeholder="Email"
                                                                                  value={email}
                                                                                  onChange={(e) => setEmail(e.target.value)}/>
                                </motion.div>
                                <motion.div variants={itemVariants}><GlowingInput type="password" placeholder="Mật khẩu"
                                                                                  value={password}
                                                                                  onChange={(e) => setPassword(e.target.value)}/>
                                </motion.div>
                                <motion.div variants={itemVariants}><Captcha code={captchaCode} input={captchaInput}
                                                                             onInputChange={setCaptchaInput}
                                                                             onRefresh={() => {
                                                                                 generateCaptcha();
                                                                                 setCaptchaInput('');
                                                                             }}/></motion.div>

                                <motion.div variants={itemVariants} className="text-right -mt-3">
                                    <button type="button" onClick={handlePasswordReset} disabled={loading}
                                            className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition-colors disabled:opacity-50">Quên
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
                                                  className="text-green-400 text-center text-sm">{resetMessage}</motion.p>)}
                                </AnimatePresence>

                                <motion.div variants={itemVariants}>
                                    <motion.button type="submit"
                                                   disabled={!email || !password || !captchaInput || loading}
                                                   className="action-button-shine" whileHover={{scale: 1.03}}
                                                   whileTap={{scale: 0.98}}>{loading ? 'Đang xử lý...' : 'Đăng Nhập'}</motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                    <div className="hidden lg:flex flex-col bg-black/20 p-12 border-l border-white/10">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-white mb-6">Bảng Tin
                            </motion.h3>
                            <motion.div variants={itemVariants} className="space-y-4">
                                <NoticeItem icon={<FaBullhorn className="text-yellow-400"/>}
                                            title="Lịch nghỉ Lễ Quốc Khánh 2/9" date="25/08/2023"/>
                                <NoticeItem icon={<FaWrench className="text-cyan-400"/>}
                                            title="Bảo trì hệ thống e-learning" date="23/08/2023"/>
                                <NoticeItem icon={<FaInfoCircle className="text-green-400"/>}
                                            title="Cập nhật quy chế thi học kỳ mới" date="20/08/2023"/>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <motion.footer initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.8}}
                           className="text-center text-gray-500 text-sm mt-8 z-10">
                <p>© {new Date().getFullYear()} Grammatica. Mọi quyền được bảo lưu.</p>
            </motion.footer>
        </div>
    );
};

export default FinalLoginPage;