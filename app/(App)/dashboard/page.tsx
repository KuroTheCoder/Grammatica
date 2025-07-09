// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import setDoc
import { auth, db } from '@/lib/firebase';
import { UserProfile, Badge, Skill } from '@/types/user';
import { getMasteryStyles } from '@/lib/theme';

// --- Component Imports (The Full Roster) ---
import StudentSidebar from '@/components/dashboard/StudentSidebar';
import GoalsWidget from '@/components/dashboard/GoalsWidget';
import FactTipWidget from '@/components/dashboard/FactTipWidget'; // Import FactTipWidget
import DynamicDock, { ActiveView } from '@/components/dashboard/DynamicDock';
import ProfileCard from '@/components/dashboard/ProfileCard';
import WidgetCard from '@/components/shared/WidgetCard';
import GridBackground from '@/components/shared/GridBackground';
import InteractiveSpotlightBackground from '@/components/shared/InteractiveSpotlightBackground';
import FloatingDustBackground from '@/components/shared/FloatingDustBackground';
import FeedbackButton from '@/components/shared/FeedbackButton';
import FeedbackModal from '@/components/shared/FeedbackModal';
import OnboardingModal from '@/components/modals/OnboardingModal'; // Import OnboardingModal
// import MockChallengeCompleter from '@/components/dashboard/MockChallengeCompleter'; // Import MockChallengeCompleter

// --- Icon Imports (The Full Roster) ---
import { IconType } from 'react-icons';
import { FaBookOpen, FaPenNib, FaHeadphones, FaMicrophone, FaCrown, FaUserAstronaut, FaFire } from 'react-icons/fa';
import { SiReact, SiNextdotjs } from 'react-icons/si';

const skillIconMap: Record<string, IconType> = { Reading: FaBookOpen, Writing: FaPenNib, Listening: FaHeadphones, Speaking: FaMicrophone };
const badgeIconMap: Record<string, IconType> = { react: SiReact, nextjs: SiNextdotjs, pioneer: FaUserAstronaut, 'streak-7': FaFire };

const StudentDashboardPage = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);
    const [user] = useAuthState(auth);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');
    const [isDockVisible, setDockVisible] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // State for feedback modal
    const [showOnboarding, setShowOnboarding] = useState(false); // State to control onboarding modal visibility

    // Keyboard shortcuts for power users
    useKeyPress('d', () => setDockVisible(prev => !prev));

    // Effect for fetching user data
    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);

                // TODO: Replace this with actual badge data fetched from the user's profile
                const hardcodedBadges: Badge[] = [
                    {
                        id: 'pioneer',
                        icon: FaUserAstronaut,
                        color: '#A78BFA',
                        tooltip: 'Pioneer',
                        description: 'Joined Grammatica during the beta phase.',
                        earnedOn: '2024-07-09',
                    },
                    {
                        id: 'streak-7',
                        icon: FaFire,
                        color: '#F97316',
                        tooltip: '7-Day Streak',
                        description: 'Kept the learning flame alive for a whole week!',
                        earnedOn: '2024-07-08',
                    },
                ];

                if (docSnap.exists()) {
                    const rawData = docSnap.data();
                    const processedProfile: UserProfile = {
                        uid: user.uid, email: rawData.email || "", role: rawData.role || ["student"], class: rawData.class || "N/A", displayName: rawData.displayName || "New User", avatarUrl: rawData.avatarUrl || 'https://i.pravatar.cc/150', profileStatus: rawData.profileStatus || "Ready to learn!", mastery: rawData.mastery || "A1", streak: rawData.streak ?? 0, xp: rawData.xp || { current: 0, max: 100 },
                        badges: [
                            ...hardcodedBadges,
                            ...(rawData.badges || []).map((badge: Omit<Badge, 'icon'>) => ({ ...badge, icon: badgeIconMap[badge.id] || FaCrown }))
                        ],
                        skills: (rawData.skills || []).map((skill: Omit<Skill, 'icon'>) => ({ ...skill, icon: skillIconMap[skill.label] || FaBookOpen })),
                        onboardingCompleted: rawData.onboardingCompleted || false, // Read onboarding status
                    };
                    setUserProfile(processedProfile);

                    // Show onboarding if not completed
                    if (!rawData.onboardingCompleted) {
                        setShowOnboarding(true);
                    }
                } else {
                    console.warn("No Firestore profile found for this user. Creating a temporary client-side profile.");
                    const defaultProfile: UserProfile = { uid: user.uid, email: user.email || "", displayName: user.displayName || "New Student", role: ["student"], class: "Unassigned", avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`, profileStatus: "Ready to start learning!", mastery: "A1", streak: 0, xp: { current: 0, max: 100 }, badges: hardcodedBadges, skills: [], onboardingCompleted: false };
                    setUserProfile(defaultProfile);
                    setShowOnboarding(true); // Show onboarding for new users
                }
            };
            fetchUserProfile();
        }
    }, [user]);

    // Function to handle onboarding completion
    const handleOnboardingComplete = async () => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { onboardingCompleted: true }, { merge: true });
            setUserProfile(prev => prev ? { ...prev, onboardingCompleted: true } : null);
            setShowOnboarding(false);
        }
    };

    // This function acts as our content router for the main widget area
    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="flex flex-col lg:flex-row gap-6 w-full">
                        <WidgetCard title="Goals and Status" key="goals" className="flex-1"><GoalsWidget /></WidgetCard>
                        <FactTipWidget key="fact-tip" className="w-80" /> {/* Fixed width for smaller section */}
                    </div>
                );
            case 'learn':
                return (<WidgetCard title="Learning Center" key="learn"><p>Learning modules coming soon...</p></WidgetCard>);
            case 'ai_tutor':
                return (<WidgetCard title="AI Tutor" key="ai_tutor"><p>AI Tutor coming soon...</p></WidgetCard>);
            case 'practice':
                return (<WidgetCard title="Practice Arena" key="practice"><p>Practice modules coming soon...</p></WidgetCard>);
            case 'community':
                return (<WidgetCard title="Community" key="community"><p>Community features coming soon...</p></WidgetCard>);
            default:
                return null;
        }
    };

    // We derive the spotlight color from the user's profile for that extra "wow"
    const masteryColor = userProfile ? getMasteryStyles(userProfile.mastery).color : '#34D399';


    return (
        <main className="flex h-screen w-full bg-transparent text-white overflow-hidden">
            {/* --- THE COSMIC DUST STORM BACKGROUND STACK --- */}
            <GridBackground />
            <InteractiveSpotlightBackground variant="student" dynamicColor={masteryColor} />
            <FloatingDustBackground />

            <StudentSidebar isExpanded={isSidebarExpanded} setIsExpanded={setSidebarExpanded} />

            <div
                className="relative flex-1 flex flex-col p-6 space-y-6 transition-all duration-300 ease-in-out"
                onMouseLeave={() => setDockVisible(false)}
            >
                <ProfileCard user={userProfile} isCompact={isSidebarExpanded} />

                {/* Mock component for testing XP and Streak updates */}
                {/* <MockChallengeCompleter userProfile={userProfile} /> */}

                <div className="flex-1 flex">
                    {renderActiveView()}
                </div>

                {/* Feedback Button */}
                <div className="fixed bottom-24 right-6 z-50">
                    <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
                </div>

                {/* Feedback Modal */}
                <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />

                {/* Onboarding Modal */}
                <OnboardingModal
                    isOpen={showOnboarding}
                    onClose={() => setShowOnboarding(false)}
                    onComplete={handleOnboardingComplete}
                />

                {/* --- The Stealth Dock Summoning Zone --- */}
                <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center"
                     onMouseEnter={() => setDockVisible(true)}
                >
                    <div className="pointer-events-auto">
                        <AnimatePresence>
                            {isDockVisible && (
                                <motion.div
                                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } }}
                                    exit={{ opacity: 0, y: 100, scale: 0.9, transition: { duration: 0.2 } }}
                                >
                                    <DynamicDock activeView={activeView} setActiveView={setActiveView} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default StudentDashboardPage;