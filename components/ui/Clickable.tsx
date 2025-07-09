"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

export type ParticlePreset = 'default' | 'confetti' | 'sparkle' | 'heart';
export type ClickAnimationPreset = 'none' | 'pop' | 'shake';

interface ClickableProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    particlePreset?: ParticlePreset;
    clickAnimation?: ClickAnimationPreset;
}

const Clickable: React.FC<ClickableProps> = ({ children, onClick, className, particlePreset = 'default', clickAnimation = 'none' }) => {
    const [animationState, setAnimationState] = useState('initial');
    const [isClicked, setIsClicked] = useState(false); // Re-added isClicked state

    const handleClick = useCallback(() => {
        setIsClicked(true); // Set isClicked to true on click
        setAnimationState(clickAnimation);
        if (onClick) {
            onClick();
        }
    }, [onClick, clickAnimation]);

    const buttonVariants = {
        initial: { scale: 1 },
        pop: { scale: [1, 1.05, 1], transition: { duration: 0.2, ease: easeOut } },
        shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4, ease: easeOut } },
    };

    return (
        <motion.div
            onClick={handleClick}
            whileTap={{ scale: 0.97 }}
            onAnimationComplete={() => {
                setIsClicked(false); // Reset isClicked after animation
                setAnimationState('initial');
            }}
            className={`relative cursor-pointer ${className}`}
            variants={buttonVariants}
            animate={animationState}
        >
            {children}
            <AnimatePresence>
                {isClicked && (
                    <Particles preset={particlePreset} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface ParticlesProps {
    preset: ParticlePreset;
}

const Particles: React.FC<ParticlesProps> = ({ preset }) => {
    const particleCount = 12;
    const colors = {
        default: ['#FFD700', '#FF69B4', '#00FFFF', '#7FFF00', '#FF4500'],
        confetti: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
        sparkle: ['#FFD700', '#FFFFFF', '#FFA500'],
        heart: ['#FF69B4', '#E91E63', '#FFC0CB'],
    };

    const particleVariants = {
        initial: { x: 0, y: 0, opacity: 1, scale: 0.5 },
        animate: (i: number) => ({
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: Math.random() + 0.5,
            rotate: Math.random() * 360,
            transition: { duration: 0.6, ease: easeOut, delay: i * 0.01 },
        }),
    };

    const renderParticle = (i: number) => {
        switch (preset) {
            case 'sparkle':
                return <Star size={12} color={colors.sparkle[i % colors.sparkle.length]} style={{ filter: `drop-shadow(0 0 5px ${colors.sparkle[i % colors.sparkle.length]})` }} />;
            case 'heart':
                return <Heart size={12} color={colors.heart[i % colors.heart.length]} style={{ fill: colors.heart[i % colors.heart.length] }} />;
            case 'confetti':
                return <div style={{ width: 8, height: 12, transform: 'rotate(45deg)', background: colors.confetti[i % colors.confetti.length] }} />;
            default:
                return <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.default[i % colors.default.length], boxShadow: `0 0 10px ${colors.default[i % colors.default.length]}` }} />;
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={particleVariants}
                    initial="initial"
                    animate="animate"
                    style={{ position: 'absolute' }}
                >
                    {renderParticle(i)}
                </motion.div>
            ))}
        </div>
    );
};

export default Clickable;
