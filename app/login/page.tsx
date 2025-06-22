"use client";

import { useState } from "react";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

export default function LoginPage() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-8">
            <div className="relative w-full max-w-4xl h-[500px] bg-white shadow-2xl rounded-lg overflow-hidden">
                {/* Sign Up Panel (Bên trái) */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ${
                        isRightPanelActive
                            ? "translate-x-full opacity-0 pointer-events-none"
                            : "translate-x-0 opacity-100"
                    }`}
                >
                    <SignUpForm />
                </div>

                {/* Sign In Panel (Bên phải) */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ${
                        isRightPanelActive
                            ? "translate-x-full opacity-100"
                            : "-translate-x-full opacity-0 pointer-events-none"
                    }`}
                >
                    <SignInForm />
                </div>

                {/* Overlay panel ở bên phải */}
                <div
                    className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-[#ff4b2b] to-[#ff416c] text-white flex flex-col items-center justify-center px-10 transition-transform duration-700"
                    style={{
                        transform: isRightPanelActive
                            ? "translateX(-100%)"
                            : "translateX(0%)",
                    }}
                >
                    {isRightPanelActive ? (
                        <>
                            <h1 className="text-3xl font-bold">Welcome Back!</h1>
                            <p className="mt-2 mb-6 text-center">
                                To keep connected with us please login with your personal info
                            </p>
                            <button
                                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#ff4b2b] transition-all"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold">Hello, Friend!</h1>
                            <p className="mt-2 mb-6 text-center">
                                Enter your personal details and start your journey with us
                            </p>
                            <button
                                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#ff4b2b] transition-all"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
