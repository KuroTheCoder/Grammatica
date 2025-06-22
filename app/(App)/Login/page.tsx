"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FaGoogle, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const SignInForm = () => {
    // 1. Lấy router để thực hiện chuyển hướng
    const router = useRouter();

    // 2. State cho form và lỗi
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 3. Hàm xử lý khi submit form
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ---- Thay thế bằng logic gọi API thật của bạn ----
            // Giả lập một cuộc gọi API mất 1 giây
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Ví dụ: Kiểm tra giả lập
            if (email !== 'test@example.com' || password !== 'password') {
                throw new Error('Email hoặc mật khẩu không đúng.');
            }

            // Nếu API thành công, bạn sẽ nhận được một token
            const fakeToken = 'your-secret-auth-token-from-api';
            // ----------------------------------------------------

            // 4. Lưu token vào cookie
            Cookies.set('auth-token', fakeToken, { expires: 7, path: '/' });

            // 5. Chuyển hướng đến trang Home
            // Dùng replace để người dùng không thể nhấn "Back" quay lại đây
            router.replace('/Home');

        } catch (err: unknown) { // SỬA LỖI TẠI ĐÂY: Dùng `unknown` thay cho `any`
            // Kiểm tra xem `err` có phải là một đối tượng Error không
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Đã có lỗi không xác định xảy ra. Vui lòng thử lại.');
            }
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="w-full h-full flex flex-col items-center justify-center px-10 text-center bg-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign In</h1>
            <div className="flex items-center gap-4 my-2">
                <a href="#" className="social-icon"><FaFacebookF /></a>
                <a href="#" className="social-icon"><FaGoogle /></a>
                <a href="#" className="social-icon"><FaLinkedinIn /></a>
            </div>
            <p className="text-gray-500 text-sm mb-4">or use your account</p>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
            />

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <a href="#" className="text-gray-500 text-sm my-4 hover:underline">Forgot your password?</a>

            <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#ff4b2b] to-[#ff416c] text-white font-bold uppercase px-12 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
};
export default SignInForm;