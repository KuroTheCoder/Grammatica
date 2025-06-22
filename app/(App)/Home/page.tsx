"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import Cookies from 'js-cookie'; // Import js-cookie
import { FcGraduationCap } from "react-icons/fc";
import { auth } from '@/lib/firebase'; // Import auth from your firebase config
import { signOut } from "firebase/auth"; // Import signOut

const menuItems = [
    { label: "Luyện kỹ năng", icon: "🎧" },
    { label: "Bài tập", icon: "📄" },
    { label: "Thi nói", icon: "🗣️" },
    { label: "Liên hệ giáo viên", icon: "📞" },
    { label: "Chat nhóm", icon: "💬" },
];

export default function EnglishDashboard() {
    const [active, setActive] = useState("Luyện kỹ năng");
    const router = useRouter(); // Initialize useRouter

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
            Cookies.remove('auth-token'); // Remove the auth token cookie
            console.log("User logged out successfully");
            router.replace('/Login'); // Redirect to login page (adjust path if needed)
        } catch (error) {
            console.error("Error logging out: ", error);
            // Handle any logout errors here (e.g., display a message to the user)
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#f3f4f6]">
            {/* Sidebar */}
            <aside className="w-full md:w-60 bg-white shadow-md">
                <div className="h-16 flex items-center justify-center gap-2 px-4 font-bold text-lg">
                    <FcGraduationCap size={28} />
                    <span className="hidden md:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53]">
                        GRAMMATICA
                    </span>
                </div>
                <nav className="mt-4">
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => setActive(item.label)}
                            className={`group relative flex items-center justify-start px-4 py-3 transition-transform duration-200 ease-in-out cursor-pointer
                                hover:scale-105 hover:bg-blue-50 active:scale-95 ${
                                active === item.label
                                    ? "bg-blue-100 font-semibold text-blue-800"
                                    : "text-gray-700"
                            }`}
                        >
                            <span className="text-xl transition-transform duration-200 ease-in-out group-hover:scale-125">
                                {item.icon}
                            </span>
                            <span className="ml-3 hidden md:block transition-all duration-200 ease-in-out group-hover:scale-105">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 w-full p-4 md:p-6 max-w-full">
                {/* Profile card */}
                <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-white">
                            NA
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Nguyễn Văn A</h2>
                            <p className="text-sm text-gray-500">Lớp 12A3 - Trường THPT ABC</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center sm:text-right">
                        <p>🎯 Mục tiêu hôm nay: Luyện nói 20 phút</p>
                        <p>🔥 Chuỗi ngày học: 5 ngày liên tiếp</p>
                    </div>
                </div>

                {/* Active tab title & logout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold text-[#1e3a8a]">{active}</h1>
                    <button
                        onClick={handleLogout} // Attach the logout handler
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                    >
                        Đăng xuất
                    </button>
                </div>

                {/* Content */}
                {active === "Luyện kỹ năng" && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <p>🔤 Nghe - Nói - Đọc - Viết: Chọn kỹ năng bạn muốn luyện.</p>
                        <p>📈 Theo dõi tiến độ mỗi ngày.</p>
                    </div>
                )}

                {active === "Bài tập" && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <p>📚 Danh sách bài tập mới sẽ hiển thị tại đây.</p>
                        <p>✔️ Làm bài, nhận chấm điểm tự động hoặc từ giáo viên.</p>
                    </div>
                )}

                {active === "Thi nói" && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <p>🎤 Ghi âm phần thi và nộp để được chấm điểm.</p>
                        <p>⏱ Thi thử theo thời gian thực.</p>
                    </div>
                )}

                {active === "Liên hệ giáo viên" && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <p>📧 Gửi tin nhắn hoặc đặt lịch gọi với giáo viên.</p>
                    </div>
                )}

                {active === "Chat nhóm" && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <p>👨‍👩‍👧‍👦 Trao đổi bài học và luyện tập cùng bạn bè.</p>
                    </div>
                )}
            </main>
        </div>
    );
}