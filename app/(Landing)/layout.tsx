// File: app/(Landing)/layout.tsx (The "Living Room" Layout) - THIS CODE GOES HERE

export default function LandingLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    // Its only job is to add the background color. Perfect.
    return (
        <div className="bg-slate-900 text-slate-200 antialiased">
            {children}
        </div>
    );
}