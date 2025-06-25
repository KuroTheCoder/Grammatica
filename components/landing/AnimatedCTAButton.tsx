// File: components/landing/AnimatedCTAButton.tsx (CONFIRM THIS CODE IS CORRECT)

'use client';

import PrimaryCTAButton from "@/components/ui/PrimaryCTAButton";

export default function AnimatedCTAButton() {
    return (
        // We add a class to slightly increase the text size for the main hero button
        <div className="text-lg">
            <PrimaryCTAButton href="/Login">
                Bắt đầu học ngay
            </PrimaryCTAButton>
        </div>
    );
}