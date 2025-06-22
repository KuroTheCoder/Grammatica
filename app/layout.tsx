import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HtmlClassFixer from "./Components/HtmlClassFixer"; // nhớ tạo file này

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <html lang="en" className="mdl-js">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f6f5f7] flex items-center justify-center min-h-screen`}
        >
        <HtmlClassFixer />
        {children}
        </body>
        </html>
    );
}
