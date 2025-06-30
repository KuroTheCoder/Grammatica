// app/components/dashboard/ProfileCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaCrown, FaFire, FaBookOpen, FaPenNib, FaHeadphones, FaMicrophone } from 'react-icons/fa';
import { SiReact, SiNextdotjs } from 'react-icons/si';

// TYPE DEFINITIONS
interface Badge { id: string; icon: IconType; color: string; tooltip: string; }
interface Skill { label: string; percentage: number; color: string; icon: IconType; }
interface StudentData { name: string; class: string; avatarUrl: string; status: string; xp: { current: number; max: number }; mastery: string; streak: number; badges: Badge[]; skills: Skill[]; }

// DYNAMIC STYLING ENGINE
const getMasteryStyle = (mastery: string): string => { const level = mastery.toUpperCase(); if (level.startsWith('C')) return 'from-amber-400 to-yellow-500'; if (level.startsWith('B')) return 'from-sky-400 to-cyan-500'; return 'from-green-500 to-emerald-600'; };
const getStreakStyle = (streak: number): string => { if (streak > 100) return 'from-indigo-400 to-purple-500'; if (streak > 50) return 'from-red-500 to-orange-500'; if (streak > 10) return 'from-amber-500 to-orange-400'; return 'from-gray-400 to-gray-500'; };

// BADGE ICON COMPONENT
interface BadgeIconProps { badge: Badge; }
const BadgeIcon: React.FC<BadgeIconProps> = ({ badge }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <motion.button
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileTap={{ scale: 0.9 }}
            className="relative"
            // onClick={() => openModal(badge.id)}
        >
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                <badge.icon size={32} style={{ color: badge.color, filter: `drop-shadow(0 0 5px ${badge.color})` }} />
            </motion.div>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-md shadow-lg whitespace-nowrap"
                    >
                        {badge.tooltip}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

// SkillCircle Component
interface SkillCircleProps { skill: Skill; }
const SkillCircle: React.FC<SkillCircleProps> = ({ skill }) => {
    const { label, percentage, color, icon: Icon } = skill;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progressSpring = useSpring(0, { stiffness: 30, damping: 15 });
    const progressPath = useTransform(progressSpring, (value) => circumference * (1 - value / 100));
    const roundedProgress = useTransform(progressSpring, (latest) => latest.toFixed(0));
    React.useEffect(() => {
        const timer = setTimeout(() => progressSpring.set(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage, progressSpring]);
    const lighterColor = color + 'B3';
    return (
        <motion.div whileHover={{ scale: 1.1, filter: `drop-shadow(0 0 10px ${color})` }} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={lighterColor} />
                            <stop offset="100%" stopColor={color} />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10" stroke="#374151" />
                    <motion.circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10" stroke={`url(#gradient-${label})`} strokeLinecap="round" transform="rotate(-90 50 50)" strokeDasharray={circumference} strokeDashoffset={progressPath} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="font-bold text-xl text-white">{roundedProgress}</motion.span><span className="font-bold text-xl text-white">%</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Icon className="text-gray-400 group-hover:text-white transition-colors" style={{ color }} size={16} />
                <p className="text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">{label}</p>
            </div>
        </motion.div>
    );
};
// BUG FIX: The duplicate, empty SkillCircle definition that was here has been DELETED.

// MAIN PROFILE CARD
const studentData: StudentData = { name: "Alex 'The Coder' Doe", class: 'Grammar Gurus - Cohort A', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'Crushing this project!', xp: { current: 65, max: 100 }, mastery: 'B2', streak: 68, badges: [ { id: 'react', icon: SiReact, color: '#61DAFB', tooltip: 'React Pro' }, { id: 'nextjs', icon: SiNextdotjs, color: '#FFFFFF', tooltip: 'Next.js Navigator' }, ], skills: [ { label: 'Reading', percentage: 75, color: '#34D399', icon: FaBookOpen }, { label: 'Writing', percentage: 60, color: '#60A5FA', icon: FaPenNib }, { label: 'Listening', percentage: 85, color: '#FBBF24', icon: FaHeadphones }, { label: 'Speaking', percentage: 40, color: '#F87171', icon: FaMicrophone }, ] };
const cardVariants = { initial: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }, }, } as const;

interface ProfileCardProps { isCompact: boolean; }
const ProfileCard: React.FC<ProfileCardProps> = ({ isCompact }) => {
    const xpPercentage = (studentData.xp.current / studentData.xp.max) * 100;
    const transition = { type: "spring", stiffness: 300, damping: 30 } as const;
    const layoutTransition = { type: "spring", stiffness: 500, damping: 50 } as const;
    const masteryStyle = getMasteryStyle(studentData.mastery);
    const streakStyle = getStreakStyle(studentData.streak);

    return (
        <motion.div variants={cardVariants} initial="initial" animate="animate" layout transition={layoutTransition} whileHover={{ scale: 1.01, boxShadow: "0px 10px 40px rgba(138, 43, 226, 0.4)" }} className="bg-gradient-to-br from-gray-900 to-purple-900/50 backdrop-blur-lg border border-white/10 rounded-2xl w-full flex items-center justify-between gap-6 p-4 text-white">
            <motion.div layout="position" className="flex items-center gap-4 flex-shrink-0">
                <motion.div whileHover={{ scale: 1.1 }} transition={transition}><Image src={studentData.avatarUrl} alt="Student Avatar" width={isCompact ? 64 : 96} height={isCompact ? 64 : 96} className={`rounded-full object-cover border-4 border-purple-500/50 shadow-lg transition-all duration-300 ${isCompact ? 'w-16 h-16' : 'w-24 h-24'}`} /></motion.div>
                <AnimatePresence>{!isCompact && ( <motion.button initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -10}} transition={{...transition, delay: 0.1}} whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.95 }} className="border border-gray-600 rounded-lg px-4 py-2 bg-black/30"><p className="text-sm text-gray-300 text-center">{studentData.status}</p></motion.button>)}</AnimatePresence>
            </motion.div>

            <motion.div layout="position" className="flex-grow flex items-center justify-center gap-6">
                <div className="flex-grow flex flex-col gap-2 items-start">
                    <h2 className={`font-bold transition-all ${isCompact ? 'text-xl' : 'text-3xl'}`}>{studentData.name}</h2>
                    <p className="text-sm text-gray-400">{studentData.class}</p>
                    <AnimatePresence>
                        {!isCompact && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{...transition, delay: 0.2}} className="flex flex-col gap-3 w-full mt-2">
                                <div className="flex items-center gap-4 py-1">
                                    {studentData.badges.map((badge) => (
                                        <BadgeIcon key={badge.id} badge={badge} />
                                    ))}
                                </div>
                                <div className="w-full max-w-sm">
                                    <div className="flex justify-between items-center text-xs text-green-300 mb-1"><span>XP</span><span>{studentData.xp.current} / {studentData.xp.max}</span></div>
                                    <motion.button whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.99 }} className="w-full bg-black/40 rounded-full h-3.5 p-0.5 relative cursor-pointer">
                                        <motion.div className="h-full rounded-full relative" style={{ background: `linear-gradient(to right, #6EE7B7, #10B981, #059669)`}} initial={{ width: 0 }} animate={{ width: `${xpPercentage}%` }} transition={{ ...transition, type: "spring", damping: 25, stiffness: 100 }}><div className="absolute top-[2px] left-[2px] right-[2px] h-[2px] bg-white/40 rounded-full filter blur-[1px]" /></motion.div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <AnimatePresence>{!isCompact && ( <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} transition={{...transition, delay: 0.3}} className="flex-shrink-0 flex items-center justify-center gap-4">{studentData.skills.map((skill) => (<SkillCircle key={skill.label} skill={skill} />))}</motion.div>)}</AnimatePresence>
            </motion.div>

            <motion.div layout="position" className="flex-shrink-0 flex flex-col items-center justify-center gap-2 self-center">
                <AnimatePresence mode="wait">
                    {isCompact ? (
                        <motion.div key="compact-stats" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 p-1 rounded-md bg-gradient-to-r ${masteryStyle}`}><FaCrown /><p className="font-bold text-base">{studentData.mastery}</p></div>
                            <div className={`flex items-center gap-2 p-1 rounded-md bg-gradient-to-r ${streakStyle}`}><FaFire /><p className="font-bold text-base">{studentData.streak}</p></div>
                        </motion.div>
                    ) : (
                        <motion.div key="full-stats" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col gap-2">
                            <motion.button whileHover={{ scale: 1.05, y: -2, filter: 'brightness(1.2)' }} className={`flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r ${masteryStyle} w-full shadow-lg`}><FaCrown size={20} /><p className="font-bold text-xl">{studentData.mastery}</p></motion.button>
                            <motion.button whileHover={{ scale: 1.05, y: -2, filter: 'brightness(1.2)' }} className={`flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r ${streakStyle} w-full shadow-lg`}><FaFire size={20} /><p className="font-bold text-xl">{studentData.streak}</p></motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default ProfileCard;