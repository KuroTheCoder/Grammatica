"use client";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // đường dẫn đến file firebase.ts của bạn
import { useState } from "react";
import {FaFacebookF, FaGoogle, FaLinkedinIn} from "react-icons/fa";

export default function SignInForm() {
    const [state, setState] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const allowedPattern = /^[a-zA-Z0-9._%+-]+\.c3hhtham@gmail\.com$/;

        if (!allowedPattern.test(state.email)) {
            alert("Email không được phép đăng nhập. Vui lòng dùng email hợp lệ.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, state.email, state.password);
            alert("Đăng nhập thành công!");
            router.push("/Home");
            setState({ email: "", password: "" });
        } catch (error) {
            if (error instanceof FirebaseError) {
                alert(`Lỗi đăng nhập: ${error.message}`);
            } else {
                alert("Lỗi không xác định khi đăng nhập.");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white flex flex-col items-center justify-center h-full px-[50px] text-center"
        >
            <h1 className="text-black text-2xl font-bold">Sign In</h1>

            <div className="my-5 flex gap-4">
                <a
                    href="#"
                    className="text-blue-600 hover:bg-blue-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    title="Login with Facebook"
                >
                    <FaFacebookF />
                </a>
                <a
                    href="#"
                    className="text-red-500 hover:bg-red-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    title="Login with Google"
                >
                    <FaGoogle />
                </a>
                <a
                    href="#"
                    className="text-blue-700 hover:bg-blue-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    title="Login with LinkedIn"
                >
                    <FaLinkedinIn />
                </a>
            </div>


            <span className="text-xs text-gray-600">or use your account</span>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={state.email}
                onChange={handleChange}
                className="bg-gray-100 text-black placeholder-gray-600 py-3 px-4 my-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={state.password}
                onChange={handleChange}
                className="bg-gray-100 text-black placeholder-gray-600 py-3 px-4 my-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <a href="#" className="text-xs mt-2 text-blue-500 hover:underline">
                Forgot your password?
            </a>

            <button
                type="submit"
                className="mt-4 bg-[#ff4b2b] text-white font-bold text-xs px-[45px] py-3 uppercase tracking-wider rounded-full border border-[#ff4b2b] active:scale-95 transition-all"
            >
                Sign In
            </button>
        </form>
    );
}
