// File: components/ui/AuroraButton.tsx (NEW FILE - COPY THIS)

'use client';

import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import Link from 'next/link';

export default function AuroraButton() {
    return (
        <Link href="/Login" className="inline-block">
            <motion.button
                className="relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* This is the animated, shimmering border */}
                <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FDE047_0%,#A2C5B6_50%,#FDE047_100%)]" />

                {/* This is the actual button content with the dark background */}
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-lg font-bold text-white backdrop-blur-3xl">
                    <div className="flex items-center justify-center gap-3">
                        Đăng nhập ngay
                        <FiLogIn className="h-5 w-5"/>
                    </div>
                </span>
            </motion.button>
        </Link>
    );
}