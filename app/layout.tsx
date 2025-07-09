// File: app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Hoặc font Geist của bạn
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { NotificationProvider } from '@/contexts/NotificationContext'; // Import NotificationProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Grammatica Web App",
    description: "Learn grammar effortlessly with Grammatica",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vie" suppressHydrationWarning>
        {/* Body không có class style, để các layout con tự quyết định */}
        <body className={inter.className}>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </body>
        <Analytics />
        <SpeedInsights />
        </html>
    );
}