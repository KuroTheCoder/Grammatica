// File: components/landing/LandingFooter.tsx (NEW FILE - COPY THIS)

'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaFacebook, FaDiscord } from 'react-icons/fa6';

export default function LandingFooter() {
    return (
        <footer className="text-slate-400 py-8 px-4 border-t border-slate-800/50 bg-black/20">
            <div className="max-w-7xl mx-auto text-center">
                <p className="mb-4">© {new Date().getFullYear()} Grammatica. All rights reserved.</p>
                <div className="flex justify-center gap-6">
                    {[
                        {href: "https://github.com/KuroTheCoder", icon: <FaGithub/>, label: "GitHub"},
                        {href: "https://www.facebook.com/KuroHocCode/", icon: <FaFacebook/>, label: "Facebook"},
                        {href: "https://discord.gg/w4KkQcm2tT", icon: <FaDiscord/>, label: "Discord"}
                    ].map(item => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.label}
                            className="hover:text-emerald-400 transition-colors text-2xl"
                            whileHover={{y: -3}}
                        >
                            {item.icon}
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    );
}