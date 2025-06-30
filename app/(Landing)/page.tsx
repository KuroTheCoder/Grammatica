// File: app/(Landing)/page.tsx (FIXED - NO DUPLICATE SECTION)

'use client';

import Link from "next/link";
import React, {Suspense, useEffect, useState} from 'react';

// Import all our "islands"
import HeroAnimation from "@/components/landing/HeroAnimation";
import LandingPageClient from "@/components/landing/LandingPageClient";
import ClientNav from "@/components/landing/ClientNav";
import AnimatedCTAButton from "@/components/landing/AnimatedCTAButton";
import LandingFooter from "@/components/landing/LandingFooter";
import {KeywordHighlight} from "@/components/landing/LandingHelpers";
import InteractiveSpotlightBackground from "@/components/shared/InteractiveSpotlightBackground";
import FloatingDustBackground from "@/components/shared/FloatingDustBackground";

const Logo = () => (<Link href="/" className="flex items-center gap-3 text-white">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#FDE047" stopOpacity="0.9"/>
                <stop offset="1" stopColor="#A2C5B6"/>
            </linearGradient>
        </defs>
        <path
            d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C19.4442 4 22.5134 5.38553 24.6644 7.53612"
            stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24.5" cy="8.5" r="2.5" fill="url(#logo-gradient)"/>
    </svg>
    <span
        className="text-2xl font-bold tracking-wider bg-gradient-to-r from-stone-300 to-emerald-300 text-transparent bg-clip-text">Grammatica</span>
</Link>);


export default function HomePage() {
    const [pageHasMounted, setPageHasMounted] = useState(false);
    useEffect(() => {
        setPageHasMounted(true);
    }, []);

    return (
        <div className="w-full bg-transparent text-white relative isolate overflow-x-hidden">
            {pageHasMounted && (
                <>
                    <InteractiveSpotlightBackground variant="landing"/>
                    <FloatingDustBackground/>
                </>
            )}
            <ClientNav> <Logo/> </ClientNav>
            <header
                className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-4 md:px-8 max-w-7xl mx-auto pt-16">
                <div className="text-center lg:text-left text-white max-w-2xl lg:max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
                        style={{textShadow: '0 2px 20px rgba(0,0,0,0.7)'}}>Chinh phục Tiếng Anh cùng <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-emerald-300 to-stone-300">Grammatica</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 mb-8"
                       style={{textShadow: '0 1px 10px rgba(0,0,0,0.7)'}}>Nền tảng học tập hiện đại dành riêng cho học
                        sinh, kết hợp <KeywordHighlight>bài học tương tác</KeywordHighlight> và <KeywordHighlight>công
                            nghệ AI đột phá</KeywordHighlight>.</p>
                    <div><AnimatedCTAButton/></div>
                </div>
                <HeroAnimation/>
            </header>
            <Suspense fallback={<div className="text-center p-10">Loading sections...</div>}>
                {/* THIS NOW CONTAINS ALL THE SECTIONS, INCLUDING THE FINAL CTA */}
                <LandingPageClient/>
            </Suspense>
            <LandingFooter/>
        </div>
    );
}