// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Hoặc font Geist của bạn
import "./globals.css";

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
        <html lang="en">
        {/* Body không có class style, để các layout con tự quyết định */}
        <body className={inter.className}>{children}</body>
        </html>
    );
}