// File: app/(Landing)/layout.tsx

export default function LandingLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-900 text-slate-200 antialiased">
            {/* Nền sao các kiểu có thể đặt ở đây */}
            {children}
        </div>
    );
}