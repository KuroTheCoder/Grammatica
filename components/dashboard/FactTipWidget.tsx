"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetCard from '@/components/shared/WidgetCard';

interface FactTip {
    type: 'fact' | 'tip';
    content: string;
}

const FACTS_AND_TIPS: FactTip[] = [
    { type: 'fact', content: "Did you know Nha Trang, the capital of Khanh Hoa, is famous for its beautiful beaches and diving spots?" },
    { type: 'tip', content: "Pro Tip: Use Ctrl + D to quickly show or hide your dock!" },
    { type: 'fact', content: "Khanh Hoa is home to the historic Po Nagar Cham Towers, a significant cultural site." },
    { type: 'tip', content: "Tip: Explore the 'My Lessons' section to track your learning progress." },
    { type: 'fact', content: "The swallow's nest soup, a delicacy, is a specialty of Khanh Hoa province." },
    { type: 'tip', content: "Pro Tip: Don't forget to check your daily streak to keep your learning momentum!" },
    { type: 'fact', content: "Van Phong Bay in Khanh Hoa is considered one of the most beautiful bays in the world." },
    { type: 'tip', content: "Tip: The sidebar (Ctrl + B) is for rarely used navigation like settings and help." },
];

const FactTipWidget: React.FC<{ className?: string }> = ({ className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % FACTS_AND_TIPS.length);
        }, 10000); // Change fact/tip every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const currentItem = FACTS_AND_TIPS[currentIndex];

    return (
        <WidgetCard title={currentItem.type === 'fact' ? 'Khanh Hoa Fact' : 'Grammatica Tip'} className={className}>
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentIndex} // Key change forces re-render and animation
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg text-neutral-200 text-center"
                >
                    {currentItem.content}
                </motion.p>
            </AnimatePresence>
        </WidgetCard>
    );
};

export default FactTipWidget;
