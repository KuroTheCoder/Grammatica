// File: components/shared/WebVitals.tsx (THE NEW, LIGHTWEIGHT VERSION)

'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
    useReportWebVitals((metric) => {
        // For our performance audit, we are temporarily switching to console.log.
        // This avoids loading the entire heavy Firebase SDK on the initial page load,
        // which was the primary cause of the "Reduce unused JavaScript" warning.

        const metricsToLog = ['FCP', 'LCP', 'CLS', 'TTFB', 'INP'];
        if (metricsToLog.includes(metric.name)) {
            // You can check your browser's console (F12) to see these values now.
            console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms`);
        }
    });

    return null; // This component still renders nothing.
}