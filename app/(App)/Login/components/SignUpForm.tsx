"use client";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // hoặc đường dẫn tới file `firebase.ts` của bạn
import { useState } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function SignUpForm() {
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const allowedPattern = /^[a-zA-Z0-9._%+-]+\.c3hhtham@gmail\.com$/;

        if (!allowedPattern.test(state.email)) {
            alert("Email không được phép đăng ký. Vui lòng dùng email hợp lệ do trường cung cấp.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, state.email, state.password);
            alert("Đăng ký thành công!");
            setState({ name: "", email: "", password: "" });
        } catch (error) {
            if (error instanceof FirebaseError) {
                alert(`Lỗi đăng ký: ${error.message}`);
            } else {
                alert("Lỗi không xác định khi đăng ký.");
            }
        }
    };

    return (
        <form
            onSubmit={handleOnSubmit}
            className="bg-white flex flex-col items-center justify-center h-full px-[50px] text-center shadow-md rounded-md"
        >
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

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

            <span className="text-sm text-black">or use your email for registration</span>

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={state.name}
                onChange={handleChange}
                className="bg-gray-100 text-black placeholder-gray-600 py-3 px-4 my-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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


            <button
                type="submit"
                className="mt-5 bg-[#ff4b2b] hover:bg-[#e84321] text-white font-semibold text-sm px-[45px] py-3 uppercase tracking-wider rounded-full transition-all duration-300"
            >
                Sign Up
            </button>
        </form>
    );
}
