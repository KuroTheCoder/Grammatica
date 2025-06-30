// app/dashboard/ProfileCard.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { Badge, Skill, UserProfile } from '@/types/user';

// Component Imports
import PulseLoader from '@/components/ui/PulseLoader';
import AvatarModal from '@/components/modals/AvatarModal';
import BadgeModal from '@/components/modals/BadgeModal';
import MasteryModal from '@/components/modals/MasteryModal';
import StreakModal from '@/components/modals/StreakModal';
import ClassLeaderboardModal from '@/components/modals/ClassLeaderboardModal';
import AnnouncementsModal from '@/components/modals/AnnouncementsModal';
import ClassBadge from '@/components/ui/ClassBadge';
import RankBadge from '@/components/ui/RankBadge';
import { getMasteryStyles, getStreakStyle } from '@/lib/theme';
import { FaBell, FaBookOpen, FaCrown, FaFire, FaHeadphones, FaMicrophone, FaPenNib } from 'react-icons/fa';

const DEFAULT_SKILLS: Skill[] = [
    {label: 'Reading', percentage: 69, color: '#34D399', icon: FaBookOpen},
    {label: 'Writing', percentage: 69, color: '#60A5FA', icon: FaPenNib},
    {label: 'Listening', percentage: 69, color: '#FBBF24', icon: FaHeadphones},
    {label: 'Speaking', percentage: 69, color: '#F87171', icon: FaMicrophone},
];
const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/150';

const BadgeIcon: React.FC<{badge: Badge; onClick: () => void}> = ({badge, onClick}) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.button onClick={onClick} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                       whileTap={{scale: 0.9}} className="relative">
            <motion.div whileHover={{scale: 1.2, rotate: 5}}>
                {badge.icon &&
                    <badge.icon size={32} style={{color: badge.color, filter: `drop-shadow(0 0 5px ${badge.color})`}}/>}
            </motion.div>
            <AnimatePresence>{isHovered && (<motion.div initial={{opacity: 0, y: 10, scale: 0.9}} animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {type: 'spring', stiffness: 300, damping: 20}
            }} exit={{opacity: 0, y: 10, scale: 0.9}}
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-md shadow-lg whitespace-nowrap">{badge.tooltip}</motion.div>)}</AnimatePresence>
        </motion.button>
    );
};

const SkillCircle: React.FC<{skill: Skill; onClick: () => void}> = ({skill, onClick}) => {
    const {label, percentage, color, icon: Icon} = skill;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progressSpring = useSpring(0, {stiffness: 30, damping: 15});
    const progressPath = useTransform(progressSpring, (value) => circumference * (1 - value / 100));
    React.useEffect(() => {
        const timer = setTimeout(() => progressSpring.set(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage, progressSpring]);

    return (
        <motion.button
            onClick={onClick}
            whileHover={{scale: 1.1, filter: `drop-shadow(0 0 10px ${color})`}}
            className="flex flex-col items-center gap-2 group cursor-pointer outline-none"
        >
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10" stroke="#374151"/>
                    <motion.circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10"
                                   stroke={color} strokeLinecap="round"
                                   transform="rotate(-90 50 50)" strokeDasharray={circumference}
                                   strokeDashoffset={progressPath}/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="font-bold text-xl text-white">{percentage}%</motion.span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="text-gray-400 group-hover:text-white transition-colors" style={{color}} size={16}/>}
                <p className="text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">{label}</p>
            </div>
        </motion.button>
    );
};

const cardVariants = {
    initial: {opacity: 0, y: 50, scale: 0.9},
    animate: { opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness: 100, damping: 20, delay: 0.2} }
} as const;

interface ProfileCardProps {
    user: UserProfile | null;
    isCompact: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({user, isCompact}) => {
    const [modalState, setModalState] = useState({
        avatar: false, badge: false, mastery: false, streak: false, class: false, announcements: false,
    });
    const openModal = (modal: keyof typeof modalState) => setModalState(prev => ({...prev, [modal]: true}));
    const closeModal = (modal: keyof typeof modalState) => setModalState(prev => ({...prev, [modal]: false}));

    if (!user) {
        return <div className="bg-gradient-to-br from-gray-900 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-2xl w-full flex items-center justify-center min-h-[156px]"><PulseLoader /></div>;
    }

    const skillsToDisplay = user.skills && user.skills.length > 0 ? user.skills : DEFAULT_SKILLS;
    const masteryTheme = getMasteryStyles(user.mastery);
    const streakStyle = getStreakStyle(user.streak || 0);
    const masteryColor = masteryTheme.color;
    const xpPercentage = user.xp ? (user.xp.current / user.xp.max) * 100 : 0;

    return (
        <>
            <motion.div
                layout
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.02, boxShadow: `0px 0px 50px -10px ${masteryColor}` }}
                style={{ boxShadow: `0px 0px 40px -20px ${masteryColor}` }}
                transition={{ layout: { type: 'spring', stiffness: 200, damping: 30 } }}
                className="relative bg-gray-900/60 border border-white/10 rounded-2xl w-full flex items-center justify-between gap-4 p-4 text-white overflow-hidden aurora-background"
            >
                <motion.div layout="position" className="flex items-center flex-shrink-0 z-10">
                    <motion.button onClick={() => openModal('avatar')} whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${masteryColor}` }} className="rounded-full">
                        <Image src={user.avatarUrl || DEFAULT_AVATAR_URL} alt="Student Avatar" width={isCompact ? 64 : 96} height={isCompact ? 64 : 96}
                               className={`rounded-full object-cover border-4 shadow-lg transition-all duration-300 ${isCompact ? 'w-16 h-16' : 'w-24 h-24'}`}
                               style={{ borderColor: masteryColor }}/>
                    </motion.button>
                </motion.div>

                <div className="flex-grow flex items-center justify-between gap-6 z-10 overflow-hidden pr-4">
                    <div className="flex flex-col gap-2 items-start">
                        <motion.div layout="position" className="flex items-center gap-4">
                            <h2 className={`font-bold transition-all ${isCompact ? 'text-xl' : 'text-3xl'}`}>{user.displayName}</h2>
                            <motion.button onClick={() => openModal('class')}> <RankBadge rank={3} /> </motion.button>
                        </motion.div>

                        <motion.div layout="position">
                            <motion.button onClick={() => openModal('class')} whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}>
                                <ClassBadge className={user.class} />
                            </motion.button>
                        </motion.div>

                        <motion.div
                            layout
                            initial={{ opacity: 1, height: 'auto' }}
                            animate={{ opacity: isCompact ? 0 : 1, height: isCompact ? 0 : 'auto', marginTop: isCompact ? 0 : '0.5rem' }}
                            className="flex flex-col gap-3 w-full"
                        >
                            <div className="flex items-center gap-4 py-1">
                                {user.badges?.map((badge) => (<BadgeIcon key={badge.id} badge={badge} onClick={() => openModal('badge')}/>))}
                            </div>
                            <div className="w-full max-w-sm">
                                <div className="flex justify-between items-center text-xs text-green-300 mb-1">
                                    <span>XP</span><span>{user.xp.current} / {user.xp.max}</span>
                                </div>
                                <motion.button onClick={() => openModal('streak')} whileHover={{scale: 1.01, filter: 'brightness(1.1)'}} className="w-full bg-black/40 rounded-full h-3.5 p-0.5 relative cursor-pointer">
                                    <motion.div className="h-full rounded-full" style={{background: `linear-gradient(to right, #6EE7B7, #10B981)`}}
                                                initial={{width: 0}} animate={{width: `${xpPercentage}%`}} transition={{type: "spring", damping: 25, stiffness: 100}}/>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        layout
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isCompact ? 0 : 1, transition: { delay: isCompact ? 0 : 0.2 } }}
                        className="flex-shrink-0 flex items-center justify-center gap-4"
                    >
                        {skillsToDisplay.map((skill) => (
                            <SkillCircle key={skill.label} skill={skill} onClick={() => openModal('mastery')} />
                        ))}
                    </motion.div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4 self-center z-10">
                    <motion.button onClick={() => openModal('announcements')} whileHover={{scale: 1.1}} className="relative text-gray-400 hover:text-white transition-colors">
                        <FaBell size={24} />
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</motion.div>
                    </motion.button>
                    <motion.button onClick={() => openModal('mastery')} layoutId="mastery-button" whileHover={{scale: 1.1}} className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${masteryTheme.gradient} shadow-lg`}>
                        <motion.div layoutId="mastery-icon"><FaCrown /></motion.div>
                        <motion.p layoutId="mastery-text" className="font-bold">{user.mastery}</motion.p>
                    </motion.button>
                    <motion.button onClick={() => openModal('streak')} layoutId="streak-button" whileHover={{scale: 1.1}} className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${streakStyle} shadow-lg`}>
                        <motion.div layoutId="streak-icon"><FaFire /></motion.div>
                        <motion.p layoutId="streak-text" className="font-bold">{user.streak}</motion.p>
                    </motion.button>
                </div>
            </motion.div>

            <AvatarModal isOpen={modalState.avatar} onClose={() => closeModal('avatar')} />
            {user.badges && <BadgeModal isOpen={modalState.badge} onClose={() => closeModal('badge')} badges={user.badges} />}
            <MasteryModal isOpen={modalState.mastery} onClose={() => closeModal('mastery')} currentMastery={user.mastery} />
            <StreakModal isOpen={modalState.streak} onClose={() => closeModal('streak')} currentStreak={user.streak} />
            <ClassLeaderboardModal isOpen={modalState.class} onClose={() => closeModal('class')} className={user.class} />
            <AnnouncementsModal isOpen={modalState.announcements} onClose={() => closeModal('announcements')} />
        </>
    );
};

export default ProfileCard;