// app/(App)/Login/page.tsx
"use client";

import React, { useState, useRef, Suspense, FormEvent, FC, InputHTMLAttributes, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import type * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaUserGraduate, FaChalkboardTeacher, FaBullhorn, FaWrench, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ===================================================================
// 1. BACKGROUND ĐÃ SỬA LỖI HYDRATION
// ===================================================================
const generateStars = (count: number, radius: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(1 - 2 * Math.random());
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
    }
    return positions;
};

const SubtleStarfieldBackground = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-900">
        <Canvas camera={{ position: [0, 0, 1] }}><Suspense fallback={null}><Stars /></Suspense></Canvas>
    </div>
);

const Stars = () => {
    const ref = useRef<THREE.Points>(null);
    // SỬA LỖI HYDRATION: Chỉ tạo sao ở phía client
    const [positions, setPositions] = useState<Float32Array | null>(null);
    useEffect(() => {
        setPositions(generateStars(5000, 1.5));
    }, []);

    useFrame((state, delta) => { if(ref.current) { ref.current.rotation.x -= delta/15; ref.current.rotation.y -= delta/20; }});

    // Chỉ render khi đã có vị trí sao (tránh hydration mismatch)
    return positions ? (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled><PointMaterial transparent color="#a855f7" size={0.003} sizeAttenuation={true} depthWrite={false} /></Points>
        </group>
    ) : null;
};

// ===================================================================
// 2. CÁC COMPONENT GIAO DIỆN
// ===================================================================
const GlowingInput: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <motion.div whileHover={{ y: -2 }} className="glowing-input-container p-px rounded-lg">
        <input {...props} className="w-full bg-gray-800 text-gray-200 rounded-[7px] p-3 outline-none" />
    </motion.div>
);
const Captcha: FC<{ captchaCode: string; captchaInput: string; onInputChange: (val: string) => void; onRefresh: () => void; }> = ({ captchaCode, captchaInput, onInputChange, onRefresh }) => (
    <div className="space-y-3">
        <label className="text-sm text-gray-400">Xác minh bạn không phải robot</label>
        <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-lg h-12 select-none"><span className="text-white text-2xl font-mono tracking-[0.3em]" style={{ textDecoration: 'line-through', textDecorationColor: '#4b5563' }}>{captchaCode}</span></div>
            <motion.button type="button" onClick={onRefresh} className="p-3 h-12 aspect-square bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors" whileHover={{ scale: 1.1, rotate: 45 }} whileTap={{ scale: 0.9 }}><FaSyncAlt className="w-full h-full"/></motion.button>
        </div>
        <GlowingInput type="text" placeholder="Nhập mã xác nhận..." value={captchaInput} onChange={(e) => onInputChange(e.target.value)} maxLength={5} />
    </div>
);
const NoticeItem: FC<{ icon: React.ReactNode; title: string; date: string }> = ({ icon, title, date }) => (
    <motion.div whileHover={{ scale: 1.03, y: -4, backgroundColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-white/5 rounded-lg border border-white/10 p-4 flex items-start space-x-4 cursor-pointer">
        <div className="text-2xl mt-1 text-gray-400">{icon}</div>
        <div><h4 className="font-bold text-white">{title}</h4><p className="text-sm text-gray-500">{date}</p></div>
    </motion.div>
);
const RoleSlider: FC<{ isTeacher: boolean; onRoleChange: (isTeacher: boolean) => void }> = ({ isTeacher, onRoleChange }) => (
    <div className="relative flex w-full p-1 bg-white/5 rounded-lg border border-white/10">
        <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute top-1 bottom-1 w-1/2 rounded-md bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg" style={{ x: isTeacher ? '100%' : '0%' }}/>
        <motion.button type="button" onClick={() => onRoleChange(false)} className="relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }}><FaUserGraduate className={!isTeacher ? 'text-white' : 'text-gray-400'}/><span className={!isTeacher ? 'text-white' : 'text-gray-400'}>Học sinh</span></motion.button>
        <motion.button type="button" onClick={() => onRoleChange(true)} className="relative z-10 w-1/2 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }}><FaChalkboardTeacher className={isTeacher ? 'text-white' : 'text-gray-400'}/><span className={isTeacher ? 'text-white' : 'text-gray-400'}>Giáo viên</span></motion.button>
    </div>
);

// ===================================================================
// 3. COMPONENT LOGIN CHÍNH
// ===================================================================
const FinalLoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const generateCaptcha = useCallback(() => { const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let result = ''; for (let i = 0; i < 5; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); } setCaptchaCode(result); }, []);
    useEffect(() => { generateCaptcha(); }, [generateCaptcha]);
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault(); setFormError('');
        if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) { setFormError('Mã xác nhận không chính xác.'); generateCaptcha(); setCaptchaInput(''); return; }
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const { role } = userDoc.data();
                if (role === (isTeacher ? 'teacher' : 'student')) {
                    const token = await user.getIdToken();
                    Cookies.set('auth-token', token, { expires: 1, path: '/' });
                    router.replace('/dashboard');
                } else { throw new Error('wrong-role'); }
            } else { throw new Error('no-firestore-profile'); }
        } catch (error) {
            const getErrorCode = (err: unknown): string => {
                if (err instanceof Error) return err.message;
                if (typeof err === 'object' && err !== null && 'code' in err) return String((err as { code: string }).code);
                return 'unknown-error';
            };
            const errorCode = getErrorCode(error);
            switch (errorCode) {
                case 'auth/user-not-found': case 'auth/wrong-password': case 'auth/invalid-credential': setFormError('Thông tin đăng nhập không chính xác.'); break;
                case 'wrong-role': setFormError('Vai trò bạn chọn không khớp với tài khoản.'); break;
                case 'no-firestore-profile': setFormError('Tài khoản không có dữ liệu trong hệ thống.'); break;
                default: setFormError('Đã có lỗi xảy ra, vui lòng thử lại.'); break;
            }
            generateCaptcha(); setCaptchaInput('');
        } finally { setLoading(false); }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 flex items-center justify-center p-4 overflow-hidden">
            <SubtleStarfieldBackground />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-4xl bg-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2"><FaReact className="text-cyan-400 text-4xl animate-spin-slow" /><h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Grammatica</h2></motion.div>
                            <motion.p variants={itemVariants} className="text-gray-400 mb-8">Chào mừng quay trở lại hệ thống.</motion.p>
                            <form onSubmit={handleLogin} noValidate className="space-y-5">
                                <motion.div variants={itemVariants}><RoleSlider isTeacher={isTeacher} onRoleChange={setIsTeacher} /></motion.div>
                                <motion.div variants={itemVariants}><GlowingInput type="email" placeholder="Email nhà trường" value={email} onChange={(e) => setEmail(e.target.value)} /></motion.div>
                                <motion.div variants={itemVariants}><GlowingInput type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} /></motion.div>
                                <motion.div variants={itemVariants}><Captcha captchaCode={captchaCode} captchaInput={captchaInput} onInputChange={setCaptchaInput} onRefresh={() => { generateCaptcha(); setCaptchaInput(''); }} /></motion.div>
                                <AnimatePresence>{formError && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-center text-sm">{formError}</motion.p>)}</AnimatePresence>
                                <motion.div variants={itemVariants}>
                                    <motion.button type="submit" disabled={!email || !password || !captchaInput || loading} className="action-button-shine" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                    <div className="hidden lg:flex flex-col bg-black/20 p-12">
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-white mb-6">Bảng Tin Nhà Trường</motion.h3>
                            <motion.div variants={itemVariants} className="space-y-4">
                                <NoticeItem icon={<FaBullhorn className="text-yellow-400" />} title="Lịch nghỉ Lễ Quốc Khánh 2/9" date="25/08/2023" />
                                <NoticeItem icon={<FaWrench className="text-cyan-400" />} title="Bảo trì hệ thống e-learning" date="23/08/2023" />
                                <NoticeItem icon={<FaInfoCircle className="text-green-400" />} title="Cập nhật quy chế thi học kỳ mới" date="20/08/2023" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FinalLoginPage;