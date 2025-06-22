// File: app/(app)/layout.tsx

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <main className="antialiased bg-[#f6f5f7] flex items-center justify-center min-h-screen">
            {children}
        </main>
    );
}