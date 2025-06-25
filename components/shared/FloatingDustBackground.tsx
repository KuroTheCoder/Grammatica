// components/shared/FloatingDustBackground.tsx (NEW FILE - COPY THIS)

"use client";

import { useRef, useEffect } from 'react';

// All the particle logic is now self-contained in this file.
class Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    color: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.color = `hsla(160, 50%, 80%, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.y -= this.speedY;
        if (this.y < 0) {
            this.y = this.canvas.height;
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

function initParticles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[]) {
    const numberOfParticles = Math.floor(canvas.width / 30);
    particles.length = 0; // Clear the array
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(ctx, canvas));
    }
}

function animateParticles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    return requestAnimationFrame(() => animateParticles(ctx, canvas, particles));
}

const FloatingDustBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        initParticles(ctx, canvas, particles);

        let animationFrameId: number;

        const startAnimation = () => {
            animationFrameId = animateParticles(ctx, canvas, particles);
        };
        startAnimation();

        const handleResize = () => {
            if (canvas && ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles(ctx, canvas, particles);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] mix-blend-screen"/>;
};

export default FloatingDustBackground;