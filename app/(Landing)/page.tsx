import LandingPageClient from "@/components/landing/LandingPageClient";
import { Suspense } from 'react';

// This is now a Server Component! It renders on the server for blazing-fast loads.
export default function HomePage() {
    return (
        // The Suspense fallback is optional but good practice for client components
        <Suspense fallback={<div className="bg-slate-900 min-h-screen" />}>
            <LandingPageClient />
        </Suspense>
    );
}