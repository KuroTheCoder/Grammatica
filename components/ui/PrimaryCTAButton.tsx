// File: components/ui/PrimaryCTAButton.tsx (CONFIRM THIS CODE IS CORRECT)

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';

export default function PrimaryCTAButton({ children, href, className }: { children: React.ReactNode; href: string; className?: string; }) {
    return (
        <Link href={href} className={className}>
            <motion.div
                // I've adjusted padding and text size slightly to be more versatile
                className="group bg-[#FDE047] text-[#040D0A] font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-[#ffe97a] inline-flex items-center justify-center gap-2 text-md cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(253, 224, 71, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {children}
                <FiLogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.div>
        </Link>
    );
}