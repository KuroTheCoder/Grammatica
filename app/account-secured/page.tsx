'use client';

// LỖI 1: Xóa 'Link' vì không được sử dụng
// import Link from 'next/link';
import { useRouter } from 'next/navigation';

// LỖI 2: Xóa 'FaShieldAlt' vì không được sử dụng
// import { FaCheckCircle, FaShieldAlt, FaKey } from 'react-icons/fa';
import { FaCheckCircle, FaKey } from 'react-icons/fa';


const AccountSecuredPage = () => {
    const router = useRouter();

    const handleLoginAndChangePassword = () => {
        // Lưu một cờ vào sessionStorage để nhắc nhở đổi mật khẩu sau khi đăng nhập
        sessionStorage.setItem('force_password_change', 'true');
        router.push('/Login');
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-[#040D0A] text-white p-4">
            <div className="text-center max-w-lg p-8 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl">
                <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Tài khoản của bạn đã được bảo vệ!</h1>
                <p className="text-slate-300 mb-2">
                    Tất cả các phiên đăng nhập đáng ngờ đã bị chấm dứt.
                </p>
                <p className="text-yellow-400 font-semibold mb-6">
                    Hành động tiếp theo quan trọng nhất: Hãy đổi mật khẩu ngay để ngăn chặn kẻ gian truy cập lại.
                </p>

                {/* Dùng button với onClick là đúng cho trường hợp này */}
                <button
                    onClick={handleLoginAndChangePassword}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 font-bold text-base bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                    <FaKey />
                    Đăng nhập & Đổi mật khẩu ngay
                </button>
            </div>
        </main>
    );
};

export default AccountSecuredPage;