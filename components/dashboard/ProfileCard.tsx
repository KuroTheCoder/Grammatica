// app/dashboard/ProfileCard.tsx
"use client";

import React, {useState} from 'react';
import Image from 'next/image';
import {AnimatePresence, motion, useSpring, useTransform, easeOut} from 'framer-motion';
import {Badge, Skill, UserProfile} from '@/types/user';

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
import {getMasteryStyles, getStreakStyle} from '@/lib/theme';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {FaBell, FaBookOpen, FaCrown, FaFire, FaFireAlt, FaHeadphones, FaMicrophone, FaPenNib, FaSun, FaStar, FaRocket} from 'react-icons/fa';

const DEFAULT_SKILLS: Skill[] = [
    {label: 'Reading', percentage: 69, color: '#34D399', icon: FaBookOpen},
    {label: 'Writing', percentage: 69, color: '#60A5FA', icon: FaPenNib},
    {label: 'Listening', percentage: 69, color: '#FBBF24', icon: FaHeadphones},
    {label: 'Speaking', percentage: 69, color: '#F87171', icon: FaMicrophone},
];
const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/150';

import Clickable from '@/components/ui/Clickable';

import { useClassLeaderboard } from '@/hooks/useClassLeaderboard';

const BadgeIcon: React.FC<{ badge: Badge }> = ({badge}) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                    className="relative">
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
        </motion.div>
    );
};

const SkillCircle: React.FC<{ skill: Skill }> = ({skill}) => {
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
        <motion.div
            whileHover={{scale: 1.1, filter: `drop-shadow(0 0 10px ${color})`}}
            className="flex flex-col items-center gap-2 group outline-none"
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
                {Icon && <Icon className="text-gray-400 group-hover:text-white transition-colors" style={{color}}
                               size={16}/>}
                <p className="text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">{label}</p>
            </div>
        </motion.div>
    );
};

const cardVariants = {
    initial: {opacity: 0, y: 50, scale: 0.9},
    animate: {opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness: 100, damping: 20, delay: 0.2}}
} as const;

interface ProfileCardProps {
    user: UserProfile | null;
    isCompact: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({user, isCompact}) => {
    const [modalState, setModalState] = useState({
        avatar: false, badge: false, mastery: false, streak: false, class: false, announcements: false, // mockChallenge: false, // Added mockChallenge
    });
    const [isBellRinging, setIsBellRinging] = useState(false);
    const [userRank, setUserRank] = useState<number | null>(null);

    const { leaderboard, loading } = useClassLeaderboard(user?.class);

    const openModal = (modal: keyof typeof modalState) => setModalState(prev => ({...prev, [modal]: true}));
    const closeModal = (modal: keyof typeof modalState) => setModalState(prev => ({...prev, [modal]: false}));

    const handleBellClick = () => {
        openModal('announcements');
        setIsBellRinging(true);
        setTimeout(() => setIsBellRinging(false), 1000); // Ring for 1 second
    };

    const bellVariants = {
        initial: { rotate: 0 },
        ringing: {
            rotate: [0, -15, 15, -15, 15, 0],
            transition: { duration: 0.5, ease: easeOut },
        },
    };

    // Calculate user rank
    React.useEffect(() => {
        if (user && leaderboard.length > 0) {
            const foundIndex = leaderboard.findIndex(student => student.uid === user.uid);
            if (foundIndex !== -1) {
                setUserRank(foundIndex + 1); // Ranks are 1-based
            } else {
                setUserRank(null); // User not found in top 10 or class
            }
        } else if (!loading) {
            setUserRank(null); // Reset rank if no user or leaderboard is empty after loading
        }
    }, [leaderboard, user, loading]);

    if (!user) {
        return <div
            className="bg-gradient-to-br from-gray-900 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-2xl w-full flex items-center justify-center min-h-[156px]">
            <PulseLoader/></div>;
    }

    const skillsToDisplay = user.skills && user.skills.length > 0 ? user.skills : DEFAULT_SKILLS;

    // === THIS IS THE DYNAMIC FIX ===
    // 1. We get the entire style object from our single source of truth.
    const masteryTheme = getMasteryStyles(user.mastery);
    // 2. We extract the hex color and the gradient class. Both are now perfectly in sync.
    const masteryColor = masteryTheme.color;
    const masteryGradient = masteryTheme.gradient;
    // === END FIX ===

    
    const xpPercentage = user.xp ? (user.xp.current / user.xp.max) * 100 : 0;

    return (
        <>
            <motion.div
                layout
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover={{scale: 1.02, boxShadow: `0px 0px 50px -10px ${masteryColor}`}}
                style={{boxShadow: `0px 0px 40px -20px ${masteryColor}`}}
                transition={{layout: {type: 'spring', stiffness: 200, damping: 30}}}
                className="relative bg-gray-900/60 border border-white/10 rounded-2xl w-full flex items-center justify-between gap-4 p-6 text-white overflow-hidden aurora-background"
            >
                <motion.div layout="position" className="flex items-center flex-shrink-0 z-10">
                    <Clickable onClick={() => openModal('avatar')} particlePreset="sparkle" clickAnimation="pop">
                        <motion.div
                            whileHover={{scale: 1.1, boxShadow: `0 0 20px ${masteryColor}`}}
                            className="rounded-full">
                            <Image src={user.avatarUrl || DEFAULT_AVATAR_URL} alt="Student Avatar"
                                   width={isCompact ? 56 : 80} height={isCompact ? 56 : 80}
                                   className={`rounded-full object-cover border-4 shadow-lg transition-all duration-300 ${isCompact ? 'w-14 h-14' : 'w-20 h-20'}`}
                                   style={{borderColor: masteryColor}}/>
                        </motion.div>
                    </Clickable>
                </motion.div>

                <div className="flex-grow flex items-center justify-between gap-6 z-10 overflow-hidden pr-4">
                    <div className="flex flex-col gap-2 items-start">
                        <motion.div layout="position" className="flex items-center gap-4">
                            <h2 className={`font-bold transition-all ${isCompact ? 'text-lg' : 'text-2xl'}`}>{user.displayName}</h2>
                            <Clickable onClick={() => openModal('class')} particlePreset="confetti" clickAnimation="shake">
                                <RankBadge rank={userRank !== null ? userRank : 0}/>
                            </Clickable>
                        </motion.div>

                        <motion.div layout="position" className="flex items-center gap-4">
                            <Clickable onClick={() => openModal('class')} particlePreset="confetti" clickAnimation="shake">
                                <motion.div whileHover={{scale: 1.05, filter: 'brightness(1.1)'}}>
                                    <ClassBadge className={user.class}/>
                                </motion.div>
                            </Clickable>
                            {user.badges && user.badges.length > 0 && (
                                <div className="flex items-center gap-4 py-1">
                                    {user.badges.map((badge) => (
                                        <Clickable key={badge.id} onClick={() => openModal('badge')} particlePreset="heart" clickAnimation="pop">
                                            <BadgeIcon badge={badge}/>
                                        </Clickable>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            layout
                            initial={{opacity: 1, height: 'auto'}}
                            animate={{
                                opacity: isCompact ? 0 : 1,
                                height: isCompact ? 0 : 'auto',
                                marginTop: isCompact ? 0 : '0.5rem'
                            }}
                            className="flex flex-col gap-3 w-full"
                        >
                            <div className="w-full max-w-sm">
                                <div className="flex justify-between items-center text-xs text-green-300 mb-1">
                                    <span>XP</span><span>{user.xp.current} / {user.xp.max}</span>
                                </div>
                                <Clickable className="w-full" clickAnimation="none">
                                    <motion.div
                                        whileHover={{scale: 1.01, filter: 'brightness(1.1)'}}
                                        className="w-full bg-black/40 rounded-full h-3.5 p-0.5 relative">
                                        <motion.div className="h-full rounded-full"
                                                    style={{background: `linear-gradient(to right, #6EE7B7, #10B981)`}}
                                                    initial={{width: 0}} animate={{width: `${xpPercentage}%`}}
                                                    transition={{type: "spring", damping: 25, stiffness: 100}}/>
                                    </motion.div>
                                </Clickable>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        layout
                        initial={{opacity: 1}}
                        animate={{opacity: isCompact ? 0 : 1, transition: {delay: isCompact ? 0 : 0.2}}}
                        className="flex-shrink-0 flex items-center justify-center gap-4"
                    >
                        {skillsToDisplay.map((skill) => (
                            <Clickable key={skill.label} clickAnimation="pop">
                                <SkillCircle skill={skill}/>
                            </Clickable>
                        ))}
                    </motion.div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4 self-center z-10">
                    <Clickable onClick={handleBellClick} particlePreset="sparkle" clickAnimation="none">
                        <motion.div
                            whileHover={{scale: 1.1}}
                            className="relative text-gray-400 hover:text-white transition-colors">
                            <motion.div animate={isBellRinging ? 'ringing' : 'initial'} variants={bellVariants}>
                                <FaBell size={24}/>
                            </motion.div>
                            <motion.div initial={{scale: 0}} animate={{scale: 1}}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3
                            </motion.div>
                        </motion.div>
                    </Clickable>
                    <Clickable onClick={() => openModal('mastery')} particlePreset="confetti" clickAnimation="pop">
                        <motion.div
                            layoutId="mastery-button"
                            whileHover={{scale: 1.1}}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${masteryGradient} shadow-lg`}>
                            <motion.div layoutId="mastery-icon"><FaCrown/></motion.div>
                            <motion.p layoutId="mastery-text" className="font-bold">{user.mastery}</motion.p>
                        </motion.div>
                    </Clickable>
                    <Clickable onClick={() => openModal('streak')} particlePreset="sparkle" clickAnimation="pop">
                        <motion.div
                            layoutId="streak-button"
                            whileHover={{scale: 1.1}}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${getStreakStyle(user.streak || 0).gradient} shadow-lg`}>
                            <motion.div layoutId="streak-icon">{
                                React.createElement(getStreakStyle(user.streak || 0).icon)
                            }</motion.div>
                            <motion.p layoutId="streak-text" className="font-bold">{
                                user.streak
                            }</motion.p>
                        </motion.div>
                    </Clickable>
                    {/* Button to open MockChallengeCompleter Modal */}
                    {/* <motion.button onClick={() => openModal('mockChallenge')}
                                   whileHover={{scale: 1.1}}
                                   className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg text-white">
                        <FaRocket size={20}/>
                        <span className="font-bold">Simulate</span>
                    </motion.button> */}
                </div>
            </motion.div>

            <AvatarModal isOpen={modalState.avatar} onClose={() => closeModal('avatar')}/>
            {user.badges &&
                <BadgeModal isOpen={modalState.badge} onClose={() => closeModal('badge')} badges={user.badges}/>}
            <MasteryModal isOpen={modalState.mastery} onClose={() => closeModal('mastery')}
                          currentMastery={user.mastery}/>
            <StreakModal isOpen={modalState.streak} onClose={() => closeModal('streak')} currentStreak={user.streak}/>
            <ClassLeaderboardModal isOpen={modalState.class} onClose={() => closeModal('class')}
                                   className={user.class}/>
            <AnnouncementsModal isOpen={modalState.announcements} onClose={() => closeModal('announcements')}/>
            {/* MockChallengeCompleter Modal */}
            {/* <MockChallengeCompleter isOpen={modalState.mockChallenge} onClose={() => closeModal('mockChallenge')} userProfile={user}/> */}
        </>
    );
};

export default ProfileCard;