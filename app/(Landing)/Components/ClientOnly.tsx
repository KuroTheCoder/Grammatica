// File: app/(Landing)/Components/ClientOnly.tsx
"use client";

import { useEffect, useState } from "react";

// Component này sẽ chỉ render children của nó ở phía client
export function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        // Không render gì cả ở phía server và lần render đầu tiên ở client
        return null;
    }

    return <>{children}</>;
}